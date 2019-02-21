import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {Observable, Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Document} from '../../../models/document';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {CanModuleDeactivate} from '../../../shared/auth-guard/can-deactivate-guard.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {GDPService} from '../../../shared/service/gdp.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';

@Component({
    selector: 'app-reg-cerere',
    templateUrl: './reg-cerere.component.html',
    styleUrls: ['./reg-cerere.component.css']
})

export class RegCerereComponent implements OnInit, OnDestroy, CanModuleDeactivate {

    documents: Document [] = [];
    companii: Observable<any[]>;
    rForm: FormGroup;

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();

    constructor(private fb: FormBuilder,
                private router: Router,
                private gdpService: GDPService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private loadingService: LoaderService,
                private route: Router,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog) {
        this.rForm = fb.group({
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'idnp': [null, [Validators.required, Validators.maxLength(13)]],
            'id': [null],
            'startDate': [new Date()],
            'currentStep': ['E'],
            'mandatedFirstname': [null, Validators.required],
            'mandatedLastname': [null, Validators.required],
            'phoneNumber': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'email': [null, Validators.email],
            'requestMandateNr': [null],
            'requestMandateDate': [{value: null, disabled: true}],
            'registrationRequestMandatedContactsId': [null],
            'company': fb.group({
                'id': [],
                'name': [null, Validators.required],
                'adresa': [{value: null, disabled: true}],
                'idno': [{value: null, disabled: true}],
                'seria': [{value: null, disabled: true}],
                'nrLic': [{value: null, disabled: true}],
                'dataEliberariiLic': [{value: null, disabled: true}],
                'dataExpirariiLic': [{value: null, disabled: true}],
            }),
            'initiator': [''],
            'assignedUser': [''],
            'type':
                fb.group({
                    'code': ['EGDP']
                }),
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrarea cererii de inspecție a regulilor de bună practică de distribuţie');

        this.subscriptions.push(
            this.gdpService.generateDocNumber().subscribe(data => {
                    this.generatedDocNrSeq = data[0];
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.gdpService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );
    }

    companySelected(company) {
        console.log(company);

        this.rForm.get('company.adresa').setValue(company.legalAddress);
        this.rForm.get('company.id').setValue(company.id);
        this.rForm.get('company.name').setValue(company.name);

        if (company.idno) {
            this.rForm.get('company.idno').setValue(company.idno);
            this.subscriptions.push(
                this.gdpService.retrieveLicenseByIdno(company.idno).subscribe(data => {
                    console.log('retrieveLicenseByIdno', data);
                    if (data) {
                        this.rForm.get('company.seria').setValue(data.serialNr);
                        this.rForm.get('company.nrLic').setValue(data.nr);
                        this.rForm.get('company.dataEliberariiLic').setValue(new Date(data.releaseDate));
                        this.rForm.get('company.dataExpirariiLic').setValue(new Date(data.expirationDate));
                    } else {
                        this.showNoLicence();
                    }
                }));
        } else {
            this.showNoLicence();
        }

    }

    showNoLicence() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Compania solicitanta nu are licenta. Mergeți la pagina principală?',
                confirm: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.route.navigate(['dashboard/homepage']);
            }
        });
    }


    checkIDNP($event) {
        if ($event.target.value.trim().length === 0) {
            this.rForm.get('idnp').setErrors(null);
        } else {
            this.subscriptions.push(this.gdpService.validIDNP($event.target.value).subscribe(response => {
                    if (response) {
                        this.rForm.get('idnp').setErrors(null);
                    } else {
                        this.rForm.get('idnp').setErrors({'incorrect': true});
                    }
                })
            );
        }
    }

    nextStep() {

        this.formSubmitted = true;

        if (!this.rForm.valid || !this.rForm.get('idnp').value) {
            return;
        }

        this.formSubmitted = false;

        this.loadingService.show();

        const useranameDB = this.gdpService.getUsername();

        const modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: 'R'
        }];
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;
        modelToSubmit.endDate = new Date();
        modelToSubmit.registrationRequestMandatedContacts = [{
            mandatedLastname: this.rForm.get('mandatedLastname').value,
            mandatedFirstname: this.rForm.get('mandatedFirstname').value,
            phoneNumber: this.rForm.get('phoneNumber').value,
            email: this.rForm.get('email').value,
            requestMandateNr: this.rForm.get('requestMandateNr').value,
            requestMandateDate: this.rForm.get('requestMandateDate').value,
            id: this.rForm.get('registrationRequestMandatedContactsId').value,
            idnp: this.rForm.get('idnp').value
        }];

        this.formSubmitted = true;

        this.subscriptions.push(this.gdpService.addRegistrationRequestForGDP(modelToSubmit).subscribe(req => {
                this.rForm.get('id').setValue(req.body.id);
                this.errorHandlerService.showSuccess('Datele au fost salvate');
                if (req.body.registrationRequestMandatedContacts[0]) {
                    this.rForm.get('registrationRequestMandatedContactsId').setValue(req.body.registrationRequestMandatedContacts[0].id);
                }

                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.navbarTitleService.showTitleMsg('');
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

        // if(!this.rForm.dirty){
        //     return true;
        // }
        // const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
        //     data: {
        //         message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
        //         confirm: false,
        //     size: 'sm',
        //     }
        // });
        //
        // return dialogRef.afterClosed();
        return true;

    }
}
