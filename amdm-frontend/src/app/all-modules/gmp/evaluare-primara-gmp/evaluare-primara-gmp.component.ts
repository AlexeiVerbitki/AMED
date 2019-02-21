import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {DocumentService} from '../../../shared/service/document.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {TaskService} from '../../../shared/service/task.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {LicenseService} from '../../../shared/service/license/license.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddDescriptionComponent} from '../../../dialog/add-description/add-description.component';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {SelectSubsidiaryModalComponent} from '../../gdp/select-subsidiary-modal/select-subsidiary-modal.component';
import {InspectorsModalComponent} from '../../gdp/inspectors-modal/inspectors-modal.component';
import {LaboratorDialogComponent} from '../../../dialog/laborator-dialog/laborator-dialog.component';
import {QualifiedPersonDialogComponent} from '../../../dialog/qualified-person-dialog/qualified-person-dialog.component';
import {SearchMedicamentsDialogComponent} from '../../../dialog/search-medicaments-dialog/search-medicaments-dialog.component';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';
import {SelectDocumentNumberComponent} from '../../../dialog/select-document-number/select-document-number.component';
import {SelectInspectionDateForAfComponent} from '../../../dialog/select-inspection-date-for-af/select-inspection-date-for-af.component';

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara-gmp.component.html',
    styleUrls: ['./evaluare-primara-gmp.component.css']
})
export class EvaluarePrimaraGmpComponent implements OnInit, OnDestroy {
    get formData() {
        return <FormArray>this.inspectorForm.get('periods');
    }

    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document[] = [];
    registrationRequestMandatedContacts: any[];
    docTypes: any[];
    docTypesInitial: any[];
    formSubmitted: boolean;
    outDocuments: any[] = [];
    reqTypes: any[];
    companyLicenseNotFound = false;
    initialData: any;
    asepticPreparations: any[];
    nesterilePreparations: any[];
    medicaments: any[] = [];
    authorizedManufacturedMedicaments: any[] = [];
    otherAsepticPreparations: any[] = [];
    otherNesterilePreparations: any[] = [];
    finalSterilized: any[] = [];
    biologicalMedicines: any[] = [];
    importActivities: any[] = [];
    primaryPackagings: any[] = [];
    secondaryPackagings: any[] = [];
    nesterilePreparationsCertified: any[] = [];
    sterileCertifieds: any[] = [];
    sterilizations: any[] = [];
    productions: any[] = [];
    biologicalMedicinesCertified: any[] = [];
    testsForQualityControls: any[] = [];
    otherFinalSterilized: any[] = [];
    otherPrimaryPackagings: any[] = [];
    otherSterilizations: any[] = [];
    otherProductions: any[] = [];
    otherBiologicalMedicines: any[] = [];
    otherImportActivities: any[] = [];
    otherBiologicalMedicinesImport: any[] = [];
    otherNesterilePreparationsCertified: any[] = [];
    otherBiologicalMedicinesCertified: any[] = [];
    otherSterileCertifieds: any[] = [];
    otherPreparationsOrProductions: any[] = [];
    otherTestsForQualityControl: any[] = [];
    subsidiaryList: any[] = [];
    selectedSubsidiaries: any[] = [];
    laborators: any[] = [];
    qualityControlPersons: any[] = [];
    qualifiedPersons: any[] = [];
    productionPersons: any[] = [];
    inspectorForm: FormGroup;
    selectedInspectors: any[] = [];
    paymentTotal: number;

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private documentService: DocumentService,
                private navbarTitleService: NavbarTitleService,
                private medicamentService: MedicamentService,
                private taskService: TaskService,
                private authService: AuthService,
                private loadingService: LoaderService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private licenseService: LicenseService,
                private administrationService: AdministrationService,
                private requestService: RequestService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {

        this.inspectorForm = fb.group({
            'useInspector': [false],
            'mandatedLastname': [null, Validators.required],
            'periods': fb.array([])
        });

        this.eForm = fb.group({
            'id': [],
            'data': [new Date()],
            'startDateValue': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [null],
            'documents': [],
            'typeFara': [null],
            'licenseId': [null],
            'type': [],
            'initiator': [null],
            'requestHistories': [],
            'company': [null],
            'companyValue': [],
            'seria': [null],
            'raportStatus': [null],
            'asepticallyPrepared': [null],
            'terminallySterilised': [null],
            'nonsterileProducts': [null],
            'nrLic': [null],
            'dataEliberariiLic': {disabled: true, value: new Date()},
            'dataExpirariiLic': {disabled: true, value: new Date()},
            'asepticPreparationsValues': [null],
            'nesterilePreparationsValues': [null],
            'finalSterilizedValues': [null],
            'production': [null],
            'primaryPackaging': [null],
            'gmpID': [null],
            'secondaryPackaging': [null],
            'sterilization': [null],
            'testsForQualityControl': [null],
            'testsForQualityControlImport': [null],
            'biologicalMedicinesValues': [null],
            'importActivities': [null],
            'biologicalMedicinesImport': [null],
            'nesterilePreparationsCertifiedValues': [null],
            'biologicalMedicinesCertifiedValues': [null],
            'sterileCertifiedsValues': [null],
            'humanUse': [false],
            'medicamentClinicalInvestigation': [false],
            'veterinary': [false],
            'groupLeader': [null],
            'veterinaryDetails': {disabled: true, value: null},
            'informatiiLoculDistributieAngro':
                fb.group({
                    'placeDistributionAddress': [null, Validators.required],
                    'placeDistributionPostalCode': [null],
                    'placeDistributionContactName': [null, Validators.required],
                    'placeDistributionPhoneNumber': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
                    'placeDistributionFax': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
                    'placeDistributionMobileNumber': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
                    'placeDistributionEmail': [null, Validators.email],
                    'placeDistributionName': [null, Validators.required],
                    'etapeleDeFabricatie': [null, Validators.required],
                }),
        });

        this.eForm.get('veterinary').valueChanges.subscribe(val => {
            if (val) {
                this.eForm.get('veterinaryDetails').enable();
            } else {
                this.eForm.get('veterinaryDetails').setValue(null);
                this.eForm.get('veterinaryDetails').disable();
            }
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Autorizație de fabricație a medicamentelor / Evaluare primara');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.loadGMPDetails(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.fillRequestDetails(data);
                        this.fillGMPDetails(data);
                        this.loadAllQuickSearches(data);
                    })
                );
            })
        );
    }

    loadAllQuickSearches(dataDB: any) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('43', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                const splitted = step.availableDocTypes.split(',');
                                this.docTypes = this.docTypes.filter(r => splitted.some(x => x == r.category));
                                if (!this.outDocuments.find(t => t.docType.category == 'OGM')) {
                                    this.outDocuments.push({
                                        name: 'Ordinul de inspectare al întreprinderii',
                                        docType: this.docTypesInitial.find(r => r.category == 'OGM'),
                                        date: new Date()
                                    });
                                }
                                if (!this.outDocuments.find(t => t.docType.category == 'AFM')) {
                                    this.outDocuments.push({
                                        name: 'Autorizatie de fabricatie',
                                        docType: this.docTypesInitial.find(r => r.category == 'AFM'),
                                        date: new Date()
                                    });
                                }
                                if (!this.outDocuments.find(t => t.docType.category == 'CGM')) {
                                    this.outDocuments.push({
                                        name: 'Certificatul GMP',
                                        docType: this.docTypesInitial.find(r => r.category == 'CGM'),
                                        date: new Date()
                                    });
                                }
                                this.checkOutputDocumentsStatus();
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllRequestTypes().subscribe(data => {
                    this.reqTypes = data;
                    this.reqTypes = this.reqTypes.filter(t => t.processId == 12 && t.code != 'GMPF');
                    if (dataDB.type) {
                        this.eForm.get('type').setValue(this.reqTypes.find(r => r.id === dataDB.type.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.licenseService.retrieveLicenseByIdno(dataDB.company.idno).subscribe(data => {
                    if (data) {
                        this.eForm.get('licenseId').setValue(data.id);
                        this.eForm.get('seria').setValue(data.serialNr);
                        this.eForm.get('nrLic').setValue(data.nr);
                        this.eForm.get('dataEliberariiLic').setValue(new Date(data.releaseDate));
                        this.eForm.get('dataExpirariiLic').setValue(new Date(data.expirationDate));
                        this.subsidiaryList = data.economicAgents;
                        this.normalizeSubsidiaryList();
                    } else {
                        this.companyLicenseNotFound = true;
                    }
                }
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllSterileProducts().subscribe(data => {
                    this.asepticPreparations = data;
                    this.finalSterilized = data;
                    this.sterileCertifieds = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].sterileProducts) {
                        const arrAseptic: any[] = [];
                        const arrFinalSterilized: any[] = [];
                        const arrSterileCertifieds: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].sterileProducts) {
                            if (z.category == 'P') {
                                if (z.sterileProduct) {
                                    arrAseptic.push(z.sterileProduct);
                                } else {
                                    this.otherAsepticPreparations.push({description: z.description});
                                }
                            } else if (z.category == 'S') {
                                if (z.sterileProduct) {
                                    arrFinalSterilized.push(z.sterileProduct);
                                } else {
                                    this.otherFinalSterilized.push({description: z.description});
                                }
                            } else if (z.category == 'C') {
                                if (z.sterileProduct) {
                                    arrSterileCertifieds.push(z.sterileProduct);
                                } else {
                                    this.otherSterileCertifieds.push({description: z.description});
                                }
                            }
                        }
                        this.eForm.get('finalSterilizedValues').setValue(arrFinalSterilized);
                        this.eForm.get('asepticPreparationsValues').setValue(arrAseptic);
                        this.eForm.get('sterileCertifiedsValues').setValue(arrSterileCertifieds);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllNesterileProducts().subscribe(data => {
                    this.nesterilePreparations = data;
                    this.nesterilePreparationsCertified = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].neSterileProducts) {
                        const arrNesterilePreparations: any[] = [];
                        const arrNesterilePreparationsCertified: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].neSterileProducts) {
                            if (z.category == 'N') {
                                if (z.nesterileProduct) {
                                    arrNesterilePreparations.push(z.nesterileProduct);
                                } else {
                                    this.otherNesterilePreparations.push({description: z.description});
                                }
                            } else if (z.category == 'C') {
                                if (z.nesterileProduct) {
                                    arrNesterilePreparationsCertified.push(z.nesterileProduct);
                                } else {
                                    this.otherNesterilePreparationsCertified.push({description: z.description});
                                }
                            }
                        }
                        this.eForm.get('nesterilePreparationsValues').setValue(arrNesterilePreparations);
                        this.eForm.get('nesterilePreparationsCertifiedValues').setValue(arrNesterilePreparationsCertified);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllBiologicalMedicines().subscribe(data => {
                    this.biologicalMedicines = data;
                    this.biologicalMedicinesCertified = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].biologicalMedicines) {
                        const arrBiologicalMedicines: any[] = [];
                        const arrBiologicalMedicinesCertified: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].biologicalMedicines) {
                            if (z.category == 'B') {
                                if (z.biologicalMedicine) {
                                    arrBiologicalMedicines.push(z.biologicalMedicine);
                                } else {
                                    this.otherBiologicalMedicines.push({description: z.description});
                                }
                            } else if (z.category == 'C') {
                                if (z.biologicalMedicine) {
                                    arrBiologicalMedicinesCertified.push(z.biologicalMedicine);
                                } else {
                                    this.otherBiologicalMedicinesCertified.push({description: z.description});
                                }
                            }
                        }
                        this.eForm.get('biologicalMedicinesValues').setValue(arrBiologicalMedicines);
                        this.eForm.get('biologicalMedicinesCertifiedValues').setValue(arrBiologicalMedicinesCertified);
                    }
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].biologicalMedicinesImport) {
                        const arrBiologicalMedicines: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].biologicalMedicinesImport) {
                            if (z.category == 'B') {
                                if (z.biologicalMedicine) {
                                    arrBiologicalMedicines.push(z.biologicalMedicine);
                                } else {
                                    this.otherBiologicalMedicinesImport.push({description: z.description});
                                }
                            }
                        }
                        this.eForm.get('biologicalMedicinesImport').setValue(arrBiologicalMedicines);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllGMPManufacures().subscribe(data => {
                    this.productions = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].manufactures) {
                        const arrManufactures: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].manufactures) {
                            if (z.manufacture) {
                                arrManufactures.push(z.manufacture);
                            } else {
                                if (z.category == 'O') {
                                    this.otherProductions.push({description: z.description});
                                } else if (z.category == 'OP') {
                                    this.otherPreparationsOrProductions.push({description: z.description});
                                }
                            }
                        }
                        this.eForm.get('production').setValue(arrManufactures);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllImportActivities().subscribe(data => {
                    this.importActivities = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].importActivities) {
                        const arrImport: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].importActivities) {
                            if (z.importActivity) {
                                arrImport.push(z.importActivity);
                            } else {
                                this.otherImportActivities.push({description: z.description});
                            }
                        }
                        this.eForm.get('importActivities').setValue(arrImport);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllSterilizations().subscribe(data => {
                    this.sterilizations = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].sterilizations) {
                        const arrSterilizations: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].sterilizations) {
                            if (z.sterilization) {
                                arrSterilizations.push(z.sterilization);
                            } else {
                                this.otherSterilizations.push({description: z.description});
                            }
                        }
                        this.eForm.get('sterilization').setValue(arrSterilizations);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllPrimaryPackaging().subscribe(data => {
                    this.primaryPackagings = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].primaryPackagings) {
                        const arrPrimaryPackagings: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].primaryPackagings) {
                            if (z.primaryPackaging) {
                                arrPrimaryPackagings.push(z.primaryPackaging);
                            } else {
                                this.otherPrimaryPackagings.push({description: z.description});
                            }
                        }
                        this.eForm.get('primaryPackaging').setValue(arrPrimaryPackagings);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllSecondaryPackaging().subscribe(data => {
                    this.secondaryPackagings = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].secondaryPackagings) {
                        const arrSecondaryPackagings: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].secondaryPackagings) {
                            if (z.secondaryPackaging) {
                                arrSecondaryPackagings.push(z.secondaryPackaging);
                            }
                        }
                        this.eForm.get('secondaryPackaging').setValue(arrSecondaryPackagings);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllTestsForQualityControl().subscribe(data => {
                    this.testsForQualityControls = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].testsForQualityControl) {
                        const arrTestsForQualityControl: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].testsForQualityControl) {
                            if (z.testQualityControl) {
                                arrTestsForQualityControl.push(z.testQualityControl);
                            } else {
                                this.otherTestsForQualityControl.push({description: z.description});
                            }
                        }
                        this.eForm.get('testsForQualityControl').setValue(arrTestsForQualityControl);
                    }
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].testsForQualityControlImport) {
                        const arrTestsForQualityControl: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].testsForQualityControlImport) {
                            if (z.testQualityControl) {
                                arrTestsForQualityControl.push(z.testQualityControl);
                            }
                        }
                        this.eForm.get('testsForQualityControlImport').setValue(arrTestsForQualityControl);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getManufacturersByIDNO(dataDB.company.idno).subscribe(data => {
                    if (data && data.length > 0) {
                        const dto = {authorizationHolder: data[0]};
                        this.subscriptions.push(
                            this.medicamentService.getMedicamentsByFilter(dto
                            ).subscribe(request => {
                                    this.medicaments = request.body;
                                },
                                error => console.log(error)
                            ));
                    }
                }
            )
        );
    }

    fillRequestDetails(data: any) {
        this.eForm.get('typeFara').setValue(data.type);
        this.eForm.get('type').setValue(data.type);
        this.eForm.get('id').setValue(data.id);
        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
        this.eForm.get('initiator').setValue(data.initiator);
        this.eForm.get('startDate').setValue(data.startDate);
        this.eForm.get('startDateValue').setValue(new Date(data.startDate));
        this.eForm.get('requestNumber').setValue(data.requestNumber);
        this.eForm.get('requestHistories').setValue(data.requestHistories);
        this.eForm.get('company').setValue(data.company);
        this.eForm.get('companyValue').setValue(data.company.name);
        this.outDocuments = data.outputDocuments;
        this.checkOutputDocumentsStatus();
        this.documents = data.documents;
        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let xs = this.documents;
        xs = xs.map(x => {
            x.isOld = true;
            return x;
        });
    }

    normalizeSubsidiaryList() {
        this.subsidiaryList.forEach(cis => {
            this.commonNormalizeSubsidiary(cis);
        });
    }

    normalizeSubsidiaryFromDB() {
        this.selectedSubsidiaries.forEach(cis => {
            this.commonNormalizeSubsidiary(cis);
        });
    }

    commonNormalizeSubsidiary(cis: any) {
        cis.companyType = cis.type.description;
        if (cis.locality) {
            cis.address = cis.locality.state.description + ', ' + cis.locality.description + ', ' + cis.street;
        }

        let activitiesStr = '';
        cis.activities.forEach(r => {
            if (r.description) {
                if (activitiesStr) {
                    activitiesStr += ', ' + r.description;
                } else {
                    activitiesStr = r.description;
                }
            }
        });
        cis.activitiesStr = activitiesStr;

        let pharmaceutist;
        cis.agentPharmaceutist.forEach(r => {
            if (pharmaceutist) {
                pharmaceutist += ', ' + r.fullName;
            } else {
                pharmaceutist = r.fullName;
            }
        });
        cis.selectedPharmaceutist = pharmaceutist;
    }

    fillGMPDetails(dataDB: any) {
        if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0) {
            this.eForm.get('gmpID').setValue(dataDB.gmpAuthorizations[0].id);
            this.eForm.get('humanUse').setValue(dataDB.gmpAuthorizations[0].medicamentHumanUse);
            this.eForm.get('veterinary').setValue(dataDB.gmpAuthorizations[0].medicamentVeterinary);
            this.eForm.get('medicamentClinicalInvestigation').setValue(dataDB.gmpAuthorizations[0].medicamentClinicalInvestigation);
            this.eForm.get('veterinaryDetails').setValue(dataDB.gmpAuthorizations[0].veterinaryDetails);
            this.eForm.get('asepticallyPrepared').setValue(dataDB.gmpAuthorizations[0].asepticallyPreparedImport);
            this.eForm.get('terminallySterilised').setValue(dataDB.gmpAuthorizations[0].terminallySterilisedImport);
            this.eForm.get('nonsterileProducts').setValue(dataDB.gmpAuthorizations[0].nonsterileProductsImport);
            this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').setValue(dataDB.gmpAuthorizations[0].placeDistributionName);
            this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').setValue(dataDB.gmpAuthorizations[0].placeDistributionAddress);
            this.eForm.get('informatiiLoculDistributieAngro.placeDistributionPostalCode').setValue(dataDB.gmpAuthorizations[0].placeDistributionPostalCode);
            this.eForm.get('informatiiLoculDistributieAngro.placeDistributionContactName').setValue(dataDB.gmpAuthorizations[0].placeDistributionContactName);
            this.eForm.get('informatiiLoculDistributieAngro.placeDistributionPhoneNumber').setValue(dataDB.gmpAuthorizations[0].placeDistributionPhoneNumber);
            this.eForm.get('informatiiLoculDistributieAngro.placeDistributionFax').setValue(dataDB.gmpAuthorizations[0].placeDistributionFax);
            this.eForm.get('informatiiLoculDistributieAngro.placeDistributionMobileNumber').setValue(dataDB.gmpAuthorizations[0].placeDistributionMobileNumber);
            this.eForm.get('informatiiLoculDistributieAngro.placeDistributionEmail').setValue(dataDB.gmpAuthorizations[0].placeDistributionEmail);
            this.eForm.get('informatiiLoculDistributieAngro.etapeleDeFabricatie').setValue(dataDB.gmpAuthorizations[0].stagesOfManufacture);
            this.eForm.get('groupLeader').setValue(dataDB.gmpAuthorizations[0].groupLeader);
            if (dataDB.gmpAuthorizations[0].inspectors && dataDB.gmpAuthorizations[0].inspectors.length != 0) {
                this.inspectorForm.get('useInspector').setValue(true);
                this.selectedInspectors = dataDB.gmpAuthorizations[0].inspectors;
                this.selectedInspectors.forEach(t => t.selected = true);
            }
            if (dataDB.gmpAuthorizations[0].periods.length > 0) {
                dataDB.gmpAuthorizations[0].periods.forEach(p => (this.inspectorForm.get('periods') as FormArray).push(this.createPeriod(p)));
            }
            this.laborators = dataDB.gmpAuthorizations[0].laboratories;
            dataDB.gmpAuthorizations[0].qualifiedPersons.forEach(t => {
                    if (t.category == 'QP') {
                        this.qualifiedPersons.push(t);
                    } else if (t.category == 'QC') {
                        this.qualityControlPersons.push(t);
                    } else if (t.category == 'QPP') {
                        this.productionPersons.push(t);
                    }
                }
            );
            dataDB.gmpAuthorizations[0].authorizedMedicines.forEach(t =>
                this.authorizedManufacturedMedicaments.push({
                    id: t.medicament.id,
                    code: t.medicament.code,
                    commercialName: t.medicament.commercialName,
                    registerNumber: t.medicament.registrationNumber,
                    division: t.medicament.division,
                    volume: t.medicament.volume,
                    volumeQuantityMeasurement: (t.medicament.volumeQuantityMeasurement) ? t.medicament.volumeQuantityMeasurement.description : ''
                }));
            dataDB.gmpAuthorizations[0].subsidiaries.forEach(t =>
                this.selectedSubsidiaries.push(t.subsidiary)
            );
            this.normalizeSubsidiaryFromDB();
        }
    }

    documentModified(event) {
        this.formSubmitted = false;
        this.checkOutputDocumentsStatus();
    }

    checkOutputDocumentsStatus() {
        for (const entry of this.outDocuments) {
            const isMatch = this.documents.some(elem => {
                return (elem.docType.category == entry.docType.category) ? true : false;
            });
            if (isMatch) {
                entry.status = 'Atasat';
            } else {
                entry.status = 'Nu este atasat';
            }
        }
    }

    canDeactivate()
        :
        Observable<boolean> | Promise<boolean> | boolean {

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

    save() {
        this.loadingService.show();
        const modelToSubmit: any = this.eForm.value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.currentStep = 'E';
        modelToSubmit.assignedUser = this.authService.getUserName();

        if (!this.eForm.get('type').value) {
            modelToSubmit.type = this.eForm.get('typeFara').value;
        }

        modelToSubmit.gmpAuthorizations = [];
        modelToSubmit.gmpAuthorizations.push(this.fillGMPAuthorization());

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('startDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });
        modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        this.subscriptions.push(this.requestService.addGMPRequest(modelToSubmit).subscribe(data => {
                this.initialData = Object.assign({}, data.body);
                this.initialData.gmpAuthorizations = Object.assign([], data.body.gmpAuthorizations);
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    fillGMPAuthorization() {
        const gmpAuthorization = {
            id: this.eForm.get('gmpID').value,
            status: 'P',
            company: this.eForm.get('company').value,
            sterileProducts: [],
            neSterileProducts: [],
            biologicalMedicines: [],
            biologicalMedicinesImport: [],
            importActivities: [],
            manufactures: [],
            sterilizations: [],
            primaryPackagings: [],
            secondaryPackagings: [],
            testsForQualityControl: [],
            testsForQualityControlImport: [],
            qualifiedPersons: [],
            authorizedMedicines: [],
            laboratories: this.laborators,
            subsidiaries: [],
            groupLeader: this.eForm.get('groupLeader').value,
            medicamentHumanUse: this.eForm.get('humanUse').value,
            medicamentClinicalInvestigation: this.eForm.get('medicamentClinicalInvestigation').value,
            nonsterileProductsImport: this.eForm.get('nonsterileProducts').value,
            terminallySterilisedImport: this.eForm.get('terminallySterilised').value,
            asepticallyPreparedImport: this.eForm.get('asepticallyPrepared').value,
            medicamentVeterinary: this.eForm.get('veterinary').value,
            veterinaryDetails: this.eForm.get('veterinaryDetails').value,
            inspectors: this.selectedInspectors,
            periods: (this.inspectorForm.get('periods') as FormArray).getRawValue(),
            placeDistributionName: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').value,
            placeDistributionAddress: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value,
            placeDistributionPostalCode: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionPostalCode').value,
            placeDistributionContactName: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionContactName').value,
            placeDistributionPhoneNumber: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionPhoneNumber').value,
            placeDistributionFax: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionFax').value,
            placeDistributionMobileNumber: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionMobileNumber').value,
            placeDistributionEmail: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionEmail').value,
            stagesOfManufacture: this.eForm.get('informatiiLoculDistributieAngro.etapeleDeFabricatie').value,
        };

        // produse sterile
        if (this.eForm.get('asepticPreparationsValues').value) {
            for (const w of this.eForm.get('asepticPreparationsValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'P'});
            }
        }
        if (this.otherAsepticPreparations.length != 0) {
            for (const w of this.otherAsepticPreparations) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'P'});
            }
        }
        if (this.eForm.get('finalSterilizedValues').value) {
            for (const w of this.eForm.get('finalSterilizedValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'S'});
            }
        }
        if (this.otherFinalSterilized.length != 0) {
            for (const w of this.otherFinalSterilized) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'S'});
            }
        }
        if (this.eForm.get('sterileCertifiedsValues').value) {
            for (const w of this.eForm.get('sterileCertifiedsValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'C'});
            }
        }
        if (this.otherSterileCertifieds.length != 0) {
            for (const w of this.otherSterileCertifieds) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'C'});
            }
        }

        if (this.eForm.get('finalSterilizedValues').value) {
            for (const w of this.eForm.get('finalSterilizedValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'S'});
            }
        }

        // produse nesterile
        if (this.eForm.get('nesterilePreparationsValues').value) {
            for (const w of this.eForm.get('nesterilePreparationsValues').value) {
                gmpAuthorization.neSterileProducts.push({nesterileProduct: w, category: 'N'});
            }
        }
        if (this.otherNesterilePreparations.length != 0) {
            for (const w of this.otherNesterilePreparations) {
                gmpAuthorization.neSterileProducts.push({description: w.description, category: 'N'});
            }
        }
        if (this.eForm.get('nesterilePreparationsCertifiedValues').value) {
            for (const w of this.eForm.get('nesterilePreparationsCertifiedValues').value) {
                gmpAuthorization.neSterileProducts.push({nesterileProduct: w, category: 'C'});
            }
        }
        if (this.otherNesterilePreparationsCertified.length != 0) {
            for (const w of this.otherNesterilePreparationsCertified) {
                gmpAuthorization.neSterileProducts.push({description: w.description, category: 'C'});
            }
        }

        // medicamente biologice
        if (this.eForm.get('biologicalMedicinesValues').value) {
            for (const w of this.eForm.get('biologicalMedicinesValues').value) {
                gmpAuthorization.biologicalMedicines.push({biologicalMedicine: w, category: 'B'});
            }
        }
        if (this.otherBiologicalMedicines.length != 0) {
            for (const w of this.otherBiologicalMedicines) {
                gmpAuthorization.biologicalMedicines.push({description: w.description, category: 'B'});
            }
        }
        if (this.eForm.get('biologicalMedicinesCertifiedValues').value) {
            for (const w of this.eForm.get('biologicalMedicinesCertifiedValues').value) {
                gmpAuthorization.biologicalMedicines.push({biologicalMedicine: w, category: 'C'});
            }
        }
        if (this.otherBiologicalMedicinesCertified.length != 0) {
            for (const w of this.otherBiologicalMedicinesCertified) {
                gmpAuthorization.biologicalMedicines.push({description: w.description, category: 'C'});
            }
        }

        // medicamente biologice pentru import
        if (this.eForm.get('biologicalMedicinesImport').value) {
            for (const w of this.eForm.get('biologicalMedicinesImport').value) {
                gmpAuthorization.biologicalMedicinesImport.push({biologicalMedicine: w, category: 'B'});
            }
        }
        if (this.otherBiologicalMedicinesImport.length != 0) {
            for (const w of this.otherBiologicalMedicinesImport) {
                gmpAuthorization.biologicalMedicinesImport.push({description: w.description, category: 'B'});
            }
        }

        // fabricatii
        if (this.eForm.get('production').value) {
            for (const w of this.eForm.get('production').value) {
                gmpAuthorization.manufactures.push({manufacture: w, category: 'P'});
            }
        }
        if (this.otherProductions.length != 0) {
            for (const w of this.otherProductions) {
                gmpAuthorization.manufactures.push({description: w.description, category: 'O'});
            }
        }
        if (this.otherPreparationsOrProductions.length != 0) {
            for (const w of this.otherPreparationsOrProductions) {
                gmpAuthorization.manufactures.push({description: w.description, category: 'OP'});
            }
        }

        // sterilizari
        if (this.eForm.get('sterilization').value) {
            for (const w of this.eForm.get('sterilization').value) {
                gmpAuthorization.sterilizations.push({sterilization: w});
            }
        }
        if (this.otherSterilizations.length != 0) {
            for (const w of this.otherSterilizations) {
                gmpAuthorization.sterilizations.push({description: w.description});
            }
        }

        // activităţi de import
        if (this.eForm.get('importActivities').value) {
            for (const w of this.eForm.get('importActivities').value) {
                gmpAuthorization.importActivities.push({importActivity: w});
            }
        }
        if (this.otherImportActivities.length != 0) {
            for (const w of this.otherImportActivities) {
                gmpAuthorization.importActivities.push({description: w.description});
            }
        }

        // ambalare primara
        if (this.eForm.get('primaryPackaging').value) {
            for (const w of this.eForm.get('primaryPackaging').value) {
                gmpAuthorization.primaryPackagings.push({primaryPackaging: w});
            }
        }
        if (this.otherPrimaryPackagings.length != 0) {
            for (const w of this.otherPrimaryPackagings) {
                gmpAuthorization.primaryPackagings.push({description: w.description});
            }
        }
        // ambalare secundara
        if (this.eForm.get('secondaryPackaging').value) {
            for (const w of this.eForm.get('secondaryPackaging').value) {
                gmpAuthorization.secondaryPackagings.push({secondaryPackaging: w});
            }
        }

        // teste pentru controlul calitatii
        if (this.eForm.get('testsForQualityControl').value) {
            for (const w of this.eForm.get('testsForQualityControl').value) {
                gmpAuthorization.testsForQualityControl.push({testQualityControl: w});
            }
        }
        if (this.eForm.get('testsForQualityControlImport').value) {
            for (const w of this.eForm.get('testsForQualityControlImport').value) {
                gmpAuthorization.testsForQualityControlImport.push({testQualityControl: w});
            }
        }
        if (this.otherTestsForQualityControl.length != 0) {
            for (const w of this.otherTestsForQualityControl) {
                gmpAuthorization.testsForQualityControl.push({description: w.description});
            }
        }

        this.qualifiedPersons.forEach(t => gmpAuthorization.qualifiedPersons.push(t));
        this.qualityControlPersons.forEach(t => gmpAuthorization.qualifiedPersons.push(t));
        this.productionPersons.forEach(t => gmpAuthorization.qualifiedPersons.push(t));

        this.authorizedManufacturedMedicaments.forEach(t => gmpAuthorization.authorizedMedicines.push({medicament: {id: t.id}}));
        this.selectedSubsidiaries.forEach(t => gmpAuthorization.subsidiaries.push({subsidiary: {id: t.id}}));
        return gmpAuthorization;
    }

    nextStep() {
        if (this.companyLicenseNotFound && this.eForm.get('raportStatus').value && this.eForm.get('raportStatus').value == 1) {
            this.errorHandlerService.showError('Acest agent economic nu are o licenta activa.');
            return;
        }

        if (!this.eForm.get('type').value) {
            this.errorHandlerService.showError('Tipul cererii trebuie selectat.');
            return;
        }

        this.formSubmitted = true;
        if (this.eForm.invalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        if (!this.eForm.get('veterinary').value && !this.eForm.get('humanUse').value && !this.eForm.get('medicamentClinicalInvestigation').value) {
            this.errorHandlerService.showError('Tipul de medicament fabricat trebuie selectat.');
            return;
        }

        if (this.eForm.get('veterinary').value && !this.eForm.get('veterinaryDetails').value) {
            this.errorHandlerService.showError('Detaliile pentru medicamentele de uz veterinar trebuie introduse');
            return;
        }

        for (const p of (this.inspectorForm.get('periods') as FormArray).getRawValue()) {
            if (!p.fromDate || !p.toDate) {
                this.errorHandlerService.showError('Exista perioade de inspectie incomplete');
                return;
            } else if (p.fromDate.getTime() > p.toDate.getTime()) {
                this.errorHandlerService.showError('Exista perioade de inspectie invalide. Din data este mai mare ca Pina la data.');
                return;
            }
        }

        if (!this.eForm.get('groupLeader').value) {
            this.errorHandlerService.showError('Sef inspectie trebuie selectat.');
            return;
        }

        const arr = (this.inspectorForm.get('periods') as FormArray).getRawValue();
        if (!arr || arr.length == 0) {
            this.errorHandlerService.showError('Nici o perioada de inspectie nu a fost adaugata.');
            return;
        }

        if (!this.eForm.get('raportStatus').value) {
            this.errorHandlerService.showError('Status raport trebuie selectat.');
            return;
        }

        if (this.eForm.get('raportStatus').value == 0) {
            this.interruptProcess();
            return;
        }

        const sl = this.outDocuments.find(r => r.docType.category == 'SL');
        if (sl) {
            const resp = this.outDocuments.filter(t => t.docType.category == 'SL').find(r => r.responseReceived != 1);
            if (resp) {
                this.errorHandlerService.showError('Exista solicitari de date aditionale fara raspuns primit.');
                return;
            }
        }

        const sd = this.outDocuments.find(r => r.docType.category == 'SD');
        if (sd) {
            const resp = this.outDocuments.filter(t => t.docType.category == 'SD').find(r => r.responseReceived != 1);
            if (resp) {
                this.errorHandlerService.showError('Exista solicitare de inlaturare deficiente fara raspuns primit.');
                return;
            }
        }

        const findDocTypeOGM = this.documents.find(t => t.docType.category == 'OGM');
        if (!findDocTypeOGM) {
            this.errorHandlerService.showError('Ordinul de inspectare al întreprinderii nu este atasat.');
            return;
        }

        const findDocTypeAFM = this.documents.find(t => t.docType.category == 'AFM');
        if (!findDocTypeAFM) {
            this.errorHandlerService.showError('Autorizatia de fabricatie nu este atasata.');
            return;
        }

        const findDocTypeCGM = this.documents.find(t => t.docType.category == 'CGM');
        if (!findDocTypeCGM) {
            this.errorHandlerService.showError('Certificatul GMP nu este atasat.');
            return;
        }

        this.formSubmitted = false;

        const modelToSubmit: any = this.eForm.value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.assignedUser = this.authService.getUserName();

        modelToSubmit.gmpAuthorizations = [];
        modelToSubmit.gmpAuthorizations.push(this.fillGMPAuthorization());

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('startDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });
        modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        this.subscriptions.push(this.requestService.finishGMPRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage']);
            }, error => this.loadingService.hide())
        );
    }

    interruptProcess() {

        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                const usernameDB = this.authService.getUserName();
                const modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    id: this.eForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.initialData.initiator,
                    registrationRequestMandatedContacts: [],
                    medicaments: [],
                    gmpAuthorizations: [],
                    requestNumber: this.eForm.get('requestNumber').value,
                    startDate: this.eForm.get('startDate').value,
                    type: this.eForm.get('type').value,
                    company: this.eForm.get('company').value,
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.eForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });
                if (!this.eForm.get('type').value) {
                    modelToSubmit.type = this.eForm.get('typeFara').value;
                }

                modelToSubmit.gmpAuthorizations.push(this.fillGMPAuthorization());

                modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

                this.subscriptions.push(this.requestService.addGMPRequest(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/gmp/interrupt/' + this.eForm.get('id').value]);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    addAsepticPreparation() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Preparat aseptic',
            errMsg: 'Preparatul trebuie introdus',
            title: 'Adaugare preparat aseptic'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherAsepticPreparations.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeAsepticPreparation(index
                                 :
                                 number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast preparat?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherAsepticPreparations.splice(index, 1);
            }
        });
    }

    addFinalSterilized() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Produs sterilizat final ',
            errMsg: 'Produsul trebuie introdus',
            title: 'Adaugare produs sterilizat final'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherFinalSterilized.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeFinalSterilized(index
                              :
                              number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherFinalSterilized.splice(index, 1);
            }
        });
    }

    addSterileCertified() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Produs sterilizat',
            errMsg: 'Produsul trebuie introdus',
            title: 'Adaugare produs sterilizat'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherSterileCertifieds.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeOtherSterileCertified(index
                                    :
                                    number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherSterileCertifieds.splice(index, 1);
            }
        });
    }

    addNesterileProducts() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Produs nesterilizat',
            errMsg: 'Produsul trebuie introdus',
            title: 'Adaugare produs nesterilizat'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherNesterilePreparations.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeNesterileProducts(index
                                :
                                number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherNesterilePreparations.splice(index, 1);
            }
        });
    }

    addNesterilePreparationsCertified() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Produs nesterilizat',
            errMsg: 'Produsul trebuie introdus',
            title: 'Adaugare produs nesterilizat'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherNesterilePreparationsCertified.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeNesterilePreparationsCertified(index
                                             :
                                             number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherNesterilePreparationsCertified.splice(index, 1);
            }
        });
    }

    addImportActivities() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Activitate de import',
            errMsg: 'Activitatea trebuie introdusa',
            title: 'Adaugare activitate de import'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherImportActivities.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeImportActivities(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta activitate?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherImportActivities.splice(index, 1);
            }
        });
    }

    addBiologicalMedicines() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Medicament biologic',
            errMsg: 'Medicamentul biologic trebuie introdus',
            title: 'Adaugare medicament biologic'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherBiologicalMedicines.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeBiologicalMedicines(index
                                  :
                                  number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast medicament?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherBiologicalMedicines.splice(index, 1);
            }
        });
    }

    addBiologicalMedicinesImport() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Medicament biologic',
            errMsg: 'Medicamentul biologic trebuie introdus',
            title: 'Adaugare medicament biologic'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherBiologicalMedicinesImport.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeBiologicalMedicinesImport(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast medicament?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherBiologicalMedicinesImport.splice(index, 1);
            }
        });
    }

    addBiologicalMedicinesCertified() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Medicament biologic',
            errMsg: 'Medicamentul biologic trebuie introdus',
            title: 'Adaugare medicament biologic'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherBiologicalMedicinesCertified.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeBiologicalMedicinesCertified(index
                                           :
                                           number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast medicament?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherBiologicalMedicinesCertified.splice(index, 1);
            }
        });
    }

    addProduction() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Fabricatie',
            errMsg: 'Fabricatia trebuie introdusa',
            title: 'Adaugare fabricatie'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherProductions.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeProduction(index
                         :
                         number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta fabricatie?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherProductions.splice(index, 1);
            }
        });
    }

    addSterilization() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Sterilizare',
            errMsg: 'Sterilizarea trebuie introdusa',
            title: 'Adaugare sterilizare'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherSterilizations.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeSterilization(index
                            :
                            number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta sterilizare?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherSterilizations.splice(index, 1);
            }
        });
    }

    addPreparationsOrProductions() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Alte produse sau activităţi de fabricaţie',
            errMsg: 'Produsul sau activitatea de fabricatie trebuie introdusa',
            title: 'Alte produse sau activităţi de fabricaţie'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherPreparationsOrProductions.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removePreparationsOrProductions(index
                                        :
                                        number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs/fabricaţie?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherPreparationsOrProductions.splice(index, 1);
            }
        });
    }

    addPrimaryPackaging() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Ambalare primară',
            errMsg: 'Ambalarea primară trebuie introdusa',
            title: 'Adaugare ambalare primară'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherPrimaryPackagings.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removePrimaryPackaging(index
                               :
                               number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta ambalare?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherPrimaryPackagings.splice(index, 1);
            }
        });
    }

    addTestsForQualityControl() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            name: 'Teste pentru controlul calităţii',
            errMsg: 'Testul trebuie introdus',
            title: 'Adaugare teste pentru controlul calităţii'
        };

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherTestsForQualityControl.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeTestsForQualityControl(index
                                     :
                                     number
    ) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast test?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherTestsForQualityControl.splice(index, 1);
            }
        });
    }

    checkHumanUseMed(value: any) {
        this.eForm.get('humanUse').setValue(value.checked);
    }

    checkVeterinary(value: any) {
        this.eForm.get('veterinary').setValue(value.checked);
    }

    checkClinicalMed(value: any) {
        this.eForm.get('medicamentClinicalInvestigation').setValue(value.checked);
    }

    checkAsepticallyPrepared(value: any) {
        this.eForm.get('asepticallyPrepared').setValue(value.checked);
    }

    checkTerminallySterilised(value: any) {
        this.eForm.get('terminallySterilised').setValue(value.checked);
    }

    checkNonsterileProducts(value: any) {
        this.eForm.get('nonsterileProducts').setValue(value.checked);
    }

    selectSubsidiary() {
        const dialogRef = this.dialog.open(SelectSubsidiaryModalComponent, {
            width: '1800px',
            data: {
                idno: this.eForm.get('company').value.idno,
                subsidiaryList: this.subsidiaryList,
                selectedSubsidiaries: this.selectedSubsidiaries
            },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectedSubsidiaries = result;
            }
        });
    }

    selectInspectors() {
        const dialogRef = this.dialog.open(InspectorsModalComponent, {
            width: '1800px',
            data: {selectedInspectors: this.selectedInspectors},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectedInspectors = result;
            }
        });
    }

    killInspector(i, obj) {
        if (this.eForm.get('groupLeader').value && this.eForm.get('groupLeader').value.id == obj.id) {
            this.eForm.get('groupLeader').setValue(null);
        }
        this.selectedInspectors.splice(i, 1);
    }


    createPeriod(obj)
        :
        FormGroup {
        obj = obj ? obj : {};
        return this.fb.group({
            fromDate: [{value: new Date(obj.fromDate), disabled: true}],
            toDate: [{value: new Date(obj.toDate), disabled: true}],
            gmpId: obj.gmpId,
            id: obj.id
        });
    }

    addPeriod(obj) {
        (this.inspectorForm.get('periods') as FormArray).push(this.createPeriod(obj));
    }

    inspectionPeriodChanged(i, type, event) {
        const p = (this.inspectorForm.get('periods') as FormArray).controls[i] as FormGroup;
        if (p) {
            if (type == 'from' && p.controls.toDate.value && new Date(event).getTime() > p.controls.toDate.value.getTime()) {
                this.errorHandlerService.showError('Din data trebuie sa fie mai mica sau egala cu Pina la data');
                return;
            }
            if (type == 'to' && p.controls.fromDate.value && p.controls.fromDate.value.getTime() > new Date(event).getTime()) {
                this.errorHandlerService.showError('Pina la data trebuie sa fie mai mare sau egala cu Din data');
                return;
            }
        }
    }

    removePeriod(i) {
        (this.inspectorForm.get('periods') as FormArray).controls.splice(i, 1);
    }

    addLaborator() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(LaboratorDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.laborators.push(
                    result
                );
            }
        });
    }

    editLaborator(laborator: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';
        dialogConfig2.data = laborator;

        const dialogRef = this.dialog.open(LaboratorDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.laborators[index] = result;
            }
        });
    }

    removeLaborator(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceast laborator?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.laborators.splice(index, 1);
            }
        });
    }

    addQualifiedPerson() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '1800px';
        dialogConfig2.data = {type: 'QP'};

        const dialogRef = this.dialog.open(QualifiedPersonDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.qualifiedPersons.push(
                    result
                );
            }
        });
    }

    editQualifiedPerson(qualifiedPerson
                            :
                            any, index
                            :
                            number
    ) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '1800px';
        dialogConfig2.data = {type: 'QP', qualifiedPerson: qualifiedPerson};

        const dialogRef = this.dialog.open(QualifiedPersonDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.qualifiedPersons[index] = result;
            }
        });
    }

    removeQualifiedPerson(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta persoana?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.qualifiedPersons.splice(index, 1);
            }
        });
    }

    addQualityControlPerson() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '1800px';
        dialogConfig2.data = {type: 'QC'};

        const dialogRef = this.dialog.open(QualifiedPersonDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.qualityControlPersons.push(
                    result
                );
            }
        });
    }

    editQualityControlPerson(qualifiedPerson
                                 :
                                 any, index
                                 :
                                 number
    ) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '1800px';
        dialogConfig2.data = {type: 'QC', qualifiedPerson: qualifiedPerson};

        const dialogRef = this.dialog.open(QualifiedPersonDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.qualityControlPersons[index] = result;
            }
        });
    }

    removeQualityControlPerson(index
                                   :
                                   number
    ) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta persoana?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.qualityControlPersons.splice(index, 1);
            }
        });
    }

    addProductionPerson() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '1800px';
        dialogConfig2.data = {type: 'QPP'};

        const dialogRef = this.dialog.open(QualifiedPersonDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.productionPersons.push(
                    result
                );
            }
        });
    }

    editProductionPerson(qualifiedPerson
                             :
                             any, index
                             :
                             number
    ) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '1800px';
        dialogConfig2.data = {type: 'QPP', qualifiedPerson: qualifiedPerson};

        const dialogRef = this.dialog.open(QualifiedPersonDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.productionPersons[index] = result;
            }
        });
    }

    removeProductionPerson(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta persoana?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.productionPersons.splice(index, 1);
            }
        });
    }

    addAuthorizedManufacturedMedicaments() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '1800px';

        const dialogRef = this.dialog.open(SearchMedicamentsDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                for (const v of result.medicaments) {
                    this.authorizedManufacturedMedicaments.push(
                        v
                    );
                }
            }
        });
    }

    removeAuthorizedManufacturedMedicaments(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceast medicament?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.authorizedManufacturedMedicaments.splice(index, 1);
            }
        });
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    requestAdditionalData() {

        this.formSubmitted = true;

        const lenOutDoc = this.outDocuments.filter(r => r.docType.category === 'SL').length;

        const dialogRef2 = this.dialog.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            height: '800px',
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA_GMP',
                startDate: this.eForm.get('startDate').value,
                nrOrdDoc: lenOutDoc + 1,
                companyName: this.eForm.get('company').value.name,
                address: this.eForm.get('company').value.legalAddress,
                registrationRequestMandatedContact: this.registrationRequestMandatedContacts[0]
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.outDocuments.push(result);
                this.save();
                this.checkOutputDocumentsStatus();
            }
        });
    }

    requestRemovalDeficiencies() {

        this.formSubmitted = true;

        const lenOutDoc = this.outDocuments.filter(r => r.docType.category === 'SD').length;

        const dialogRef2 = this.dialog.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            height: '800px',
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'REQUEST_REMOVAL_DEFICIENCIES_GMP',
                startDate: this.eForm.get('startDate').value,
                nrOrdDoc: lenOutDoc + 1,
                companyName: this.eForm.get('company').value.name,
                address: this.eForm.get('company').value.legalAddress,
                registrationRequestMandatedContact: this.registrationRequestMandatedContacts[0]
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.outDocuments.push(result);
                this.save();
                this.checkOutputDocumentsStatus();
            }
        });
    }

    viewOGM() {
        if (!this.eForm.get('groupLeader').value) {
            this.errorHandlerService.showError('Sef inspectie trebuie selectat.');
            return;
        }

        const arr = (this.inspectorForm.get('periods') as FormArray).getRawValue();
        if (!arr || arr.length == 0) {
            this.errorHandlerService.showError('Nici o perioada de inspectie nu a fost adaugata.');
            return;
        }

        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value) {
            this.errorHandlerService.showError('Adresa locului de fabricaţie trebuie introdusa.');
            return;
        }

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '400px';

        let firstInspectionDate = null;
        for (const x of arr) {
            if (firstInspectionDate == null || firstInspectionDate.getTime() > x.fromDate.getTime()) {
                firstInspectionDate = x.fromDate;
            }
        }
        let inspectorsName = '';
        this.selectedInspectors.forEach(t => {
                if (this.eForm.get('groupLeader').value.id != t.id) {
                    inspectorsName = inspectorsName + t.name;
                    if (t.function) {
                        inspectorsName = inspectorsName + ', ' + t.function;
                    }
                    inspectorsName = inspectorsName + '|';
                }
            }
        );
        inspectorsName = inspectorsName.substring(0, inspectorsName.length - 1);

        const dialogRef = this.dialog.open(SelectDocumentNumberComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                const model = {
                    orderNr: result.docNr,
                    requestNr: this.eForm.get('requestNumber').value,
                    requestDate: this.eForm.get('startDate').value,
                    expertsLeader: this.eForm.get('groupLeader').value.name,
                    expertsLeaderFunction: this.eForm.get('groupLeader').value.function,
                    companyName: this.eForm.get('company').value.name,
                    companyAddress: this.eForm.get('company').value.legalAddress,
                    distributionCompanyAddress: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value,
                    firstInspectionDate: firstInspectionDate,
                    inspectorsName: inspectorsName
                };
                this.loadingService.show();
                this.subscriptions.push(this.documentService.viewOGM(model).subscribe(data => {
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
        });
    }

    viewSLAndSD(document: any) {
        const modelToSubmit = {
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

        this.loadingService.show();
        const observable = this.documentService.viewRequestNew(modelToSubmit);

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

    viewDoc(document: any) {
        if (document.docType.category == 'SL' || document.docType.category == 'SD') {
            this.viewSLAndSD(document);
        } else if (document.docType.category == 'OGM') {
            this.viewOGM();
        } else if (document.docType.category == 'AFM') {
            this.viewAFM();
        } else if (document.docType.category == 'CGM') {
            this.viewCGM();
        }
    }

    viewCGM() {
        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value) {
            this.errorHandlerService.showError('Adresa locului de fabricaţie trebuie introdusa.');
            return;
        }

        if (!this.eForm.get('humanUse').value && !this.eForm.get('medicamentClinicalInvestigation').value && !this.eForm.get('veterinary').value) {
            this.errorHandlerService.showError('Tipurile de medicamente fabricate trebuie selectate.');
            return;
        }

        const findDocTypeOGM = this.documents.find(t => t.docType.category == 'OGM');
        if (!findDocTypeOGM) {
            this.errorHandlerService.showError('Ordinul de inspectare al întreprinderii nu este atasat.');
            return;
        }

        const findDocTypeAFM = this.documents.find(t => t.docType.category == 'AFM');
        if (!findDocTypeAFM) {
            this.errorHandlerService.showError('Autorizatia de fabricatie nu este atasata.');
            return;
        }

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '400px';

        dialogConfig2.data = {type: 'CGM'};

        const dialogRef = this.dialog.open(SelectInspectionDateForAfComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                const model = this.extractedModelLayouts(result);
                model.certificateNr = result.docNr;
                model.orderDate = findDocTypeOGM.dateOfIssue;
                model.orderNr = findDocTypeOGM.number;
                model.licenseSeries = this.eForm.get('seria').value;
                model.licenseNr = this.eForm.get('nrLic').value;
                model.licenseDate = this.eForm.get('dataEliberariiLic').value;
                model.autorizationDate = findDocTypeAFM.dateOfIssue;
                model.qualityControlTestsImport = [];
                model.preparateAsepticImport = this.eForm.get('asepticallyPrepared').value;
                model.sterilizateFinalImport = this.eForm.get('terminallySterilised').value;
                model.produseNesterileImport = this.eForm.get('nonsterileProducts').value;
                model.medicamenteBiologiceImport = [];
                model.otherImports = [];
                model.autorizationNr = findDocTypeAFM.number;
                if (this.eForm.get('testsForQualityControlImport').value) {
                    this.eForm.get('testsForQualityControlImport').value.forEach(t => model.qualityControlTestsImport.push({
                        value: t.description,
                        valueEn: t.descriptionEn
                    }));
                }
                if (this.eForm.get('biologicalMedicinesImport').value) {
                    this.eForm.get('biologicalMedicinesImport').value.forEach(t => model.medicamenteBiologiceImport.push({
                        value: t.description,
                        valueEn: t.descriptionEn
                    }));
                }
                if (this.otherBiologicalMedicinesImport) {
                    this.otherBiologicalMedicinesImport.forEach(t => model.medicamenteBiologiceImport.push({
                        value: t.description,
                        valueEn: t.descriptionEn
                    }));
                }
                if (this.eForm.get('importActivities').value) {
                    this.eForm.get('importActivities').value.forEach(t => model.otherImports.push({
                        value: t.description,
                        valueEn: t.descriptionEn
                    }));
                }
                if (this.otherImportActivities) {
                    this.otherImportActivities.forEach(t => model.otherImports.push({
                        value: t.description,
                        valueEn: t.descriptionEn
                    }));
                }

                this.loadingService.show();
                this.subscriptions.push(this.documentService.viewCGM(model).subscribe(data => {
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
        });
    }

    private extractedModelLayouts(result) {
        const model = {
            requestNr: this.eForm.get('requestNumber').value,
            requestDate: this.eForm.get('startDate').value,
            expertsLeader: this.eForm.get('groupLeader').value.name,
            expertsLeaderFunction: this.eForm.get('groupLeader').value.function,
            companyName: this.eForm.get('company').value.name,
            companyAddress: this.eForm.get('company').value.legalAddress,
            distributionCompanyAddress: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value,
            autorizationNr: result.docNr,
            distributionCompanyName: this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').value,
            stagesOfManufacture: this.eForm.get('informatiiLoculDistributieAngro.etapeleDeFabricatie').value,
            medicamentHumanUse: this.eForm.get('humanUse').value,
            medicamentClinicalInvestigation: this.eForm.get('medicamentClinicalInvestigation').value,
            medicamentVeterinary: this.eForm.get('veterinary').value,
            laboratories: [],
            orderNr: '',
            autorizatedMedicamentsForProduction: [],
            qualifiedPersons: [],
            responsiblePersons: [],
            qualityControlPersons: [],
            preparateAseptic: [],
            sterilizateFinal: [],
            certificareaSeriei: [],
            produseNesterile: [],
            produseNesterileNumaiCertificareaSeriei: [],
            medicamenteBiologice: [],
            medicamenteBiologiceNumaiCertificareaSeriei: [],
            manufactures: [],
            substanceSterilization: [],
            otherManufactures: [],
            ambalarePrimara: [],
            ambalareSecundara: [],
            qualityControlTests: [],
            inspectionDate: result.inspectionDate,
            aplicationDomainOfLastInspection: result.aplicationDomainOfLastInspection,
            certificateNr: '',
            orderDate: '',
            licenseSeries: '',
            licenseNr: '',
            licenseDate: '',
            autorizationDate: '',
            qualityControlTestsImport: [],
            preparateAsepticImport: '',
            sterilizateFinalImport: '',
            produseNesterileImport: '',
            medicamenteBiologiceImport: [],
            otherImports: [],
        };
        this.laborators.forEach(t => model.laboratories.push({
            typeOfAnalysis: t.typeOfAnalysis,
            address: t.address,
            name: t.name
        }));
        this.authorizedManufacturedMedicaments.forEach(t => model.autorizatedMedicamentsForProduction.push({
            certificateHolder: t.authorizationHolderDescription,
            name: t.commercialName + ' ' + this.getConcatenatedDivision(t)
        }));
        this.qualifiedPersons.forEach(t => model.qualifiedPersons.push(t.lastName + ' ' + t.firstName));
        this.productionPersons.forEach(t => model.responsiblePersons.push(t.lastName + ' ' + t.firstName));
        this.qualityControlPersons.forEach(t => model.qualityControlPersons.push(t.lastName + ' ' + t.firstName));
        if (this.eForm.get('asepticPreparationsValues').value) {
            this.eForm.get('asepticPreparationsValues').value.forEach(t => model.preparateAseptic.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherAsepticPreparations) {
            this.otherAsepticPreparations.forEach(t => model.preparateAseptic.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('finalSterilizedValues').value) {
            this.eForm.get('finalSterilizedValues').value.forEach(t => model.sterilizateFinal.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherFinalSterilized) {
            this.otherFinalSterilized.forEach(t => model.sterilizateFinal.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('sterileCertifiedsValues').value) {
            this.eForm.get('sterileCertifiedsValues').value.forEach(t => model.certificareaSeriei.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherSterileCertifieds) {
            this.otherSterileCertifieds.forEach(t => model.certificareaSeriei.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('nesterilePreparationsValues').value) {
            this.eForm.get('nesterilePreparationsValues').value.forEach(t => model.produseNesterile.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherNesterilePreparations) {
            this.otherNesterilePreparations.forEach(t => model.produseNesterile.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('nesterilePreparationsCertifiedValues').value) {
            this.eForm.get('nesterilePreparationsCertifiedValues').value.forEach(t => model.produseNesterileNumaiCertificareaSeriei.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherNesterilePreparationsCertified) {
            this.otherNesterilePreparationsCertified.forEach(t => model.produseNesterileNumaiCertificareaSeriei.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('biologicalMedicinesValues').value) {
            this.eForm.get('biologicalMedicinesValues').value.forEach(t => model.medicamenteBiologice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherBiologicalMedicines) {
            this.otherBiologicalMedicines.forEach(t => model.medicamenteBiologice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('biologicalMedicinesCertifiedValues').value) {
            this.eForm.get('biologicalMedicinesCertifiedValues').value.forEach(t => model.medicamenteBiologiceNumaiCertificareaSeriei.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherBiologicalMedicinesCertified) {
            this.otherBiologicalMedicinesCertified.forEach(t => model.medicamenteBiologiceNumaiCertificareaSeriei.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('production').value) {
            this.eForm.get('production').value.forEach(t => model.manufactures.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherProductions) {
            this.otherProductions.forEach(t => model.manufactures.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('sterilization').value) {
            this.eForm.get('sterilization').value.forEach(t => model.substanceSterilization.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherSterilizations) {
            this.otherSterilizations.forEach(t => model.substanceSterilization.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherPreparationsOrProductions) {
            this.otherPreparationsOrProductions.forEach(t => model.otherManufactures.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('primaryPackaging').value) {
            this.eForm.get('primaryPackaging').value.forEach(t => model.ambalarePrimara.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherPrimaryPackagings) {
            this.otherPrimaryPackagings.forEach(t => model.ambalarePrimara.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('secondaryPackaging').value) {
            this.eForm.get('secondaryPackaging').value.forEach(t => model.ambalareSecundara.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.eForm.get('testsForQualityControl').value) {
            this.eForm.get('testsForQualityControl').value.forEach(t => model.qualityControlTests.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherTestsForQualityControl) {
            this.otherTestsForQualityControl.forEach(t => model.qualityControlTests.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        return model;
    }

    viewAFM() {
        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value) {
            this.errorHandlerService.showError('Adresa locului de fabricaţie trebuie introdusa.');
            return;
        }

        if (!this.eForm.get('humanUse').value && !this.eForm.get('medicamentClinicalInvestigation').value && !this.eForm.get('veterinary').value) {
            this.errorHandlerService.showError('Tipurile de medicamente fabricate trebuie selectate.');
            return;
        }

        const findDocTypeOGM = this.documents.find(t => t.docType.category == 'OGM');
        if (!findDocTypeOGM) {
            this.errorHandlerService.showError('Ordinul de inspectare al întreprinderii nu este atasat.');
            return;
        }

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '400px';

        dialogConfig2.data = {type: 'AFM'};

        const dialogRef = this.dialog.open(SelectInspectionDateForAfComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                const model = this.extractedModelLayouts(result);
                this.loadingService.show();
                this.subscriptions.push(this.documentService.viewAFM(model).subscribe(data => {
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
        });
    }

    getConcatenatedDivision(med: any) {
        let concatenatedDivision = '';
        if (med.division && med.volume && med.volumeQuantityMeasurement) {
            concatenatedDivision = concatenatedDivision + med.division + ' ' + med.volume + ' ' + med.volumeQuantityMeasurement + '; ';
        } else if (med.volume && med.volumeQuantityMeasurement) {
            concatenatedDivision = concatenatedDivision + med.volume + ' ' + med.volumeQuantityMeasurement + '; ';
        } else {
            concatenatedDivision = concatenatedDivision + med.division + '; ';
        }
        return concatenatedDivision;
    }

    remove(doc: any) {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                this.outDocuments.forEach((item, index) => {
                    if (item === doc) {
                        this.outDocuments.splice(index, 1);
                    }
                });
                this.save();
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

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}


