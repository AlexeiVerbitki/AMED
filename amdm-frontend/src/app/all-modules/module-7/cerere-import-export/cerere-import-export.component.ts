import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DrugSubstanceTypesService} from '../../../shared/service/drugs/drugsubstancetypes.service';
import {DrugDocumentsService} from '../../../shared/service/drugs/drugdocuments.service';
import {DrugDecisionsService} from '../../../shared/service/drugs/drugdecisions.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {CpcdAuthLangComponent} from '../cpcd-auth-lang/cpcd-auth-lang.component';
import {AddActiveSubstanceDialogComponent} from '../add-active-substance-dialog/add-active-substance-dialog.component';

@Component({
    selector: 'app-cerere-import-export',
    templateUrl: './cerere-import-export.component.html',
    styleUrls: ['./cerere-import-export.component.css']
})
export class CerereImportExportComponent implements OnInit, OnDestroy {

    cerereImpExpForm: FormGroup;
    documents: Document [] = [];
    formSubmitted: boolean;
    generatedDocNrSeq: number;
    paymentTotal: number;
    docTypes: any[];
    activeSubstancesTable: any[] = [];
    initialData: any;
    outDocuments: any[] = [];
    isNonAttachedDocuments = false;
    drugCheckDecisions: any[] = [];
    drugSubstanceTypes: any[];
    authorizedSubstances: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;
    selectedSubstance: any;
    allSubstanceUnits: any[];
    selectedSubstancesTable: any[] = [];
    disabled: boolean;
    hasError: boolean;
    reqReqInitData: any;
    authorizationTypes: any[] = [
        {value: 'Import', viewValue: 'Import'},
        {value: 'Export', viewValue: 'Export'},
    ];
    scopeAuthorizations: any[] = [
        {value: 0, viewValue: 'Tehnic'},
        {value: 1, viewValue: 'Medical sau stiintific'},
    ];
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private medicamentTypeService: MedicamentTypeService,
                private pharmaceuticalFormsService: PharmaceuticalFormsService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private documentService: DocumentService,
                private loadingService: LoaderService,
                public dialogConfirmation: MatDialog,
                private taskService: TaskService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private drugSubstanceTypesService: DrugSubstanceTypesService,
                private drugDocumentsService: DrugDocumentsService,
                private navbarTitleService: NavbarTitleService,
                private drugDecisionsService: DrugDecisionsService,
                public dialogLanguage: MatDialog,
                public dialogActiveSubstance: MatDialog, ) {

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
                    'nrSiaGeap': [{value: null, disabled: true}],
                    'dateSiaGeap': [{value: null, disabled: true}],
                    'drugImportExports': [[]],
                    'drugSubstanceTypesId': [],
                    'registrationRequestId': null,
                    'expireDate': null,
                    'customsPost': null,
                    'partnerCompany': null,
                    'decision': null,
                    'reasonDecision': [{value: null, disabled: true}],
                }),
            'drugCheckDecisions': [],
            'requestHistories': [],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'authorizationType': [null, Validators.required],
            'scopeAuthorization': [null, Validators.required],
            'substanceType': [],
            'precursor': [{value: false, disabled: this.disabled}],
            'psihotrop': [{value: false, disabled: this.disabled}],
            'stupefiant': [{value: false, disabled: this.disabled}],
            'partner': [],
            'dataExp': [],
            'custom': [],
            'commercialName': [],
            'packaging': [],
            'packagingQuantity': [],
            'unitOfMeasurementAll': [],
        });
    }

    ngOnInit() {

        this.navbarTitleService.showTitleMsg('Cerere de autorizare a importului/exportului precursorilor/psihotropelor/stupefiantelor');

        this.checkOutputDocumentsStatus();

        this.populateRequestDetails();

        this.getAuthorizedSubstances();

        this.getDrugSubstanceTypes();

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.allSubstanceUnits = data;
                }
            )
        );

        this.onChanges();

    }

    populateRequestDetails() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.drugDecisionsService.getRequest(params['id']).subscribe(data => {
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

                        if (data.drugCheckDecisions && data.drugCheckDecisions[0]) {
                            const rs = this.authorizationTypes.find(att => att.value === data.drugCheckDecisions[0].authorizationType);

                            this.cerereImpExpForm.get('authorizationType').setValue(rs);

                            const rs1 = this.scopeAuthorizations.find(att => att.value === data.drugCheckDecisions[0].scopeAuthorization);

                            this.cerereImpExpForm.get('scopeAuthorization').setValue(rs1);

                            this.cerereImpExpForm.get('drugCheckDecision.id').setValue(data.drugCheckDecisions[0].id);
                            this.cerereImpExpForm.get('drugCheckDecision.registrationRequestId').setValue(data.drugCheckDecisions[0].registrationRequestId);
                            this.cerereImpExpForm.get('drugCheckDecision.nrSiaGeap').setValue(data.drugCheckDecisions[0].nrSiaGeap);
                            this.cerereImpExpForm.get('drugCheckDecision.dateSiaGeap').setValue(data.drugCheckDecisions[0].dateSiaGeap ? new Date(data.drugCheckDecisions[0].dateSiaGeap) : null);
                            this.cerereImpExpForm.get('drugCheckDecision.protocolNr').setValue(data.drugCheckDecisions[0].protocolNr);
                            this.cerereImpExpForm.get('drugCheckDecision.protocolDate').setValue(data.drugCheckDecisions[0].protocolDate ? new Date(data.drugCheckDecisions[0].protocolDate) : null);
                            this.cerereImpExpForm.get('drugCheckDecision.expireDate').setValue(data.drugCheckDecisions[0].expireDate ? new Date(data.drugCheckDecisions[0].expireDate) : null);
                            this.cerereImpExpForm.get('drugCheckDecision.partnerCompany').setValue(data.drugCheckDecisions[0].partnerCompany);
                            this.cerereImpExpForm.get('drugCheckDecision.customsPost').setValue(data.drugCheckDecisions[0].customsPost);

                            this.selectedSubstancesTable = data.drugCheckDecisions[0].drugImportExports;
                            this.selectedSubstancesTable.forEach(sf => {
                                sf.details.forEach(dt => {
                                    dt.substanceName = dt.authorizedDrugSubstance.substanceName;
                                    dt.substanceCode = dt.authorizedDrugSubstance.substanceCode;
                                    dt.authorizedQuantityUnitDesc = this.allSubstanceUnits.find(asu => asu.code === dt.authorizedQuantityUnitCode).description;
                                });

                            });

                            this.cerereImpExpForm.get('drugCheckDecision.reasonDecision').setValue(data.drugCheckDecisions[0].reasonDecision);
                            let dec;
                            if (data.drugCheckDecisions[0].decision && data.drugCheckDecisions[0].decision === 1) {
                                dec = '1';
                            } else if (data.drugCheckDecisions[0].decision === 0) {
                                dec = '0';
                            }
                            this.cerereImpExpForm.get('drugCheckDecision.decision').setValue(dec);
                        }


                    })
                );
            })
        );
    }

    getAuthorizedSubstances() {

        this.authorizedSubstances =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (this.cerereImpExpForm.get('authorizationType').invalid) {
                        this.errorHandlerService.showError('Selectati tipul autorizarii');
                        return false;

                    }
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

                    this.drugDecisionsService.getAuthorizedSubstancesByNameOrCode(term, this.cerereImpExpForm.get('authorizationType').value.value).pipe(
                        tap(() => this.medLoading = false)
                    )
                )
            );
    }


    getDrugSubstanceTypes() {

        this.subscriptions.push(
            this.drugSubstanceTypesService.getDrugSubstanceTypesList().subscribe(data => {
                    this.drugSubstanceTypes = data;
                }
            )
        );
    }

    onChanges(): void {
        this.getDocumentsForSelectedAuthorizationType();
    }

    getDocumentsForSelectedAuthorizationType() {

        this.cerereImpExpForm.get('authorizationType').valueChanges.subscribe(val => {
            if (val) {
                this.outDocuments = [];
                if (val.value === 'Import') {
                    this.initOutImportDocuments();
                } else if (val.value === 'Export') {
                    this.initOutExportDocuments();
                }
                this.checkOutputDocumentsStatus();
            } else {

            }

        });


        this.cerereImpExpForm.get('drugCheckDecision.decision').valueChanges.subscribe(val => {
            if (val) {
                if (val === '0') {
                    this.cerereImpExpForm.get('drugCheckDecision.reasonDecision').enable();
                } else if (val === '1') {
                    this.cerereImpExpForm.get('drugCheckDecision.reasonDecision').setValue(null);
                    this.cerereImpExpForm.get('drugCheckDecision.reasonDecision').disable();
                }

            } else {
                this.cerereImpExpForm.get('drugCheckDecision.reasonDecision').setValue(null);
                this.cerereImpExpForm.get('drugCheckDecision.reasonDecision').disable();
            }
        });

    }

    initOutExportDocuments() {
        const outDocumentEP = {
            name: 'Autorizatia de export',
            docType: {
                category: 'EP'
            },
            number: 'EP-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentEP);
    }

    initOutImportDocuments() {
        const outDocumentIP = {
            name: 'Autorizatia de import',
            docType: {
                category: 'IP'
            },
            number: 'IP-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentIP);
    }

    addSubstance() {
        if (this.cerereImpExpForm.get('authorizationType').invalid) {
            this.errorHandlerService.showError('Selectati tipul autorizarii');
            return;
        }

        if (!this.cerereImpExpForm.get('commercialName').value) {
            this.errorHandlerService.showError('Introduceti denumirea comerciala');
            return;
        }
        if (!this.cerereImpExpForm.get('packagingQuantity').value) {
            this.errorHandlerService.showError('Introduceti cantitatea totala');
            return;
        }
        if (!this.cerereImpExpForm.get('unitOfMeasurementAll').value) {
            this.errorHandlerService.showError('Selectati unitatea de masura pentru toata cantitatea.');
            return;
        }


        this.validateAuthorizationDates();

        if (this.hasError) {
            return;
        } else {
            this.populateSelectedSubstanceDetails();
        }

        this.cerereImpExpForm.get('commercialName').setValue(null);
        this.cerereImpExpForm.get('packaging').setValue(null);
        this.cerereImpExpForm.get('packagingQuantity').setValue(null);
        this.cerereImpExpForm.get('unitOfMeasurementAll').setValue(null);

        this.selectedSubstance = [];
    }

    populateSelectedSubstanceDetails() {

        const substanceDetails = {
            commercialName: this.cerereImpExpForm.get('commercialName').value,
            packaging: this.cerereImpExpForm.get('packaging').value,
            packagingQuantity: this.cerereImpExpForm.get('packagingQuantity').value,
            requestQuantityUnitCode: this.cerereImpExpForm.value.unitOfMeasurementAll ? this.cerereImpExpForm.value.unitOfMeasurementAll.code : null,
            requestQuantityUnitDesc: this.cerereImpExpForm.value.unitOfMeasurementAll ? this.cerereImpExpForm.value.unitOfMeasurementAll.description : null,
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

    nextStep() {

        this.formSubmitted = true;
        let isFormInvalid = false;
        this.hasError = false;

        if (this.cerereImpExpForm.invalid || this.paymentTotal < 0) {
            isFormInvalid = true;
        }


        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        }

        this.validateAuthorizationDates();

        if (isFormInvalid || this.hasError) {
            return;
        }

        if (this.cerereImpExpForm.get('drugCheckDecision.decision') && this.cerereImpExpForm.get('drugCheckDecision.decision').value === '0') {
            this.errorHandlerService.showError('Cererea a fost refuzata.');
            return;
        }

        this.formSubmitted = false;

        this.cerereImpExpForm.get('company').setValue(this.cerereImpExpForm.value.company);

        const modelToSubmit: any = this.cerereImpExpForm.value;

        this.populateModelToSubmit(modelToSubmit, 'D');

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
                this.router.navigate(['/dashboard/module/drug-control/declare-import-export', this.cerereImpExpForm.get('id').value]);
            })
        );

    }


    save() {
        this.validateAuthorizationDates();

        if (this.hasError) {
            return;
        }

        this.cerereImpExpForm.get('company').setValue(this.cerereImpExpForm.value.company);

        const modelToSubmit: any = this.reqReqInitData;

        this.populateModelToSubmit(modelToSubmit, 'E');

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
            //Do nothing
            this.errorHandlerService.showSuccess('Datele au fost salvate');
        }));
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

    populateModelToSubmit(modelToSubmit: any, step: string) {

        modelToSubmit.requestHistories.push({
            startDate: this.cerereImpExpForm.get('data').value,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: step
        });

        modelToSubmit.assignedUser = this.authService.getUserName();
        this.drugCheckDecisions = [];
        const drugDec = this.cerereImpExpForm.getRawValue().drugCheckDecision;
        if (this.cerereImpExpForm.get('authorizationType').value)
        {
            drugDec.authorizationType = this.cerereImpExpForm.get('authorizationType').value.value;
        }
        if (this.cerereImpExpForm.get('scopeAuthorization').valid) {
            drugDec.scopeAuthorization = this.cerereImpExpForm.get('scopeAuthorization').value.value;
        }
        drugDec.status = 'A';

        this.populateImportExportDetails(drugDec);


        this.drugCheckDecisions.push(drugDec);
        modelToSubmit.drugCheckDecisions = this.drugCheckDecisions;
        modelToSubmit.documents = this.documents;
        if (step === 'D') {
            modelToSubmit.currentStep = 'D';
        }

        modelToSubmit.medicaments = [];

    }

    populateImportExportDetails(drugCheckDecision: any) {

        drugCheckDecision.drugImportExports = [];
        for (const entry of this.selectedSubstancesTable) {

            const data = {
                id: entry.id,
                companyCode: this.cerereImpExpForm.value.company.code,
                companyName: this.cerereImpExpForm.value.company.name,
                fromDate: this.cerereImpExpForm.value.drugCheckDecision.protocolDate,
                toDate: this.cerereImpExpForm.value.drugCheckDecision.expireDate,
                packaging: entry.packaging,
                packagingQuantity: entry.packagingQuantity,
                commercialName: entry.commercialName,
                requestQuantityUnitCode: entry.requestQuantityUnitCode,
                details: entry.details
            };

            drugCheckDecision.drugImportExports.push(data);
        }
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked;
    }

    viewDoc(document: any) {

        if (document.docType.category === 'IP' || document.docType.category === 'EP') {
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
                dataExp: this.cerereImpExpForm.get('drugCheckDecision.expireDate').value,
                details: this.selectedSubstancesTable,
                authorizationType: authorizationType.value,
                custom: this.cerereImpExpForm.get('drugCheckDecision.customsPost').value,
                localityId: localityId,
                partner: this.cerereImpExpForm.get('drugCheckDecision.partnerCompany').value,
                usedScoupe: this.cerereImpExpForm.get('scopeAuthorization').value.value === 1 ? true : false,
            };

            const dialogRef2 = this.dialogLanguage.open(CpcdAuthLangComponent, {
                data: {
                    details: data,
                    parentWindow: window
                },
                hasBackdrop: false
            });

            dialogRef2.afterClosed().subscribe(result => {
                if (result.success) {

                }
            });
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
        if (this.cerereImpExpForm.get('drugCheckDecision.decision') && this.cerereImpExpForm.get('drugCheckDecision.decision').value === '1') {
            this.errorHandlerService.showError('Cererea a fost acceptata.');
            return;
        }

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
                    startDate: this.cerereImpExpForm.get('startDate').value,
                    endDate: new Date()
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

    addActiveSubstance(substance: any, i) {

        const data = {
            substance: substance,
            authorizationType: this.cerereImpExpForm.get('authorizationType').value,
            otherSelectedSubstanceDetails: this.selectedSubstancesTable.filter(asd => asd !== substance),
            reqId: this.cerereImpExpForm.get('id').value
        };

        const dialogRef2 = this.dialogActiveSubstance.open(AddActiveSubstanceDialogComponent, {
            data: {
                details: data,
                parentWindow: window
            },
            hasBackdrop: false,
            disableClose: false,
            autoFocus: true,
            panelClass: 'custom-dialog-container',
            width: '1300px',

        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                substance.details = result.details;
            }
        });
    }


    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
