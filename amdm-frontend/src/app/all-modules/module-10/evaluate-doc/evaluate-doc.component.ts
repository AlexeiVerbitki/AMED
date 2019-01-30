import {EvaluateModalComponent} from './../modal/evaluate-modal/evaluate-modal.component';
import {AfterViewInit, Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
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

@Component({
    selector: 'app-evaluate-doc',
    templateUrl: './evaluate-doc.component.html',
    styleUrls: ['./evaluate-doc.component.css']
})
export class EvaluateDocComponent implements OnInit, AfterViewInit, CanModuleDeactivate {
    documents: Document [] = [];
    eForm: FormGroup;
    docTypes: any[];
    recipientList: any[];
    generatedDocNrSeq: number;
    formSubmitted: boolean;

    canBeDeactivated = false;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private loadingService: LoaderService,
                private navbarTitleService: NavbarTitleService,
                private activatedRoute: ActivatedRoute, ) {
        this.eForm = fb.group({
            'id': null,
            'currentDate': {disabled: true, value: new Date()},
            'startDate': null,
            'sender': '',
            'recipients': [],
            'executionDate': null,
            'executionDateString': '',
            'problemDescription': '',
            'registrationRequestsEntity': {'requestHistories': {}, 'documents': []},

        });
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrare documente / Evaluare cerere');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getDocumentModuleRequest(params['id']).subscribe(data => {
                        this.recipientList = data.recipientList;
                        const pipe = new DatePipe('en-US');
                        this.eForm.get('id').setValue(data.id);
                        this.eForm.get('startDate').setValue(new Date(data.registrationRequestsEntity.startDate));
                        this.eForm.get('sender').setValue(data.sender);
                        this.eForm.get('executionDateString').setValue(pipe.transform(new Date(data.executionDate), 'dd/MM/yyyy'));
                        this.eForm.get('executionDate').setValue(data.executionDate);
                        this.eForm.get('problemDescription').setValue(data.problemDescription);
                        this.eForm.get('recipients').setValue(data.recipients);
                        this.eForm.get('registrationRequestsEntity').setValue(data.registrationRequestsEntity);
                        this.documents = data.registrationRequestsEntity.documents;
                        this.documents.forEach(doc => doc.isOld = true);

                    }
                    )
                );
            }, error1 => console.log('error  ', error1)
            )
        );
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('24', 'E').subscribe(step => {
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

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    controllBtn(item: any): void {
        item.confirmed = !item.confirmed;
    }

    addComment(item: any): void {
        const dialogRef = this.dialog.open(EvaluateModalComponent, {
            data: {
                problemDescription: item,
            },
            hasBackdrop: true,
            width:
                '650px'
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
    }

    finish(): void {

        this.loadingService.show();
        const modelToCommit: any = this.eForm.value;

        modelToCommit.registrationRequestsEntity.currentStep = 'F';
        modelToCommit.registrationRequestsEntity.assignedUser = this.authService.getUserName();
        modelToCommit.registrationRequestsEntity.endDate = new Date();

        modelToCommit.registrationRequestsEntity.documents = this.documents;
        console.log('1', modelToCommit.registrationRequestsEntity.requestHistories);
        modelToCommit.registrationRequestsEntity.requestHistories.push({
            startDate: this.eForm.get('currentDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'F'
        });

        console.log(modelToCommit);
        this.subscriptions.push(this.requestService.saveDocumentModuleRequest(modelToCommit).subscribe(data => {
                this.canBeDeactivated = true;
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage']);
            }, error => this.loadingService.hide())
        );
    }

    save(): void {
        this.loadingService.show();
        const modelToCommit: any = this.eForm.value;

        modelToCommit.registrationRequestsEntity.currentStep = 'E';
        modelToCommit.registrationRequestsEntity.assignedUser = this.authService.getUserName();
        modelToCommit.registrationRequestsEntity.endDate = new Date();

        modelToCommit.registrationRequestsEntity.documents = this.documents;
        console.log('1', modelToCommit.registrationRequestsEntity.requestHistories);
        modelToCommit.registrationRequestsEntity.requestHistories.push({
            startDate: this.eForm.get('currentDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

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
            startDate: this.eForm.get('currentDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'C'
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
