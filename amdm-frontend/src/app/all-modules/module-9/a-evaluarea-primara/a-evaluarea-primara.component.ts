import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../models/document';
import {Observable, Subject, Subscription} from 'rxjs/index';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RequestService} from '../../../shared/service/request.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {Receipt} from '../../../models/receipt';
import {PaymentOrder} from '../../../models/paymentOrder';
import {AuthService} from '../../../shared/service/authetication.service';
import {MatDialog, MatDialogConfig, MatRadioChange} from '@angular/material';
import {DocumentService} from '../../../shared/service/document.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {TaskService} from '../../../shared/service/task.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ActiveSubstanceDialogComponent} from '../../../dialog/active-substance-dialog/active-substance-dialog.component';
import {MedInstInvestigatorsDialogComponent} from '../dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';

@Component({
    selector: 'app-a-evaluarea-primara',
    templateUrl: './a-evaluarea-primara.component.html',
    styleUrls: ['./a-evaluarea-primara.component.css']
})
export class AEvaluareaPrimaraComponent implements OnInit, OnDestroy {
    evaluateClinicalTrailForm: FormGroup;
    docs: Document[] = [];
    docTypes: any[];
    reqReqInitData: any;
    phaseList: any[] = [];
    //Treatments
    treatmentId: number;
    treatmentList: any[] = [
        {'id': 1, 'description': 'Unicentric', 'code': 'U'},
        {'id': 2, 'description': 'Multicentric', 'code': 'M'}
    ];
    //Provenances
    provenanceId: number;
    provenanceList: any[] = [
        {'id': 3, 'description': 'Național', 'code': 'N'},
        {'id': 4, 'description': 'Internațional', 'code': 'I'}
    ];
    //Investigators controls
    addInvestigatorForm: FormGroup;
    allInvestigatorsList: any[] = [];
    investigatorsList: any[] = [];
    //MediacalInstitutions controls
    addMediacalInstitutionForm: FormGroup;
    allMediacalInstitutionsList: any[] = [];
    mediacalInstitutionsList: any[] = [];
    //Payments control
    receiptsList: Receipt[] = [];
    paymentOrdersList: PaymentOrder[] = [];
    paymentTotal = 0;
    medicamentForm: FormGroup;
    referenceProductFormn: FormGroup;
    placeboFormn: FormGroup;
    manufacturers: Observable<any[]>;
    loadingManufacturer = false;
    manufacturerInputs = new Subject<string>();
    farmForms: Observable<any[]>;
    loadingFarmForms = false;

    farmFormsInputs = new Subject<string>();
    atcCodes: Observable<any[]>;
    loadingAtcCodes = false;
    atcCodesInputs = new Subject<string>();

