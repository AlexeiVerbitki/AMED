import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
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
    docTypes: any[];
    recipients: any[];

    generatedDocNrSeq: number;
    formSubmitted = false;
    canBeDeactivated = false;
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
                'sender': [null, Validators.required],
                'recipientList': [null, Validators.required],
                'executionDate': [null, Validators.required],
                'problemDescription': [null]
            }
        );
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrare documente / Registrare cerere');

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('24', 'R').subscribe(step => {
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

        this.subscriptions.push(this.administrationService.getAllScrUsers().subscribe(data => {
                this.recipients = data;
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
        const currentUser = this.authService.getUserName();

        const modelToSubmit: any = {recipients: [], registrationRequestsEntity: {requestHistories: {}, type: {}, documents: {}}};


        modelToSubmit.registrationRequestsEntity.requestNumber = this.rForm.get('requestNumber').value;
        modelToSubmit.registrationRequestsEntity.initiator = currentUser;
        modelToSubmit.registrationRequestsEntity.assignedUser = currentUser;
        modelToSubmit.registrationRequestsEntity.startDate = this.rForm.get('startDate').value;
        modelToSubmit.registrationRequestsEntity.currentStep = 'E';

        modelToSubmit.sender = this.rForm.get('sender').value;
        modelToSubmit.executionDate = this.rForm.get('executionDate').value;
        modelToSubmit.problemDescription = this.rForm.get('problemDescription').value;

        this.rForm.value.recipientList.forEach(elem => modelToSubmit.recipients.push({
            name: elem.username, comment: '', confirmed: false
        }));

        modelToSubmit.registrationRequestsEntity.requestHistories = [{
            startDate: this.rForm.get('startDate').value,
            endDate: new Date(),
            username: currentUser,
            step: 'R'
        }];
        modelToSubmit.registrationRequestsEntity.type = {id: 24, description: '', code: '', processId: ''};
        modelToSubmit.registrationRequestsEntity.documents = this.documents;

        this.subscriptions.push(this.requestService.addDocumentRequest(modelToSubmit).subscribe(data => {
                this.canBeDeactivated = true;
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/documents/evaluate/' + data.body.id]);
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
