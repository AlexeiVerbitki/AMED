import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../models/document';
import {Observable, Subject, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {TaskService} from '../../../shared/service/task.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {MatDialog} from '@angular/material';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {CanModuleDeactivate} from '../../../shared/auth-guard/can-deactivate-guard.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {LicenseService} from '../../../shared/service/license/license.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {ScrAuthorRolesService} from '../../../shared/auth-guard/scr-author-roles.service';

@Component({
    selector: 'app-reg-cerere',
    templateUrl: './reg-cerere-gmp.component.html',
    styleUrls: ['./reg-cerere-gmp.component.css']
})
export class RegCerereGmpComponent implements OnInit, OnDestroy, CanModuleDeactivate {

    documents: Document [] = [];
    companii: Observable<any[]>;
    rForm: FormGroup;
    docTypes: any[];

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private navbarTitleService: NavbarTitleService,
                private taskService: TaskService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private loadingService: LoaderService,
                private licenseService: LicenseService,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog,
                private roleSrv: ScrAuthorRolesService) {
        this.rForm = fb.group({
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['E'],
            'mandatedFirstname': [null, Validators.required],
            'mandatedLastname': [null, Validators.required],
            'phoneNumber': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'email': [null, Validators.email],
            'requestMandateNr': [null],
            'requestMandateDate': [null],
            'idnp': [null, [Validators.maxLength(13), Validators.minLength(13), Validators.pattern('[0-9]+')]],
            'company': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'seria': [null],
            'nrLic': [null],
            'dataEliberariiLic': {disabled: true, value: null},
            'dataExpirariiLic': {disabled: true, value: null},
            'adresa': [null],
            'idno': [null],
            'regSubject': ['', Validators.required]
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Autorizație de fabricație a medicamentelor / Înregistrare cerere');

        this.subscriptions.push(
            this.administrationService.generateGMPRequestNumber().subscribe(data => {
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

                    this.administrationService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('43', 'R').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );
    }

    clearCompanyDetails() {
        this.rForm.get('adresa').setValue(null);
        this.rForm.get('idno').setValue(null);
        this.rForm.get('seria').setValue(null);
        this.rForm.get('nrLic').setValue(null);
        this.rForm.get('dataEliberariiLic').setValue(null);
        this.rForm.get('dataExpirariiLic').setValue(null);
    }

    companySelected(company) {

        if (!company) {
            this.clearCompanyDetails();
            return;
        }

        this.rForm.get('adresa').setValue(company.legalAddress);

        if (company.idno) {
            this.rForm.get('idno').setValue(company.idno);
            this.subscriptions.push(
                this.licenseService.retrieveLicenseByIdno(company.idno).subscribe(data => {
                    if (data) {
                        this.rForm.get('seria').setValue(data.serialNr);
                        this.rForm.get('nrLic').setValue(data.nr);
                        this.rForm.get('dataEliberariiLic').setValue(new Date(data.releaseDate));
                        this.rForm.get('dataExpirariiLic').setValue(new Date(data.expirationDate));
                    } else {
                        this.showNoLicence();
                    }
                }));
        } else {
            this.showNoLicence();
        }

    }

    showNoLicence() {
        this.clearCompanyDetails();
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Compania solicitanta nu are licenta. Mergeți la pagina principală?',
                confirm: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.router.navigate(['dashboard/homepage']);
            }
        });
    }


    checkIDNP($event) {
        if ($event.target.value.trim().length === 0) {
            this.rForm.get('idnp').setErrors(null);
        } else {
            this.subscriptions.push(this.administrationService.validIDNP($event.target.value).subscribe(response => {
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

        if (this.rForm.get('company').valid && !this.rForm.get('seria').value) {
            this.errorHandlerService.showError('Nu a fost gasita nici o licenta pentru compania selectata.');
            return;
        }

        if (this.rForm.get('mandatedFirstname').invalid || this.rForm.get('mandatedLastname').invalid || this.rForm.get('company').invalid
            || this.rForm.get('idnp').invalid || this.rForm.get('regSubject').invalid) {
            return;
        }

        if (this.rForm.get('requestMandateNr').value && !this.rForm.get('requestMandateDate').value) {
            this.errorHandlerService.showError('Data eliberarii procurii trebuie introdusa.');
            return;
        }

        if (this.rForm.get('requestMandateDate').value && !this.rForm.get('requestMandateNr').value) {
            this.errorHandlerService.showError('Numarul procurii trebuie introdus.');
            return;
        }

        this.formSubmitted = false;

        this.loadingService.show();

        const useranameDB = this.authService.getUserName();

        const modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: 'R'
        }];
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;
        modelToSubmit.registrationRequestMandatedContacts = [{
            mandatedLastname: this.rForm.get('mandatedLastname').value,
            mandatedFirstname: this.rForm.get('mandatedFirstname').value,
            phoneNumber: this.rForm.get('phoneNumber').value,
            email: this.rForm.get('email').value,
            requestMandateNr: this.rForm.get('requestMandateNr').value,
            requestMandateDate: this.rForm.get('requestMandateDate').value,
            idnp: this.rForm.get('idnp').value
        }];
        modelToSubmit.type = {code: 'GMPF'};

        this.subscriptions.push(this.requestService.addGMPRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                if (this.roleSrv.isRightAssigned('scr_module_12') || this.roleSrv.isRightAssigned('scr_admin')) {
                    this.router.navigate(['dashboard/module/gmp/evaluate/' + data.body.id]);
                } else if (this.roleSrv.isRightAssigned('scr_register_request')) {
                    this.router.navigate(['/dashboard/homepage/']);
                }
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