    manufacturersRfPr: Observable<any[]>;
    loadingManufacturerRfPr = false;
    manufacturerInputsRfPr = new Subject<string>();
    farmFormsRfPr: Observable<any[]>;
    loadingFarmFormsRfPr = false;
    farmFormsInputsRfPr = new Subject<string>();
    atcCodesRfPr: Observable<any[]>;
    loadingAtcCodesRfPr = false;
    atcCodesInputsRfPr = new Subject<string>();
    medActiveSubstances: any[] = [];
    refProdActiveSubstances: any[] = [];
    isValidRefProduct = false;
    mandatedContactName: string;
    manufacturersPlacebo: Observable<any[]>;
    loadingManufacturerPlacebo = false;
    manufacturerInputsPlacebo = new Subject<string>();
    farmFormsPlacebo: Observable<any[]>;
    loadingFarmFormsPlacebo = false;
    farmFormsInputsPlacebo = new Subject<string>();
    private readonly SEARCH_STRING_LENGTH: number = 2;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private requestService: RequestService,
                private medicamentService: MedicamentService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private documentService: DocumentService,
                private administrationService: AdministrationService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                private taskService: TaskService,
                private loadingService: LoaderService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private navbarTitleService: NavbarTitleService) {

    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Evaluarea primara');
        this.evaluateClinicalTrailForm = this.fb.group({
            'id': [''],
            'requestNumber': {value: '', disabled: true},
            'startDate': {value: '', disabled: true},
            'company': [null],
            'type': [''],
            'typeCode': [''],
            'initiator': [null],
            'assignedUser': [null],
            'receipts': [],
            'paymentOrders': [],
            'outputDocuments': [],
            'registrationRequestMandatedContacts': [],
            'clinicalTrails': this.fb.group({
                'id': [''],
                'startDateInternational': [''],
                'startDateNational': [''],
                'endDateNational': [''],
                'endDateInternational': [''],
                'title': ['title', Validators.required],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['', Validators.required],
                'phase': ['', Validators.required],
                'eudraCtNr': ['eudraCtNr', Validators.required],
                'code': ['', Validators.required],
                'medicalInstitutions': [],
                'trialPopNat': ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
                'trialPopInternat': ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
                'medicament': [],
                'referenceProduct': [],
                'status': ['P'],
                'pharmacovigilance': [],
                'placebo': [],
                'clinicTrialAmendEntities': [],
                'comissionNr': [],
                'comissionDate': [],
                'clinicTrialNotificationEntities': []
            }),

            'requestHistories': [],
            'ctPaymentOrdersEntities': [],
        });

        this.medicamentForm = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'registrationNumber': [null],
            'registrationDate': [null],
            'internationalMedicamentName': [null],
            'manufacture': [null, Validators.required],
            'dose': [null],
            'volumeQuantityMeasurement': [null],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null],
            'administratingMode': [null, Validators.required],
            'activeSubstances': [null],
            'subjectsSC': [null]
        });

        this.referenceProductFormn = this.fb.group({
            'id': [null],
            'name': [null],
            'registrationNumber': [null],
            'registrationDate': [null],
            'internationalMedicamentName': [null],
            'manufacture': [null, Validators.required],
            'dose': [null, Validators.required],
            'volumeQuantityMeasurement': [null],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null, Validators.required],
            'administratingMode': [null, Validators.required],
            'activeSubstances': [null],
            'subjectsSC': [null]
        });

        this.placeboFormn = this.fb.group({
            'id': [null],
            'name': [null],
            'registrationNumber': [null],
            'registrationDate': [null],
            'internationalMedicamentName': [null],
            'manufacture': [null],
            'dose': [null, Validators.required],
            'volumeQuantityMeasurement': [null],
            'pharmaceuticalForm': [null],
            'atcCode': [null, Validators.required],
            'administratingMode': [null],
            'activeSubstances': [null],
            'subjectsSC': [null]
        });

        this.addInvestigatorForm = this.fb.group({
            'investigator': []
        });

        this.addMediacalInstitutionForm = this.fb.group({
            'medicalInstitution': [null, Validators.required]
        });

        this.subscribeToEvents();
        this.initPage();

        this.loadManufacturers();
        this.loadFarmForms();
        this.loadATCCodes();

        this.loadManufacturersRfPr();
        this.loadFarmFormsRfPr();
        this.loadATCCodesRfPr();

        this.loadManufacturersPlacebo();
        this.loadFarmFormsPlacebo();

        this.loadPhasesList();
        this.loadInvestigatorsList();
    }

    subscribeToEvents() {
        this.subscriptions.push(
            this.medicamentForm.get('atcCode').valueChanges.subscribe(value => {
                if (value) {
                    this.medicamentForm.get('subjectsSC').reset();
                    this.medicamentForm.get('subjectsSC').disable();
                } else {
                    this.medicamentForm.get('subjectsSC').enable();
                }
            })
        );

        this.subscriptions.push(
            this.referenceProductFormn.get('name').valueChanges.subscribe(value => {
                (value && value.length > 0) ? this.isValidRefProduct = true : this.isValidRefProduct = false;
                if (this.isValidRefProduct) {
                    this.referenceProductFormn.get('manufacture').enable();
                    this.referenceProductFormn.get('dose').enable();
                    this.referenceProductFormn.get('atcCode').enable();
                    this.referenceProductFormn.get('administratingMode').enable();
                    this.referenceProductFormn.get('pharmaceuticalForm').enable();
                } else {
                    this.referenceProductFormn.get('manufacture').disable();
                    this.referenceProductFormn.get('manufacture').reset();
                    this.referenceProductFormn.get('dose').disable();
                    this.referenceProductFormn.get('dose').reset();
                    this.referenceProductFormn.get('pharmaceuticalForm').disable();
                    this.referenceProductFormn.get('pharmaceuticalForm').reset();
                    this.referenceProductFormn.get('atcCode').disable();
                    this.referenceProductFormn.get('atcCode').reset();
                    this.referenceProductFormn.get('administratingMode').disable();
                    this.referenceProductFormn.get('administratingMode').reset();
                    this.refProdActiveSubstances = [];
                }
            })
        );

        this.subscriptions.push(
            this.placeboFormn.get('name').valueChanges.subscribe(value => {
                if (value && value.length > 0) {
                    this.placeboFormn.get('administratingMode').enable();
                    this.placeboFormn.get('pharmaceuticalForm').enable();
                    this.placeboFormn.get('manufacture').enable();
                } else {
                    this.placeboFormn.get('administratingMode').disable();
                    this.placeboFormn.get('administratingMode').reset();
                    this.placeboFormn.get('pharmaceuticalForm').disable();
                    this.placeboFormn.get('pharmaceuticalForm').reset();
                    this.placeboFormn.get('manufacture').disable();
                    this.placeboFormn.get('manufacture').reset();
                }
            })
        );
    }

    loadPhasesList() {
        this.subscriptions.push(
            this.administrationService.getClinicalTrailsPhases().subscribe(data => {
                this.phaseList = data;
            }, error => console.log(error))
        );
    }

    loadATCCodesRfPr() {
        this.atcCodesRfPr =
            this.atcCodesInputsRfPr.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        console.log('result && result.length > 0', result);
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingAtcCodesRfPr = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllAtcCodesByCode(term).pipe(
                        tap(() => this.loadingAtcCodesRfPr = false)
                    )
                )
            );
    }

    loadFarmFormsRfPr() {
        this.farmFormsRfPr =
            this.farmFormsInputsRfPr.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingFarmFormsRfPr = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllPharamceuticalFormsByName(term).pipe(
                        tap(() => this.loadingFarmFormsRfPr = false)
                    )
                )
            );
    }

    loadFarmFormsPlacebo() {
        this.farmFormsPlacebo =
            this.farmFormsInputsPlacebo.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingFarmFormsPlacebo = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllPharamceuticalFormsByName(term).pipe(
                        tap(() => this.loadingFarmFormsPlacebo = false)
                    )
                )
            );
    }

    loadManufacturersRfPr() {
        this.manufacturersRfPr =
            this.manufacturerInputsRfPr.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingManufacturerRfPr = true;

                }),
                flatMap(term =>
                    this.administrationService.getManufacturersByName(term).pipe(
                        tap(() => this.loadingManufacturerRfPr = false)
                    )
                )
            );
    }

    loadManufacturersPlacebo() {
        this.manufacturersPlacebo =
            this.manufacturerInputsPlacebo.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingManufacturerPlacebo = true;

                }),
                flatMap(term =>
                    this.administrationService.getManufacturersByName(term).pipe(
                        tap(() => this.loadingManufacturerPlacebo = false)
                    )
                )
            );
    }

    loadATCCodes() {
        this.atcCodes =
            this.atcCodesInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        console.log('result && result.length > 0', result);
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

    loadFarmForms() {
        this.farmForms =
            this.farmFormsInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingFarmForms = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllPharamceuticalFormsByName(term).pipe(
                        tap(() => this.loadingFarmForms = false)
                    )
                )
            );
    }

    loadManufacturers() {
        this.manufacturers =
            this.manufacturerInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingManufacturer = true;
                }),
                flatMap(term =>
                    this.administrationService.getManufacturersByName(term).pipe(
                        tap(() => this.loadingManufacturer = false)
                    )
                )
            );
    }

    loadDocTypes(data) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode(data.type.id, data.currentStep).subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data2 => {
                                let availableDocsArr = [];
                                step.availableDocTypes ? availableDocsArr = step.availableDocTypes.split(',') : availableDocsArr = [];
                                // console.log('availableDocsArr', availableDocsArr);
                                if (step.availableDocTypes) {
                                    this.docTypes = data2;
                                    this.docTypes = this.docTypes.filter(r => availableDocsArr.includes(r.category));
                                }
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error))
        );
    }

    initPage() {
        this.subscriptions.push(
            this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(
                    this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                            this.reqReqInitData = data;
                            console.log('clinicalTrails', data);

                            this.evaluateClinicalTrailForm.get('id').setValue(data.id);
                            this.evaluateClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                            this.evaluateClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                            if (data.company) {
                                this.evaluateClinicalTrailForm.get('company').setValue(data.company);
                            } else {
                                this.mandatedContactName = data.registrationRequestMandatedContacts[0].mandatedFirstname.concat(' ')
                                    .concat(data.registrationRequestMandatedContacts[0].mandatedLastname);
                            }
                            this.evaluateClinicalTrailForm.get('type').setValue(data.type);
                            this.evaluateClinicalTrailForm.get('typeCode').setValue(data.type.code);
                            this.evaluateClinicalTrailForm.get('initiator').setValue(data.initiator);
                            this.evaluateClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);
                            this.evaluateClinicalTrailForm.get('ctPaymentOrdersEntities').setValue(data.ctPaymentOrdersEntities);
                            this.evaluateClinicalTrailForm.get('registrationRequestMandatedContacts').setValue(data.registrationRequestMandatedContacts);

                            this.evaluateClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                            this.evaluateClinicalTrailForm.get('clinicalTrails.medicalInstitutions').setValue(
                                data.medicalInstitutions == null ? [] : data.clinicalTrails.medicalInstitutions);
                            this.evaluateClinicalTrailForm.get('clinicalTrails.treatment').setValue(
                                data.clinicalTrails.treatment == null ? this.treatmentList[0] : data.clinicalTrails.treatment);
                            if (data.clinicalTrails.provenance == null) {
                                this.evaluateClinicalTrailForm.get('clinicalTrails.provenance').setValue(this.provenanceList[0]);
                                this.evaluateClinicalTrailForm.get('clinicalTrails.trialPopInternat').disable();
                            } else {
                                this.evaluateClinicalTrailForm.get('clinicalTrails.provenance').setValue(data.clinicalTrails.provenance);
                                data.clinicalTrails.provenance.id != 4 ?
                                    this.evaluateClinicalTrailForm.get('clinicalTrails.trialPopInternat').disable() :
                                    this.evaluateClinicalTrailForm.get('clinicalTrails.trialPopInternat').enable();
                            }

                            if (data.clinicalTrails.medicament !== null) {
                                this.medicamentForm.setValue(data.clinicalTrails.medicament);
                                this.medActiveSubstances = data.clinicalTrails.medicament.activeSubstances;
                            }

                            if (data.clinicalTrails.referenceProduct !== null) {
                                this.referenceProductFormn.setValue(data.clinicalTrails.referenceProduct);
                                this.refProdActiveSubstances = data.clinicalTrails.referenceProduct.activeSubstances;
                            } else {
                                this.referenceProductFormn.get('name').setValue('');
                            }

                            if (data.clinicalTrails.placebo !== null) {
                                this.placeboFormn.setValue(data.clinicalTrails.placebo);
                            } else {
                                this.placeboFormn.get('name').setValue('');
                            }

                            if (data.clinicalTrails.medicalInstitutions !== null) {
                                console.log('mediacalInstitutionsList', data.clinicalTrails.medicalInstitutions);
                                this.mediacalInstitutionsList = data.clinicalTrails.medicalInstitutions;
                            }

                            this.docs = data.documents;
                            this.docs.forEach(doc => doc.isOld = true);

                            this.receiptsList = data.receipts;
                            this.paymentOrdersList = data.paymentOrders;

                            // console.log('clinicalTrails', this.evaluateClinicalTrailForm);

                            this.loadDocTypes(data);
                            this.loadInvestigatorsList();
                            this.loadMedicalInstitutionsList();
                        },
                        error => console.log(error)
                    ));
            }));
    }

    loadMedicalInstitutionsList() {
        this.subscriptions.push(
            this.administrationService.getAllMedicalInstitutions().subscribe(data => {
                this.allMediacalInstitutionsList = data;
                console.log('allMediacalInstitutionsList', data);

                if (this.mediacalInstitutionsList !== undefined && this.mediacalInstitutionsList !== null && this.mediacalInstitutionsList.length > 0) {
                    const missing = this.allMediacalInstitutionsList.filter(item =>
                        !this.mediacalInstitutionsList.some(other => item.id === other.nmMedicalInstitution.id));
                    this.allMediacalInstitutionsList = missing;
                }
            }, error => console.log(error))
        );
    }

    addMedicalInstitution() {
        // console.log( 'this.addMediacalInstitutionForm',  this.addMediacalInstitutionForm);
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = true;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        // dialogConfig2.height = '600px';
        dialogConfig2.width = '800px';

        dialogConfig2.data = {
            nmMedicalInstitution: this.addMediacalInstitutionForm.get('medicalInstitution').value,
            investigatorsList: this.allInvestigatorsList
        };

        const dialogRef = this.dialog.open(MedInstInvestigatorsDialogComponent, dialogConfig2);

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                console.log('result', result);
                if (result == null || result == undefined || result.success === false) {
                    return;
                }
                const medInst = result.medicalInstitution.nmMedicalInstitution;
                console.log('medInst', medInst);
                this.mediacalInstitutionsList.push(result.medicalInstitution);
                console.log('this.mediacalInstitutionsList', this.mediacalInstitutionsList);
                const intdexToDelete = this.allMediacalInstitutionsList.indexOf(medInst);
                console.log('intdexToDelete', intdexToDelete);
                this.allMediacalInstitutionsList.splice(intdexToDelete, 1);
                this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
                this.addMediacalInstitutionForm.get('medicalInstitution').setValue('');
                this.addMediacalInstitutionForm.get('medicalInstitution').markAsUntouched();
            })
        );
    }

    deleteMedicalInstitution(index: number, medInst: any): void {
        // console.log('index', index);
        // console.log('medInst', medInst);

        this.allMediacalInstitutionsList.push(medInst);
        this.mediacalInstitutionsList.splice(index, 1);
        this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
    }

    loadInvestigatorsList() {
        this.subscriptions.push(
            this.administrationService.getAllInvestigators().subscribe(data => {
                    this.allInvestigatorsList = data;
                    this.allInvestigatorsList.forEach(item => {
                        item.main = false;
                    });

                }, error => console.log(error)
            )
        );
    }

    onTreatmentChange(mrChange: MatRadioChange) {
        this.evaluateClinicalTrailForm.get('clinicalTrails.treatment').setValue(this.treatmentList[mrChange.value - 1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.evaluateClinicalTrailForm.get('clinicalTrails.provenance').setValue(this.provenanceList[mrChange.value - 3]);
        if (mrChange.value === 4) {
            this.evaluateClinicalTrailForm.get('clinicalTrails.trialPopInternat').enable();
        } else {
            this.evaluateClinicalTrailForm.get('clinicalTrails.trialPopInternat').reset();
            this.evaluateClinicalTrailForm.get('clinicalTrails.trialPopInternat').disable();
        }
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    save() {
        // this.loadingService.show();
        const formModel = this.evaluateClinicalTrailForm.getRawValue();
        formModel.currentStep = 'E';
        formModel.documents = this.docs;
        formModel.receipts = this.receiptsList;
        formModel.paymentOrders = this.paymentOrdersList;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;
        // console.log('this.mediacalInstitutionsList', this.mediacalInstitutionsList);

        formModel.clinicalTrails.medicament = this.medicamentForm.value;
        formModel.clinicalTrails.medicament.activeSubstances = this.medActiveSubstances;

        formModel.clinicalTrails.referenceProduct = this.referenceProductFormn.value;
        formModel.clinicalTrails.referenceProduct.activeSubstances = this.refProdActiveSubstances;

        formModel.clinicalTrails.placebo = this.placeboFormn.value;

        formModel.assignedUser = this.authService.getUserName();
        console.log('Save data', formModel);
        // return;

        this.subscriptions.push(
            this.requestService.saveClinicalTrailRequest(formModel).subscribe(data => {
                this.loadingService.hide();
                this.errorHandlerService.showSuccess('Datele salvate cu success');
            }, error => {
                this.loadingService.hide();
                console.log(error);
            })
        );
    }

    dysplayInvalidControl(form: FormGroup) {
        const ctFormControls = form['controls'];
        for (const control of Object.keys(ctFormControls)) {
            ctFormControls[control].markAsTouched();
            ctFormControls[control].markAsDirty();
        }
    }

    onSubmit() {
        const formModel = this.evaluateClinicalTrailForm.getRawValue();

        if (this.evaluateClinicalTrailForm.invalid) {
            this.dysplayInvalidControl(this.evaluateClinicalTrailForm.get('clinicalTrails') as FormGroup);
            this.errorHandlerService.showError('Datele studiului clinic contine date invalide');
            return;
        }

        if (this.medicamentForm.invalid) {
            // console.log('this.medicamentForm', this.medicamentForm);
            this.dysplayInvalidControl(this.medicamentForm);
            this.errorHandlerService.showError('MIC Testat contine date invalide');
            return;
        }

        if (this.referenceProductFormn.invalid) {
            this.dysplayInvalidControl(this.referenceProductFormn);
            this.errorHandlerService.showError('MIC referință contine date invalide');
            return;
        }

        if (this.mediacalInstitutionsList.length == 0) {
            this.dysplayInvalidControl(this.addMediacalInstitutionForm);
            this.errorHandlerService.showError('Unitatea medicală pentru desfășurarea studiului nu a fost adaugată');
            return;
        }

        // console.log('this.medicamentForm', this.medicamentForm);
        // console.log('this.referenceProductFormn', this.referenceProductFormn);

        // console.log('formModel', formModel);
        // return;

        this.loadingService.show();
        formModel.documents = this.docs;
        formModel.receipts = this.receiptsList;
        formModel.paymentOrders = this.paymentOrdersList;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrails.medicament = this.medicamentForm.value;
        formModel.clinicalTrails.medicament.activeSubstances = this.medActiveSubstances;
        formModel.clinicalTrails.referenceProduct = this.referenceProductFormn.value;
        formModel.clinicalTrails.referenceProduct.activeSubstances = this.refProdActiveSubstances;
        formModel.clinicalTrails.placebo = this.placeboFormn.value;

        // console.log('formModel', formModel);
        // return;

        formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
        formModel.requestHistories.push({
            startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'E'
        });
        // formModel.clinicalTrails.investigators = this.investigatorsList;

        formModel.assignedUser = this.authService.getUserName();
        // console.log('formModel', JSON.stringify(formModel));

        formModel.currentStep = 'A';
        this.subscriptions.push(
            this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                this.router.navigate(['/dashboard/module/clinic-studies/analyze/' + data.body]);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
                console.log(error);
            })
        );
    }

    interruptProcess() {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        this.subscriptions.push(
            dialogRef2.afterClosed().subscribe(result => {
                // console.log('result', result);
                if (result) {
                    this.loadingService.show();
                    const formModel = this.evaluateClinicalTrailForm.getRawValue();
                    formModel.currentStep = 'I';
                    formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    formModel.requestHistories.push({
                        startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
                        endDate: new Date(),
                        username: this.authService.getUserName(),
                        step: 'E'
                    });
                    formModel.documents = this.docs;
                    this.subscriptions.push(
                        this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                            this.router.navigate(['/dashboard/module/clinic-studies/interrupt/' + data.body]);
                            this.loadingService.hide();
                        }, error => {
                            this.loadingService.hide();
                            console.log(error);
                        })
                    );
                }
            })
        );
    }

    addMedActiveSubstanceDialog() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = true;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                console.log('result', result);
                if (result !== null && result !== undefined && result.response) {
                    this.medActiveSubstances.push({
                        activeSubstance: result.activeSubstance,
                        quantity: result.activeSubstanceQuantity,
                        unitsOfMeasurement: result.activeSubstanceUnit,
                        manufacture: result.manufactures[0].manufacture
                    });
                    console.log('this.medActiveSubstances', this.medActiveSubstances);
                }
            })
        );
    }

    addRefProdActiveSubstanceDialog() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = true;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                console.log('result', result);
                if (result !== null && result !== undefined && result.response) {
                    this.refProdActiveSubstances.push({
                        activeSubstance: result.activeSubstance,
                        quantity: result.activeSubstanceQuantity,
                        unitsOfMeasurement: result.activeSubstanceUnit,
                        manufacture: result.manufactures[0].manufacture
                    });
                }
            })
        );
    }

    removeMedActiveSubstance(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.medActiveSubstances.splice(index, 1);
                }
            })
        );
    }

    removeRefProdActiveSubstance(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.refProdActiveSubstances.splice(index, 1);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.navbarTitleService.showTitleMsg('');
    }

}
