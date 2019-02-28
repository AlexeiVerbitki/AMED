import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {Observable, Subscription} from 'rxjs';
import {AdministrationService} from '../../../shared/service/administration.service';
import {Router} from '@angular/router';
import {Document} from '../../../models/document';
import {RequestService} from '../../../shared/service/request.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {TaskService} from '../../../shared/service/task.service';
import {CanModuleDeactivate} from '../../../shared/auth-guard/can-deactivate-guard.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';

@Component({
    selector: 'app-reg-doc',
    templateUrl: './reg-doc.component.html',
    styleUrls: ['./reg-doc.component.css']
})


export class RegDocComponent implements OnInit, OnDestroy, CanModuleDeactivate {

    documents: Document [] = [];
    rForm: FormGroup;
    initialDocTypes: any[];
    docTypes: any[];
    executors: any[];
    registerCodes: any[];

    generatedDocNrSeq: number;
    formSubmitted = false;
    canBeDeactivated = false;

    isExecutor = false;
    solicitant = false;
    execTerm = false;
    isOutLetter = false;

    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private successOrErrorHandlerService: SuccessOrErrorHandlerService,
                private loadingService: LoaderService,
                private navbarTitleService: NavbarTitleService,
                public dialogConfirmation: MatDialog) {
        this.rForm = fb.group({
                'requestNumber': [null],
                'startDate': [new Date(), Validators.required],
                'currentStep': ['E'],
                'recipient': [null],
                'executorList': [],
                'executionDate': [null],
                'problemDescription': [null]
            }
        );
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrare documente / Registrare cerere');

        this.subscriptions.push(this.taskService.getRegisterCatalogCodes().subscribe(data => {
                this.registerCodes = data;
                this.registerCodes = this.registerCodes.filter(elem => {
                    return 'Rg01,Rg02,Rg03,Rg04,Rg05'.includes(elem.registerCode);
                });
            }
        ));

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('24', 'R').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.initialDocTypes = data;
                                this.initialDocTypes = this.initialDocTypes.filter(r => step.availableDocTypes.includes(r.category));
                                this.docTypes = this.initialDocTypes.filter(r => r.category == 'AX');
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(this.administrationService.getAllValidUsers().subscribe(data => {
                this.executors = data;
            },
            error => console.log(error)
            )
        );
        this.subscribeForValueChanges();
    }

    subscribeForValueChanges() {
        this.subscriptions.push(this.rForm.get('requestNumber').valueChanges.subscribe(regRequestCode => {
                this.docTypes = [];
                if (regRequestCode == null) {
                    this.initialDocTypes.forEach(doc => doc.category == 'AX' ? this.docTypes.push(doc) : null);
                    this.isExecutor = false;
                    this.execTerm = false;
                    this.isOutLetter = false;
                } else if (regRequestCode.registerCode == 'Rg01') {
                    this.initialDocTypes.forEach(doc => 'AX,SIN'.includes(doc.category) ? this.docTypes.push(doc) : null);
                    this.solicitant = true;
                    this.isExecutor = false;
                    this.execTerm = false;
                    this.isOutLetter = true;
                } else if (regRequestCode.registerCode == 'Rg02') {
                    this.initialDocTypes.forEach(doc => 'AX,SIE'.includes(doc.category) ? this.docTypes.push(doc) : null);
                    this.solicitant = false;
                    this.isExecutor = true;
                    this.execTerm = false;
                    this.isOutLetter = false;
                } else if (regRequestCode.registerCode == 'Rg03') {
                    this.initialDocTypes.forEach(doc => 'AX,DI'.includes(doc.category) ? this.docTypes.push(doc) : null);
                    this.isExecutor = true;
                    this.execTerm = true;
                    this.isOutLetter = false;
                } else if (regRequestCode.registerCode == 'Rg04') {
                    this.initialDocTypes.forEach(doc => 'AX,OR'.includes(doc.category) ? this.docTypes.push(doc) : null);
                    this.isExecutor = true;
                    this.execTerm = true;
                    this.isOutLetter = false;
                } else if (regRequestCode.registerCode == 'Rg05') {
                    this.initialDocTypes.forEach(doc => 'AX,PT'.includes(doc.category) ? this.docTypes.push(doc) : null);
                    this.isExecutor = true;
                    this.execTerm = true;
                    this.isOutLetter = false;
                }
            })
        );

    }

    nextStep() {
        this.formSubmitted = true;

        if (this.documents.length === 0 || !this.rForm.valid) {
            return;
        }

        this.formSubmitted = false;

        this.loadingService.show();
        const currentUser = this.authService.getUserName();

        const modelToSubmit: any = {executors: [], registrationRequestsEntity: {requestHistories: {}, type: {}, documents: {}}};


        modelToSubmit.registrationRequestsEntity.requestNumber = this.rForm.get('requestNumber').value.registerCode;
        modelToSubmit.registrationRequestsEntity.initiator = currentUser;
        modelToSubmit.registrationRequestsEntity.assignedUser = currentUser;
        modelToSubmit.registrationRequestsEntity.startDate = this.rForm.get('startDate').value;
        modelToSubmit.registrationRequestsEntity.regSubject = this.rForm.get('problemDescription').value;

        if (this.rForm.get('requestNumber').value.registerCode == 'Rg01') {
            modelToSubmit.registrationRequestsEntity.currentStep = 'FI';

            modelToSubmit.registrationRequestsEntity.requestHistories = [{
                startDate: this.rForm.get('startDate').value,
                endDate: new Date(),
                username: currentUser,
                step: 'R'
            }];
        } else {
            modelToSubmit.registrationRequestsEntity.currentStep = 'E';

            modelToSubmit.registrationRequestsEntity.requestHistories = [{
                startDate: this.rForm.get('startDate').value,
                endDate: new Date(),
                username: currentUser,
                step: 'R'
            }];
        }

        modelToSubmit.recipient = this.rForm.get('recipient').value;
        modelToSubmit.executionDate = this.rForm.get('executionDate').value;
        modelToSubmit.problemDescription = this.rForm.get('problemDescription').value;

        if (this.rForm.value.executorList != null) {
            this.rForm.value.executorList.forEach(elem => modelToSubmit.executors.push({
                name: elem.username, comment: '', confirmed: false
            }));
        }

        modelToSubmit.registrationRequestsEntity.type = {id: 24, description: '', code: '', processId: ''};
        modelToSubmit.registrationRequestsEntity.documents = this.documents;

        this.subscriptions.push(this.requestService.addDocumentRequest(modelToSubmit).subscribe(data => {
                this.canBeDeactivated = true;
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage/']);
            }, error => this.loadingService.hide())
        );
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.rForm.dirty && !this.canBeDeactivated) {
            const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
                data: {
                    message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
                    confirm: false,
                }
            });

            return dialogRef.afterClosed();
        }

        return true;
    }
}
