import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {Expert} from '../../../models/expert';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
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
import {AddExpertComponent} from '../../../dialog/add-expert/add-expert.component';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';
import {
    SelectVariationTypeComponent,
    TodoItemFlatNode
} from '../../../dialog/select-variation-type/select-variation-type.component';
import {SelectionModel} from '@angular/cdk/collections';
import {AddLaboratorStandardsComponent} from '../../../dialog/add-laborator-standards/add-laborator-standards.component';
import {AddDivisionComponent} from '../../../dialog/add-division/add-division.component';
import {isNumeric} from 'rxjs/internal-compatibility';

@Component({
    selector: 'app-experti',
    templateUrl: './experti-modify.component.html',
    styleUrls: ['./experti-modify.component.css']
})
export class ExpertiModifyComponent implements OnInit, OnDestroy {
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
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
    expertList: any[] = [];
    variationTypesIds: string;
    variationTypesIdsTemp: string;
    standarts: any[];
    docTypesInitial: any[];

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private requestService: RequestService,
                public dialogConfirmation: MatDialog,
                private administrationService: AdministrationService,
                private router: Router,
                public dialog: MatDialog,
                private errorHandlerService: SuccessOrErrorHandlerService,
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
            'labResponse': [null],
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
                    'originaleTo': [null],
                    'orphanTo': [null],
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
        this.navbarTitleService.showTitleMsg('Aprobarea modificarilor postautorizare / Expertiza');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentHistory(params['id']).subscribe(data => {
                        this.modelToSubmit = Object.assign({}, data);
                        this.modelToSubmit.medicamentHistory = Object.assign([], data.medicamentHistory);
                        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
                        this.outputDocuments = data.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.standarts = data.laboratorReferenceStandards;
                        this.expertForm.get('id').setValue(data.id);
                        this.expertForm.get('initiator').setValue(data.initiator);
                        this.expertForm.get('startDate').setValue(data.startDate);
                        this.expertForm.get('requestNumber').setValue(data.requestNumber);
                        this.expertForm.get('companyValue').setValue(data.company.name);
                        this.expertForm.get('company').setValue(data.company);
                        const rl = this.outputDocuments.find(r => r.docType.category == 'RL');
                        if (rl && (rl.responseReceived == 0 || rl.responseReceived)) {
                            this.expertForm.get('labResponse').setValue(rl.responseReceived.toString());
                        }
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
                        this.expertForm.get('medicament.volumeTo').setValue(data.medicamentHistory[0].volumeTo);
                        if (data.medicamentHistory && data.medicamentHistory.length != 0 && data.medicamentHistory[0].volumeQuantityMeasurementTo) {
                            this.expertForm.get('medicament.volumeQuantityMeasurementTo').setValue(data.medicamentHistory[0].volumeQuantityMeasurementTo.description);
                        }
                        this.expertForm.get('medicament.termsOfValidityTo').setValue(data.medicamentHistory[0].termsOfValidityTo);
                        if (data.medicamentHistory[0].vitaleTo == 1) {
                            this.expertForm.get('medicament.groupTo').setValue('Vitale');
                        } else if (data.medicamentHistory[0].esentialeTo == 1) {
                            this.expertForm.get('medicament.groupTo').setValue('Esenţiale');
                        } else if (data.medicamentHistory[0].nonesentialeTo == 1) {
                            this.expertForm.get('medicament.groupTo').setValue('Nonesenţiale');
                        }
                        if (data.medicamentHistory[0].prescriptionTo == 0) {
                            this.expertForm.get('medicament.prescriptionTo').setValue('Fără prescripţie');
                        } else if (data.medicamentHistory[0].prescriptionTo == 1) {
                            this.expertForm.get('medicament.prescriptionTo').setValue('Cu prescripţie');
                        } else {
                            this.expertForm.get('medicament.prescriptionTo').setValue('Staţionar');
                        }
                        this.expertForm.get('medicament.authorizationHolderTo').setValue(data.medicamentHistory[0].authorizationHolderTo.description);
                        this.expertForm.get('medicament.authorizationHolderCountry').setValue(data.medicamentHistory[0].authorizationHolderTo.country.description);
                        this.expertForm.get('medicament.authorizationHolderAddress').setValue(data.medicamentHistory[0].authorizationHolderTo.address);
                        this.expertForm.get('medicament.originaleTo').setValue(data.medicamentHistory[0].originaleTo);
                        this.expertForm.get('medicament.orphanTo').setValue(data.medicamentHistory[0].orphanTo);
                        let medTypes = '';
                        for (const mt of data.medicamentHistory[0].medicamentTypesHistory) {
                            medTypes = medTypes + mt.type.description + '; ';
                        }
                        this.expertForm.get('medicament.medTypesValues').setValue(medTypes);
                        this.expertList = data.expertList;
                        for (const entry of data.medicamentHistory[0].divisionHistory) {
                            this.divisions.push({
                                old: entry.old,
                                id: entry.id,
                                description: entry.description,
                                medicamentCode: entry.medicamentCode,
                                volume: entry.volume,
                                volumeQuantityMeasurement: entry.volumeQuantityMeasurement,
                                serialNr: entry.serialNr,
                                samplesNumber: entry.samplesNumber,
                                samplesExpirationDate: entry.samplesExpirationDate,
                                instructions: entry.instructionsHistory.filter(t => t.type == 'I'),
                                machets: entry.instructionsHistory.filter(t => t.type == 'M'),
                                approved: entry.approved
                            });
                        }
                        this.expertForm.get('medicament.atcCodeTo').setValue(data.medicamentHistory[0].atcCodeTo);
                        this.activeSubstancesTable = data.medicamentHistory[0].activeSubstancesHistory;
                        this.auxiliarySubstancesTable = data.medicamentHistory[0].auxiliarySubstancesHistory;
                        this.expertForm.get('divisionBonDePlata').setValue(this.getConcatenatedDivision());
                        this.displayInstructions();
                        this.displayMachets();
                        this.manufacturesTable = data.medicamentHistory[0].manufacturesHistory;
                        this.expertForm.get('type').setValue(data.type);
                        this.expertForm.get('requestHistories').setValue(data.requestHistories);
                        this.expertForm.get('typeValue').setValue(data.type.description);
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
                        this.checkOutputDocumentsStatus();
                        this.subscriptions.push(
                            this.medicamentService.getMedicamentsByFilter({registerNumber: data.medicamentHistory[0].registrationNumber}
                            ).subscribe(request => {
                                    this.medicamentsDetails = request.body;
                                },
                                error => console.log(error)
                            ));
                        this.subscriptions.push(this.administrationService.variatonTypesJSON().subscribe(data2 => {
                                this.variationTypesIds = JSON.stringify(data2.val2);
                                if (data.variations) {
                                    this.variationTypesIdsTemp =  this.variationTypesIds.substr(1);
                                    for (const v of data.variations) {
                                        const t = new TodoItemFlatNode();
                                        t.item = this.getVariationCodeById(v.variation.id, v.value);
                                        this.checklistSelection.selected.push(t);
                                    }
                                }
                            }
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
                                this.docTypesInitial = Object.assign([], data);
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                                if (data.labIncluded == 1 && !data.labNumber && !this.outputDocuments.find(r => r.docType.category == 'LAB')) {
                                    this.outputDocuments.push({
                                        name: 'Solicitare desfasurare analize de laborator',
                                        docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                                        status: 'Urmeaza a fi inclus in actul de primire-predare',
                                        date: new Date()
                                    });
                                } else if (data.labIncluded == 1 && data.labNumber) {
                                    this.outputDocuments.forEach((item, index) => {
                                        if (item.docType.category == 'LAB') {
                                            this.outputDocuments.splice(index, 1);
                                        }
                                    });
                                    const rl = this.documents.find(r => r.docType.category == 'RL');
                                    let statusDoc = '';
                                    if (rl) {
                                        statusDoc = 'Inclus in actul de primire-predare. Raspuns primit.';
                                    } else {
                                        statusDoc = 'Inclus in actul de primire-predare. Asteptare raspuns.';
                                    }
                                    this.outputDocuments.push({
                                        name: 'Solicitare desfasurare analize de laborator',
                                        docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                                        status: statusDoc,
                                        date: new Date(),
                                        number: data.labNumber
                                    });
                                }
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );
    }

    getVariationCodeById(id: string, value: string): string {
        const i = this.variationTypesIdsTemp.indexOf(value + '":"' + id + '"') + value.length - 1;
        const tempStr =  this.variationTypesIdsTemp.substr(1, i);
        const j = tempStr.lastIndexOf('"') + 1;
        const finalStr  = tempStr.substr(j, i);
        this.variationTypesIdsTemp = this.variationTypesIdsTemp.replace('"' + finalStr + '":"' + id + '"', '');
        return finalStr;
    }

    displayInstructions() {
        this.instructions = [];
        for (const div of this.divisions) {
            if (div.instructions) {
                for (const instr of div.instructions) {
                    const instrTest = this.instructions.find(value => value.path == instr.path);
                    if (instrTest) {
                        instrTest.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                        if (instr.status == 'O') {
                            instrTest.status = 'O';
                        }
                    } else {
                        const instrAdd = Object.assign({}, instr);
                        instrAdd.divisions = [];
                        instrAdd.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                        this.instructions.push(instrAdd);
                    }
                }
            }
        }
    }

    displayMachets() {
        this.machets = [];
        for (const div of this.divisions) {
            if (div.machets) {
                for (const machet of div.machets) {
                    const machetTest = this.machets.find(value => value.path == machet.path);
                    if (machetTest) {
                        machetTest.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                        if (machet.status == 'O') {
                            machetTest.status = 'O';
                        }
                    } else {
                        const machetAdd = Object.assign({}, machet);
                        machetAdd.divisions = [];
                        machetAdd.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                        this.machets.push(machetAdd);
                    }
                }
            }
        }
    }


    viewDoc(document: any) {

        if (document.docType.category == 'MP') {

            const find = this.documents.find(t => t.docType.category == 'OM');
            if (!find) {
                this.errorHandlerService.showError('Ordinul de aprobare a modificarilor nu este atasat.');
                return;
            }

            const o = this.documents.find(t => t.docType.category == 'OM');

            const m = {
                medName: this.expertForm.get('medicamentName').value,
                registrationNumber: this.expertForm.get('medicament.registrationNumber').value,
                orderNumber: o.number,
                requestNumber: this.expertForm.get('requestNumber').value,
                registrationDate: this.expertForm.get('medicament.registrationDate').value,
                requestDate: this.expertForm.get('startDate').value,
                variationTip: this.modelToSubmit.variations[0].value,
                requestId : this.expertForm.get('id').value
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
        } else if (document.docType.category == 'SL') {


            const modelToSubmit = {
                nrDoc: document.number,
                responsiblePerson: this.registrationRequestMandatedContacts[0].mandatedLastname + ' ' + this.registrationRequestMandatedContacts[0].mandatedFirstname,
                companyName: this.expertForm.get('company').value.name,
                requestDate: document.date,
                country: 'Moldova',
                address: this.expertForm.get('company').value.legalAddress,
                phoneNumber: this.registrationRequestMandatedContacts[0].phoneNumber,
                email: this.registrationRequestMandatedContacts[0].email,
                message: document.content,
                function: document.signerFunction,
                signerName: document.signerName
            };

            let observable: Observable<any> = null;
            observable = this.documentService.viewRequestNew(modelToSubmit);

            this.subscriptions.push(observable.subscribe(data => {
                    const file = new Blob([data], {type: 'application/pdf'});
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                }
                )
            );
        }
    }

    success() {

        const rl = this.documents.find(r => r.docType.category == 'RL');
        const lab = this.outputDocuments.find(r => r.docType.category == 'LAB');
        if (lab && !rl) {
            this.errorHandlerService.showError('Rezultatul laboratorului nu a fost atasat.');
            return;
        }
        const findDDM = this.documents.find(t => t.docType.category == 'DDM');
        if (!findDDM && this.modelToSubmit.ddIncluded) {
            this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
            return;
        }

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

        x.variations = [];
        for (const sel of this.checklistSelection.selected) {
            const xid = this.getVariationId(sel.item);
            if (isNumeric(xid)) {
                x.variations.push({variation: {id: xid}, value: this.getVariationValue(sel.item)});
            }
        }

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
        x.expertList = this.expertList;
    	x.laboratorReferenceStandards = this.standarts;

        x.medicamentHistory[0].atcCodeTo = this.expertForm.get('medicament.atcCodeTo').value;
        x.medicamentHistory[0].registrationDate = this.expertForm.get('medicament.registrationDate').value;

        x.medicamentHistory[0].divisionHistory = this.divisions;
        x.medicamentHistory[0].divisionHistory.forEach(t => {t.instructionsHistory = []; });
        x.medicamentHistory[0].divisionHistory.forEach(t => {
            t.instructionsHistory.push.apply(t.instructionsHistory, t.instructions);
            t.instructionsHistory.push.apply(t.instructionsHistory, t.machets);
        });
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
                    medicamentHistory: this.modelToSubmit.medicamentHistory,
                    variations : this.modelToSubmit.variations
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.expertForm.get('data').value, endDate: new Date(),
                    username: userNameDB, step: 'X'
                });

                modelToSubmit.medicaments = [];
                modelToSubmit.medicamentHistory[0].atcCode = this.expertForm.get('medicament.atcCodeTo').value;

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
                return (elem.docType.category == entry.docType.category && ((entry.docType.category == 'SL' && elem.number == entry.number) ||
                    entry.docType.category != 'SL')) ? true : false;
            });
            if (entry.docType.category != 'LAB') {
                if (isMatch) {
                    entry.status = 'Atasat';
                } else {
                    entry.status = 'Nu este atasat';
                }
            } else {
                if (entry.number) {
                    const rl = this.documents.find(r => r.docType.category == 'RL');
                    if (rl) {
                        entry.status = 'Inclus in actul de primire-predare. Raspuns primit.';
                    } else {
                        entry.status = 'Inclus in actul de primire-predare. Asteptare raspuns.';
                    }
                } else {
                    entry.status = 'Urmeaza a fi inclus in actul de primire-predare';
                }
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
            value : {code : this.medicamentsDetails[0].code, id : this.medicamentsDetails[0].id}
        };

