import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
import {Observable, Subject, Subscription} from 'rxjs';
import {AdministrationService} from '../../../shared/service/administration.service';
import {Router} from '@angular/router';
import {Document} from "../../../models/document";
import {RequestService} from "../../../shared/service/request.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {TaskService} from "../../../shared/service/task.service";
import {CanModuleDeactivate} from "../../../shared/auth-guard/can-deactivate-guard.service";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {PriceService} from "../../../shared/service/prices.service";

@Component({
    selector: 'app-reg-cerere',
    templateUrl: './price-reg-cerere.component.html',
    styleUrls: ['./price-reg-cerere.component.css']
})

export class PriceRegCerereComponent implements OnInit, OnDestroy, CanModuleDeactivate  {

    documents: Document [] = [];
    companii: Observable<any[]>;
    rForm: FormGroup;

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    loadingCompany : boolean = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();

    constructor(private fb: FormBuilder,
                private router: Router,
                private priceService: PriceService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: ErrorHandlerService,
                private loadingService: LoaderService,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog) {
        this.rForm = fb.group({
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'id': [null],
            'folderNumber': [null, Validators.required],
            'startDate': [new Date()],
            'currentStep': ['R'],
            'mandatedFirstname': [null, Validators.required],
            'mandatedLastname': [null, Validators.required],
            'phoneNumber': [null, [Validators.required, Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'email': [null, Validators.email],
            'requestMandateNr': [null, Validators.required],
            'requestMandateDate': [{value: null}, Validators.required],
            'registrationRequestMandatedContactsId': [null],
            'company': [null],
            'initiator': [''],
            'assignedUser': [''],
            'type':
                fb.group({
                    'code': ['CPMED', Validators.required]
                }),
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrarea cererii de stabilire a prețului');

        this.subscriptions.push(
            this.priceService.generateDocNumber().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.priceService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );
    }

    nextStep() {

        this.formSubmitted = true;
        if (!this.rForm.valid) {
            return;
        }

        this.formSubmitted = false;

        this.loadingService.show();

        var useranameDB = this.priceService.getUsername();

        var modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: 'R'
        }];
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;
        modelToSubmit.endDate = new Date();
        modelToSubmit.dossierNr = this.rForm.get('folderNumber').value;
        modelToSubmit.registrationRequestMandatedContacts = [{
            mandatedLastname : this.rForm.get('mandatedLastname').value,
            mandatedFirstname : this.rForm.get('mandatedFirstname').value,
            phoneNumber : this.rForm.get('phoneNumber').value,
            email : this.rForm.get('email').value,
            requestMandateNr : this.rForm.get('requestMandateNr').value,
            requestMandateDate : this.rForm.get('requestMandateDate').value,
            id : this.rForm.get('registrationRequestMandatedContactsId').value
        }];

        this.subscriptions.push(this.priceService.addRegistrationRequestForPrice(modelToSubmit).subscribe(req => {

                this.rForm.get('id').setValue(req.body.id);
                if(req.body.registrationRequestMandatedContacts[0]) {
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
