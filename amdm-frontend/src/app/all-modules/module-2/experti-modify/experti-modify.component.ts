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
import {MatDialog, MatDialogConfig} from "@angular/material";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {MedicamentDetailsDialogComponent} from "../../../dialog/medicament-details-dialog/medicament-details-dialog.component";
import {MedicamentService} from "../../../shared/service/medicament.service";

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
    medicamentsDetails : any[];

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private requestService: RequestService,
                public dialogConfirmation: MatDialog,
                private administrationService: AdministrationService,
                private router: Router,
                public dialog: MatDialog,
                private errorHandlerService: ErrorHandlerService,
                private taskService: TaskService,
                private navbarTitleService: NavbarTitleService,
                private medicamentService: MedicamentService,
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
                    'commercialNameTo': [''],
                    'company': [''],
                    'atcCodeTo': [null],
                    'registrationDate': [],
                    'registrationNumber': [],
                    'pharmaceuticalFormTo': [null],
                    'pharmaceuticalFormType': [null],
                    'doseTo': [null],
                    'unitsOfMeasurementTo': [null],
                    'internationalMedicamentNameTo': [null],
                    'volumeTo': [null],
                    'volumeQuantityMeasurementTo': [null],
                    'termsOfValidityTo': [null],
                    'code': [null],
                    'medicamentTypeTo': [null],
                    'prescriptionTo': {disabled: true, value: null},
                    'authorizationHolderTo': [null],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'documents': [],
                    'status': ['F'],
                    'experts': [''],
                    'groupTo': ['']
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
        this.navbarTitleService.showTitleMsg('Aprobarea modificarilor postautorizate / Expertiza');

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
                        this.expertForm.get('medicament.commercialNameTo').setValue(data.medicamentHistory[0].commercialNameTo);
                        this.expertForm.get('medicamentName').setValue(data.medicamentHistory[0].commercialNameTo);
                        this.expertForm.get('medicament.registrationNumber').setValue(data.medicamentHistory[0].registrationNumber);
                        this.expertForm.get('medicamentPostauthorizationRegisterNr').setValue(data.medicamentHistory[0].registrationNumber);
                        this.expertForm.get('medicament.pharmaceuticalFormTo').setValue(data.medicamentHistory[0].pharmaceuticalFormTo.description);
                        this.expertForm.get('medicament.pharmaceuticalFormType').setValue(data.medicamentHistory[0].pharmaceuticalFormTo.type.description);
                        this.expertForm.get('medicament.doseTo').setValue(data.medicamentHistory[0].doseTo);
                        if (data.medicamentHistory && data.medicamentHistory.length != 0 && data.medicamentHistory[0].unitsOfMeasurementTo) {
                            this.expertForm.get('medicament.unitsOfMeasurementTo').setValue(data.medicamentHistory[0].unitsOfMeasurementTo.description);
                        }
                        this.expertForm.get('medicament.internationalMedicamentNameTo').setValue(data.medicamentHistory[0].internationalMedicamentNameTo.description);
                        this.expertForm.get('medicament.medicamentTypeTo').setValue(data.medicamentHistory[0].medicamentTypeTo.description);
                        this.expertForm.get('medicament.volumeTo').setValue(data.medicamentHistory[0].volumeTo);
                        if (data.medicamentHistory && data.medicamentHistory.length != 0 && data.medicamentHistory[0].volumeQuantityMeasurementTo) {
                            this.expertForm.get('medicament.volumeQuantityMeasurementTo').setValue(data.medicamentHistory[0].volumeQuantityMeasurementTo.description);
                        }
                        this.expertForm.get('medicament.termsOfValidityTo').setValue(data.medicamentHistory[0].termsOfValidityTo);
                        this.expertForm.get('medicament.groupTo').setValue(data.medicamentHistory[0].groupTo.description);
                        if (data.medicamentHistory[0].prescriptionTo == 0) {
                            this.expertForm.get('medicament.prescriptionTo').setValue('Fără prescripţie');
                        } else {
                            this.expertForm.get('medicament.prescriptionTo').setValue('Cu prescripţie');
                        }
                        this.expertForm.get('medicament.authorizationHolderTo').setValue(data.medicamentHistory[0].authorizationHolderTo.description);
                        this.expertForm.get('medicament.authorizationHolderCountry').setValue(data.medicamentHistory[0].authorizationHolderTo.country.description);
                        this.expertForm.get('medicament.authorizationHolderAddress').setValue(data.medicamentHistory[0].authorizationHolderTo.address);
                        for (let entry of data.medicamentHistory[0].divisionHistory) {
                            this.divisions.push({
                                description: entry.description,
                                old: entry.old
                            });
                        }
                        this.expertForm.get('medicament.atcCodeTo').setValue(data.medicamentHistory[0].atcCodeTo);
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
                        this.subscriptions.push(
                        this.medicamentService.getMedicamentsByFilter({registerNumber : data.medicamentHistory[0].registrationNumber}
                        ).subscribe(request => {
                                this.medicamentsDetails = request.body;
                            },
                            error => console.log(error)
                        ));
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

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    showMedicamentDetails() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '1100px';

        dialogConfig2.data = {
            value: this.medicamentsDetails[0].code
        };

        this.dialog.open(MedicamentDetailsDialogComponent, dialogConfig2);
    }
}