        this.dialog.open(MedicamentDetailsDialogComponent, dialogConfig2);
    }

    dd() {

        if (this.expertList.length == 0) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            return;
        }

        this.modelToSubmit.medicaments = [];
        this.modelToSubmit.expertList = this.expertList;
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
        const rl = this.documents.find(r => r.docType.category == 'RL');
        const lab = this.outputDocuments.find(r => r.docType.category == 'LAB');
        if (lab && !rl) {
            this.errorHandlerService.showError('Rezultatul laboratorului nu a fost atasat.');
            return;
        }
        this.formSubmitted = true;

        if (this.expertForm.invalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        const find = this.documents.find(t => t.docType.category == 'DDM');
        if (!find && this.modelToSubmit.ddIncluded) {
            this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
            return;
        }

        const sl = this.outputDocuments.find(r => r.docType.category == 'SL');
        if (sl) {
            const resp = this.outputDocuments.filter(t => t.docType.category == 'SL').find(r => r.responseReceived != 1);
            if (resp) {
                this.errorHandlerService.showError('Exista solicitari de date aditionale fara raspuns primit.');
                return;
            }
        }
        this.loadingService.show();
        this.formSubmitted = false;

        this.subscriptions.push(this.requestService.setMedicamentModifyApproved(this.expertForm.get('id').value).subscribe(data => {
                this.omApproved = true;
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    getVariationValue(find: string): string {
        const j = find.indexOf('- ') + 2;
        return find.substr(j);
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

                this.save();

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
                x.expertList = this.expertList;

                x.variations = [];
                for (const sel of this.checklistSelection.selected) {
                    const xid = this.getVariationId(sel.item);
                    if (isNumeric(xid)) {
                        x.variations.push({variation: {id: xid}, value: this.getVariationValue(sel.item)});
                    }
                }

                x.medicamentHistory[0].atcCodeTo = this.expertForm.get('medicament.atcCodeTo').value;
                x.medicamentHistory[0].approved = false;

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

        const rl = this.outputDocuments.find(r => r.docType.category == 'RL');
        if (rl) {
            rl.responseReceived = this.expertForm.get('labResponse').value;
        }

        x.documents = this.documents;
        x.outputDocuments = this.outputDocuments;
        x.laboratorReferenceStandards = this.standarts;
        x.medicamentHistory[0].divisionHistory = this.divisions;
        x.medicamentHistory[0].divisionHistory.forEach(t => {t.instructionsHistory = []; });
        x.medicamentHistory[0].divisionHistory.forEach(t => {
            t.instructionsHistory.push.apply(t.instructionsHistory, t.instructions);
            t.instructionsHistory.push.apply(t.instructionsHistory, t.machets);
        });

        x.variations = [];
        for (const sel of this.checklistSelection.selected) {
            const xid = this.getVariationId(sel.item);
            if (isNumeric(xid)) {
                x.variations.push({variation: {id: xid}, value: this.getVariationValue(sel.item)});
            }
        }

        x.medicamentHistory[0].atcCodeTo = this.expertForm.get('medicament.atcCodeTo').value;
        x.medicamentHistory[0].registrationDate = this.expertForm.get('medicament.registrationDate').value;
        x.expertList = this.expertList;

        this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(x).subscribe(data => {
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    manufacturesStr(substance: any) {
        if (substance && substance.manufactures) {
            let s = Array.prototype.map.call(substance.manufactures, s => s.manufacture.description + ' ' + (s.manufacture.country ? s.manufacture.country.description : '')
                + ' ' + s.manufacture.address + 'NRQW').toString();
            s = s.replace(/NRQW/gi, ';');
            return s.replace(';,', '; ');
        }
        return '';
    }

    getConcatenatedDivision() {
        let concatenatedDivision = '';
        for (const entry of this.divisions) {
            if (entry.description && entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.description + ' ' + entry.volume + ' ' + entry.volumeQuantityMeasurement.description + '; ';
            } else if (entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.volume + ' ' + entry.volumeQuantityMeasurement.description + '; ';
            } else {
                concatenatedDivision = concatenatedDivision + entry.description + '; ';
            }

        }
        return concatenatedDivision;
    }

    removeInstr(event) {
        for (const div of this.divisions) {
            if (div.instructions) {
                div.instructions = div.instructions.filter(t => t.path != event);
            }
        }
        this.displayInstructions();
    }

    addInstr(event) {
        this.divisions = event;
        this.displayInstructions();
    }

    removeMacheta(event) {
        for (const div of this.divisions) {
            if (div.machets) {
                div.machets = div.machets.filter(t => t.path != event);
            }
        }
        this.displayMachets();
    }

    addMacheta(event) {
        this.divisions = event;
        this.displayMachets();
    }

    addExpert() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        dialogConfig2.data = {type: 'add'};

        const dialogRef = this.dialog.open(AddExpertComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.expertList.push(result);
                }
            }
        );
    }

    editExpert(expert: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';
        dialogConfig2.data = {type: 'edit', expert: expert};

        const dialogRef = this.dialog.open(AddExpertComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.expertList[index] = result;
            }
        });
    }

    removeExpert(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta expert?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.expertList.splice(index, 1);
            }
        });
    }

    isDisabledLabButton(): boolean {
        return this.outputDocuments.some(elem => {
            return elem.docType.category == 'RL' ? true : false;
        });
    }

    requestAdditionalData() {

        if (this.expertList.length == 0) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            return;
        }

        this.save();

        const lenOutDoc = this.outputDocuments.filter(r => r.docType.category === 'SL').length;

        let x = this.expertForm.get('medicament.commercialNameTo').value + ', ' + this.expertForm.get('medicament.pharmaceuticalFormTo').value.description
            + ' ' + this.expertForm.get('medicament.doseTo').value;
        x = x + this.getConcatenatedDivision();
        x = x + '(DCI:' + this.expertForm.get('medicament.internationalMedicamentNameTo').value.description + '), producători: ';
        this.manufacturesTable.forEach(elem => x = x + ' ' + elem.manufacture.description + ',' + elem.manufacture.country.description + ',' + elem.manufacture.address);

        let y = '';
        for (const exp of this.expertList) {
            if (!exp.requestAdditionalDataNumber) {
                y = y + '\r\n\t' + (exp.expert ? exp.expert.name : exp.expertName) + '. Decizie: ' + exp.decision;
            }
        }
        if (y == '') {
            this.errorHandlerService.showError('Deciziile expertilor au fost deja incluse in scrisoarea de solicitare date aditionale.');
            return;
        }

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            height: '800px',
            data: {
                requestNumber: this.expertForm.get('requestNumber').value,
                requestId: this.expertForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA',
                startDate: this.expertForm.get('data').value,
                nrOrdDoc: lenOutDoc + 1,
                medicamentStr: x,
                expertStr: y,
                companyName: this.expertForm.get('company').value.name,
                address: this.expertForm.get('company').value.legalAddress,
                registrationRequestMandatedContact: this.registrationRequestMandatedContacts[0]
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.modelToSubmit.outputDocuments = Object.assign([], this.outputDocuments);
                this.modelToSubmit.outputDocuments.push(result);
                for (const exp of this.expertList) {
                    if (!exp.requestAdditionalDataNumber) {
                        exp.requestAdditionalDataNumber = result.number;
                    }
                }
                this.modelToSubmit.expertList = this.expertList;
                this.modelToSubmit.medicaments = [];
                this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(this.modelToSubmit).subscribe(data => {
                        this.outputDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                    }, error => console.log(error))
                );
            }
        });
    }

    requestLaboratoryAnalysis() {

        this.formSubmitted = true;

        this.formSubmitted = false;

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(AddLaboratorStandardsComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.subscriptions.push(this.requestService.laboratorAnalysis(this.expertForm.get('id').value).subscribe(data => {
                        this.outputDocuments.push({
                            name: 'Solicitare desfasurare analize de laborator',
                            docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                            status: 'Urmeaza a fi inclus in actul de primire-predare',
                            date: new Date()
                        });
                        this.standarts = result.standards;
                        this.save();
                    }, error => console.log(error))
                );
            }
        });

    }

    checkResponseReceived(doc: any, value: any) {
        if (value.checked) {
            doc.responseReceived = 1;
        } else {
            doc.responseReceived = 0;
        }
    }

    remove(doc: any) {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                if (doc.docType.category == 'LAB') {
                    this.subscriptions.push(this.requestService.removeLaboratorAnalysis(this.expertForm.get('id').value).subscribe(data => {
                            this.outputDocuments.forEach((item, index) => {
                                if (item === doc) {
                                    this.outputDocuments.splice(index, 1);
                                }
                            });
                            this.standarts = [];
                            this.save();
                        }, error => console.log(error))
                    );
                    return;
                }

                this.loadingService.show();
                this.modelToSubmit.outputDocuments = Object.assign([], this.outputDocuments);
                this.modelToSubmit.outputDocuments.forEach((item, index) => {
                    if (item === doc) { this.modelToSubmit.outputDocuments.splice(index, 1); }
                });

                if (doc.docType.category == 'SL') {
                    for (const exp of this.expertList) {
                        if (exp.requestAdditionalDataNumber == doc.number) {
                            exp.requestAdditionalDataNumber = '';
                        }
                    }
                    this.modelToSubmit.expertList = this.expertList;
                }

                this.subscriptions.push(this.requestService.addMedicamentRequest(this.modelToSubmit).subscribe(data => {
                        this.outputDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.loadingService.hide();
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    editDivision(division: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';
        dialogConfig2.data = division;

        const dialogRef = this.dialog.open(AddDivisionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.divisions[index].samplesNumber = result.samplesNumber;
                this.divisions[index].serialNr = result.serialNr;
                this.divisions[index].samplesExpirationDate = result.samplesExpirationDate;
            }
        });
    }

    viewVariationType() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        // dialogConfig2.panelClass = 'overflow-ys';

        dialogConfig2.width = '1000px';
        dialogConfig2.height = '800px';

        dialogConfig2.data = {values: this.checklistSelection, disabled : false};

        const dialogRef = this.dialog.open(SelectVariationTypeComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.checklistSelection = result.values;
                    //console.log(result.values);
                }
            }
        );
    }

    getVariationId(find: string): string {
        const i = this.variationTypesIds.indexOf(find) + find.length + 3;
        const tempStr = this.variationTypesIds.substr(i);
        const j = tempStr.indexOf(',');
        const k = tempStr.indexOf('}');
        if (j < k && j != -1) {
            return this.variationTypesIds.substr(i, j - 1);
        } else {
            return this.variationTypesIds.substr(i, k - 1);
        }
    }

}
