import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Document} from "../../../models/document";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {Expert} from "../../../models/expert";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {DocumentService} from "../../../shared/service/document.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";

@Component({
    selector: 'app-experti',
    templateUrl: './experti-modify.component.html',
    styleUrls: ['./experti-modify.component.css']
})
export class ExpertiModifyComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    expertForm: FormGroup;
    documents: Document [] = [];
    activeSubstancesTable: any[];
    company: any;
    outputDocuments: any[] = [];
    formSubmitted: boolean;
    type: any = 'POST_AUTHORIZATION';
    expert: Expert = new Expert();
    docTypes: any[];
    modelToSubmit: any;
    isNonAttachedDocuments: boolean = false;
    divisions: any[] = [];
    manufacturesTable: any[] = [];

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private requestService: RequestService,
                public dialogConfirmation: MatDialog,
                private administrationService: AdministrationService,
                private router: Router,
                private errorHandlerService: ErrorHandlerService,
                private taskService: TaskService,
                private loadingService: LoaderService,
                private documentService: DocumentService,
                private activatedRoute: ActivatedRoute) {
        this.expertForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
            'currentStep': ['F'],
            'medicamentName': [],
            'medicaments': [[]],
            'medicamentPostauthorizationRegisterNr': [''],
            'initiator': [''],
            'assignedUser': [''],
            'companyValue': [''],
            'division': [null],
            'medicament':
                fb.group({
                    'id': [],
                    'name': [''],
                    'company': [''],
                    'atcCode': [null],
                    'registrationDate': [],
                    'pharmaceuticalForm': [null],
                    'pharmaceuticalFormType': [null],
                    'dose': [null],
                    'unitsOfMeasurement': [null],
                    'internationalMedicamentName': [null],
                    'volume': [null],
                    'volumeQuantityMeasurement': [null],
                    'termsOfValidity': [null],
                    'code': [null],
                    'medicamentType': [null],
                    'storageQuantityMeasurement': [null],
                    'storageQuantity': [null],
                    'unitsQuantityMeasurement': [null],
                    'unitsQuantity': [null],
                    'prescription': {disabled: true, value: null},
                    'authorizationHolder': [null],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'documents': [],
                    'status': ['F'],
                    'experts': [''],
                    'group': ['']
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'requestHistories': []
        });
    }

    ngOnInit() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentHistory(params['id']).subscribe(data => {
                        this.modelToSubmit = Object.assign({}, data);
                        this.modelToSubmit.medicamentHistory = Object.assign([], data.medicamentHistory);
                        this.outputDocuments = data.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.expertForm.get('id').setValue(data.id);
                        this.expertForm.get('initiator').setValue(data.initiator);
                        this.expertForm.get('startDate').setValue(data.startDate);
                        this.expertForm.get('requestNumber').setValue(data.requestNumber);
                        this.expertForm.get('companyValue').setValue(data.company.name);
                        this.expertForm.get('company').setValue(data.company);
                        this.expertForm.get('medicament.id').setValue(data.medicamentHistory[0].id);
                        this.expertForm.get('medicament.name').setValue(data.medicamentHistory[0].name);
                        this.expertForm.get('medicamentName').setValue(data.medicamentHistory[0].name);
                        this.expertForm.get('medicamentPostauthorizationRegisterNr').setValue(data.medicamentHistory[0].registrationNumber);
                        this.expertForm.get('medicament.pharmaceuticalForm').setValue(data.medicamentHistory[0].pharmaceuticalForm.description);
                        this.expertForm.get('medicament.pharmaceuticalFormType').setValue(data.medicamentHistory[0].pharmaceuticalForm.type.description);
                        this.expertForm.get('medicament.dose').setValue(data.medicamentHistory[0].dose);
                        if (data.medicamentHistory && data.medicamentHistory.length != 0 && data.medicamentHistory[0].unitsOfMeasurement) {
                            this.expertForm.get('medicament.unitsOfMeasurement').setValue(data.medicamentHistory[0].unitsOfMeasurement.description);
                        }
                        this.expertForm.get('medicament.internationalMedicamentName').setValue(data.medicamentHistory[0].internationalMedicamentName.description);
                        this.expertForm.get('medicament.medicamentType').setValue(data.medicamentHistory[0].medicamentType.description);
                        this.expertForm.get('medicament.volume').setValue(data.medicamentHistory[0].volume);
                        if (data.medicamentHistory && data.medicamentHistory.length != 0 && data.medicamentHistory[0].volumeQuantityMeasurement) {
                            this.expertForm.get('medicament.volumeQuantityMeasurement').setValue(data.medicamentHistory[0].volumeQuantityMeasurement.description);
                        }
                        this.expertForm.get('medicament.termsOfValidity').setValue(data.medicamentHistory[0].termsOfValidity);
                        this.expertForm.get('medicament.group').setValue(data.medicamentHistory[0].group.description);
                        if (data.medicamentHistory[0].prescription == 0) {
                            this.expertForm.get('medicament.prescription').setValue('Fără prescripţie');
                        } else {
                            this.expertForm.get('medicament.prescription').setValue('Cu prescripţie');
                        }
                        this.expertForm.get('medicament.authorizationHolder').setValue(data.medicamentHistory[0].authorizationHolder.description);
                        this.expertForm.get('medicament.authorizationHolderCountry').setValue(data.medicamentHistory[0].authorizationHolder.country.description);
                        this.expertForm.get('medicament.authorizationHolderAddress').setValue(data.medicamentHistory[0].authorizationHolder.address);
                        for (let entry of data.medicamentHistory[0].divisionHistory) {
                            this.divisions.push({
                                description: entry.description,
                                old: entry.old
                            });
                        }
                        this.expertForm.get('medicament.atcCode').setValue(data.medicamentHistory[0].atcCode);
                        this.activeSubstancesTable = data.medicamentHistory[0].activeSubstancesHistory;
                        this.manufacturesTable = data.medicamentHistory[0].manufacturesHistory;
                        this.expertForm.get('type').setValue(data.type);
                        this.expertForm.get('requestHistories').setValue(data.requestHistories);
                        this.expertForm.get('typeValue').setValue(data.type.code);
                        this.company = data.company;
                        this.documents = data.documents;
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                    })
                );
            })
        );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('21', 'X').subscribe(step => {
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

    viewDoc(document: any) {
        this.formSubmitted = true;
        if (!this.expert || !this.expert.chairman || !this.expert.farmacolog || !this.expert.farmacist || !this.expert.medic) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati');
            return;
        }
        this.formSubmitted = false;

        if (document.docType.category == 'OM') {
            this.subscriptions.push(this.documentService.viewMedicamentAuthorizationOrder(document.number).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }, error => {
                    console.log('error ', error);
                }
                )
            );
        } else {
            this.subscriptions.push(this.documentService.viewMedicamentAuthorizationCertificate(document.number).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }, error => {
                    console.log('error ', error);
                }
                )
            );
        }
    }


    finish() {
        this.formSubmitted = true;

        let isFormInvalid = false;
        let isOutputDocInvalid = false;

        if (!this.expert || !this.expert.medic || !this.expert.farmacist || !this.expert.farmacolog || !this.expert.chairman) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            isFormInvalid = true;
        }

        if (!isFormInvalid && this.expert && !this.expert.status) {
            this.errorHandlerService.showError('Status inregistrare trebuie selectat.');
            isFormInvalid = true;
        }

        // if (!isFormInvalid && this.expert && this.expert.status == 1) {
        //     for (let entry of this.outputDocuments) {
        //         if (entry.status == 'Nu este atasat') {
        //             this.isNonAttachedDocuments = true;
        //             this.errorHandlerService.showError('Exista documente care nu au fost atasate.');
        //             isOutputDocInvalid = true;
        //         }
        //     }
        // }
        //
        // if (!isOutputDocInvalid) {
        //     this.isNonAttachedDocuments = false;
        // }

        if (isOutputDocInvalid || isFormInvalid) {
            return;
        }

        if (this.expert.status == 1) {
            this.success();
        } else {
            this.interruptProcess();
        }

    }

    success() {

        for (let entry of this.outputDocuments) {
            if (entry.docType.category == 'OM' && entry.status == 'Nu este atasat') {
                this.errorHandlerService.showError('Ordinul de aprobare a modificărilor postautorizare nu a fost atasat');
             return;
            }
        }

        this.loadingService.show();
        this.formSubmitted = false;

        var x = this.modelToSubmit;

        let usernameDB = this.authService.getUserName();
        x.currentStep = 'F';
        x.endDate = new Date();
        x.assignedUser = usernameDB;

        x.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'X'
        });

        x.requestHistories.push({
            startDate: new Date(),
            username: usernameDB, step: 'F'
        });

        x.documents = this.documents;
        x.outputDocuments = this.outputDocuments;
        x.medicaments = [];

        x.medicamentHistory[0].experts = {
            chairman: this.expert.chairman, farmacolog: this.expert.farmacolog, farmacist: this.expert.farmacist,
            medic: this.expert.medic, date: new Date(), comment: this.expert.comment, number: this.expert.comiteeNr
        };

        this.subscriptions.push(this.requestService.savePostauthorizationMedicament(x).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module']);
            }, error => this.loadingService.hide())
        );
    }

    documentModified(event) {
        this.formSubmitted = false;
        this.checkOutputDocumentsStatus();
    }

    interruptProcess() {

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                let userNameDB = this.authService.getUserName();
                var modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    initiator: this.modelToSubmit.initiator,
                    assignedUser: userNameDB,
                    id: this.expertForm.get('id').value,
                    medicaments: this.modelToSubmit.medicaments,
                    medicamentHistory: this.modelToSubmit.medicamentHistory
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.expertForm.get('data').value, endDate: new Date(),
                    username: userNameDB, step: 'X'
                });

                modelToSubmit.medicaments = [];

                modelToSubmit.medicamentHistory[0].experts = {
                    chairman: this.expert.chairman,
                    farmacolog: this.expert.farmacolog,
                    farmacist: this.expert.farmacist,
                    medic: this.expert.medic,
                    date: new Date(),
                    comment: this.expert.comment,
                    number: this.expert.comiteeNr
                };

                this.subscriptions.push(this.requestService.addMediacmentPostauthorizationHistoryOnInterruption(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/post-modify/interrupt/' + this.expertForm.get('id').value]);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    checkOutputDocumentsStatus() {
        for (let entry of this.outputDocuments) {
            var isMatch = this.documents.some(elem => {
                return (elem.docType.category == entry.docType.category) ? true : false;
            });
            if (isMatch) {
                entry.status = 'Atasat';
            } else {
                entry.status = 'Nu este atasat';
            }
        }
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

        // if(!this.rForm.dirty){
        //     return true;
        // }
        // const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
        //     data: {
        //         message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
        //         confirm: false,
        //     }
        // });
        //
        // return dialogRef.afterClosed();
        return true;

    }
}
