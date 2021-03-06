import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
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
import {UploadFileService} from '../../../shared/service/upload/upload-file.service';
import {saveAs} from 'file-saver';
import {GDPService} from '../../../shared/service/gdp.service';

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
    authDocuments: any[] = [];
    authHistory: any[] = [];
    reqTypes: any[];
    companyLicenseNotFound = false;
    initialData: any;
    asepticPreparations: any[];
    nesterilePreparations: any[];
    medicaments: any[] = [];
    authorizedManufacturedMedicaments: any[] = [];
    otherAsepticPreparations: any[] = [];
    otherClinicalAsepticPreparations: any[] = [];
    otherNesterilePreparations: any[] = [];
    otherClinicalNesterilePreparations: any[] = [];
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
    otherClinicalFinalSterilized: any[] = [];
    otherPrimaryPackagings: any[] = [];
    otherClinicalPrimaryPackagings: any[] = [];
    otherSterilizations: any[] = [];
    otherClinicalSterilizations: any[] = [];
    otherProductions: any[] = [];
    otherClinicalProductions: any[] = [];
    otherBiologicalMedicines: any[] = [];
    otherClinicalBiologicalMedicines: any[] = [];
    otherImportActivities: any[] = [];
    otherBiologicalMedicinesImport: any[] = [];
    otherNesterilePreparationsCertified: any[] = [];
    otherClinicalNesterilePreparationsCertified: any[] = [];
    otherBiologicalMedicinesCertified: any[] = [];
    otherClinicalBiologicalMedicinesCertified: any[] = [];
    otherSterileCertifieds: any[] = [];
    otherClinicalSterileCertifieds: any[] = [];
    otherPreparationsOrProductions: any[] = [];
    otherClinicalPreparationsOrProductions: any[] = [];
    otherTestsForQualityControl: any[] = [];
    otherClinicalTestsForQualityControl: any[] = [];
    subsidiaryList: any[] = [];
    selectedSubsidiaries: any[] = [];
    laborators: any[] = [];
    qualityControlPersons: any[] = [];
    qualifiedPersons: any[] = [];
    productionPersons: any[] = [];
    inspectorForm: FormGroup;
    selectedInspectors: any[] = [];
    paymentTotal: number;
    displayErrorNotActive = false;
    displayErrorNotSuspended = false;
    displayErrorNotActiveOrSuspended = false;
    displayErrorNotActiveEmitere = false;
    ogmDoc: any;

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private documentService: DocumentService,
                private navbarTitleService: NavbarTitleService,
                private medicamentService: MedicamentService,
                private taskService: TaskService,
                private authService: AuthService,
                private uploadService: UploadFileService,
                private loadingService: LoaderService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private licenseService: LicenseService,
                private gdpService: GDPService,
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
            'regSubject': [null],
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
            'dataEliberariiLic': {disabled: true, value: null},
            'dataExpirariiLic': {disabled: true, value: null},
            'asepticPreparationsValues': [null],
            'clinicalAsepticPreparationsValues': [null],
            'nesterilePreparationsValues': [null],
            'clinicalNesterilePreparationsValues': [null],
            'finalSterilizedValues': [null],
            'clinicalFinalSterilizedValues': [null],
            'production': [null],
            'clinicalProduction': [null],
            'primaryPackaging': [null],
            'clinicalPrimaryPackaging': [null],
            'gmpID': [null],
            'secondaryPackaging': [null],
            'clinicalSecondaryPackaging': [null],
            'sterilization': [null],
            'clinicalSterilization': [null],
            'testsForQualityControl': [null],
            'clinicalTestsForQualityControl': [null],
            'testsForQualityControlImport': [null],
            'biologicalMedicinesValues': [null],
            'clinicalBiologicalMedicinesValues': [null],
            'importActivities': [null],
            'biologicalMedicinesImport': [null],
            'nesterilePreparationsCertifiedValues': [null],
            'clinicalNesterilePreparationsCertifiedValues': [null],
            'biologicalMedicinesCertifiedValues': [null],
            'clinicalBiologicalMedicinesCertifiedValues': [null],
            'sterileCertifiedsValues': [null],
            'clinicalSterileCertifiedsValues': [null],
            'humanUse': [false],
            'medicamentClinicalInvestigation': [false],
            'veterinary': [false],
            'groupLeader': [null],
            'cause': [null],
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
            if (!this.eForm.get('type').value || (this.eForm.get('type').value.code != 'GMPE' && this.eForm.get('type').value.code != 'GMPM')) {
                this.eForm.get('veterinaryDetails').setValue(null);
                this.eForm.get('veterinaryDetails').disable();
            } else {
                if (val) {
                    this.eForm.get('veterinaryDetails').enable();
                } else {
                    this.eForm.get('veterinaryDetails').setValue(null);
                    this.eForm.get('veterinaryDetails').disable();
                }
            }
        });

        this.eForm.get('type').valueChanges.subscribe(val => {
            this.displayErrorNotActive = false;
            this.displayErrorNotActiveOrSuspended = false;
            this.displayErrorNotSuspended = false;
            this.displayErrorNotActiveEmitere = false;
            this.checkActiveAuthorisations();
            this.checkActiveAndSuspendedAuthorisations();
            this.checkSuspendedAuthorisations();
            if (!this.eForm.get('type').value || (this.eForm.get('type').value.code != 'GMPE' && this.eForm.get('type').value.code != 'GMPM')) {
                this.eForm.get('asepticPreparationsValues').disable();
                this.eForm.get('clinicalAsepticPreparationsValues').disable();
                this.eForm.get('finalSterilizedValues').disable();
                this.eForm.get('clinicalFinalSterilizedValues').disable();
                this.eForm.get('sterileCertifiedsValues').disable();
                this.eForm.get('clinicalSterileCertifiedsValues').disable();
                this.eForm.get('nesterilePreparationsValues').disable();
                this.eForm.get('clinicalNesterilePreparationsValues').disable();
                this.eForm.get('nesterilePreparationsCertifiedValues').disable();
                this.eForm.get('clinicalNesterilePreparationsCertifiedValues').disable();
                this.eForm.get('biologicalMedicinesValues').disable();
                this.eForm.get('clinicalBiologicalMedicinesValues').disable();
                this.eForm.get('biologicalMedicinesCertifiedValues').disable();
                this.eForm.get('clinicalBiologicalMedicinesCertifiedValues').disable();
                this.eForm.get('production').disable();
                this.eForm.get('clinicalProduction').disable();
                this.eForm.get('sterilization').disable();
                this.eForm.get('clinicalSterilization').disable();
                this.eForm.get('primaryPackaging').disable();
                this.eForm.get('clinicalPrimaryPackaging').disable();
                this.eForm.get('secondaryPackaging').disable();
                this.eForm.get('clinicalSecondaryPackaging').disable();
                this.eForm.get('testsForQualityControl').disable();
                this.eForm.get('clinicalTestsForQualityControl').disable();
                this.eForm.get('testsForQualityControlImport').disable();
                this.eForm.get('biologicalMedicinesImport').disable();
                this.eForm.get('importActivities').disable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').disable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').disable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionPostalCode').disable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionContactName').disable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionPhoneNumber').disable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionFax').disable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionMobileNumber').disable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionEmail').disable();
                this.eForm.get('informatiiLoculDistributieAngro.etapeleDeFabricatie').disable();
            } else {
                this.eForm.get('asepticPreparationsValues').enable();
                this.eForm.get('clinicalAsepticPreparationsValues').enable();
                this.eForm.get('finalSterilizedValues').enable();
                this.eForm.get('clinicalFinalSterilizedValues').enable();
                this.eForm.get('sterileCertifiedsValues').enable();
                this.eForm.get('clinicalSterileCertifiedsValues').enable();
                this.eForm.get('nesterilePreparationsValues').enable();
                this.eForm.get('clinicalNesterilePreparationsValues').enable();
                this.eForm.get('nesterilePreparationsCertifiedValues').enable();
                this.eForm.get('clinicalNesterilePreparationsCertifiedValues').enable();
                this.eForm.get('biologicalMedicinesValues').enable();
                this.eForm.get('clinicalBiologicalMedicinesValues').enable();
                this.eForm.get('biologicalMedicinesCertifiedValues').enable();
                this.eForm.get('clinicalBiologicalMedicinesCertifiedValues').enable();
                this.eForm.get('production').enable();
                this.eForm.get('clinicalProduction').enable();
                this.eForm.get('sterilization').enable();
                this.eForm.get('clinicalSterilization').enable();
                this.eForm.get('primaryPackaging').enable();
                this.eForm.get('clinicalPrimaryPackaging').enable();
                this.eForm.get('secondaryPackaging').enable();
                this.eForm.get('clinicalSecondaryPackaging').enable();
                this.eForm.get('testsForQualityControl').enable();
                this.eForm.get('clinicalTestsForQualityControl').enable();
                this.eForm.get('testsForQualityControlImport').enable();
                this.eForm.get('biologicalMedicinesImport').enable();
                this.eForm.get('importActivities').enable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').enable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').enable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionPostalCode').enable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionContactName').enable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionPhoneNumber').enable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionFax').enable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionMobileNumber').enable();
                this.eForm.get('informatiiLoculDistributieAngro.placeDistributionEmail').enable();
                this.eForm.get('informatiiLoculDistributieAngro.etapeleDeFabricatie').enable();
            }
            this.fillOutputDocuments();
            if (this.eForm.get('type').value && this.eForm.get('type').value.code != 'GMPE') {
                this.subscriptions.push(this.requestService.checkExistingAuthorization(this.eForm.get('company').value.id).subscribe(auth => {
                    if (auth.id) {
                        this.fillExistingAuthorizationDetails(auth, {
                            company: this.eForm.get('company').value,
                            type: this.eForm.get('type').value
                        }, false);
                    }
                }));
            }
        });
    }

    checkActiveAuthorisations() {
        if (this.eForm.get('type').value && (this.eForm.get('type').value.code == 'GMPS')) {
            let i = 0;
            for (const x of this.authDocuments) {
                if (x.statusCode == 'A') {
                    i++;
                }
            }
            if (i == 0) {
                this.displayErrorNotActive = true;
            }
        }
    }

    checkSuspendedAuthorisations() {
        if (this.eForm.get('type').value && this.eForm.get('type').value.code == 'GMPA') {
            let i = 0;
            for (const x of this.authDocuments) {
                if (x.statusCode == 'S') {
                    i++;
                }
            }
            if (i == 0) {
                this.displayErrorNotSuspended = true;
            }
        }
    }

    checkActiveAndSuspendedAuthorisations() {
        if (this.eForm.get('type').value && (this.eForm.get('type').value.code == 'GMPR' || this.eForm.get('type').value.code == 'GMPM'
            || this.eForm.get('type').value.code == 'GMPP' || this.eForm.get('type').value.code == 'GMPE')) {
            let i = 0;
            for (const x of this.authDocuments) {
                if (x.statusCode == 'A' || x.statusCode == 'S') {
                    i++;
                }
            }
            if (i == 0) {
                if (this.eForm.get('type').value.code != 'GMPE') {
                    this.displayErrorNotActiveOrSuspended = true;
                }
            } else {
                if (this.eForm.get('type').value.code == 'GMPE') {
                    this.displayErrorNotActiveEmitere = true;
                }
            }
        }
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Autorizație de fabricație a medicamentelor / Evaluare primara');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.loadGMPDetails(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.fillRequestDetails(data);
                        if (data.gmpAuthorizations && data.gmpAuthorizations.length > 0) {
                            this.eForm.get('gmpID').setValue(data.gmpAuthorizations[0].id);
                            this.fillGMPDetails(data);
                            this.loadAllQuickSearches(data, data.company, data.type);
                        } else {
                            this.subscriptions.push(this.requestService.checkExistingAuthorization(data.company.id).subscribe(auth => {
                                if (auth.id) {
                                    this.fillExistingAuthorizationDetails(auth, data, true);
                                } else {
                                    this.fillGMPDetails(data);
                                    this.loadAllQuickSearches(data, data.company, data.type);
                                }
                            }));
                        }
                    })
                );
            })
        );
    }

    fillExistingAuthorizationDetails(auth, data, loadSearches) {
        this.authDocuments = [];
        this.subscriptions.push(this.requestService.loadGMPDetails(auth.releaseRequestId).subscribe(request => {
            request.documents.forEach(t => {
                if (t.docType.category == 'AFM') {
                    t.status = this.getGMPStatus(new Date(auth.authorizationEndDate) < new Date() ? 'E' : auth.status, 'A');
                    t.statusCode = new Date(auth.authorizationEndDate) < new Date() ? 'E' : auth.status;
                    t.expiredDate = auth.authorizationEndDate;
                    this.authDocuments.push(t);
                }
                if (t.docType.category == 'CGM') {
                    t.status = this.getGMPStatus(new Date(auth.certificateEndDate) < new Date() ? 'E' : auth.status, 'C');
                    t.statusCode = new Date(auth.certificateEndDate) < new Date() ? 'E' : auth.status;
                    t.expiredDate = auth.certificateEndDate;
                    this.authDocuments.push(t);
                }
                if (t.docType.category == 'OGM') {
                    this.ogmDoc = t;
                }
            });
            this.authHistory = [];
            this.subscriptions.push(this.gdpService.loadAuthorizationsHistory(request.company.id).subscribe(history => {
                history.forEach(t => {
                    t.status = this.getGMPStatus(new Date(t.authorizationEndDate) < new Date() ? 'E' : t.status, 'A');
                    t.statusCode = new Date(t.authorizationEndDate) < new Date() ? 'E' : t.status;
                    t.expiredDate = t.authorizationEndDate;
                    t.docType = t.authorization.docType;
                    t.number = t.authorizationNumber;
                    t.dateOfIssue = t.authorizationStartDate;
                    t.path = t.authorization.path;
                    this.authHistory.push(t);
                });
            }));
            this.subscriptions.push(this.gdpService.loadCertificatesHistory(request.company.id).subscribe(history => {
                history.forEach(t => {
                    t.status = this.getGMPStatus(new Date(t.certificateEndDate) < new Date() ? 'E' : t.status, 'C');
                    t.statusCode = new Date(t.certificateEndDate) < new Date() ? 'E' : t.status;
                    t.expiredDate = t.certificateEndDate;
                    t.docType = t.certification.docType;
                    t.number = t.certificateNumber;
                    t.dateOfIssue = t.certificateStartDate;
                    t.path = t.certification.path;
                    this.authHistory.push(t);
                });
            }));
            request.gmpAuthorizations[0].periods.forEach(t => t.id = null);
            request.gmpAuthorizations[0].qualifiedPersons.forEach(t => t.id = null);
            request.gmpAuthorizations[0].laboratories.forEach(t => t.id = null);
            this.fillGMPDetails(request);
            if (loadSearches) {
                this.loadAllQuickSearches(request, data.company, data.type);
            }
        }));
    }

    getGMPStatus(status, type) {
        if (type == 'A') {
            if (status == 'A') {
                return 'Activa';
            } else if (status == 'S') {
                return 'Suspendata';
            } else if (status == 'R') {
                return 'Retrasa';
            } else if (status == 'E') {
                return 'Expirata';
            }
        } else if (type == 'C') {
            if (status == 'A') {
                return 'Activ';
            } else if (status == 'S') {
                return 'Suspendat';
            } else if (status == 'R') {
                return 'Retras';
            } else if (status == 'E') {
                return 'Expirat';
            }
        }
    }

    fillOutputDocuments() {
        this.outDocuments = [];
        if (this.docTypesInitial && this.eForm.get('type').value && (this.eForm.get('type').value.code == 'GMPE' || this.eForm.get('type').value.code == 'GMPM'
            || this.eForm.get('type').value.code == 'GMPP')) {
            if (!this.outDocuments.find(t => t.docType.category == 'OGM') && (this.eForm.get('type').value.code == 'GMPE' || this.eForm.get('type').value.code == 'GMPM')) {
                this.outDocuments.push({
                    name: 'Ordinul de inspectare al întreprinderii',
                    docType: this.docTypesInitial.find(r => r.category == 'OGM'),
                    date: new Date()
                });
            }
            if (!this.outDocuments.find(t => t.docType.category == 'AFM') && (this.eForm.get('type').value.code == 'GMPE' || this.eForm.get('type').value.code == 'GMPM')) {
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
        }
    }

    loadAllQuickSearches(dataDB: any, company: any, type: any) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('43', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                const splitted = step.availableDocTypes.split(',');
                                this.docTypes = this.docTypes.filter(r => splitted.some(x => x == r.category));
                                this.fillOutputDocuments();
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
                    this.eForm.get('typeFara').setValue(this.reqTypes.find(t => t.processId == 12 && t.code == 'GMPF'));
                    this.reqTypes = this.reqTypes.filter(t => t.processId == 12 && t.code != 'GMPF');
                    if (dataDB.type) {
                        this.eForm.get('type').setValue(this.reqTypes.find(r => r.id === type.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.licenseService.retrieveLicenseByIdnoFillStateName(company.idno).subscribe(data => {
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
                        const clinicalArrAseptic: any[] = [];
                        const clinicalArrFinalSterilized: any[] = [];
                        const clinicalArrSterileCertifieds: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].sterileProducts) {
                            if (z.type && z.type == 'C') {
                                if (z.category == 'P') {
                                    if (z.sterileProduct) {
                                        clinicalArrAseptic.push(z.sterileProduct);
                                    } else {
                                        this.otherClinicalAsepticPreparations.push({description: z.description});
                                    }
                                } else if (z.category == 'S') {
                                    if (z.sterileProduct) {
                                        clinicalArrFinalSterilized.push(z.sterileProduct);
                                    } else {
                                        this.otherClinicalFinalSterilized.push({description: z.description});
                                    }
                                } else if (z.category == 'C') {
                                    if (z.sterileProduct) {
                                        clinicalArrSterileCertifieds.push(z.sterileProduct);
                                    } else {
                                        this.otherClinicalSterileCertifieds.push({description: z.description});
                                    }
                                }
                            } else {
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
                        }
                        this.eForm.get('finalSterilizedValues').setValue(arrFinalSterilized);
                        this.eForm.get('asepticPreparationsValues').setValue(arrAseptic);
                        this.eForm.get('sterileCertifiedsValues').setValue(arrSterileCertifieds);
                        this.eForm.get('clinicalFinalSterilizedValues').setValue(clinicalArrFinalSterilized);
                        this.eForm.get('clinicalAsepticPreparationsValues').setValue(clinicalArrAseptic);
                        this.eForm.get('clinicalSterileCertifiedsValues').setValue(clinicalArrSterileCertifieds);
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
                        const arrClinicalNesterilePreparations: any[] = [];
                        const arrClinicalNesterilePreparationsCertified: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].neSterileProducts) {
                            if (z.type && z.type == 'C') {
                                if (z.category == 'N') {
                                    if (z.nesterileProduct) {
                                        arrClinicalNesterilePreparations.push(z.nesterileProduct);
                                    } else {
                                        this.otherClinicalNesterilePreparations.push({description: z.description});
                                    }
                                } else if (z.category == 'C') {
                                    if (z.nesterileProduct) {
                                        arrClinicalNesterilePreparationsCertified.push(z.nesterileProduct);
                                    } else {
                                        this.otherClinicalNesterilePreparationsCertified.push({description: z.description});
                                    }
                                }
                            } else {
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
                        }
                        this.eForm.get('nesterilePreparationsValues').setValue(arrNesterilePreparations);
                        this.eForm.get('nesterilePreparationsCertifiedValues').setValue(arrNesterilePreparationsCertified);
                        this.eForm.get('clinicalNesterilePreparationsValues').setValue(arrClinicalNesterilePreparations);
                        this.eForm.get('clinicalNesterilePreparationsCertifiedValues').setValue(arrClinicalNesterilePreparationsCertified);
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
                        const arrClinicalBiologicalMedicines: any[] = [];
                        const arrClinicalBiologicalMedicinesCertified: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].biologicalMedicines) {
                            if (z.type && z.type == 'C') {
                                if (z.category == 'B') {
                                    if (z.biologicalMedicine) {
                                        arrClinicalBiologicalMedicines.push(z.biologicalMedicine);
                                    } else {
                                        this.otherClinicalBiologicalMedicines.push({description: z.description});
                                    }
                                } else if (z.category == 'C') {
                                    if (z.biologicalMedicine) {
                                        arrClinicalBiologicalMedicinesCertified.push(z.biologicalMedicine);
                                    } else {
                                        this.otherClinicalBiologicalMedicinesCertified.push({description: z.description});
                                    }
                                }
                            } else {
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
                        }
                        this.eForm.get('biologicalMedicinesValues').setValue(arrBiologicalMedicines);
                        this.eForm.get('biologicalMedicinesCertifiedValues').setValue(arrBiologicalMedicinesCertified);
                        this.eForm.get('clinicalBiologicalMedicinesValues').setValue(arrClinicalBiologicalMedicines);
                        this.eForm.get('clinicalBiologicalMedicinesCertifiedValues').setValue(arrClinicalBiologicalMedicinesCertified);
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
                        const arrClinicalManufactures: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].manufactures) {
                            if (z.type && z.type == 'C') {
                                if (z.manufacture) {
                                    arrClinicalManufactures.push(z.manufacture);
                                } else {
                                    if (z.category == 'O') {
                                        this.otherClinicalProductions.push({description: z.description});
                                    } else if (z.category == 'OP') {
                                        this.otherClinicalPreparationsOrProductions.push({description: z.description});
                                    }
                                }
                            } else {
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
                        }
                        this.eForm.get('production').setValue(arrManufactures);
                        this.eForm.get('clinicalProduction').setValue(arrClinicalManufactures);
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
                        const arrClinicalSterilizations: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].sterilizations) {
                            if (z.type && z.type == 'C') {
                                if (z.sterilization) {
                                    arrClinicalSterilizations.push(z.sterilization);
                                } else {
                                    this.otherClinicalSterilizations.push({description: z.description});
                                }
                            } else {
                                if (z.sterilization) {
                                    arrSterilizations.push(z.sterilization);
                                } else {
                                    this.otherSterilizations.push({description: z.description});
                                }
                            }
                        }
                        this.eForm.get('sterilization').setValue(arrSterilizations);
                        this.eForm.get('clinicalSterilization').setValue(arrClinicalSterilizations);
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
                        const arrClinicalPrimaryPackagings: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].primaryPackagings) {
                            if (z.type && z.type == 'C') {
                                if (z.primaryPackaging) {
                                    arrClinicalPrimaryPackagings.push(z.primaryPackaging);
                                } else {
                                    this.otherClinicalPrimaryPackagings.push({description: z.description});
                                }
                            } else {
                                if (z.primaryPackaging) {
                                    arrPrimaryPackagings.push(z.primaryPackaging);
                                } else {
                                    this.otherPrimaryPackagings.push({description: z.description});
                                }
                            }
                        }
                        this.eForm.get('primaryPackaging').setValue(arrPrimaryPackagings);
                        this.eForm.get('clinicalPrimaryPackaging').setValue(arrClinicalPrimaryPackagings);
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
                        const arrClinicalSecondaryPackagings: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].secondaryPackagings) {
                            if (z.type && z.type == 'C') {
                                if (z.secondaryPackaging) {
                                    arrClinicalSecondaryPackagings.push(z.secondaryPackaging);
                                }
                            } else {
                                if (z.secondaryPackaging) {
                                    arrSecondaryPackagings.push(z.secondaryPackaging);
                                }
                            }
                        }
                        this.eForm.get('secondaryPackaging').setValue(arrSecondaryPackagings);
                        this.eForm.get('clinicalSecondaryPackaging').setValue(arrClinicalSecondaryPackagings);
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
                        const arrClinicalTestsForQualityControl: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].testsForQualityControl) {
                            if (z.type && z.type == 'C') {
                                if (z.testQualityControl) {
                                    arrClinicalTestsForQualityControl.push(z.testQualityControl);
                                } else {
                                    this.otherClinicalTestsForQualityControl.push({description: z.description});
                                }
                            } else {
                                if (z.testQualityControl) {
                                    arrTestsForQualityControl.push(z.testQualityControl);
                                } else {
                                    this.otherTestsForQualityControl.push({description: z.description});
                                }
                            }
                        }
                        this.eForm.get('testsForQualityControl').setValue(arrTestsForQualityControl);
                        this.eForm.get('clinicalTestsForQualityControl').setValue(arrClinicalTestsForQualityControl);
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
            this.administrationService.getManufacturersByIDNO(company.idno).subscribe(data => {
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
        this.eForm.get('id').setValue(data.id);
        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
        this.eForm.get('initiator').setValue(data.initiator);
        this.eForm.get('startDate').setValue(data.startDate);
        this.eForm.get('regSubject').setValue(data.regSubject);
        this.eForm.get('startDateValue').setValue(new Date(data.startDate));
        this.eForm.get('requestNumber').setValue(data.requestNumber);
        this.eForm.get('requestHistories').setValue(data.requestHistories);
        this.eForm.get('company').setValue(data.company);
        this.eForm.get('companyValue').setValue(data.company.name);
        this.outDocuments = data.outputDocuments;
        this.checkOutputDocumentsStatus();
        this.documents = data.documents;
        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
            cis.address = cis.locality.stateName + ', ' + cis.locality.description + ', ' + cis.street;
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
            this.purgeForm((this.inspectorForm.get('periods') as FormArray));
            if (dataDB.gmpAuthorizations[0].periods.length > 0) {
                dataDB.gmpAuthorizations[0].periods.forEach(p => (this.inspectorForm.get('periods') as FormArray).push(this.createPeriod(p)));
            }
            this.laborators = dataDB.gmpAuthorizations[0].laboratories;
            this.qualifiedPersons = [];
            this.qualityControlPersons = [];
            this.productionPersons = [];
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
            this.authorizedManufacturedMedicaments = [];
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
            this.selectedSubsidiaries = [];
            dataDB.gmpAuthorizations[0].subsidiaries.forEach(t =>
                this.selectedSubsidiaries.push(t.subsidiary)
            );
            this.normalizeSubsidiaryFromDB();
        }
    }

    purgeForm(form: FormArray) {
        while (0 !== form.length) {
            form.removeAt(0);
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
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    fillGMPAuthorization() {
        const gmpAuthorization = {
            id: this.eForm.get('gmpID').value,
            status: 'P',
            cause: this.eForm.get('cause').value,
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
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'P', type: 'U'});
            }
        }
        if (this.otherAsepticPreparations.length != 0) {
            for (const w of this.otherAsepticPreparations) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'P', type: 'U'});
            }
        }

        if (this.eForm.get('clinicalAsepticPreparationsValues').value) {
            for (const w of this.eForm.get('clinicalAsepticPreparationsValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'P', type: 'C'});
            }
        }
        if (this.otherClinicalAsepticPreparations.length != 0) {
            for (const w of this.otherClinicalAsepticPreparations) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'P', type: 'C'});
            }
        }

        if (this.eForm.get('finalSterilizedValues').value) {
            for (const w of this.eForm.get('finalSterilizedValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'S', type: 'U'});
            }
        }
        if (this.otherFinalSterilized.length != 0) {
            for (const w of this.otherFinalSterilized) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'S', type: 'U'});
            }
        }

        if (this.eForm.get('clinicalFinalSterilizedValues').value) {
            for (const w of this.eForm.get('clinicalFinalSterilizedValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'S', type: 'C'});
            }
        }
        if (this.otherClinicalFinalSterilized.length != 0) {
            for (const w of this.otherClinicalFinalSterilized) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'S', type: 'C'});
            }
        }

        if (this.eForm.get('sterileCertifiedsValues').value) {
            for (const w of this.eForm.get('sterileCertifiedsValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'C', type: 'U'});
            }
        }
        if (this.otherSterileCertifieds.length != 0) {
            for (const w of this.otherSterileCertifieds) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'C', type: 'U'});
            }
        }

        if (this.eForm.get('clinicalSterileCertifiedsValues').value) {
            for (const w of this.eForm.get('clinicalSterileCertifiedsValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'C', type: 'C'});
            }
        }
        if (this.otherClinicalSterileCertifieds.length != 0) {
            for (const w of this.otherClinicalSterileCertifieds) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'C', type: 'C'});
            }
        }

        // if (this.eForm.get('finalSterilizedValues').value) {
        //     for (const w of this.eForm.get('finalSterilizedValues').value) {
        //         gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'S'});
        //     }
        // }

        // produse nesterile
        if (this.eForm.get('nesterilePreparationsValues').value) {
            for (const w of this.eForm.get('nesterilePreparationsValues').value) {
                gmpAuthorization.neSterileProducts.push({nesterileProduct: w, category: 'N', type: 'U'});
            }
        }
        if (this.otherNesterilePreparations.length != 0) {
            for (const w of this.otherNesterilePreparations) {
                gmpAuthorization.neSterileProducts.push({description: w.description, category: 'N', type: 'U'});
            }
        }
        if (this.eForm.get('clinicalNesterilePreparationsValues').value) {
            for (const w of this.eForm.get('clinicalNesterilePreparationsValues').value) {
                gmpAuthorization.neSterileProducts.push({nesterileProduct: w, category: 'N', type: 'C'});
            }
        }
        if (this.otherClinicalNesterilePreparations.length != 0) {
            for (const w of this.otherClinicalNesterilePreparations) {
                gmpAuthorization.neSterileProducts.push({description: w.description, category: 'N', type: 'C'});
            }
        }
        if (this.eForm.get('nesterilePreparationsCertifiedValues').value) {
            for (const w of this.eForm.get('nesterilePreparationsCertifiedValues').value) {
                gmpAuthorization.neSterileProducts.push({nesterileProduct: w, category: 'C', type: 'U'});
            }
        }
        if (this.otherNesterilePreparationsCertified.length != 0) {
            for (const w of this.otherNesterilePreparationsCertified) {
                gmpAuthorization.neSterileProducts.push({description: w.description, category: 'C', type: 'U'});
            }
        }
        if (this.eForm.get('clinicalNesterilePreparationsCertifiedValues').value) {
            for (const w of this.eForm.get('clinicalNesterilePreparationsCertifiedValues').value) {
                gmpAuthorization.neSterileProducts.push({nesterileProduct: w, category: 'C', type: 'C'});
            }
        }
        if (this.otherClinicalNesterilePreparationsCertified.length != 0) {
            for (const w of this.otherClinicalNesterilePreparationsCertified) {
                gmpAuthorization.neSterileProducts.push({description: w.description, category: 'C', type: 'C'});
            }
        }

        // medicamente biologice
        if (this.eForm.get('biologicalMedicinesValues').value) {
            for (const w of this.eForm.get('biologicalMedicinesValues').value) {
                gmpAuthorization.biologicalMedicines.push({biologicalMedicine: w, category: 'B', type: 'U'});
            }
        }
        if (this.otherBiologicalMedicines.length != 0) {
            for (const w of this.otherBiologicalMedicines) {
                gmpAuthorization.biologicalMedicines.push({description: w.description, category: 'B', type: 'U'});
            }
        }
        if (this.eForm.get('clinicalBiologicalMedicinesValues').value) {
            for (const w of this.eForm.get('clinicalBiologicalMedicinesValues').value) {
                gmpAuthorization.biologicalMedicines.push({biologicalMedicine: w, category: 'B', type: 'C'});
            }
        }
        if (this.otherClinicalBiologicalMedicines.length != 0) {
            for (const w of this.otherClinicalBiologicalMedicines) {
                gmpAuthorization.biologicalMedicines.push({description: w.description, category: 'B', type: 'C'});
            }
        }
        if (this.eForm.get('biologicalMedicinesCertifiedValues').value) {
            for (const w of this.eForm.get('biologicalMedicinesCertifiedValues').value) {
                gmpAuthorization.biologicalMedicines.push({biologicalMedicine: w, category: 'C', type: 'U'});
            }
        }
        if (this.otherBiologicalMedicinesCertified.length != 0) {
            for (const w of this.otherBiologicalMedicinesCertified) {
                gmpAuthorization.biologicalMedicines.push({description: w.description, category: 'C', type: 'U'});
            }
        }
        if (this.eForm.get('clinicalBiologicalMedicinesCertifiedValues').value) {
            for (const w of this.eForm.get('clinicalBiologicalMedicinesCertifiedValues').value) {
                gmpAuthorization.biologicalMedicines.push({biologicalMedicine: w, category: 'C', type: 'C'});
            }
        }
        if (this.otherClinicalBiologicalMedicinesCertified.length != 0) {
            for (const w of this.otherClinicalBiologicalMedicinesCertified) {
                gmpAuthorization.biologicalMedicines.push({description: w.description, category: 'C', type: 'C'});
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
                gmpAuthorization.manufactures.push({manufacture: w, category: 'P', type: 'U'});
            }
        }
        if (this.otherProductions.length != 0) {
            for (const w of this.otherProductions) {
                gmpAuthorization.manufactures.push({description: w.description, category: 'O', type: 'U'});
            }
        }
        if (this.otherPreparationsOrProductions.length != 0) {
            for (const w of this.otherPreparationsOrProductions) {
                gmpAuthorization.manufactures.push({description: w.description, category: 'OP', type: 'U'});
            }
        }
        if (this.eForm.get('clinicalProduction').value) {
            for (const w of this.eForm.get('clinicalProduction').value) {
                gmpAuthorization.manufactures.push({manufacture: w, category: 'P', type: 'C'});
            }
        }
        if (this.otherClinicalProductions.length != 0) {
            for (const w of this.otherClinicalProductions) {
                gmpAuthorization.manufactures.push({description: w.description, category: 'O', type: 'C'});
            }
        }
        if (this.otherClinicalPreparationsOrProductions.length != 0) {
            for (const w of this.otherClinicalPreparationsOrProductions) {
                gmpAuthorization.manufactures.push({description: w.description, category: 'OP', type: 'C'});
            }
        }

        // sterilizari
        if (this.eForm.get('sterilization').value) {
            for (const w of this.eForm.get('sterilization').value) {
                gmpAuthorization.sterilizations.push({sterilization: w, type: 'U'});
            }
        }
        if (this.otherSterilizations.length != 0) {
            for (const w of this.otherSterilizations) {
                gmpAuthorization.sterilizations.push({description: w.description, type: 'U'});
            }
        }
        if (this.eForm.get('clinicalSterilization').value) {
            for (const w of this.eForm.get('clinicalSterilization').value) {
                gmpAuthorization.sterilizations.push({sterilization: w, type: 'C'});
            }
        }
        if (this.otherClinicalSterilizations.length != 0) {
            for (const w of this.otherClinicalSterilizations) {
                gmpAuthorization.sterilizations.push({description: w.description, type: 'C'});
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
                gmpAuthorization.primaryPackagings.push({primaryPackaging: w, type: 'U'});
            }
        }
        if (this.otherPrimaryPackagings.length != 0) {
            for (const w of this.otherPrimaryPackagings) {
                gmpAuthorization.primaryPackagings.push({description: w.description, type: 'U'});
            }
        }
        if (this.eForm.get('clinicalPrimaryPackaging').value) {
            for (const w of this.eForm.get('clinicalPrimaryPackaging').value) {
                gmpAuthorization.primaryPackagings.push({primaryPackaging: w, type: 'C'});
            }
        }
        if (this.otherClinicalPrimaryPackagings.length != 0) {
            for (const w of this.otherClinicalPrimaryPackagings) {
                gmpAuthorization.primaryPackagings.push({description: w.description, type: 'C'});
            }
        }
        // ambalare secundara
        if (this.eForm.get('secondaryPackaging').value) {
            for (const w of this.eForm.get('secondaryPackaging').value) {
                gmpAuthorization.secondaryPackagings.push({secondaryPackaging: w, type: 'U'});
            }
        }
        if (this.eForm.get('clinicalSecondaryPackaging').value) {
            for (const w of this.eForm.get('clinicalSecondaryPackaging').value) {
                gmpAuthorization.secondaryPackagings.push({secondaryPackaging: w, type: 'C'});
            }
        }


        // teste pentru controlul calitatii
        if (this.eForm.get('testsForQualityControl').value) {
            for (const w of this.eForm.get('testsForQualityControl').value) {
                gmpAuthorization.testsForQualityControl.push({testQualityControl: w, type: 'U'});
            }
        }
        if (this.eForm.get('clinicalTestsForQualityControl').value) {
            for (const w of this.eForm.get('clinicalTestsForQualityControl').value) {
                gmpAuthorization.testsForQualityControl.push({testQualityControl: w, type: 'C'});
            }
        }
        if (this.eForm.get('testsForQualityControlImport').value) {
            for (const w of this.eForm.get('testsForQualityControlImport').value) {
                gmpAuthorization.testsForQualityControlImport.push({testQualityControl: w});
            }
        }
        if (this.otherTestsForQualityControl.length != 0) {
            for (const w of this.otherTestsForQualityControl) {
                gmpAuthorization.testsForQualityControl.push({description: w.description, type: 'U'});
            }
        }
        if (this.otherClinicalTestsForQualityControl.length != 0) {
            for (const w of this.otherClinicalTestsForQualityControl) {
                gmpAuthorization.testsForQualityControl.push({description: w.description, type: 'C'});
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

        this.checkActiveAuthorisations();
        if (this.displayErrorNotActive) {
            this.errorHandlerService.showError('Operatiunea - suspendare nu poate fi executata, nu a fost gasita nici o autorizatie activa');
            return;
        }
        if (this.displayErrorNotActiveEmitere) {
            this.errorHandlerService.showError('Operatiunea - emitere nu poate fi executata, exista deja autorizatie emisa');
            return;
        }

        this.checkActiveAndSuspendedAuthorisations();
        if (this.displayErrorNotActiveOrSuspended && this.eForm.get('type').value.code == 'GMPR') {
            this.errorHandlerService.showError('Operatiunea - retragere nu poate fi executata, nu a fost gasita nici o autorizatie activa sau suspendata');
            return;
        }
        if (this.displayErrorNotActiveOrSuspended && this.eForm.get('type').value.code == 'GMPM') {
            this.errorHandlerService.showError('Operatiunea - modificare nu poate fi executata, nu a fost gasita nici o autorizatie activa sau suspendata');
            return;
        }
        if (this.displayErrorNotActiveOrSuspended && this.eForm.get('type').value.code == 'GMPP') {
            this.errorHandlerService.showError('Operatiunea - prelungire certificat nu poate fi executata, nu a fost gasita nici o autorizatie activa sau suspendata');
            return;
        }

        this.checkSuspendedAuthorisations();
        if (this.displayErrorNotSuspended) {
            this.errorHandlerService.showError('Operatiunea - activare nu poate fi executata, nu a fost gasita nici o autorizatie suspendata');
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

        if (this.eForm.get('type').value.code == 'GMPE' || this.eForm.get('type').value.code == 'GMPM') {
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
        }

        if (!this.eForm.get('cause').value && (this.eForm.get('type').value.code == 'GMPS' || this.eForm.get('type').value.code == 'GMPR')) {
            this.errorHandlerService.showError('Cauza trebuie introdusa');
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

        if (this.eForm.get('type').value.code == 'GMPS') {
            this.subscriptions.push(this.requestService.suspendGMPRequest(modelToSubmit).subscribe(data => {
                    this.loadingService.hide();
                    this.router.navigate(['dashboard/homepage']);
                }, error => this.loadingService.hide())
            );
        } else if (this.eForm.get('type').value.code == 'GMPR') {
            this.subscriptions.push(this.requestService.retragereGMPRequest(modelToSubmit).subscribe(data => {
                    this.loadingService.hide();
                    this.router.navigate(['dashboard/homepage']);
                }, error => this.loadingService.hide())
            );
        } else if (this.eForm.get('type').value.code == 'GMPA') {
            this.subscriptions.push(this.requestService.activareGMPRequest(modelToSubmit).subscribe(data => {
                    this.loadingService.hide();
                    this.router.navigate(['dashboard/homepage']);
                }, error => this.loadingService.hide())
            );
        } else if (this.eForm.get('type').value.code == 'GMPM') {
            this.subscriptions.push(this.requestService.modificareGMPRequest(modelToSubmit).subscribe(data => {
                    this.loadingService.hide();
                    this.router.navigate(['dashboard/homepage']);
                }, error => this.loadingService.hide())
            );
        } else if (this.eForm.get('type').value.code == 'GMPP') {
            this.subscriptions.push(this.requestService.prelungireGMPRequest(modelToSubmit).subscribe(data => {
                    this.loadingService.hide();
                    this.router.navigate(['dashboard/homepage']);
                }, error => this.loadingService.hide())
            );
        } else {
            this.subscriptions.push(this.requestService.finishGMPRequest(modelToSubmit).subscribe(data => {
                    this.loadingService.hide();
                    this.router.navigate(['dashboard/homepage']);
                }, error => this.loadingService.hide())
            );
        }
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
                    regSubject: this.eForm.get('regSubject').value,
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

    addClinicalAsepticPreparation() {
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
                    this.otherClinicalAsepticPreparations.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeAsepticPreparation(index: number) {
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

    removeClinicalAsepticPreparation(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast preparat?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalAsepticPreparations.splice(index, 1);
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

    addClinicalFinalSterilized() {
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
                    this.otherClinicalFinalSterilized.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeFinalSterilized(index: number) {
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

    removeClinicalFinalSterilized(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalFinalSterilized.splice(index, 1);
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

    addClinicalSterileCertified() {
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
                    this.otherClinicalSterileCertifieds.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeOtherSterileCertified(index: number) {
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

    removeOtherClinicalSterileCertified(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalSterileCertifieds.splice(index, 1);
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

    addClinicalNesterileProducts() {
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
                    this.otherClinicalNesterilePreparations.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeNesterileProducts(index: number) {
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

    removeClinicalNesterileProducts(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalNesterilePreparations.splice(index, 1);
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

    addClinicalNesterilePreparationsCertified() {
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
                    this.otherClinicalNesterilePreparationsCertified.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeNesterilePreparationsCertified(index: number) {
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

    removeClinicalNesterilePreparationsCertified(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalNesterilePreparationsCertified.splice(index, 1);
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

    addClinicalBiologicalMedicines() {
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
                    this.otherClinicalBiologicalMedicines.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeBiologicalMedicines(index: number) {
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

    removeClinicalBiologicalMedicines(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast medicament?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalBiologicalMedicines.splice(index, 1);
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

    addClinicalBiologicalMedicinesCertified() {
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
                    this.otherClinicalBiologicalMedicinesCertified.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeBiologicalMedicinesCertified(index: number) {
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

    removeClinicalBiologicalMedicinesCertified(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast medicament?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalBiologicalMedicinesCertified.splice(index, 1);
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

    addClinicalProduction() {
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
                    this.otherClinicalProductions.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeProduction(index: number) {
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

    removeClinicalProduction(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta fabricatie?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalProductions.splice(index, 1);
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

    addClinicalSterilization() {
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
                    this.otherClinicalSterilizations.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeSterilization(index: number) {
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

    removeClinicalSterilization(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta sterilizare?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalSterilizations.splice(index, 1);
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

    addClinicalPreparationsOrProductions() {
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
                    this.otherClinicalPreparationsOrProductions.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removePreparationsOrProductions(index: number) {
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

    removeClinicalPreparationsOrProductions(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs/fabricaţie?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalPreparationsOrProductions.splice(index, 1);
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

    addClinicalPrimaryPackaging() {
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
                    this.otherClinicalPrimaryPackagings.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removePrimaryPackaging(index: number) {
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

    removeClinicalPrimaryPackaging(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta ambalare?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalPrimaryPackagings.splice(index, 1);
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

    addClinicalTestsForQualityControl() {
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
                    this.otherClinicalTestsForQualityControl.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeTestsForQualityControl(index: number) {
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

    removeClinicalTestsForQualityControl(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast test?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherClinicalTestsForQualityControl.splice(index, 1);
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
                selectedSubsidiaries: this.selectedSubsidiaries,
                type: 'GMP'
            },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectedSubsidiaries = result;
                if (this.selectedSubsidiaries && this.selectedSubsidiaries.length > 0) {
                    this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').setValue(this.selectedSubsidiaries[0].companyType);
                    this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').setValue(this.selectedSubsidiaries[0].address);
                }
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

        let magicNumber = '';
        for (const outDoc of this.outDocuments) {
            if (magicNumber < outDoc.number) {
                magicNumber = outDoc.number;
            }
        }
        const magicNumbers = magicNumber.split('-');

        let nrOrdDoc = 1;
        if (magicNumbers && magicNumbers.length > 2) {
            nrOrdDoc = Number(magicNumbers[3]) + 1;
        }

        const dialogRef2 = this.dialog.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            height: '800px',
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA_GMP',
                startDate: this.eForm.get('startDate').value,
                nrOrdDoc: nrOrdDoc,
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

        let magicNumber = '';
        for (const outDoc of this.outDocuments) {
            if (magicNumber < outDoc.number) {
                magicNumber = outDoc.number;
            }
        }
        const magicNumbers = magicNumber.split('-');

        let nrOrdDoc = 1;
        if (magicNumbers && magicNumbers.length > 2) {
            nrOrdDoc = Number(magicNumbers[3]) + 1;
        }

        const dialogRef2 = this.dialog.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            height: '800px',
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'REQUEST_REMOVAL_DEFICIENCIES_GMP',
                startDate: this.eForm.get('startDate').value,
                nrOrdDoc: nrOrdDoc,
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

        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').value) {
            this.errorHandlerService.showError('Numele locului de fabricație trebuie introdus.');
            return;
        }

        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value) {
            this.errorHandlerService.showError('Adresa locului de fabricaţie trebuie introdusa.');
            return;
        }

        if (!this.eForm.get('informatiiLoculDistributieAngro.etapeleDeFabricatie').value) {
            this.errorHandlerService.showError('Etapele de fabricaţie trebuie introduse.');
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
        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').value) {
            this.errorHandlerService.showError('Numele locului de fabricație trebuie introdus.');
            return;
        }

        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value) {
            this.errorHandlerService.showError('Adresa locului de fabricaţie trebuie introdusa.');
            return;
        }

        if (!this.eForm.get('informatiiLoculDistributieAngro.etapeleDeFabricatie').value) {
            this.errorHandlerService.showError('Etapele de fabricaţie trebuie introduse.');
            return;
        }

        if (!this.eForm.get('humanUse').value && !this.eForm.get('medicamentClinicalInvestigation').value && !this.eForm.get('veterinary').value) {
            this.errorHandlerService.showError('Tipurile de medicamente fabricate trebuie selectate.');
            return;
        }

        let orderNumber = null;
        let orderDateOfIssue = null;
        let authorizationNumber = null;
        let authorizationDateOfIssue = null;
        if (this.eForm.get('type').value.code == 'GMPP') {
            orderNumber = this.ogmDoc.number;
            orderDateOfIssue = this.ogmDoc.dateOfIssue;
            const findDocTypeAFM = this.authDocuments.find(t => t.docType.category == 'AFM');
            authorizationNumber = findDocTypeAFM.number;
            authorizationDateOfIssue = findDocTypeAFM.dateOfIssue;
        } else {
            const findDocTypeOGM = this.documents.find(t => t.docType.category == 'OGM');
            if (!findDocTypeOGM && this.eForm.get('type').value.code == 'GMPE') {
                this.errorHandlerService.showError('Ordinul de inspectare al întreprinderii nu este atasat.');
                return;
            }

            const findDocTypeAFM = this.documents.find(t => t.docType.category == 'AFM');
            if (!findDocTypeAFM) {
                this.errorHandlerService.showError('Autorizatia de fabricatie nu este atasata.');
                return;
            }
            orderNumber = findDocTypeOGM.number;
            orderDateOfIssue = findDocTypeOGM.dateOfIssue;
            authorizationNumber = findDocTypeAFM.number;
            authorizationDateOfIssue = findDocTypeAFM.dateOfIssue;
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
                model.orderDate = orderDateOfIssue;
                model.orderNr = orderNumber;
                model.licenseSeries = this.eForm.get('seria').value;
                model.licenseNr = this.eForm.get('nrLic').value;
                model.licenseDate = this.eForm.get('dataEliberariiLic').value;
                model.autorizationDate = authorizationDateOfIssue;
                model.qualityControlTestsImport = [];
                model.preparateAsepticImport = this.eForm.get('asepticallyPrepared').value;
                model.sterilizateFinalImport = this.eForm.get('terminallySterilised').value;
                model.produseNesterileImport = this.eForm.get('nonsterileProducts').value;
                model.medicamenteBiologiceImport = [];
                model.otherImports = [];
                model.autorizationNr = authorizationNumber;
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
            preparateAsepticMedicamenteClinice: [],
            sterilizateFinal: [],
            sterilizateFinalMedicamenteClinice: [],
            certificareaSeriei: [],
            certificareaSerieiMedicamenteClinice: [],
            produseNesterile: [],
            produseNesterileMedicamenteClinice: [],
            produseNesterileNumaiCertificareaSeriei: [],
            produseNesterileNumaiCertificareaSerieiMedicamenteClinice: [],
            medicamenteBiologice: [],
            medicamenteBiologiceMedicamenteClinice: [],
            medicamenteBiologiceNumaiCertificareaSeriei: [],
            medicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice: [],
            manufactures: [],
            manufacturesMedicamenteClinice: [],
            substanceSterilization: [],
            substanceSterilizationMedicamenteClinice: [],
            otherManufactures: [],
            otherManufacturesMedicamenteClinice: [],
            ambalarePrimara: [],
            ambalarePrimaraMedicamenteClinice: [],
            ambalareSecundara: [],
            ambalareSecundaraMedicamenteClinice: [],
            qualityControlTests: [],
            qualityControlTestsMedicamenteClinice: [],
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
        if (this.eForm.get('clinicalAsepticPreparationsValues').value) {
            this.eForm.get('clinicalAsepticPreparationsValues').value.forEach(t => model.preparateAsepticMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalAsepticPreparations) {
            this.otherClinicalAsepticPreparations.forEach(t => model.preparateAsepticMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalFinalSterilizedValues').value) {
            this.eForm.get('clinicalFinalSterilizedValues').value.forEach(t => model.sterilizateFinalMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalFinalSterilized) {
            this.otherClinicalFinalSterilized.forEach(t => model.sterilizateFinalMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalSterileCertifiedsValues').value) {
            this.eForm.get('clinicalSterileCertifiedsValues').value.forEach(t => model.certificareaSerieiMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalSterileCertifieds) {
            this.otherClinicalSterileCertifieds.forEach(t => model.certificareaSerieiMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalNesterilePreparationsValues').value) {
            this.eForm.get('clinicalNesterilePreparationsValues').value.forEach(t => model.produseNesterileMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalNesterilePreparations) {
            this.otherClinicalNesterilePreparations.forEach(t => model.produseNesterileMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalNesterilePreparationsCertifiedValues').value) {
            this.eForm.get('clinicalNesterilePreparationsCertifiedValues').value.forEach(t => model.produseNesterileNumaiCertificareaSerieiMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalNesterilePreparationsCertified) {
            this.otherClinicalNesterilePreparationsCertified.forEach(t => model.produseNesterileNumaiCertificareaSerieiMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalBiologicalMedicinesValues').value) {
            this.eForm.get('clinicalBiologicalMedicinesValues').value.forEach(t => model.medicamenteBiologiceMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalBiologicalMedicines) {
            this.otherClinicalBiologicalMedicines.forEach(t => model.medicamenteBiologiceMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalBiologicalMedicinesCertifiedValues').value) {
            this.eForm.get('clinicalBiologicalMedicinesCertifiedValues').value.forEach(t => model.medicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalBiologicalMedicinesCertified) {
            this.otherClinicalBiologicalMedicinesCertified.forEach(t => model.medicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalProduction').value) {
            this.eForm.get('clinicalProduction').value.forEach(t => model.manufacturesMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalProductions) {
            this.otherClinicalProductions.forEach(t => model.manufacturesMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalSterilization').value) {
            this.eForm.get('clinicalSterilization').value.forEach(t => model.substanceSterilizationMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalSterilizations) {
            this.otherClinicalSterilizations.forEach(t => model.substanceSterilizationMedicamenteClinice.push({
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
        if (this.otherClinicalPreparationsOrProductions) {
            this.otherClinicalPreparationsOrProductions.forEach(t => model.otherManufacturesMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalPrimaryPackaging').value) {
            this.eForm.get('clinicalPrimaryPackaging').value.forEach(t => model.ambalarePrimaraMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalPrimaryPackagings) {
            this.otherClinicalPrimaryPackagings.forEach(t => model.ambalarePrimaraMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalSecondaryPackaging').value) {
            this.eForm.get('clinicalSecondaryPackaging').value.forEach(t => model.ambalareSecundaraMedicamenteClinice.push({
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
        if (this.eForm.get('clinicalTestsForQualityControl').value) {
            this.eForm.get('clinicalTestsForQualityControl').value.forEach(t => model.qualityControlTestsMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        if (this.otherClinicalTestsForQualityControl) {
            this.otherClinicalTestsForQualityControl.forEach(t => model.qualityControlTestsMedicamenteClinice.push({
                value: t.description,
                valueEn: t.descriptionEn
            }));
        }
        return model;
    }

    viewAFM() {
        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionName').value) {
            this.errorHandlerService.showError('Numele locului de fabricație trebuie introdus.');
            return;
        }

        if (!this.eForm.get('informatiiLoculDistributieAngro.placeDistributionAddress').value) {
            this.errorHandlerService.showError('Adresa locului de fabricaţie trebuie introdusa.');
            return;
        }

        if (!this.eForm.get('informatiiLoculDistributieAngro.etapeleDeFabricatie').value) {
            this.errorHandlerService.showError('Etapele de fabricaţie trebuie introduse.');
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

    loadFile(path: string) {
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(data => {
                this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
            },

            error => {
                console.log(error);
            }
            )
        );
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }

}


