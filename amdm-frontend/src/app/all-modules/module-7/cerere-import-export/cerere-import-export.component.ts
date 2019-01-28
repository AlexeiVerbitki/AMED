import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select} from '../../../models/select';
import {Document} from '../../../models/document';
import {Observable, Subject, Subscription} from 'rxjs';
import {AdministrationService} from '../../../shared/service/administration.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {MedicamentTypeService} from '../../../shared/service/medicamenttype.service';
import {PharmaceuticalFormsService} from '../../../shared/service/pharmaceuticalforms.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {DocumentService} from '../../../shared/service/document.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material';
import {TaskService} from '../../../shared/service/task.service';
import {ErrorHandlerService} from '../../../shared/service/error-handler.service';
import {DrugSubstanceTypesService} from '../../../shared/service/drugs/drugsubstancetypes.service';
import {DrugDocumentsService} from '../../../shared/service/drugs/drugdocuments.service';
import {DrugDecisionsService} from '../../../shared/service/drugs/drugdecisions.service';

@Component({
    selector: 'app-cerere-import-export',
    templateUrl: './cerere-import-export.component.html',
    styleUrls: ['./cerere-import-export.component.css']
})
export class CerereImportExportComponent implements OnInit {

    cerereImpExpForm: FormGroup;
    documents: Document [] = [];
    formSubmitted: boolean;
    generatedDocNrSeq: number;
    companies: any[];
    filteredOptions: Observable<any[]>;
    unitsOfMeasurement: any[];
    paymentTotal: number;
    docTypes: any[];
    allDocTypes: any[];
    activeSubstancesTable: any[] = [];
    initialData: any;
    outDocuments: any[] = [];
    isNonAttachedDocuments = false;
    isResponseReceived = false;
    docTypesInitial: any[];
    drugCheckDecisions: any[] = [];
    drugSubstanceTypes: any[];
    authorizedSubstances: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;
    selectedSubstance: any;
    unityDesc: any;
    substanceUnits: any[];
    selectedSubstanceUnits: any[] = [];
    selectedSubstancesTable: any[] = [];
    substanceNotSelected: boolean;
    substanceExistInTable: boolean;
    disabled: boolean;
    hasError: boolean;
    reqReqInitData: any;
    authorizationTypes: Select[] = [
        {value: 'none', viewValue: '(None)'},
        {value: 'Import', viewValue: 'Import'},
        {value: 'Export', viewValue: 'Export'},
    ];
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private medicamentTypeService: MedicamentTypeService,
                private pharmaceuticalFormsService: PharmaceuticalFormsService, private activatedRoute: ActivatedRoute, private router: Router,
                private requestService: RequestService, private authService: AuthService,
                private documentService: DocumentService, private loadingService: LoaderService, public dialogConfirmation: MatDialog,
                private taskService: TaskService, private ref: ChangeDetectorRef, private errorHandlerService: ErrorHandlerService,
                private drugSubstanceTypesService: DrugSubstanceTypesService, private drugDocumentsService: DrugDocumentsService,
                private drugDecisionsService: DrugDecisionsService) {

        this.cerereImpExpForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'startDate': [],
            'requestNumber': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'company': [''],
            'companyValue': [],
            'currentStep': ['E'],
            'documents': [],
            'drugCheckDecision':
                fb.group({
                    'id': null,
                    'protocolNr': [null, Validators.required],
                    'protocolDate': Date,
                    'drugImportExportDetails': [[]],
                    'drugSubstanceTypesId': []
                }),
            'drugCheckDecisions': [],
            'requestHistories': [],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'authorizationType': [null, Validators.required],
            'substanceType': [],
            'precursor': [{value: false, disabled: this.disabled}],
            'psihotrop': [{value: false, disabled: this.disabled}],
            'stupefiant': [{value: false, disabled: this.disabled}],
            'partner': [],
            'dataExp': [],
            'custom': [],
            'substance': [],
            'authorizedQuantity': [],
            'availableQuantity': {disabled: true, value: []},
            'commercialName': [],
            'packaging': [],
            'packagingQuantity': [],
            'unitOfMeasurement': []
        });
    }

    ngOnInit() {

        this.populateRequestDetails();

        this.generateDocNumber();

        this.getAuthorizedSubstances();

        this.getDrugSubstanceTypes();

        this.getAllUnitsOfMeasurement();

    }

    populateRequestDetails() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.reqReqInitData = data;
                        this.initialData = Object.assign({}, data);
                        this.cerereImpExpForm.get('id').setValue(data.id);
                        this.cerereImpExpForm.get('initiator').setValue(data.initiator);
                        this.cerereImpExpForm.get('startDate').setValue(data.startDate);
                        this.cerereImpExpForm.get('requestNumber').setValue(data.requestNumber);
                        this.cerereImpExpForm.get('requestHistories').setValue(data.requestHistories);
                        this.cerereImpExpForm.get('type').setValue(data.type);
                        this.cerereImpExpForm.get('typeValue').setValue(data.type.code);
                        this.cerereImpExpForm.get('company').setValue(data.company);
                        this.cerereImpExpForm.get('companyValue').setValue(data.company.name);
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });

                        this.loadDocTypes();
                    })
                );
            })
        );
    }

    getAuthorizedSubstances() {

        this.authorizedSubstances =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.medLoading = true;

                }),
                flatMap(term =>

                    this.drugDecisionsService.getAuthorizedSubstancesByNameOrCode(term).pipe(
                        tap(() => this.medLoading = false)
                    )
                )
            );
    }

    generateDocNumber() {

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.cerereImpExpForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );
    }

    getAllUnitsOfMeasurement() {

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                    this.onChanges();
                },
                error => console.log(error)
            )
        );

    }

    getDrugSubstanceTypes() {

        this.subscriptions.push(
            this.drugSubstanceTypesService.getDrugSubstanceTypesList().subscribe(data => {
                    this.drugSubstanceTypes = data;
                },
                error => console.log(error)
            )
        );
    }

    loadDocTypes() {

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('11', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.allDocTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                this.allDocTypes = this.allDocTypes.filter(r => step.availableDocTypes.includes(r.category));
                                this.docTypes = this.allDocTypes.filter(r => r.category === 'None');

                                this.initOutputDocuments();
                                this.checkOutputDocumentsStatus();
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );
    }

    onChanges(): void {

        this.getDocumentsForSelectedAuthorizationType();

        this.getSelectedSubstanceDetails();
    }

    getDocumentsForSelectedAuthorizationType() {

        this.cerereImpExpForm.get('authorizationType').valueChanges.subscribe(val => {
            this.outDocuments = [];
            if (val.value === 'Import') {
                this.initOutImportDocuments();
            } else if (val.value === 'Export') {
                this.initOutExportDocuments();
            } else {
                this.docTypes = this.allDocTypes.filter(r => r.category === 'SR');
            }
            const outDocumentSR = {
                name: 'Scrisoare de refuz',
                docType: this.docTypesInitial.find(r => r.category === 'SR'),
                number: 'SR-' + this.cerereImpExpForm.get('requestNumber').value,
                date: new Date()
            };
            this.outDocuments.push(outDocumentSR);
            this.checkOutputDocumentsStatus();

        });

    }

    getSelectedSubstanceDetails() {

        this.cerereImpExpForm.get('substance').valueChanges.subscribe(val => {
            this.substanceExistInTable = false;
            this.selectedSubstance = this.cerereImpExpForm.get('substance').value;
            if (this.selectedSubstance != null) {
                this.substanceNotSelected = false;
                this.unityDesc = this.unitsOfMeasurement.find(r => r.code == this.selectedSubstance.unitOfMeasureCode);
                this.cerereImpExpForm.get('unitOfMeasurement').setValue(this.unityDesc.description);
                this.subscriptions.push(
                    this.drugDecisionsService.getUnitsByRefUnitCode(this.selectedSubstance.unitOfMeasureCode).subscribe(data => {
                            this.substanceUnits = data;
                            const refUnit = {
                                unitCode: this.selectedSubstance.unitOfMeasureCode,
                                refUnitCode: "",
                                unitCodeRate: 1,
                                refUnitCodeRate: 1,
                                unitCodeDescription: this.unityDesc.description
                            };

                            this.substanceUnits.push(refUnit);
                        },
                        error => console.log(error)
                    )
                );
                this.getSubstanceDetails();
            } else {
                this.initSubstanceData();
            }

        });
    }

    initOutExportDocuments() {
        const outDocumentEP = {
            name: 'Autorizatia de export',
            docType: this.docTypesInitial.find(r => r.category === 'EP'),
            number: 'EP-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentEP);

        this.docTypes = this.allDocTypes.filter(r => r.category === 'SR' || r.category === 'EP');
    }

    initOutImportDocuments() {
        const outDocumentIP = {
            name: 'Autorizatia de import',
            docType: this.docTypesInitial.find(r => r.category === 'IP'),
            number: 'IP-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentIP);

        this.docTypes = this.allDocTypes.filter(r => r.category === 'SR' || r.category === 'IP');
    }

    getSubstanceDetails() {

        this.activeSubstancesTable = [];
        this.activeSubstancesTable.push(this.selectedSubstance);
        this.cerereImpExpForm.get('availableQuantity').setValue(0);
        if (this.selectedSubstance.toDate != null && this.selectedSubstance.fromDate != null) {

            const toDate = new Date(this.selectedSubstance.toDate);
            const fromDate = new Date(this.selectedSubstance.fromDate);
            const date = new Date();
            if (toDate.getTime() > date.getTime() && date.getTime() >= fromDate.getTime()) {
                this.cerereImpExpForm.get('availableQuantity').setValue(this.selectedSubstance.quantity);
                this.calculateSubstanceAvailableQuantity();
            }
        }
    }

    calculateSubstanceAvailableQuantity() {

        this.subscriptions.push(
            this.drugDecisionsService.getImportExportDetailsBySubstanceId(this.selectedSubstance.id).subscribe(data => {

                    let availableQuantity = this.selectedSubstance.quantity;
                    for (const entry of data) {
                        if (entry.toDate != null && entry.authorizedQuantity != null) {
                            const toDate = new Date(entry.toDate);
                            const date = new Date();
                            if (toDate.getTime() > date.getTime()) {

                                availableQuantity = availableQuantity - entry.authorizedQuantity;
                            } else {
                                if (entry.usedQuantity != null) {
                                    availableQuantity = availableQuantity - entry.authorizedQuantity;
                                    const remainQuantity = entry.authorizedQuantity - entry.usedQuantity;
                                    availableQuantity = availableQuantity + remainQuantity;
                                }
                            }
                        }
                    }

                    if (availableQuantity > 0) {

                        this.cerereImpExpForm.get('availableQuantity').setValue(availableQuantity);

                    }

                },
                error => console.log(error)
            )
        );

    }

    convertSubstanceQuantity() {

        if (this.cerereImpExpForm.value.authorizedQuantity != null && this.cerereImpExpForm.get('availableQuantity').value != null && this.cerereImpExpForm.get('substance') != null && this.cerereImpExpForm.get('unitOfMeasurement') != null )
        {

            if(this.cerereImpExpForm.get('unitOfMeasurement').value.unitCode && this.cerereImpExpForm.get('substance').value.unitOfMeasureCode != this.cerereImpExpForm.get('unitOfMeasurement').value.unitCode){

                this.cerereImpExpForm.value.authorizedQuantity = (this.cerereImpExpForm.value.authorizedQuantity * this.cerereImpExpForm.get('unitOfMeasurement').value.unitCodeRate) /  this.cerereImpExpForm.get('unitOfMeasurement').value.refUnitCodeRate;

            }

        }

    }

    initSubstanceData() {
        this.activeSubstancesTable = [];
        this.cerereImpExpForm.get('availableQuantity').setValue("");
        this.cerereImpExpForm.get('unitOfMeasurement').setValue("");
    }

    addSubstance() {

        this.substanceNotSelected = true;
        this.substanceExistInTable = false;
        this.hasError = false;
        if (this.selectedSubstance != null) {
            this.substanceNotSelected = false;
            const substance = this.selectedSubstancesTable.find(r => r.authorizedDrugSubstancesId === this.selectedSubstance.id);

            if (substance != null) {
                this.substanceExistInTable = true;
                return;
            } else {
                this.validateAuthorizedQuantity();
                this.validateAuthorizationDates();

                if (this.hasError) {
                    return;
                } else {
                    this.populateSelectedSubstanceDetails();
                }
            }
        } else {
            return;
        }
    }

    populateSelectedSubstanceDetails() {

        const unitOfMeasurement = this.cerereImpExpForm.get('substance').value;
        let unitDescription = '';
        if (unitOfMeasurement != null && unitOfMeasurement.unitCodeDescription != null) {
            unitDescription = unitOfMeasurement.unitCodeDescription;
        }

        const substanceDetails = {
            authorizedDrugSubstancesId: this.selectedSubstance.id,
            substanceName: this.selectedSubstance.substanceName,
            substanceCode: this.selectedSubstance.substanceCode,
            commercialName: this.cerereImpExpForm.get('commercialName').value,
            packaging: this.cerereImpExpForm.get('packaging').value,
            packagingQuantity: this.cerereImpExpForm.get('packagingQuantity').value,
            authorizedQuantity: this.cerereImpExpForm.value.authorizedQuantity,
            authorizedQuantityUnit: this.unityDesc.description
        };

        this.selectedSubstancesTable.push(substanceDetails);
    }

    removeSubstance(index) {

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });
        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.selectedSubstancesTable.splice(index, 1);
            }
        });

    }

    saveRequest() {

        this.formSubmitted = true;
        let isFormInvalid = false;
        this.isResponseReceived = false;
        this.isNonAttachedDocuments = false;
        this.hasError = false;

        if (this.cerereImpExpForm.invalid || this.paymentTotal < 0) {
            isFormInvalid = true;
        }

        this.checkSelectedDocumentsStatus();

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        } else if (!this.isResponseReceived) {
            this.errorHandlerService.showError('Nici un document pentru emitere nu a fost selectat.');
            return;
        } else if (this.isNonAttachedDocuments && this.isResponseReceived) {
            this.errorHandlerService.showError('Exista documente care nu au fost atasate.');
            return;
        }

        this.validateAuthorizedQuantity();
        this.validateAuthorizationDates();

        if (isFormInvalid || this.hasError) {
            return;
        }

        this.isResponseReceived = true;
        this.formSubmitted = false;

        this.cerereImpExpForm.get('company').setValue(this.cerereImpExpForm.value.company);

        const modelToSubmit: any = this.cerereImpExpForm.value;

        this.populateModelToSubmit(modelToSubmit);

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
                this.router.navigate(['/dashboard/management/cpcadtask']);
            }, error => console.log(error))
        );

    }

    validateAuthorizationDates() {

        if (this.cerereImpExpForm.value.drugCheckDecision.protocolDate != null && this.cerereImpExpForm.value.dataExp != null) {

            const fromDate = new Date(this.cerereImpExpForm.value.drugCheckDecision.protocolDate);
            const toDate = new Date(this.cerereImpExpForm.value.dataExp);
            const date = new Date();
            if (date.getDate() > fromDate.getDate()) {
                this.errorHandlerService.showError('Data procesului nu este valida.');
                this.hasError = true;
                return;
            }
            if (fromDate.getTime() >= toDate.getTime()) {
                this.errorHandlerService.showError('Data expirarii nu poate fi mai mica ca data procesului.');
                this.hasError = true;
                return;
            }
        }

    }

    validateAuthorizedQuantity() {

        this.convertSubstanceQuantity();
        if (this.cerereImpExpForm.value.authorizedQuantity != null && this.cerereImpExpForm.get('availableQuantity').value != null
            && this.cerereImpExpForm.value.authorizedQuantity > this.cerereImpExpForm.get('availableQuantity').value) {
            this.hasError = true;
            this.errorHandlerService.showError('Cantitatea autorizata nu poate fi mai mare ca cantitatea admisibila.');
            return;
        }

    }

    populateModelToSubmit(modelToSubmit: any) {

        modelToSubmit.requestHistories.push({
            startDate: this.cerereImpExpForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        modelToSubmit.assignedUser = this.authService.getUserName();

        this.populateSelectedSubstances(modelToSubmit);
        this.populateImportExportDetails(modelToSubmit);

        this.drugCheckDecisions = [];
        this.drugCheckDecisions.push(this.cerereImpExpForm.get('drugCheckDecision').value);
        modelToSubmit.drugCheckDecisions = this.drugCheckDecisions;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;

    }

    populateImportExportDetails(modelToSubmit: any) {

        for (const entry of this.selectedSubstancesTable) {

            const details = {
                companyCode: this.cerereImpExpForm.value.company.code,
                companyName: this.cerereImpExpForm.value.company.name,
                substanceName: entry.substanceName,
                authorizationType: this.cerereImpExpForm.value.authorizationType.value,
                authorizedDrugSubstancesId: entry.authorizedDrugSubstancesId,
                fromDate: this.cerereImpExpForm.value.drugCheckDecision.protocolDate,
                toDate: this.cerereImpExpForm.value.dataExp,
                authorizedQuantity: entry.authorizedQuantity,
                usedQuantity: '',
                packaging: entry.packaging,
                packagingQuantity: entry.packagingQuantity,
                commercialName: entry.commercialName,
                authorizedQuantityUnit: entry.authorizedQuantityUnit
            };

            modelToSubmit.drugCheckDecision.drugImportExportDetails.push(details);
        }

    }

    populateSelectedSubstances(modelToSubmit: any) {

        if (this.cerereImpExpForm.get('precursor').value || this.cerereImpExpForm.get('psihotrop').value || this.cerereImpExpForm.get('stupefiant').value) {

            const precursor = this.cerereImpExpForm.get('precursor').value;
            const psihotrop = this.cerereImpExpForm.get('psihotrop').value;
            const stupefiant = this.cerereImpExpForm.get('stupefiant').value;

            if (precursor && !psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code === 'PRECURSOR');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code === 'PSIHOTROP');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && !psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code === 'STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code === 'PRECURSOR/PSIHOTROP');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && !psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code === 'PRECURSOR/STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code === 'PSIHOTROP/STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code === 'PRECURSOR/PSIHOTROP/STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            }

        }
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked;
    }

    checkSelectedDocumentsStatus() {

        for (const entry of this.outDocuments) {
            if (entry.responseReceived || entry.status === 'Atasat') {
                this.isResponseReceived = true;
                if (entry.status === 'Nu este atasat') {
                    this.isNonAttachedDocuments = true;
                }
            }
        }
    }

    viewDoc(document: any) {

        if (document.docType.category === 'IP' || document.docType.category === 'EP') {
            this.loadingService.show();
            const company = this.cerereImpExpForm.get('company').value;
            let localityId = '';
            if (company != null && company.locality != null) {
                localityId = company.locality.id;
            }
            const authorizationType = this.cerereImpExpForm.get('authorizationType').value;

            const data = {
                requestNumber: this.cerereImpExpForm.get('requestNumber').value,
                protocolDate: this.cerereImpExpForm.get('drugCheckDecision.protocolDate').value,
                companyValue: this.cerereImpExpForm.get('companyValue').value,
                dataExp: this.cerereImpExpForm.get('dataExp').value,
                details: this.selectedSubstancesTable,
                authorizationType: authorizationType.value,
                custom: this.cerereImpExpForm.get('custom').value,
                localityId: localityId,
                partner: this.cerereImpExpForm.get('partner').value,
            };

            this.subscriptions.push(this.drugDocumentsService.viewImportExportAuthorization(data).subscribe(data => {
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
                    if (item === doc) {
                        this.outDocuments.splice(index, 1);
                    }
                });
                this.initialData.outputDocuments = this.outDocuments;

                this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.loadingService.hide();
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    checkOutputDocumentsStatus() {
        for (const entry of this.outDocuments) {
            const isMatch = this.documents.some(elem => {
                return (elem.docType.category === entry.docType.category && elem.number === entry.number) ? true : false;
            });
            if (isMatch) {
                entry.status = 'Atasat';
            } else {
                entry.status = 'Nu este atasat';
            }
        }
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
                const usernameDB = this.authService.getUserName();
                const modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    id: this.cerereImpExpForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.authService.getUserName(),
                    type: this.cerereImpExpForm.get('type').value,
                    requestNumber: this.cerereImpExpForm.get('requestNumber').value,
                    startDate: this.cerereImpExpForm.get('startDate').value
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.cerereImpExpForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });

                this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module']);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    private initOutputDocuments() {

        const outDocumentSR = {
            name: 'Scrisoare de refuz',
            docType: this.docTypesInitial.find(r => r.category === 'SR'),
            number: 'SR-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentSR);

        this.outDocuments = this.outDocuments.filter(r => r.category === 'SR');
    }
}
