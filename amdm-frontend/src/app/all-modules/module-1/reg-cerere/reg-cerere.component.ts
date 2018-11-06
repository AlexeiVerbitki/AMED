import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
import {Observable, Subscription} from 'rxjs';
import {AdministrationService} from '../../../shared/service/administration.service';
import {Router} from '@angular/router';
import {Document} from "../../../models/document";
import {RequestService} from "../../../shared/service/request.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {TaskService} from "../../../shared/service/task.service";
import {CanModuleDeactivate} from "../../../shared/auth-guard/can-deactivate-guard.service";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";

@Component({
    selector: 'app-reg-cerere',
    templateUrl: './reg-cerere.component.html',
    styleUrls: ['./reg-cerere.component.css']
})

export class RegCerereComponent implements OnInit, OnDestroy, CanModuleDeactivate  {

    documents: Document [] = [];
    companii: any[];
    rForm: FormGroup;
    docTypes: any[];

    generatedDocNrSeq: number;
    //filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    //isWrongValueCompany: boolean;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private errorHandlerService: ErrorHandlerService,
                private loadingService: LoaderService,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog) {
        this.rForm = fb.group({
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['E'],
            'medicament':
                fb.group({
                    'name': ['', Validators.required],
                    'company': [null, Validators.required],
                    'status': ['P']
                }),
            'company': [''],
            'type':
                fb.group({
                    'code': ['MEDP', Validators.required]
                }),
        });
    }

    ngOnInit() {
        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllCompanies().subscribe(data => {
                    this.companii = data;
                },
                error => console.log(error)
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
        if (this.documents.length === 0 || !this.rForm.valid) {
            return;
        }

        this.formSubmitted = false;

        this.loadingService.show();
        this.rForm.get('company').setValue(this.rForm.value.medicament.company);

        let formModel: any = this.rForm.value;
        formModel.requestHistories = [{
            startDate: this.rForm.get('startDate').value,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'E'
        }];
        formModel.medicament.documents = this.documents;
        formModel.medicament.registrationDate = new Date();

        this.subscriptions.push(this.requestService.addMedicamentRequest(formModel).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + data.body.id]);
            }, error => this.loadingService.hide())
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

        console.log('form details: ', this.rForm);
        if(!this.rForm.dirty){
            return true;
        }
        const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                title: 'test',
                message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
                confirm: false,
            }
        });

        return dialogRef.afterClosed();

    }
}
