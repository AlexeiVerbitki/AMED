import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Document} from '../../../models/document';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DocumentService} from '../../../shared/service/document.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {TaskService} from '../../../shared/service/task.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {AddExpertComponent} from '../../../dialog/add-expert/add-expert.component';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';
import {AddDivisionComponent} from '../../../dialog/add-division/add-division.component';

@Component({
    selector: 'app-experti',
    templateUrl: './experti.component.html',
    styleUrls: ['./experti.component.css']
})
export class ExpertiComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    expertForm: FormGroup;
    documents: Document [] = [];
    docDetails: Document = new Document();
    activeSubstancesTable: any[];
    auxiliarySubstancesTable: any[] = [];
    company: any;
    outputDocuments: any[] = [];
    formSubmitted: boolean;
    docTypes: any[];
    docTypesInitial: any[];
    modelToSubmit: any;
    isNonAttachedDocuments = false;
    divisions: any[] = [];
    manufacturesTable: any[] = [];
    instructions: any[] = [];
    machets: any[] = [];
    registrationRequestMandatedContacts: any[] = [];
    oaAttached = false;
    oaIncluded = false;
    expertList: any[] = [];
    standarts: any[] = [];

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private requestService: RequestService,
                public dialogConfirmation: MatDialog,
                public dialog: MatDialog,
                private administrationService: AdministrationService,
                private router: Router,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private navbarTitleService: NavbarTitleService,
                private taskService: TaskService,
                private loadingService: LoaderService,
                private documentService: DocumentService,
                private activatedRoute: ActivatedRoute) {
        this.expertForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
            'regSubject': [null],
            'currentStep': ['F'],
            'medicamentName': [],
            'initiator': [''],
            'assignedUser': [''],
            'companyValue': [''],
            'division': [null],
            'standard' : [null],
            'labResponse': [null],
            'divisionBonDePlata': [null],
            'medicament':
                fb.group({
                    'id': [],
                    'commercialName': [''],
                    'company': [''],
                    'atcCode': [null],
                    'registrationDate': [],
                    'pharmaceuticalForm': [''],
                    'pharmaceuticalFormType': [''],
                    'dose': [null],
                    'originale': [null],
                    'orphan': [null],
                    'unitsOfMeasurement': [null],
                    'internationalMedicamentName': [null],
                    'volume': [null],
                    'volumeQuantityMeasurement': [null],
                    'registrationNumber': [null],
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
                    'medTypesValues': [null],
                    'documents': [],
                    'status': ['F'],
                    'expertList': [''],
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
        this.navbarTitleService.showTitleMsg('Înregistrare medicament / Expertiza');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.modelToSubmit = Object.assign({}, data);
                        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
                        this.outputDocuments = data.outputDocuments;
                        this.standarts = data.laboratorReferenceStandards;

                        this.expertForm.get('id').setValue(data.id);
                        this.expertForm.get('initiator').setValue(data.initiator);
                        this.expertForm.get('startDate').setValue(data.startDate);
                        this.expertForm.get('regSubject').setValue(data.regSubject);
                        this.expertForm.get('requestNumber').setValue(data.requestNumber);
                        this.expertForm.get('companyValue').setValue(data.company.name);
                        this.expertForm.get('company').setValue(data.company);
                        const rl = this.outputDocuments.find(r => r.docType.category == 'RL');
                        if (rl && (rl.responseReceived == 0 || rl.responseReceived)) {
                            this.expertForm.get('labResponse').setValue(rl.responseReceived.toString());
                        }
                        this.expertForm.get('medicament.commercialName').setValue(data.medicaments[0].commercialName);
                        this.expertForm.get('medicamentName').setValue(data.medicaments[0].commercialName);
                        this.expertForm.get('medicament.pharmaceuticalForm').setValue(data.medicaments[0].pharmaceuticalForm.description);
                        this.expertForm.get('medicament.pharmaceuticalFormType').setValue(data.medicaments[0].pharmaceuticalForm.type.description);
                        this.expertForm.get('medicament.registrationNumber').setValue(data.medicaments[0].registrationNumber);
                        this.expertForm.get('medicament.dose').setValue(data.medicaments[0].dose);
                        if (data.medicaments && data.medicaments.length != 0 && data.medicaments[0].unitsOfMeasurement) {
                            this.expertForm.get('medicament.unitsOfMeasurement').setValue(data.medicaments[0].unitsOfMeasurement.description);
                        }
                        this.expertForm.get('medicament.internationalMedicamentName').setValue(data.medicaments[0].internationalMedicamentName.description);
                        this.expertForm.get('medicament.volume').setValue(data.medicaments[0].volume);
                        if (data.medicaments && data.medicaments.length != 0 && data.medicaments[0].volumeQuantityMeasurement) {
                            this.expertForm.get('medicament.volumeQuantityMeasurement').setValue(data.medicaments[0].volumeQuantityMeasurement.description);
                        }
                        this.expertForm.get('medicament.termsOfValidity').setValue(data.medicaments[0].termsOfValidity);

                        if (data.medicaments[0].vitale == 1) {
                            this.expertForm.get('medicament.group').setValue('Vitale');
                        } else if (data.medicaments[0].esentiale == 1) {
                            this.expertForm.get('medicament.group').setValue('Esenţiale');
                        } else if (data.medicaments[0].nonesentiale == 1) {
                            this.expertForm.get('medicament.group').setValue('Nonesenţiale');
                        }

                        if (data.medicaments[0].prescription == 0) {
                            this.expertForm.get('medicament.prescription').setValue('Fără prescripţie');
                        } else if (data.medicaments[0].prescription == 1) {
                            this.expertForm.get('medicament.prescription').setValue('Cu prescripţie');
                        } else {
                            this.expertForm.get('medicament.prescription').setValue('Staţionar');
                        }
                        this.expertForm.get('medicament.authorizationHolder').setValue(data.medicaments[0].authorizationHolder.description);
                        this.expertForm.get('medicament.authorizationHolderCountry').setValue(data.medicaments[0].authorizationHolder.country.description);
                        this.expertForm.get('medicament.authorizationHolderAddress').setValue(data.medicaments[0].authorizationHolder.address);
                        this.expertForm.get('medicament.originale').setValue(data.medicaments[0].originale);
                        this.expertForm.get('medicament.orphan').setValue(data.medicaments[0].orphan);
                        this.expertForm.get('medicament.atcCode').setValue(data.medicaments[0].atcCode);
                        let medTypes = '';
                        for (const mt of data.medicaments[0].medicamentTypes) {
                            medTypes = medTypes + mt.type.description + '; ';
                        }
                        this.expertForm.get('medicament.medTypesValues').setValue(medTypes);
                        this.expertList = data.expertList;
                        this.activeSubstancesTable = data.medicaments[0].activeSubstances;
                        this.auxiliarySubstancesTable = data.medicaments[0].auxSubstances;
                        this.manufacturesTable = data.medicaments[0].manufactures;
                        for (const entry of data.medicaments) {
                            if ((entry.division || entry.volume) && (entry.status == 'F' || entry.status == 'P')) {
                                this.divisions.push({
                                    id: entry.id,
                                    description: entry.division,
                                    code: entry.code,
                                    volume: entry.volume,
                                    volumeQuantityMeasurement: entry.volumeQuantityMeasurement,
                                    serialNr: entry.serialNr,
                                    samplesNumber: entry.samplesNumber,
                                    samplesExpirationDate: entry.samplesExpirationDate,
                                    instructions: entry.instructions.filter(t => t.type == 'I'),
                                    machets: entry.instructions.filter(t => t.type == 'M'),
                                    approved: entry.approved
                                });
                                if (entry.approved) {
                                    this.oaIncluded = true;
                                }
                            }
                        }
                        this.expertForm.get('divisionBonDePlata').setValue(this.getConcatenatedDivision());
                        this.displayInstructions();
                        this.displayMachets();
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
                        this.docDetails = this.documents.find(t => t.docType.category == 'OA');
                        this.oaAttached = this.documents.find(t => t.docType.category == 'OA') ? true : false;
                        this.checkOutputDocumentsStatus();
                        this.fillQuickSearches(data);
                    })
                );
            })
        );
    }

    fillQuickSearches(dataDB) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('1', 'X').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                                if (dataDB.labIncluded == 1 && !dataDB.labNumber && !this.outputDocuments.find(r => r.docType.category == 'LAB')) {
                                    this.outputDocuments.push({
                                        name: 'Solicitare desfasurare analize de laborator',
                                        docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                                        status: 'Urmeaza a fi inclus in actul de predare-primire',
                                        date: new Date()
                                    });
                                } else if (dataDB.labIncluded == 1 && dataDB.labNumber) {
                                    this.outputDocuments.forEach((item, index) => {
                                        if (item.docType.category == 'LAB') {
                                            this.outputDocuments.splice(index, 1);
                                        }
                                    });
                                    const rl = this.documents.find(r => r.docType.category == 'RL');
                                    let statusDoc = '';
                                    if (rl) {
                                        statusDoc = 'Inclus in actul de predare-primire. Raspuns primit.';
                                    } else {
                                        statusDoc = 'Inclus in actul de predare-primire. Asteptare raspuns.';
                                    }
                                    this.outputDocuments.push({
                                        name: 'Solicitare desfasurare analize de laborator',
                                        docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                                        status: statusDoc,
                                        date: new Date(),
                                        number: dataDB.labNumber
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

        if (document.docType.category == 'CA') {

            const find = this.documents.find(t => t.docType.category == 'OA');
            if (!find) {
                this.errorHandlerService.showError('Ordinul de autorizare nu este atasat.');
                return;
            }

            const d = '';
            this.divisions.forEach(t => d + t.description + '; ');
            const a: any[] = [];
            this.activeSubstancesTable.forEach(t => a.push(t.activeSubstance.description + ' ' + t.quantity + ' ' + t.unitsOfMeasurement.description));
            const manufacutresWithAddress = [];
            this.manufacturesTable.filter(t => t.producatorProdusFinit).forEach(t => manufacutresWithAddress.push(t.manufacture.description + ', '
                + t.manufacture.country.description));
            const o = this.documents.find(t => t.docType.category == 'OA');

            const m = {
                medName: this.expertForm.get('medicament.commercialName').value,
                pharmaceuticalPhorm: this.expertForm.get('medicament.pharmaceuticalForm').value,
                dose: this.expertForm.get('medicament.dose').value,
                divisions: d,
                activeSubstances: a,
                authorizationHolder: this.expertForm.get('medicament.authorizationHolder').value,
                authorizationHolderCountry: this.expertForm.get('medicament.authorizationHolderCountry').value,
                manufactureWithAddress: manufacutresWithAddress,
                atcCode: this.expertForm.get('medicament.atcCode').value,
                termsOfValidity: this.expertForm.get('medicament.termsOfValidity').value,
                registrationNumber: this.expertForm.get('medicament.registrationNumber').value,
                registrationDate: o.dateOfIssue,
                orderNumber: o.number,
                orderDate: o.dateOfIssue,
                isUnlimitedPeriod: this.expertForm.get('type').value.code == 'MERG' || this.expertForm.get('type').value.code == 'MERS'
            };

            this.subscriptions.push(this.documentService.viewMedicamentAuthorizationCertificate(m).subscribe(data => {
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

        const findDocType = this.documents.find(t => t.docType.category == 'DD');
        if (!findDocType && this.modelToSubmit.ddIncluded) {
            this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
            return;
        }

        if (this.expertForm.get('type').value.code != 'MERG' && this.expertForm.get('type').value.code != 'MERS' && this.instructions.length == 0) {
            this.errorHandlerService.showError('Nici o informatie nu a fost adaugata');
            return;
        }

        if (this.expertForm.get('type').value.code != 'MERG' && this.expertForm.get('type').value.code != 'MERS' && this.machets.length == 0) {
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
            if (this.expertForm.get('type').value.code != 'MERG' && this.expertForm.get('type').value.code != 'MERS' && !findInstr) {
                this.errorHandlerService.showError('Exista divizari fara informatii.');
                return;
            }
            if (this.expertForm.get('type').value.code != 'MERG' && this.expertForm.get('type').value.code != 'MERS' && !findMachet) {
                this.errorHandlerService.showError('Exista divizari fara machete.');
                return;
            }
        }

        const find = this.documents.find(t => t.docType.category == 'OA');
        if (!find) {
            this.errorHandlerService.showError('Ordinul de autorizare nu este atasat.');
            return;
        }


        const find2 = this.documents.find(t => t.docType.category == 'CA');
        if (!find2) {
            this.errorHandlerService.showError('Certificatul de autorizare nu este atasat.');
            return;
        }

        this.loadingService.show();
        this.formSubmitted = false;

        const regData = this.modelToSubmit;

        const usernameDB = this.authService.getUserName();
        regData.currentStep = 'F';
        regData.endDate = new Date();
        regData.assignedUser = usernameDB;

        regData.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'X'
        });

        regData.requestHistories.push({
            startDate: new Date(),
            username: usernameDB, step: 'F'
        });

        regData.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        regData.documents = this.documents;
        regData.outputDocuments = this.outputDocuments;
        regData.laboratorReferenceStandards = this.standarts;
        regData.expertList = this.expertList;

        for (const med of regData.medicaments) {
            med.atcCode = this.expertForm.get('medicament.atcCode').value;
            const div = this.divisions.find(t => t.description == med.division);
            if (div.approved) {
                med.status = 'F';
            } else {
                med.status = 'N';
            }

            med.instructions = [];
            for (const x of this.instructions) {
                x.id = null;
                x.type = 'I';
                const z = Object.assign({}, x);
                const copyDivision = med.division;
                z.division = copyDivision;
                if (x.divisions.some(value => value.description == med.division)) {
                    med.instructions.push(z);
                }
            }

            for (const x of this.machets) {
                x.id = null;
                x.type = 'M';
                const z = Object.assign({}, x);
                const copyDivision = med.division;
                z.division = copyDivision;
                if (x.divisions.some(value => value.description == med.division)) {
                    med.instructions.push(z);
                }
            }
        }

        this.subscriptions.push(this.requestService.addMedicamentRequest(regData).subscribe(data => {
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
                    expertList: this.expertList
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.expertForm.get('data').value, endDate: new Date(),
                    username: userNameDB, step: 'X'
                });

                for (const med of modelToSubmit.medicaments) {
                    med.atcCode = this.expertForm.get('medicament.atcCode').value;
                }

                this.subscriptions.push(this.requestService.addMedicamentRegistrationHistoryOnInterruption(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.expertForm.get('id').value]);
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
                        entry.status = 'Inclus in actul de predare-primire. Raspuns primit.';
                    } else {
                        entry.status = 'Inclus in actul de predare-primire. Asteptare raspuns.';
                    }
                } else {
                    entry.status = 'Urmeaza a fi inclus in actul de predare-primire';
                }
            }
        }

        this.outputDocuments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
        this.errorHandlerService.showSuccess('');
    }

    dd() {

        if (this.expertList.length == 0) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            return;
        }

        this.modelToSubmit.expertList = this.expertList;
        this.modelToSubmit.ddIncluded = true;

        const usernameDB = this.authService.getUserName();
        this.modelToSubmit.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'DD'
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

    removeFromAuthorizationOrder() {
        const ids: any[] = [];
        this.divisions.forEach(t => ids.push(t.id));
        this.subscriptions.push(this.requestService.removeMedicamentsFromAuthorizationOrder(ids).subscribe(data => {
                this.loadingService.hide();
                this.errorHandlerService.showSuccess('Medicamentele au fost extrase din ordinul de autorizare');
                this.oaIncluded = false;
            }, error => this.loadingService.hide())
        );
    }

    addToAuthorizationOrder() {
        this.formSubmitted = true;

        if (this.expertForm.invalid && this.expertForm.get('type').value.code != 'MERG' && this.expertForm.get('type').value.code != 'MERS') {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        const find = this.documents.find(t => t.docType.category == 'DD');
        if (!find && this.modelToSubmit.ddIncluded) {
            this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
            return;
        }

        const y = this.divisions.find(t => t.approved == true);
        if (!y) {
            this.errorHandlerService.showError('Nici un medicament nu a fost aprobat.');
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

        const ids: any[] = [];
        this.divisions.filter(t => t.approved == true).forEach(t => ids.push(t.id));

        this.subscriptions.push(this.requestService.setMedicamentApproved(ids).subscribe(data => {
                this.loadingService.hide();
                this.errorHandlerService.showSuccess('Medicamentele au fost incluse in ordinul de autorizare');
                this.oaIncluded = true;
            }, error => this.loadingService.hide())
        );
    }

    back() {

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)? Divizarile aprobate nu vor fi incluse in ordinul de autorizare.',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();

                const regData = this.modelToSubmit;

                const usernameDB = this.authService.getUserName();
                regData.currentStep = 'E';
                regData.assignedUser = usernameDB;

                regData.requestHistories.push({
                    startDate: this.expertForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'X'
                });

                regData.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

                regData.documents = this.documents;
                regData.outputDocuments = this.outputDocuments.filter(t => t.docType.category != 'CA');
                regData.expertList = this.expertList;

                for (const med of regData.medicaments) {
                    med.atcCode = this.expertForm.get('medicament.atcCode').value;
                    const div = this.divisions.find(t => t.description == med.division);
                    med.approved = false;

                    med.instructions = [];
                    for (const x of this.instructions) {
                        x.id = null;
                        x.type = 'I';
                        const z = Object.assign({}, x);
                        const copyDivision = Object.assign('', med.division);
                        z.division = copyDivision;
                        if (x.divisions.some(value => value.description == med.division)) {
                            med.instructions.push(z);
                        }
                    }

                    for (const x of this.machets) {
                        x.id = null;
                        x.type = 'M';
                        const z = Object.assign({}, x);
                        const copyDivision = Object.assign('', med.division);
                        z.division = copyDivision;
                        if (x.divisions.some(value => value.description == med.division)) {
                            med.instructions.push(z);
                        }
                    }
                }

                this.subscriptions.push(this.requestService.addMedicamentRequest(regData).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + this.modelToSubmit.id]);
                    }, error => this.loadingService.hide())
                );
            }
        });

    }

    save(showSuccess) {
        this.loadingService.show();

        const regData = this.modelToSubmit;

        const usernameDB = this.authService.getUserName();
        regData.currentStep = 'X';
        regData.assignedUser = usernameDB;
        regData.medicamentName = this.expertForm.get('medicament.commercialName').value;

        regData.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'X'
        });

        regData.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        const rl = this.outputDocuments.find(r => r.docType.category == 'RL');
        if (rl) {
            rl.responseReceived = this.expertForm.get('labResponse').value;
        }

        regData.documents = this.documents;
        regData.outputDocuments = this.outputDocuments;
        regData.laboratorReferenceStandards = this.standarts;
        regData.expertList = this.expertList;

        for (const med of regData.medicaments) {
            med.atcCode = this.expertForm.get('medicament.atcCode').value;
            const div = this.divisions.find(t => t.description == med.division);

            med.instructions = [];
            for (const x of this.instructions) {
                x.id = null;
                x.type = 'I';
                const z = Object.assign({}, x);
                const copyDivision = med.division;
                z.division = copyDivision;
                if (x.divisions.some(value => value.description == med.division)) {
                    med.instructions.push(z);
                }
            }

            for (const x of this.machets) {
                x.id = null;
                x.type = 'M';
                const z = Object.assign({}, x);
                const copyDivision = med.division;
                z.division = copyDivision;
                if (x.divisions.some(value => value.description == med.division)) {
                    med.instructions.push(z);
                }
            }

            for (const d of this.divisions) {
                if (med.id == d.id) {
                    med.serialNr = d.serialNr;
                    med.samplesNumber = d.samplesNumber;
                    med.samplesExpirationDate = d.samplesExpirationDate;
                }
            }
        }

        this.subscriptions.push(this.requestService.addMedicamentRequest(regData).subscribe(data => {
                this.loadingService.hide();
                if (showSuccess) {
                    this.errorHandlerService.showSuccess('Datele au fost salvate.');
                }
            }, error => this.loadingService.hide())
        );
    }

    manufacturesStr(substance: any) {
        if (substance && substance.manufactures) {
            let str = Array.prototype.map.call(substance.manufactures, s => s.manufacture.description + ' ' + (s.manufacture.country ? s.manufacture.country.description : '')
                + ' ' + s.manufacture.address + 'NRQW').toString();
            str = str.replace(/NRQW/gi, ';');
            return str.replace(';,', '; ');
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
            return elem.docType.category == 'LAB' ? true : false;
        });
    }

    requestAdditionalData() {

        if (this.expertList.length == 0) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            return;
        }

        let magicNumber = '';
        for (const outDoc of this.outputDocuments) {
            if (magicNumber < outDoc.number) {
                magicNumber = outDoc.number;
            }
        }
        const magicNumbers = magicNumber.split('-');

        let nrOrdDoc = 1;
        if (magicNumbers && magicNumbers.length > 2) {
            nrOrdDoc = Number(magicNumbers[3]) + 1;
        }

        let x = this.expertForm.get('medicament.commercialName').value + ', ' + this.expertForm.get('medicament.pharmaceuticalForm').value.description
            + ' ' + this.expertForm.get('medicament.dose').value;
        x = x + this.getConcatenatedDivision();
        x = x + '(DCI:' + this.expertForm.get('medicament.internationalMedicamentName').value.description + '), producători: ';
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
                nrOrdDoc: nrOrdDoc,
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
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.modelToSubmit).subscribe(data => {
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

        this.subscriptions.push(this.requestService.laboratorAnalysis(this.expertForm.get('id').value).subscribe(data => {
                this.outputDocuments.push({
                    name: 'Solicitare desfasurare analize de laborator',
                    docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                    status: 'Urmeaza a fi inclus in actul de predare-primire',
                    date: new Date()
                });
                this.save(false);
            }, error => console.log(error))
        );

    }

    checkResponseReceived(doc: any, value: any) {
        if (value.checked) {
            doc.responseReceived = 1;
        } else {
            doc.responseReceived = 0;
        }
    }

    remove(index, doc: any) {
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
                            // this.outputDocuments.forEach((item, index) => {
                            //     if (item === doc) {
                                    this.outputDocuments.splice(index, 1);
                            //     }
                            // });
                            this.save(false);
                        }, error => console.log(error))
                    );
                    return;
                }

                this.loadingService.show();
                // this.outputDocuments.forEach((item, index) => {
                //     if (item === doc) {
                this.outputDocuments.splice(index, 1);
                this.modelToSubmit.outputDocuments =  this.outputDocuments;
                //     }
                // });

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
        dialogConfig2.data = {division: division, disabledMainFields: true};

        const dialogRef = this.dialog.open(AddDivisionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.divisions[index].samplesNumber = result.samplesNumber;
                this.divisions[index].serialNr = result.serialNr;
                this.divisions[index].samplesExpirationDate = result.samplesExpirationDate;
            }
        });
    }

    addStandard() {
        if (this.expertForm.get('standard').value) {
            this.standarts.push({description: this.expertForm.get('standard').value});
            this.expertForm.get('standard').setValue(null);
        }
    }

    removeStandard(index) {
        this.standarts.splice(index, 1);
    }

}
