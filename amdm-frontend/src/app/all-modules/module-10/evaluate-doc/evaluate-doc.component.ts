import {EvaluateModalComponent} from './../modal/evaluate-modal/evaluate-modal.component';
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormGroup} from '@angular/forms';

import {MatDialog, MatDialogConfig} from '@angular/material';
import {Observable, Subscription} from 'rxjs';
import {AdministrationService} from '../../../shared/service/administration.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Document} from '../../../models/document';
import {RequestService} from '../../../shared/service/request.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {TaskService} from '../../../shared/service/task.service';
import {CanModuleDeactivate} from '../../../shared/auth-guard/can-deactivate-guard.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {DatePipe} from '@angular/common';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {PersAsignModalComponent} from '../modal/pers-asign-modal/pers-asign-modal.component';

@Component({
    selector: 'app-evaluate-doc',
    templateUrl: './evaluate-doc.component.html',
    styleUrls: ['./evaluate-doc.component.css']
})
export class EvaluateDocComponent implements OnInit, AfterViewInit, OnDestroy, CanModuleDeactivate {
    documents: Document [] = [];
    eForm: FormGroup;
    docTypes: any[];
    recipientList: any[];
    generatedDocNrSeq: number;
    formSubmitted: boolean;

    assignedUsers: string;
    history: string;

    canBeDeactivated = false;
    private subscriptions: Subscription[] = [];
    isRg02: boolean;
    isExecutionTermVisible = false;

    isReadOnlyMode = false;
    initiator = '';

    constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private loadingService: LoaderService,
                private navbarTitleService: NavbarTitleService,
                private activatedRoute: ActivatedRoute) {
        this.eForm = fb.group({
            'id': null,
            'requestNumber': null,
            'currentDate': {disabled: true, value: new Date()},
            'currentStep': null,
            'startDate': null,
            'recipient': '',
            'executors': [],
            'executionDate': null,
            'executionDateString': '',
            'problemDescription': {disabled: true, value: ''},
            'registrationRequestsEntity': {'requestHistories': {}, 'documents': []},
            'documentHistoryEntity': [],
            'letterNumber': null
        });
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrare documente / Evaluare cerere');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getDocumentModuleRequest(params['id']).subscribe(data => {
                        this.recipientList = data.recipientList;
                        const pipe = new DatePipe('ro-MD');
                        this.eForm.get('id').setValue(data.id);
                        this.eForm.get('letterNumber').setValue(data.letterNumber);
                        this.eForm.get('requestNumber').setValue(data.registrationRequestsEntity.requestNumber);
                        this.eForm.get('startDate').setValue(new Date(data.registrationRequestsEntity.startDate));
                        this.eForm.get('recipient').setValue(data.recipient);
                        this.eForm.get('executionDateString').setValue(data.executionDate == null ? null :
                            pipe.transform(new Date(data.executionDate), 'dd/MM/yyyy'));
                        this.eForm.get('executionDate').setValue(data.executionDate);
                        this.eForm.get('problemDescription').setValue(data.problemDescription);
                        this.eForm.get('executors').setValue(data.executors);
                        this.eForm.get('registrationRequestsEntity').setValue(data.registrationRequestsEntity);
                        this.eForm.get('currentStep').setValue(data.registrationRequestsEntity.currentStep);
                        this.documents = data.registrationRequestsEntity.documents;
                        this.documents.forEach(doc => doc.isOld = true);
                        this.assignedUsers = data.executors.map(u => u.fullname).join(', ');
                        this.eForm.get('documentHistoryEntity').setValue(data.documentHistoryEntity);
                        this.history = data.documentHistoryEntity.map(entity => new Date(entity.addDate) + ' - ' + entity.assignee +
                            ': ' + entity.actionDescription).join('\r\n');

                        this.isRg02 = data.registrationRequestsEntity.requestNumber.startsWith('Rg02') ? true : false;
                        this.isExecutionTermVisible = data.registrationRequestsEntity.requestNumber.startsWith('Rg03') ||
                            data.registrationRequestsEntity.requestNumber.startsWith('Rg01') ||
                            data.registrationRequestsEntity.requestNumber.startsWith('Rg04') ||
                            data.registrationRequestsEntity.requestNumber.startsWith('Rg05');

                        this.isReadOnlyMode = data.registrationRequestsEntity.currentStep.startsWith('F') ? true : false;
                        this.initiator = data.registrationRequestsEntity.initiator;
                    })
                );
            }
            )
        );
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('24', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                            }
                        )
                    );
                }
            )
        );
    }

    isPersonAssigned(): boolean {
        if (this.eForm.get('executors').value) {
            return this.eForm.get('executors').value.filter(exec => exec.name == this.authService.getUserName()).length > 0;
        }
    }

    isInitiator(): boolean {
        return this.initiator == this.authService.getUserName();
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    addComment(): void {
        const userName = this.authService.getUserName();
        const item = this.eForm.get('executors').value.filter(exec => exec.name == userName);
        const dialogRef = this.dialog.open(EvaluateModalComponent, {
            hasBackdrop: true,
            width:
                '650px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.actionDescription != '') {
                this.eForm.get('documentHistoryEntity').value.push(result);
                item.comment = '' + result.addDate.toLocaleString() + ': ' + result.assignee + ' - ' +
                    result.actionDescription + '\r\n';
                this.history = this.history + item.comment;
            }
        });
    }

    documentListModified(event) {
        const actionDescription = event.removed ? 'A fost sters document cu nume: ' + event.data.name + ', tip: ' + event.data.docType.description
            : 'A fost adaugat document cu nume: ' + event.data.name + ', tip: ' + event.data.docType.description;
        const comment = '' + new Date().toLocaleString().trim() + ': ' + this.authService.getUserName() + ' - ' +
            actionDescription + '\r\n';
        this.history = this.history + comment;
        this.eForm.get('documentHistoryEntity').value.push({id: null, addDate: new Date(), actionDescription: actionDescription, assignee: this.authService.getUserName()});
    }

    addPersonAssign(): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {initiator: this.eForm.get('registrationRequestsEntity').value.initiator, executors: this.eForm.get('executors').value};
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.panelClass = 'custom-dialog-container';
        dialogConfig.width = '650px';

        const dialogRef = this.dialog.open(PersAsignModalComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(response => {
            if (response && response.username != '') {
                const actionDescription = 'A delegat ' + response.fullname + ' pentru executare.';
                this.eForm.get('documentHistoryEntity').value.push({id: null, addDate: new Date(), actionDescription: actionDescription, assignee: this.authService.getUserName()});

                const comment = '' + new Date().toLocaleString() + ': ' + this.authService.getUserName() + ' - ' + actionDescription + '\r\n';
                this.history = this.history + comment;

                this.assignedUsers = this.assignedUsers + ', ' + response.fullname;
                this.eForm.get('executors').value.push({id: null, name: response.username, fullname: response.fullname, confirmed: false, documentModuleId: null});
            }
        });
    }

    finish(): void {
        this.loadingService.show();
        const modelToCommit: any = this.eForm.value;

        modelToCommit.registrationRequestsEntity.currentStep = 'F';
        modelToCommit.registrationRequestsEntity.assignedUser = this.authService.getUserName();
        modelToCommit.registrationRequestsEntity.endDate = new Date();

        modelToCommit.registrationRequestsEntity.documents = this.documents;
        modelToCommit.registrationRequestsEntity.requestHistories.push({
            startDate: this.eForm.get('currentDate').value,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'F'
        });
        modelToCommit.documentHistoryEntity = this.eForm.get('documentHistoryEntity').value;
        this.subscriptions.push(this.requestService.saveDocumentModuleRequest(modelToCommit).subscribe(data => {
                this.canBeDeactivated = true;
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage']);
            }, error => this.loadingService.hide())
        );
    }

    close(): void {
        this.loadingService.show();
        const modelToSubmit: any = this.eForm.value;

        modelToSubmit.registrationRequestsEntity.currentStep = 'W';
        modelToSubmit.registrationRequestsEntity.assignedUser = this.authService.getUserName();

        modelToSubmit.registrationRequestsEntity.requestHistories.push({
            startDate: this.eForm.get('startDate').value,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: this.eForm.get('currentStep').value
        });

        this.subscriptions.push(this.requestService.saveDocumentModuleRequest(modelToSubmit).subscribe(data => {
                this.canBeDeactivated = true;
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage']);
            }, error => this.loadingService.hide())
        );

    }

    save(stepStatus: string): void {
        this.loadingService.show();
        const modelToCommit: any = this.eForm.value;

        modelToCommit.registrationRequestsEntity.currentStep = stepStatus;
        modelToCommit.registrationRequestsEntity.assignedUser = this.authService.getUserName();
        // modelToCommit.registrationRequestsEntity.endDate = new Date();

        modelToCommit.registrationRequestsEntity.documents = this.documents;
        modelToCommit.registrationRequestsEntity.requestHistories.push({
            startDate: this.eForm.get('currentDate').value,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: this.eForm.get('currentStep').value
        });

        modelToCommit.executors = this.eForm.get('executors').value;
        this.subscriptions.push(this.requestService.saveDocumentModuleRequest(modelToCommit).subscribe(data => {
                this.canBeDeactivated = true;
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage']);
            }, error => this.loadingService.hide())
        );

    }

    cancel(): void {
        this.loadingService.show();
        const modelToCommit: any = this.eForm.value;

        modelToCommit.registrationRequestsEntity.currentStep = 'C';
        modelToCommit.registrationRequestsEntity.assignedUser = this.authService.getUserName();
        modelToCommit.registrationRequestsEntity.endDate = new Date();

        modelToCommit.registrationRequestsEntity.documents = this.documents;
        modelToCommit.registrationRequestsEntity.requestHistories.push({
            startDate: this.eForm.get('currentDate').value,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: this.eForm.get('currentStep').value
        });

        this.subscriptions.push(this.requestService.saveDocumentModuleRequest(modelToCommit).subscribe(data => {
                this.canBeDeactivated = true;
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage']);
            }, error => this.loadingService.hide())
        );
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

        if (this.eForm.dirty && !this.canBeDeactivated) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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
