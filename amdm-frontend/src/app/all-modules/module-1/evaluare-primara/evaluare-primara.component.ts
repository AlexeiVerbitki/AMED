import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {RequestService} from "../../../shared/service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {DocumentService} from "../../../shared/service/document.service";
import {RequestAdditionalDataDialogComponent} from "../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component";
import {TaskService} from "../../../shared/service/task.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {ActiveSubstanceDialogComponent} from "../../../dialog/active-substance-dialog/active-substance-dialog.component";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {Document} from "../../../models/document";
import {UploadFileService} from "../../../shared/service/upload/upload-file.service";
import {AuxiliarySubstanceDialogComponent} from "../../../dialog/auxiliary-substance-dialog/auxiliary-substance-dialog.component";
import {PaymentComponent} from "../../../payment/payment.component";
import {AddManufactureComponent} from "../../../dialog/add-manufacture/add-manufacture.component";

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara.component.html',
    styleUrls: ['./evaluare-primara.component.css']
})
export class EvaluarePrimaraComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document[] = [];
    instructions: any[] = [];
    machets: any[] = [];
    formSubmitted: boolean;
    isAddDivision: boolean;
    isAddManufacture: boolean;
    paymentTotal: number;

    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    activeSubstancesTable: any[] = [];
    auxiliarySubstancesTable: any[] = [];
    divisions: any[] = [];
    customsCodes: any[] = [];
    manufacturesTable: any[] = [];
    unitsOfMeasurement: any[];
    volumeUnitsOfMeasurement: any[];
    unitsQuantityMeasurement: any[];
    storageUnitsOfMeasurement: any[];
    registrationRequestMandatedContacts: any[];
    groups: any[];
    prescriptions: any[] = [];
    internationalNames: any[];
    medicamentTypes: any[];
    medicamentTypes2 : any[];
    manufactures: any[];
    manufactureAuthorizations: any[];
    docTypes: any[];
    docTypesInitial: any[];
    outDocuments: any[] = [];
    isResponseReceived: boolean = true;
    isNonAttachedDocuments: boolean = false;
    initialData: any;
    wasFoundDivision: boolean;
    wasFoundManufacture: boolean;

    @ViewChild('payment') payment: PaymentComponent;

    protected atcCodes: Observable<any[]>;
    protected loadingAtcCodes: boolean = false;
    protected atcCodesInputs = new Subject<string>();

    constructor(public dialog: MatDialog,
                private fb: FormBuilder,
                private requestService: RequestService,
                private administrationService: AdministrationService,
                private documentService: DocumentService,
                private taskService: TaskService,
                private errorHandlerService: ErrorHandlerService,
                private navbarTitleService: NavbarTitleService,
                private uploadService: UploadFileService,
                private loadingService: LoaderService,
                public dialogConfirmation: MatDialog,
                private authService: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.eForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
            'currentStep': ['X'],
            'documents': [],
            'companyValue': [],
            'initiator': [''],
            'assignedUser': [''],
            'medicamentName': [],
            'medicaments': [[]],
            'division': [null],
            'labResponse': [null],
            'divisionBonDePlata': [null],
            'medicament':
                fb.group({
                    'id': [],
                    'commercialName': ['', Validators.required],
                    'atcCode': [null, Validators.required],
                    'registrationDate': [],
                    'pharmaceuticalForm': [null, Validators.required],
                    'pharmaceuticalFormType': [null, Validators.required],
                    'dose': [null],
                    'unitsOfMeasurement': [null],
                    'internationalMedicamentName': [null, Validators.required],
                    'volume': [null],
                    'volumeQuantityMeasurement': [null],
                    'termsOfValidity': [null, Validators.required],
                    'medicamentType': [null, Validators.required],
                    'storageQuantityMeasurement': [null],
                    'storageQuantity': [null],
                    'unitsQuantityMeasurement': [null],
                    'unitsQuantity': [null],
                    'prescription': [null, Validators.required],
                    'authorizationHolder': [null, Validators.required],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'status': ['P'],
                    'customsCode': [null, Validators.required],
                    'group': [null, Validators.required],
                    'medTypesValues' : []
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'manufacture': [null],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'requestHistories': []
        });

        this.eForm.get('division').valueChanges.subscribe(
            r => {
                this.isAddDivision = false;
                this.wasFoundDivision = false;
            }
        );
        this.eForm.get('manufacture').valueChanges.subscribe(
            r => {
                this.isAddManufacture = false;
                this.wasFoundManufacture = false;
            }
        );
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrarea medicamentului / Evaluare primara');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.initialData.medicaments = Object.assign([], data.medicaments);
                        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
                        this.eForm.get('id').setValue(data.id);
                        this.eForm.get('initiator').setValue(data.initiator);
                        this.eForm.get('startDate').setValue(data.startDate);
                        this.eForm.get('requestNumber').setValue(data.requestNumber);
                        this.eForm.get('type').setValue(data.type);
                        this.eForm.get('requestHistories').setValue(data.requestHistories);
                        this.eForm.get('typeValue').setValue(data.type.description);
                        this.eForm.get('company').setValue(data.company);
                        this.eForm.get('companyValue').setValue(data.company.name);
                        this.eForm.get('medicament.commercialName').setValue(data.medicamentName);
                        this.eForm.get('medicamentName').setValue(data.medicamentName);
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        let rl = this.outDocuments.find(r => r.docType.category == 'RL');
                        if (rl && rl.responseReceived) {
                            this.eForm.get('labResponse').setValue(rl.responseReceived.toString());
                        }
                        if (data.medicaments && data.medicaments.length != 0) {
                            this.initialData.medicaments.activeSubstances = Object.assign([], data.medicaments[0].activeSubstances);
                            this.initialData.medicaments.auxSubstances = Object.assign([], data.medicaments[0].auxSubstances);

                            let divisionBonDePlata = '';
                            for (let entry of data.medicaments) {
                                if (entry.division && entry.division.length != 0) {
                                    this.divisions.push({
                                        description: entry.division
                                    });
                                    divisionBonDePlata = divisionBonDePlata + entry.description + '; ';
                                }
                            }
                            this.eForm.get('divisionBonDePlata').setValue(divisionBonDePlata);
                            this.eForm.get('medicament.atcCode').setValue(data.medicaments[0].atcCode);
                            this.eForm.get('medicament.dose').setValue(data.medicaments[0].dose);
                            this.eForm.get('medicament.termsOfValidity').setValue(data.medicaments[0].termsOfValidity);
                            this.eForm.get('medicament.volume').setValue(data.medicaments[0].volume);
                            this.activeSubstancesTable = data.medicaments[0].activeSubstances;
                            this.auxiliarySubstancesTable = data.medicaments[0].auxSubstances;
                            this.manufacturesTable = data.medicaments[0].manufactures;
                            for (let x of data.medicaments) {
                                this.fillInstructions(x);
                                this.fillMachets(x);
                            }
                        }
                        this.checkOutputDocumentsStatus();
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        this.loadAllQuickSearches(data);
                    })
                );
            })
        );
    }

    fillInstructions(medicament: any) {
        for (let medInstruction of medicament.instructions) {
            if (medInstruction.type == 'I') {
                let pageInstrction = this.instructions.find(value => value.path == medInstruction.path);
                if (pageInstrction) {
                    pageInstrction.divisions.push({description: medicament.division});
                } else {
                    medInstruction.divisions = [];
                    medInstruction.divisions.push({description: medicament.division});
                    this.instructions.push(medInstruction);
                }
            }
        }
    }

    fillMachets(x: any) {
        for (let y of x.instructions) {
            if (y.type == 'M') {
                let z = this.machets.find(value => value.path == y.path);
                if (z) {
                    z.divisions.push({description: x.division});
                } else {
                    y.divisions = [];
                    y.divisions.push({description: x.division});
                    this.machets.push(y);
                }
            }
        }
    }

    loadATCCodes() {
        this.atcCodes =
            this.atcCodesInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingAtcCodes = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllAtcCodesByCode(term).pipe(
                        tap(() => this.loadingAtcCodes = false)
                    )
                )
            );
    }

    checkOutputDocumentsStatus() {
        for (let entry of this.outDocuments) {
            var isMatch = this.documents.some(elem => {
                return (elem.docType.category == entry.docType.category && elem.number == entry.number) ? true : false;
            });
            if (isMatch) {
                entry.status = 'Atasat';
            } else {
                entry.status = 'Nu este atasat';
            }
        }
    }

    loadAllQuickSearches(dataDB: any) {

        this.loadATCCodes();

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].pharmaceuticalForm) {
                        this.eForm.get('medicament.pharmaceuticalFormType').setValue(this.pharmaceuticalFormTypes.find(r => r.id === dataDB.medicaments[0].pharmaceuticalForm.type.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                    this.volumeUnitsOfMeasurement = data;
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].unitsOfMeasurement) {
                        this.eForm.get('medicament.unitsOfMeasurement').setValue(this.unitsOfMeasurement.find(r => r.id === dataDB.medicaments[0].unitsOfMeasurement.id));
                    }
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].volumeQuantityMeasurement) {
                        this.eForm.get('medicament.volumeQuantityMeasurement').setValue(this.volumeUnitsOfMeasurement.find(r => r.id === dataDB.medicaments[0].volumeQuantityMeasurement.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentForms().subscribe(data => {
                    this.storageUnitsOfMeasurement = data;
                    this.unitsQuantityMeasurement = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllInternationalNames().subscribe(data => {
                    this.internationalNames = data;
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].internationalMedicamentName) {
                        this.eForm.get('medicament.internationalMedicamentName').setValue(this.internationalNames.find(r => r.id === dataDB.medicaments[0].internationalMedicamentName.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentTypes().subscribe(data => {
                    this.medicamentTypes = data;
                    this.medicamentTypes = this.medicamentTypes.filter(r => r.category === 'M');
                    this.medicamentTypes2 = data.filter(r => r.category === 'T');
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].medicamentType) {
                        this.eForm.get('medicament.medicamentType').setValue(this.medicamentTypes.find(r => r.id === dataDB.medicaments[0].medicamentType.id));
                    }
                    if(dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].medicamentTypes)
                    {
                        let arr : any[] = [];
                        for(let z of dataDB.medicaments[0].medicamentTypes) {
                            arr.push(z.type);
                        }
                        this.eForm.get('medicament.medTypesValues').setValue(arr);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactures = data;
                    this.manufactureAuthorizations = this.manufactures.filter(r => r.authorizationHolder == 1);
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].authorizationHolder) {
                        this.eForm.get('medicament.authorizationHolder').setValue(this.manufactureAuthorizations.find(r => r.id === dataDB.medicaments[0].authorizationHolder.id));
                    }
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].manufacture) {
                        this.eForm.get('medicament.manufacture').setValue(this.manufactures.find(r => r.id === dataDB.medicaments[0].manufacture.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('1', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentGroups().subscribe(data => {
                    this.groups = data;
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].group) {
                        this.eForm.get('medicament.group').setValue(this.groups.find(r => r.id === dataDB.medicaments[0].group.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllCustomsCodes().subscribe(data => {
                    this.customsCodes = data;
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].customsCode) {
                        this.eForm.get('medicament.customsCode').setValue(this.customsCodes.find(r => r.id === dataDB.medicaments[0].customsCode.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.prescriptions = [...this.prescriptions, {value: 1, description: 'Cu prescripţie'}];
        this.prescriptions = [...this.prescriptions, {value: 0, description: 'Fără prescripţie'}];
        if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].prescription != undefined && dataDB.medicaments[0].prescription != null) {
            if (dataDB.medicaments[0].prescription == 1) {
                this.eForm.get('medicament.prescription').setValue({value: 1, description: "Cu prescripţie"});
            } else {
                this.eForm.get('medicament.prescription').setValue({value: 0, description: "Fără prescripţie"});
            }
        }

        // if(dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].atcCode!=undefined && dataDB.medicaments[0].atcCode!=null)
        // {
        //     let code = dataDB.medicaments[0].atcCode;
        // }
    }

    checkPharmaceuticalFormTypeValue() {

        if (this.eForm.get('medicament.pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.eForm.get('medicament.pharmaceuticalFormType').value.id).subscribe(data => {
                    this.eForm.get('medicament.pharmaceuticalForm').setValue(null);
                    this.pharmaceuticalForms = data;
                    if (this.initialData.medicaments && this.initialData.medicaments.length != 0 && this.initialData.medicaments[0] && this.initialData.medicaments[0].pharmaceuticalForm) {
                        this.eForm.get('medicament.pharmaceuticalForm').setValue(this.pharmaceuticalForms.find(r => r.id === this.initialData.medicaments[0].pharmaceuticalForm.id));
                    }
                },
                error => console.log(error)
            )
        );
    }

    fillAutorizationHolderDetails() {
        if (this.eForm.get('medicament.authorizationHolder').value == null) {
            return;
        }

        this.eForm.get('medicament.authorizationHolderCountry').setValue(this.eForm.get('medicament.authorizationHolder').value.country.description);
        this.eForm.get('medicament.authorizationHolderAddress').setValue(this.eForm.get('medicament.authorizationHolder').value.address);
    }

    fillManufactureDetails() {
        if (this.eForm.get('medicament.manufacture').value == null) {
            return;
        }

        this.eForm.get('medicament.manufactureMedCountry').setValue(this.eForm.get('medicament.manufacture').value.country.description);
        this.eForm.get('medicament.manufactureMedAddress').setValue(this.eForm.get('medicament.manufacture').value.address);
    }

    nextStep() {

        this.formSubmitted = true;

        let isFormInvalid = false;
        let isOutputDocInvalid = false;
        if (this.eForm.invalid || this.divisions.length == 0 || this.activeSubstancesTable.length == 0 || this.manufacturesTable.length == 0
            || this.paymentTotal < 0) {
            isFormInvalid = true;
        }

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        }

        if (isOutputDocInvalid || isFormInvalid) {
            return;
        }

        let test = this.manufacturesTable.find(r => r.producatorProdusFinit == true);
        if (!test) {
            this.errorHandlerService.showError('Nu a fost selectat producatorul produsului finit');
            return;
        }

        let sl = this.outDocuments.find(r => r.docType.category == 'SL');
        if (sl) {
            let resp = this.outDocuments.filter(t => t.docType.category == 'SL').find(r => r.responseReceived != 1);
            if (resp) {
                this.errorHandlerService.showError('Exista solicitari de date aditionale fara raspuns primit.');
                return;
            }
        }

        let rl = this.outDocuments.find(r => r.docType.category == 'RL');
        if (rl) {
            if (!this.eForm.get('labResponse').value) {
                this.errorHandlerService.showError('Nu a fost primit rezultatul de la laborator.');
                return;
            } else if (rl.status != 'Atasat') {
                this.errorHandlerService.showError('Rezultatul laboratorului nu a fost atasat.');
                return;
            } else {
                rl.responseReceived = this.eForm.get('labResponse').value;
            }
        }

        this.isResponseReceived = true;
        this.formSubmitted = false;

        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        this.fillMedicamentDetails(modelToSubmit);

        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        // modelToSubmit.outputDocuments.push({
        //     name: 'Ordinul de autorizare a medicamentului',
        //     docType: this.docTypesInitial.find(r => r.category == 'OA'),
        //     number: 'OA-' + this.eForm.get('requestNumber').value,
        //     date: new Date()
        // });
        modelToSubmit.outputDocuments.push({
            name: 'Certificatul de autorizare al medicamentului',
            docType: this.docTypesInitial.find(r => r.category == 'CA'),
            number: 'CA-' + this.eForm.get('requestNumber').value,
            date: new Date()
        });

        modelToSubmit.assignedUser = this.authService.getUserName();

        this.loadingService.show();
        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/medicament-registration/expert/' + data.body.id]);
            }, error1 => this.hideModal(modelToSubmit))
        );
    }

    hideModal(modelToSubmit: any) {
        this.loadingService.hide();
        this.outDocuments = modelToSubmit.medicament.outputDocuments;
    }

    addDivision() {
        this.isAddDivision = true;

        if (!this.eForm.get('division').value || this.eForm.get('division').value.toString().length == 0) {
            return;
        }

        this.wasFoundDivision = false;
        let test = this.divisions.find(r => r.description == this.eForm.get('division').value);
        if (test) {
            this.wasFoundDivision = true;
            return;
        }


        this.isAddDivision = false;

        this.divisions.push({
            description: this.eForm.get('division').value
        });

        this.eForm.get('division').setValue(null);

        let divisionBonDePlata = '';
        for (let entry of this.divisions) {
            divisionBonDePlata = divisionBonDePlata + entry.description + '; ';
        }
        this.eForm.get('divisionBonDePlata').setValue(divisionBonDePlata);
    }

    addManufacture() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        dialogConfig2.data = {manufacturesTable : this.manufacturesTable, comment : true};

        let dialogRef = this.dialog.open(AddManufactureComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.manufacturesTable.push({manufacture: result.manufacture,producatorProdusFinit: false,comment : result.comment});
                    this.payment.manufactureModified();
                }
            }
        );
    }

    removeManufacture(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceast producator?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.manufacturesTable.splice(index, 1);
                this.payment.manufactureModified();
            }
        });
    }

    removeDivisionFromInstructions(division: any) {
        for (let instruction of this.instructions) {
            instruction.divisions.forEach((item, index) => {
                if (item.description == division.description) {
                    instruction.divisions.splice(index, 1);
                }
            });
            if (instruction.divisions.length == 0) {
                this.subscriptions.push(this.uploadService.removeFileFromStorage(instruction.path).subscribe(data => {
                        this.instructions.forEach((item, index) => {
                            if (item.path === instruction.path) this.instructions.splice(index, 1);
                        });
                    },
                    error => {
                        console.log(error);
                    }
                    )
                );
            }
        }
    }

    removeDivisionFromMachets(division: any) {
        for (let macheta of this.machets) {
            macheta.divisions.forEach((item, index) => {
                if (item.description == division.description) {
                    macheta.divisions.splice(index, 1);
                }
            });
            if (macheta.divisions.length == 0) {
                this.subscriptions.push(this.uploadService.removeFileFromStorage(macheta.path).subscribe(data => {
                        this.machets.forEach((item, index) => {
                            if (item.path === macheta.path) this.machets.splice(index, 1);
                        });
                    },
                    error => {
                        console.log(error);
                    }
                    )
                );
            }
        }
    }

    removeDivision(index: number, division: any) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta divizare? Instructiunile si machetele atasate acestei diviziuni vor fi sterese.',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeDivisionFromInstructions(division);
                this.removeDivisionFromMachets(division);
                this.divisions.splice(index, 1);
                let divisionBonDePlata = '';
                for (let entry of this.divisions) {
                    divisionBonDePlata = divisionBonDePlata + entry.description + '; ';
                }
                this.eForm.get('divisionBonDePlata').setValue(divisionBonDePlata);
            }
        });
    }

    removeSubstance(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.activeSubstancesTable.splice(index, 1);
                this.eForm.get('medicament.dose').setValue(null);
                let d = null;
                for(let z of this.activeSubstancesTable)
                {
                    if(!d) {
                        d = z.quantity + ' ' + z.unitsOfMeasurement.description;
                    }
                    else
                    {
                        d = d +  ' + ' + z.quantity + ' ' + z.unitsOfMeasurement.description;
                    }
                }
                this.eForm.get('medicament.dose').setValue(d);
            }
        });
    }

    removeAuxiliarySubstance(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.auxiliarySubstancesTable.splice(index, 1);
            }
        });
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    documentModified(event) {
        this.formSubmitted = false;
        this.checkOutputDocumentsStatus();
    }

    requestLaboratoryAnalysis() {

        this.outDocuments.push({
            name: 'Solicitare desfasurare analize de laborator',
            docType: this.docTypes.find(r => r.category == 'RL'),
            status: 'Nu este atasat',
            date: new Date()
        });
        this.initialData.outputDocuments = this.outDocuments;
        this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                this.outDocuments = data.body.outputDocuments;
                this.checkOutputDocumentsStatus();
            }, error => console.log(error))
        );

    }

    isDisabledLabButton(): boolean {
        return this.outDocuments.some(elem => {
            return elem.docType.category == 'RL' ? true : false;
        });
    }

    requestAdditionalData() {

        this.formSubmitted = true;

        let isFormInvalid = false;
        let isOutputDocInvalid = false;
        if (this.eForm.get('medicament.pharmaceuticalForm').invalid || this.eForm.get('medicament.dose').invalid ||
            this.eForm.get('medicament.internationalMedicamentName').invalid || this.divisions.length == 0 || this.manufacturesTable.length == 0) {
            isFormInvalid = true;
        }

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        this.formSubmitted = false;

        var lenOutDoc = this.outDocuments.filter(r => r.docType.category === 'SL').length;

        let x = this.eForm.get('medicament.commercialName').value + ', ' + this.eForm.get('medicament.pharmaceuticalForm').value.description
            + ' ' + this.eForm.get('medicament.dose').value;
        this.divisions.forEach(elem => x = x + ' ' + elem.description + ';');
        x = x + '(DCI:' + this.eForm.get('medicament.internationalMedicamentName').value.description + '), producători: ';
        this.manufacturesTable.forEach(elem => x = x + ' ' + elem.manufacture.description + ',' + elem.manufacture.country.description + ',' + elem.manufacture.address);

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            height: '800px',
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA',
                startDate: this.eForm.get('data').value,
                nrOrdDoc: lenOutDoc + 1,
                medicamentStr: x,
                companyName: this.eForm.get('company').value.name,
                address: this.eForm.get('company').value.legalAddress,
                registrationRequestMandatedContact: this.registrationRequestMandatedContacts[0]
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.outDocuments.push(result);
                this.initialData.outputDocuments = this.outDocuments;
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                    }, error => console.log(error))
                );
            }
        });
    }

    interruptProcess() {

        this.formSubmitted = true;

        if (this.eForm.invalid || this.divisions.length == 0 || this.activeSubstancesTable.length == 0 || this.manufacturesTable.length == 0) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }
        let test = this.manufacturesTable.find(r => r.producatorProdusFinit == true);
        if (!test) {
            this.errorHandlerService.showError('Nu a fost selectat producatorul produsului finit');
            return;
        }

        this.formSubmitted = false;

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                let usernameDB = this.authService.getUserName();
                var modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    id: this.eForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.initialData.initiator,
                    registrationRequestMandatedContacts: [],
                    medicaments: []
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.eForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });

                this.fillMedicamentDetails(modelToSubmit);
                modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

                this.subscriptions.push(this.requestService.addMedicamentRegistrationHistoryOnInterruption(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.eForm.get('id').value]);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    viewDoc(document: any) {
        this.loadingService.show();
        if (document.docType.category == 'SL' || document.docType.category == 'LA') {


            let modelToSubmit = {
                nrDoc: document.number,
                responsiblePerson: this.registrationRequestMandatedContacts[0].mandatedLastname + ' ' + this.registrationRequestMandatedContacts[0].mandatedFirstname,
                companyName: this.eForm.get('company').value.name,
                requestDate: document.date,
                country: 'Moldova',
                address: this.eForm.get('company').value.legalAddress,
                phoneNumber: this.registrationRequestMandatedContacts[0].phoneNumber,
                email: this.registrationRequestMandatedContacts[0].email,
                message: document.content,
                function: document.signerFunction,
                signerName: document.signerName
            };

            let observable: Observable<any> = null;
            observable = this.documentService.viewRequestNew(modelToSubmit);

            this.subscriptions.push(observable.subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                }
                )
            );
        } else {
            this.subscriptions.push(this.documentService.viewDD(document.number).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                }
                )
            );
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
                this.loadingService.show();
                this.outDocuments.forEach((item, index) => {
                    if (item === doc) this.outDocuments.splice(index, 1);
                });
                this.initialData.outputDocuments = this.outDocuments;

                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.loadingService.hide();
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    checkResponseReceived(doc: any, value: any) {
        if(value.checked)
        {
            doc.responseReceived = 1;
        }
        else
        {
            doc.responseReceived = 0;
        }
    }

    checkProducatorProdusFinit(manufacture: any, value: any) {
        for (let m of this.manufacturesTable) {
            m.producatorProdusFinit = false;
        }
        manufacture.producatorProdusFinit = value.checked;
        this.payment.manufactureModified();
    }

    save() {

        let rl = this.outDocuments.find(r => r.docType.category == 'RL');
        if (rl) {
            rl.responseReceived = this.eForm.get('labResponse').value;
        }

        this.loadingService.show();
        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.currentStep = 'E';
        modelToSubmit.assignedUser = this.authService.getUserName();

        this.fillMedicamentDetails(modelToSubmit);

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });
        modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        console.log(modelToSubmit);
        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
            this.initialData = Object.assign({}, data.body);
            this.initialData.medicaments = Object.assign([], data.body.medicaments);
            this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
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

    addActiveSubstanceDialog() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.activeSubstancesTable.push({
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufactures: result.manufactures
                });

                let d = null;
                for(let z of this.activeSubstancesTable)
                {
                    if(!d) {
                        d = z.quantity + ' ' + z.unitsOfMeasurement.description;
                    }
                    else
                    {
                        d = d +  ' + ' + z.quantity + ' ' + z.unitsOfMeasurement.description;
                    }
                }
                this.eForm.get('medicament.dose').setValue(d);
            }
        });
    }

    addAuxiliarySubstanceDialog() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        let dialogRef = this.dialog.open(AuxiliarySubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.auxiliarySubstancesTable.push({
                    auxSubstance: result.auxSubstance
                });
            }
        });
    }

    editSubstance(substance: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';
        dialogConfig2.data = substance;

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result.response) {
                this.activeSubstancesTable[index] = {
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufactures: result.manufactures
                };

                let d = null;
                for(let z of this.activeSubstancesTable)
                {
                    if(!d) {
                        d = z.quantity + ' ' + z.unitsOfMeasurement.description;
                    }
                    else
                    {
                        d = d +  ' + ' + z.quantity + ' ' + z.unitsOfMeasurement.description;
                    }
                }
                this.eForm.get('medicament.dose').setValue(d);
            }
        });
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    fillMedicamentDetails(modelToSubmit: any): void {
        for (let subst of this.activeSubstancesTable) {
            subst.id = null;
            for(let man of subst.manufactures)
            {
                man.id = null;
            }
        }

        for (let subst of this.auxiliarySubstancesTable) {
            subst.id = null;
        }

        for (let division of this.divisions) {
            let medicamentToSubmit: any;
            medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
            medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
            medicamentToSubmit.auxSubstances = this.auxiliarySubstancesTable;
            medicamentToSubmit.division = division.description;
            this.initialData.medicaments[0].experts.id =null;
            medicamentToSubmit.experts = this.initialData.medicaments[0].experts;
            if (this.eForm.get('medicament.atcCode').value) {
                if (this.eForm.get('medicament.atcCode').value.code) {
                    medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value.code;
                } else {
                    medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value;
                }
            }
            if (this.eForm.get('medicament.prescription').value) {
                medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
            }

            medicamentToSubmit.instructions = [];
            for (let x of this.instructions) {
                x.id = null;
                x.type = 'I';
                let z = Object.assign({}, x);
                let copyDivision = Object.assign({}, division);
                z.division = copyDivision.description;
                if (x.divisions.some(value => value.description == division.description)) {
                    medicamentToSubmit.instructions.push(z);
                }
            }

            for (let x of this.machets) {
                x.id = null;
                x.type = 'M';
                let z = Object.assign({}, x);
                let copyDivision = Object.assign({}, division);
                z.division = copyDivision.description;
                if (x.divisions.some(value => value.description == division.description)) {
                    medicamentToSubmit.instructions.push(z);
                }
            }

            medicamentToSubmit.manufactures = [];
            for (let x of this.manufacturesTable) {
                x.id = null;
                medicamentToSubmit.manufactures.push(x);
            }

            medicamentToSubmit.medicamentTypes = [];
            if(this.eForm.get('medicament.medTypesValues').value) {
                for (let w of this.eForm.get('medicament.medTypesValues').value) {
                    medicamentToSubmit.medicamentTypes.push({type: w});
                }
            }

            modelToSubmit.medicaments.push(medicamentToSubmit);
        }

        if (this.divisions.length == 0) {
            let medicamentToSubmit: any;
            medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
            medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
            medicamentToSubmit.auxSubstances = this.auxiliarySubstancesTable;
            this.initialData.medicaments[0].experts.id =null;
            medicamentToSubmit.experts = this.initialData.medicaments[0].experts;
            if (this.eForm.get('medicament.atcCode').value) {
                medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value.code;
            }
            if (this.eForm.get('medicament.prescription').value) {
                medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
            }
            medicamentToSubmit.manufactures = this.manufacturesTable;
            medicamentToSubmit.medicamentTypes = [];
            if(this.eForm.get('medicament.medTypesValues').value) {
                for (let w of this.eForm.get('medicament.medTypesValues').value) {
                    medicamentToSubmit.medicamentTypes.push({type: w});
                }
            }
            modelToSubmit.medicaments.push(medicamentToSubmit);
        }
    }

    manufacturesStr(substance: any) {
        if(substance && substance.manufactures) {
            let s = Array.prototype.map.call(substance.manufactures, s => s.manufacture.description + ' ' + s.manufacture.country.description + ' ' + s.manufacture.address + 'NRQW').toString();
            s = s.replace(/NRQW/gi, ';');
            return s.replace(';,', '; ');
        }
        return '';
    }

}