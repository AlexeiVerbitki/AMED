import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
import {Observable, Subject, Subscription} from 'rxjs';
import {AdministrationService} from '../../../shared/service/administration.service';
import {Router} from '@angular/router';
import {Document} from '../../../models/document';
import {RequestService} from '../../../shared/service/request.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {ErrorHandlerService} from '../../../shared/service/error-handler.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {TaskService} from '../../../shared/service/task.service';
import {CanModuleDeactivate} from '../../../shared/auth-guard/can-deactivate-guard.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {MedicamentService} from "../../../shared/service/medicament.service";

@Component({
    selector: 'app-reg-cerere',
    templateUrl: './reg-cerere.component.html',
    styleUrls: ['./reg-cerere.component.css']
})

export class RegCerereComponent implements OnInit, OnDestroy, CanModuleDeactivate  {

    documents: Document [] = [];
    companii: Observable<any[]>;
    rForm: FormGroup;
    docTypes: any[];

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();

    constructor(private fb: FormBuilder,
                private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private navbarTitleService: NavbarTitleService,
                private taskService: TaskService,
                private medicamentService : MedicamentService,
                private errorHandlerService: ErrorHandlerService,
                private loadingService: LoaderService,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog) {
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
            'company': [null, Validators.required],
            'initiator': [''],
            'assignedUser': ['']
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrarea medicamentului / Înregistrare cerere');

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) { return true; }
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
            this.taskService.getRequestStepByIdAndCode('1', 'R').subscribe(step => {
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

    nextStep() {


        this.formSubmitted = true;
        if (this.rForm.get('mandatedFirstname').invalid || this.rForm.get('mandatedLastname').invalid || this.rForm.get('company').invalid) {
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
        modelToSubmit.registrationRequestMandatedContacts = [{mandatedLastname : this.rForm.get('mandatedLastname').value,
            mandatedFirstname : this.rForm.get('mandatedFirstname').value,
            phoneNumber : this.rForm.get('phoneNumber').value,
            email : this.rForm.get('email').value,
            requestMandateNr : this.rForm.get('requestMandateNr').value,
            requestMandateDate : this.rForm.get('requestMandateDate').value
        }];
        modelToSubmit.type ={code : 'MEDF'};

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + data.body.id]);
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
