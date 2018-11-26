import {EvaluateModalComponent} from './../modal/evaluate-modal/evaluate-modal.component';
import {Component, OnInit} from '@angular/core';

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
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";

@Component({
    selector: 'app-evaluate-doc',
    templateUrl: './evaluate-doc.component.html',
    styleUrls: ['./evaluate-doc.component.css']
})
export class EvaluateDocComponent implements OnInit, CanModuleDeactivate {

    documents: Document [] = [];
    companii: any[];
    rForm: FormGroup;
    docTypes: any[];

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private errorHandlerService: ErrorHandlerService,
                private loadingService: LoaderService,
                private navbarTitleService: NavbarTitleService,) {
        this.rForm = fb.group({
            'requestNumber': [null],
            'startDate': [new Date(), Validators.required],
            'currentStep': ['E'],
            'sender': [null, Validators.required],
            'recipientList': [null, Validators.required],
            'executionDate': [null, Validators.required],
            'problemDescription': [null]

        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrare documente / Evaluare cerere');

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

        var modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'R'
        }];
        modelToSubmit.medicament.documents = this.documents;
        modelToSubmit.medicament.registrationDate = new Date();

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + data.body.id]);
            }, error => this.loadingService.hide())
        );
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    evaluateModalOpen(): void {
        const dialogRef = this.dialog.open(EvaluateModalComponent, {
            width: '650px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

        //     if (this.rForm.dirty && !this.canBeDeactivated) {
        //
        //         const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
        //             data: {
        //                 message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
        //                 confirm: false,
        //             }
        //         });
        //
        //         return dialogRef.afterClosed();
        //     }
        //     return true;
        // }
        return true;
    }
}