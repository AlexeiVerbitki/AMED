import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {Expert} from '../../../models/expert';
import {ErrorHandlerService} from '../../../shared/service/error-handler.service';
import {DocumentService} from '../../../shared/service/document.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {TaskService} from '../../../shared/service/task.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {MedicamentDetailsDialogComponent} from '../../../dialog/medicament-details-dialog/medicament-details-dialog.component';
import {MedicamentService} from '../../../shared/service/medicament.service';

@Component({
    selector: 'app-experti',
    templateUrl: './experti-modify.component.html',
    styleUrls: ['./experti-modify.component.css']
})
export class ExpertiModifyComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    expertForm: FormGroup;
    documents: Document [] = [];
    docDetails: Document = new Document();
    activeSubstancesTable: any[];
    company: any;
    outputDocuments: any[] = [];
    formSubmitted: boolean;
    type: any = 'POST_AUTHORIZATION';
    expert: Expert = new Expert();
    docTypes: any[];
    modelToSubmit: any;
    isNonAttachedDocuments = false;
    divisions: any[] = [];
    manufacturesTable: any[] = [];
    medicamentsDetails: any[];
    auxiliarySubstancesTable: any[] = [];
    instructions: any[] = [];
    machets: any[] = [];
    registrationRequestMandatedContacts: any[] = [];
    chairmans: any[];
    farmacologs: any[];
    farmacists: any[];
    medics: any[];
    omAttached = false;
    omApproved = false;

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
            'expertDate': [new Date()],
            'comiteeNr': [null],
            'chairman': [null],
            'farmacolog': [null],
            'farmacist': [null],
            'medic': [null],
            'commentExperts': [null],
            'statusExperts': [null, Validators.required],
            'decisionChairman': [null],
            'decisionFarmacolog': [null],
            'decisionFarmacist': [null],
            'decisionMedic': [null],
            'divisionBonDePlata': [null],
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
                    'medTypesValues': [null],
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
                        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
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
                        this.expertForm.get('medicament.registrationDate').setValue(data.medicamentHistory[0].registrationDate);
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
                        let medTypes = '';
                        for (const mt of data.medicamentHistory[0].medicamentTypesHistory) {
                            medTypes = medTypes + mt.type.description + '; ';
                        }
                        this.expertForm.get('medicament.medTypesValues').setValue(medTypes);
                        if (data.medicamentHistory[0].experts) {
                            this.expertForm.get('expertDate').setValue(new Date(data.medicamentHistory[0].experts.date));
                            this.expertForm.get('comiteeNr').setValue(data.medicamentHistory[0].experts.number);
                            this.expertForm.get('commentExperts').setValue(data.medicamentHistory[0].experts.comment);
                            if (data.medicamentHistory[0].experts.status) {
                                this.expertForm.get('statusExperts').setValue(data.medicamentHistory[0].experts.status.toString());
                            }
                            this.expertForm.get('decisionChairman').setValue(data.medicamentHistory[0].experts.decisionChairman);
                            this.expertForm.get('decisionFarmacolog').setValue(data.medicamentHistory[0].experts.decisionFarmacolog);
                            this.expertForm.get('decisionFarmacist').setValue(data.medicamentHistory[0].experts.decisionFarmacist);
                            this.expertForm.get('decisionMedic').setValue(data.medicamentHistory[0].experts.decisionMedic);
                        }
                        for (const entry of data.medicamentHistory[0].divisionHistory) {
                            this.divisions.push({
                                description: entry.description,
                                old: entry.old,
                                id: entry.id,
                                approved: entry.approved
                            });
                        }
                        this.expertForm.get('medicament.atcCodeTo').setValue(data.medicamentHistory[0].atcCodeTo);
                        this.activeSubstancesTable = data.medicamentHistory[0].activeSubstancesHistory;
                        this.auxiliarySubstancesTable = data.medicamentHistory[0].auxiliarySubstancesHistory;
                        this.fillInstructions(data.medicamentHistory[0]);
                        if (data.medicamentHistory[0].approved == 1) {
                            this.expertForm.get('statusExperts').setValue('1');
                        }
                        this.fillMachets(data.medicamentHistory[0]);
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
                        this.docDetails = this.documents.find(t => t.docType.category == 'OM');
                        this.omAttached = this.documents.find(t => t.docType.category == 'OM') ? true : false;
                        this.omApproved = data.medicamentHistory[0].approved == 1;
                        this.loadExperts();
                        this.subscriptions.push(
                            this.medicamentService.getMedicamentsByFilter({registerNumber: data.medicamentHistory[0].registrationNumber}
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

    loadExperts() {
        this.subscriptions.push(
            this.administrationService.getAllEmployees().subscribe(data => {
                    this.chairmans = data;
                    this.chairmans = this.chairmans.filter(r => r.chairmanOfExperts == 1);
                    this.farmacologs = data;
                    this.farmacologs = this.farmacologs.filter(r => r.profession && r.profession.category == 'FG');
                    this.farmacists = data;
                    this.farmacists = this.farmacists.filter(r => r.profession && r.profession.category == 'FT');
                    this.medics = data;
                    this.medics = this.medics.filter(r => r.profession && r.profession.category == 'CL');
                    if (this.modelToSubmit.medicamentHistory[0].experts) {
                        if (this.modelToSubmit.medicamentHistory[0].experts.chairman) {
                            this.expertForm.get('chairman').setValue(this.chairmans.find(t => t.id == this.modelToSubmit.medicamentHistory[0].experts.chairman.id));
                        }
                        if (this.modelToSubmit.medicamentHistory[0].experts.farmacolog) {
                            this.expertForm.get('farmacolog').setValue(this.farmacologs.find(t => t.id == this.modelToSubmit.medicamentHistory[0].experts.farmacolog.id));
                        }
                        if (this.modelToSubmit.medicamentHistory[0].experts.farmacist) {
                            this.expertForm.get('farmacist').setValue(this.farmacists.find(t => t.id == this.modelToSubmit.medicamentHistory[0].experts.farmacist.id));
                        }
                        if (this.modelToSubmit.medicamentHistory[0].experts.medic) {
                            this.expertForm.get('medic').setValue(this.medics.find(t => t.id == this.modelToSubmit.medicamentHistory[0].experts.medic.id));
                        }
                    }
                },
                error => console.log(error)
            )
        );
    }

    fillInstructions(medicamentHist: any) {
        for (const medInstruction of medicamentHist.instructionsHistory) {
            if (medInstruction.type == 'I') {
                const pageInstrction = this.instructions.find(value => value.path == medInstruction.path);
                if (pageInstrction) {
                    pageInstrction.divisions.push({description: medInstruction.division});
                } else {
                    medInstruction.divisions = [];
                    medInstruction.divisions.push({description: medInstruction.division});
                    this.instructions.push(medInstruction);
                }
            }
        }
    }

    fillMachets(medicamentHist: any) {
        for (const medInstruction of medicamentHist.instructionsHistory) {
            if (medInstruction.type == 'M') {
                const pageInstrction = this.machets.find(value => value.path == medInstruction.path);
                if (pageInstrction) {
                    pageInstrction.divisions.push({description: medInstruction.division});
                } else {
                    medInstruction.divisions = [];
                    medInstruction.divisions.push({description: medInstruction.division});
                    this.machets.push(medInstruction);
                }
            }
        }
    }

    viewDoc(document: any) {

        const find = this.documents.find(t => t.docType.category == 'OM');
        if (!find) {
            this.errorHandlerService.showError('Ordinul de aprobare a modificarilor nu este atasat.');
            return;
        }

        if (document.docType.category == 'MP') {

            const o = this.documents.find(t => t.docType.category == 'OM');

            const m = {
                medName: this.expertForm.get('medicamentName').value,
                registrationNumber: this.expertForm.get('medicament.registrationNumber').value,
                orderNumber: o.number,
                requestNumber : this.expertForm.get('requestNumber').value,
                registrationDate : this.expertForm.get('medicament.registrationDate').value,
                requestDate : this.expertForm.get('startDate').value,
                variationTip : 'II A'
            };

            this.subscriptions.push(this.documentService.viewMedicamentModificationCertificate(m).subscribe(data => {
                    const file = new Blob([data], {type: 'application/pdf'});
                    const fileURL = URL.createObjectURL(file);
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

        if (this.expertForm.get('statusExperts').invalid) {
            this.errorHandlerService.showError('Status inregistrare trebuie selectat.');
            return;
        }

        const find = this.documents.find(t => t.docType.category == 'DDM');
        if (!find && this.modelToSubmit.ddIncluded) {
            this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
            return;
        }

        if (this.expertForm.get('statusExperts').value == 1) {
            this.success();
        } else {
            this.interruptProcess();
        }

    }

    success() {

        if (this.instructions.length == 0) {
            this.errorHandlerService.showError('Nici o informatie nu a fost adaugata');
            return;
        }

        if (this.machets.length == 0) {
            this.errorHandlerService.showError('Nici o macheta nu a fost adaugata');
            return;
        }

        for (const div of this.divisions) {
            let findInstr = false;
            let findMachet = false;
            for (const instr of this.instructions) {
                if (instr.divisions.some(value => value.description == div.description)) {
                    findInstr = true;
                }
            }
            for (const macheta of this.machets) {
                if (macheta.divisions.some(value => value.description == div.description)) {
                    findMachet = true;
                }
            }
            if (!findInstr) {
                this.errorHandlerService.showError('Exista divizari fara instructiuni.');
                return;
            }
            if (!findMachet) {
                this.errorHandlerService.showError('Exista divizari fara machete.');
                return;
            }
        }

        const find = this.documents.find(t => t.docType.category == 'OM');
        if (!find) {
            this.errorHandlerService.showError('Ordinul de aprobare a modificarilor nu este atasat.');
            return;
        }


        const find2 = this.documents.find(t => t.docType.category == 'MP');
        if (!find2) {
            this.errorHandlerService.showError('Modificarea certificatului de autorizare nu este atasata.');
            return;
        }


        this.loadingService.show();
        this.formSubmitted = false;

        const x = this.modelToSubmit;

        const usernameDB = this.authService.getUserName();
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

        x.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        x.documents = this.documents;
        x.outputDocuments = this.outputDocuments;
        x.medicaments = [];

        x.medicamentHistory[0].atcCodeTo = this.expertForm.get('medicament.atcCodeTo').value;
        x.medicamentHistory[0].experts = {
            chairman: this.expertForm.get('chairman').value,
            farmacolog: this.expertForm.get('farmacolog').value,
            farmacist: this.expertForm.get('farmacist').value,
            medic: this.expertForm.get('medic').value,
            date: this.expertForm.get('expertDate').value,
            comment: this.expertForm.get('commentExperts').value,
            number: this.expertForm.get('comiteeNr').value,
            decisionChairman: this.expertForm.get('decisionChairman').value,
            decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
            decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
            decisionMedic: this.expertForm.get('decisionMedic').value,
            status: this.expertForm.get('statusExperts').value
        };

        x.medicamentHistory[0].instructionsHistory = [];
        for (const x1 of this.instructions) {
            x1.id = null;
            x1.type = 'I';
            for (const y of x1.divisions) {
                const z = Object.assign({}, x1);
                z.division = y.description;
                x.medicamentHistory[0].instructionsHistory.push(z);
            }
        }

        for (const x1 of this.machets) {
            x1.id = null;
            x1.type = 'M';
            for (const y of x1.divisions) {
                const z = Object.assign({}, x1);
                z.division = y.description;
                x.medicamentHistory[0].instructionsHistory.push(z);
            }
        }


        this.subscriptions.push(this.requestService.savePostauthorizationMedicament(x).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage']);
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
                const userNameDB = this.authService.getUserName();
                const modelToSubmit = {
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
                modelToSubmit.medicamentHistory[0].atcCode = this.expertForm.get('medicament.atcCodeTo').value;
                modelToSubmit.medicamentHistory[0].experts = {
                    chairman: this.expertForm.get('chairman').value,
                    farmacolog: this.expertForm.get('farmacolog').value,
                    farmacist: this.expertForm.get('farmacist').value,
                    medic: this.expertForm.get('medic').value,
                    date: this.expertForm.get('expertDate').value,
                    comment: this.expertForm.get('commentExperts').value,
                    number: this.expertForm.get('comiteeNr').value,
                    decisionChairman: this.expertForm.get('decisionChairman').value,
                    decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
                    decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
                    decisionMedic: this.expertForm.get('decisionMedic').value
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
        for (const entry of this.outputDocuments) {
            const isMatch = this.documents.some(elem => {
                return (elem.docType.category == entry.docType.category && elem.number == entry.number) ? true : false;
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

    dd() {

        if (!this.expertForm.get('chairman').value || !this.expertForm.get('farmacolog').value || !this.expertForm.get('farmacist').value
            || !this.expertForm.get('medic').value) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            return;
        }

        if (!this.expertForm.get('comiteeNr').value) {
            this.errorHandlerService.showError('Numarul comisiei trebuie completat.');
            return;
        }

        if (!this.expertForm.get('expertDate').value) {
            this.errorHandlerService.showError('Data comisiei trebuie completata.');
            return;
        }

        this.modelToSubmit.medicaments = [];

        this.modelToSubmit.medicamentHistory[0].experts = {
            chairman: this.expertForm.get('chairman').value,
            farmacolog: this.expertForm.get('farmacolog').value,
            farmacist: this.expertForm.get('farmacist').value,
            medic: this.expertForm.get('medic').value,
            date: this.expertForm.get('expertDate').value,
            comment: this.expertForm.get('commentExperts').value,
            number: this.expertForm.get('comiteeNr').value,
            decisionChairman: this.expertForm.get('decisionChairman').value,
            decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
            decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
            decisionMedic: this.expertForm.get('decisionMedic').value
        };

        this.modelToSubmit.ddIncluded = true;

        const usernameDB = this.authService.getUserName();
        this.modelToSubmit.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'DDM'
        });

        this.modelToSubmit.currentStep = 'X';
        this.modelToSubmit.assignedUser = usernameDB;

        this.loadingService.show();
        this.subscriptions.push(this.requestService.includeExpertsInDD(this.modelToSubmit).subscribe(data => {
                this.loadingService.hide();
            }, error1 => {
                this.loadingService.hide();
            })
        );
    }

    checkApproved(element: any, value: any) {
        element.approved = value.checked;
    }

    addToAuthorizationOrder() {
        this.formSubmitted = true;

        if (this.expertForm.get('chairman').invalid || this.expertForm.get('farmacolog').invalid || this.expertForm.get('farmacist').invalid
            || this.expertForm.get('medic').invalid) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            return;
        }

        if (this.expertForm.invalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        const find = this.documents.find(t => t.docType.category == 'DDM');
        if (!find && this.modelToSubmit.ddIncluded) {
            this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
            return;
        }

        this.loadingService.show();
        this.formSubmitted = false;

        this.subscriptions.push(this.requestService.setMedicamentModifyApproved(this.expertForm.get('id').value).subscribe(data => {
                this.omApproved = true;
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    back() {

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)? Modificarile vor fi excluse din ordinul de aprobare.',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();

                const x = this.modelToSubmit;

                const usernameDB = this.authService.getUserName();
                x.currentStep = 'E';
                x.assignedUser = usernameDB;

                x.requestHistories.push({
                    startDate: this.expertForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'X'
                });

                x.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

                x.documents = this.documents;
                x.outputDocuments = this.outputDocuments.filter(t => t.docType.category != 'MP');

                x.medicamentHistory[0].atcCodeTo = this.expertForm.get('medicament.atcCodeTo').value;
                x.medicamentHistory[0].approved = false;
                x.medicamentHistory[0].experts = {
                        chairman: this.expertForm.get('chairman').value,
                        farmacolog: this.expertForm.get('farmacolog').value,
                        farmacist: this.expertForm.get('farmacist').value,
                        medic: this.expertForm.get('medic').value,
                        date: this.expertForm.get('expertDate').value,
                        comment: this.expertForm.get('commentExperts').value,
                        number: this.expertForm.get('comiteeNr').value,
                        decisionChairman: this.expertForm.get('decisionChairman').value,
                        decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
                        decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
                        decisionMedic: this.expertForm.get('decisionMedic').value
                    };

                    x.medicamentHistory[0].instructionsHistory = [];
                    for (const x1 of this.instructions) {
                        x1.id = null;
                        x1.type = 'I';
                        for (const y of x1.divisions) {
                            const z = Object.assign({}, x1);
                            z.division = y.description;
                            x.medicamentHistory[0].instructionsHistory.push(z);
                        }
                    }

                    for (const x1 of this.machets) {
                        x1.id = null;
                        x1.type = 'M';
                        for (const y of x1.divisions) {
                            const z = Object.assign({}, x1);
                            z.division = y.description;
                            x.medicamentHistory[0].instructionsHistory.push(z);
                        }
                    }


                this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(x).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/post-modify/evaluate/' + this.modelToSubmit.id]);
                    }, error => this.loadingService.hide())
                );
            }
        });

    }

    save() {
        this.loadingService.show();

        const x = this.modelToSubmit;

        const usernameDB = this.authService.getUserName();
        x.currentStep = 'X';
        x.assignedUser = usernameDB;

        x.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'X'
        });

        x.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        x.documents = this.documents;
        x.outputDocuments = this.outputDocuments;

        x.medicamentHistory[0].atcCodeTo = this.expertForm.get('medicament.atcCodeTo').value;

        x.medicamentHistory[0].experts = {
                chairman: this.expertForm.get('chairman').value,
                farmacolog: this.expertForm.get('farmacolog').value,
                farmacist: this.expertForm.get('farmacist').value,
                medic: this.expertForm.get('medic').value,
                date: this.expertForm.get('expertDate').value,
                comment: this.expertForm.get('commentExperts').value,
                number: this.expertForm.get('comiteeNr').value,
                decisionChairman: this.expertForm.get('decisionChairman').value,
                decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
                decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
                decisionMedic: this.expertForm.get('decisionMedic').value,
                status: this.expertForm.get('statusExperts').value
            };

        x.medicamentHistory[0].instructionsHistory = [];
        for (const x1 of this.instructions) {
            x1.id = null;
            x1.type = 'I';
            for (const y of x1.divisions) {
                const z = Object.assign({}, x1);
                z.division = y.description;
                x.medicamentHistory[0].instructionsHistory.push(z);
            }
        }

        for (const x1 of this.machets) {
            x1.id = null;
            x1.type = 'M';
            for (const y of x1.divisions) {
                const z = Object.assign({}, x1);
                z.division = y.description;
                x.medicamentHistory[0].instructionsHistory.push(z);
            }
        }

        this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(x).subscribe(data => {
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    manufacturesStr(substance: any) {
        if (substance && substance.manufactures) {
            let s = Array.prototype.map.call(substance.manufactures, s => s.manufacture.description + ' ' + (s.manufacture.country ? s.manufacture.country.description : '') + ' ' + s.manufacture.address + 'NRQW').toString();
            s = s.replace(/NRQW/gi, ';');
            return s.replace(';,', '; ');
        }
        return '';
    }

}
