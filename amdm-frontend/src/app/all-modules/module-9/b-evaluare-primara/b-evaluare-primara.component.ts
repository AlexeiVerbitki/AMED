import {Component, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {TaskService} from "../../../shared/service/task.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatRadioChange} from "@angular/material";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";

@Component({
    selector: 'app-b-evaluare-primara',
    templateUrl: './b-evaluare-primara.component.html',
    styleUrls: ['./b-evaluare-primara.component.css']
})
export class BEvaluarePrimaraComponent implements OnInit {

    treatmentList: any[] = [
        {'id': 1, 'description': 'Unicentric', 'code': 'U'},
        {'id': 2, 'description': 'Multicentric', 'code': 'M'}
    ];

    provenanceList: any[] = [
        {'id': 3, 'description': 'Național', 'code': 'N'},
        {'id': 4, 'description': 'Internațional', 'code': 'I'}
    ];

    private subscriptions: Subscription[] = [];

    clinicTrailAmendForm: FormGroup;

    docs: Document[] = [];
    docTypes: any[] = [];

    addMediacalInstitutionForm: FormGroup;
    allMediacalInstitutionsList: any[] = [];
    mediacalInstitutionsList: any[] = [];

    medicamentForm: FormGroup;
    referenceProductFormn: FormGroup;
    placeboFormn: FormGroup;

    protected manufacturers: Observable<any[]>;
    protected loadingManufacturer: boolean = false;
    protected manufacturerInputs = new Subject<string>();

    protected measureUnits: any[] = [];
    protected measureUnitsRfPr: any[] = [];
    protected measureUnitsPlacebo: any[] = [];
    protected loadingMeasureUnits: boolean = false;

    protected farmForms: Observable<any[]>;
    protected loadingFarmForms: boolean = false;
    protected farmFormsInputs = new Subject<string>();

    protected atcCodes: Observable<any[]>;
    protected loadingAtcCodes: boolean = false;
    protected atcCodesInputs = new Subject<string>();

    protected manufacturersRfPr: Observable<any[]>;
    protected loadingManufacturerRfPr: boolean = false;
    protected manufacturerInputsRfPr = new Subject<string>();

    protected farmFormsRfPr: Observable<any[]>;
    protected loadingFarmFormsRfPr: boolean = false;
    protected farmFormsInputsRfPr = new Subject<string>();

    protected atcCodesRfPr: Observable<any[]>;
    protected loadingAtcCodesRfPr: boolean = false;
    protected atcCodesInputsRfPr = new Subject<string>();

    //Payments control
    receiptsList: Receipt[] = [];
    paymentOrdersList: PaymentOrder[] = [];
    paymentTotal: number = 0;


    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private taskService: TaskService,
                private administrationService: AdministrationService) {
    }

    ngOnInit() {
        this.clinicTrailAmendForm = this.fb.group({
            'id': [''],
            'requestNumber': {value: '', disabled: true},
            'startDate': {value: '', disabled: true},
            'company': [''],
            'type': [''],
            'typeCode': [''],
            'initiator': [null],
            'assignedUser': [null],
            'receipts': [],
            'paymentOrders': [],
            'outputDocuments': [],
            'clinicalTrailAmendment': this.fb.group({
                'id': [''],
                'title': ['title', Validators.required],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['', Validators.required],
                'phase': ['', Validators.required],
                'eudraCtNr': ['eudraCtNr', Validators.required],
                'code': ['', Validators.required],
                'medicalInstitutions': [],
                'investigators': [],
                'trialPopulation': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'medicament': [],
                'referenceProduct': [],
                'placebo': [],
                'status': ['P'],
            }),
            'requestHistories': []
        });

        this.addMediacalInstitutionForm = this.fb.group({
            'medicalInstitution': []
        });

        this.medicamentForm = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufacture': [null, Validators.required],
            'dose': [null, Validators.required],
            'volumeQuantityMeasurement': [null, Validators.required],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null, Validators.required],
            'administratingMode': [null, Validators.required]
        });

        this.referenceProductFormn = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufacture': [null, Validators.required],
            'dose': [null, Validators.required],
            'volumeQuantityMeasurement': [null, Validators.required],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null, Validators.required],
            'administratingMode': [null, Validators.required]
        });

        this.placeboFormn = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufacture': [null, Validators.required],
            'dose': [null, Validators.required],
            'volumeQuantityMeasurement': [null, Validators.required],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null, Validators.required],
            'administratingMode': [null, Validators.required]
        });

        this.initPage();
        this.loadDocTypes();
        this.loadMedicalInstitutionsList();
        this.loadManufacturers();
        this.initMeasureUnits();
        this.loadFarmForms();
        this.loadATCCodes();

        this.loadManufacturersRfPr();
        this.loadFarmFormsRfPr();
        this.loadATCCodesRfPr();
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    loadATCCodesRfPr() {
        this.atcCodesRfPr =
            this.atcCodesInputsRfPr.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        console.log("result && result.length > 0", result);
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
                    if (result && result.length > 2) return true;
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

    loadManufacturersRfPr() {
        this.manufacturersRfPr =
            this.manufacturerInputsRfPr.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
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

    loadATCCodes() {
        this.atcCodes =
            this.atcCodesInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        console.log("result && result.length > 0", result);
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
                    if (result && result.length > 2) return true;
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

    initMeasureUnits() {
        this.loadingMeasureUnits = true;
        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                this.measureUnits = data;
                this.measureUnitsRfPr = data;
                this.measureUnitsPlacebo = data;
                this.loadingMeasureUnits = false;
            }, error => console.log(error))
        );
    }

    loadManufacturers() {
        this.manufacturers =
            this.manufacturerInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
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

    addMedicalInstitution() {
        this.mediacalInstitutionsList.push(this.addMediacalInstitutionForm.get('medicalInstitution').value);
        let intdexToDelete = this.allMediacalInstitutionsList.indexOf(this.addMediacalInstitutionForm.get('medicalInstitution').value);
        this.allMediacalInstitutionsList.splice(intdexToDelete, 1);
        this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
        this.addMediacalInstitutionForm.get('medicalInstitution').setValue('');
    }

    deleteMedicalInstitution(institution) {
        var intdexToDelete = this.mediacalInstitutionsList.indexOf(institution);
        this.mediacalInstitutionsList.splice(intdexToDelete, 1);
        this.allMediacalInstitutionsList.push(institution);
        this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
    }

    loadMedicalInstitutionsList() {
        this.subscriptions.push(
            this.administrationService.getAllMedicalInstitutions().subscribe(data => {
                this.allMediacalInstitutionsList = data;

                if (this.mediacalInstitutionsList.length > 0) {
                    let missing = this.allMediacalInstitutionsList.filter(item =>
                        !this.mediacalInstitutionsList.some(other => item.id === other.id));
                    this.allMediacalInstitutionsList = missing;
                }
            }, error => console.log(error))
        )
    }

    loadDocTypes() {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('4', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                if (step.availableDocTypes) {
                                    this.docTypes = data;
                                    this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
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

    initPage() {
        this.subscriptions.push(
            this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getClinicalTrailAmendmentRequest(params['id']).subscribe(data => {
                        console.log(data);
                        this.clinicTrailAmendForm.get('id').setValue(data.id);
                        this.clinicTrailAmendForm.get('requestNumber').setValue(data.requestNumber);
                        this.clinicTrailAmendForm.get('startDate').setValue(new Date(data.startDate));
                        this.clinicTrailAmendForm.get('company').setValue(data.company);
                        this.clinicTrailAmendForm.get('type').setValue(data.type);
                        this.clinicTrailAmendForm.get('typeCode').setValue(data.type.code);
                        this.clinicTrailAmendForm.get('initiator').setValue(data.initiator);
                        this.clinicTrailAmendForm.get('requestHistories').setValue(data.requestHistories);

                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.id').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].id);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.title').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].title);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.treatment').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].treatment);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.provenance').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].provenance);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.sponsor').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].sponsor);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.phase').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].phase);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.eudraCtNr').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].eudraCtNr);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.code').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].code);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.trialPopulation').setValue(data.clinicalTrails.clinicTrialAmendEntities[0].trialPopulation);


                        if (data.clinicalTrails.medicament !== null) {
                            this.medicamentForm.setValue(data.clinicalTrails.clinicTrialAmendEntities[0].medicament);
                        }
                        if (data.clinicalTrails.referenceProduct !== null) {
                            this.referenceProductFormn.setValue(data.clinicalTrails.clinicTrialAmendEntities[0].referenceProduct);
                        }
                        if (data.clinicalTrails.placebo !== null) {
                            this.placeboFormn.setValue(data.clinicalTrails.clinicTrialAmendEntities[0].placebo);
                        }
                        // console.log('data.clinicalTrails.clinicTrialAmendEntities[0]', data.clinicalTrails.clinicTrialAmendEntities);
                        // console.log(' this.clinicTrailAmendForm', this.clinicTrailAmendForm);

                        //
                        //
                        // this.investigatorsList = data.clinicalTrails.investigators;
                        this.mediacalInstitutionsList = data.clinicalTrails.clinicTrialAmendEntities[0].medicalInstitutions;
                        this.docs = data.documents;
                        this.docs.forEach(doc => doc.isOld = true);
                        //
                        this.receiptsList = data.receipts;
                        this.paymentOrdersList = data.paymentOrders;
                        //
                        // this.loadInvestigatorsList();
                        this.loadMedicalInstitutionsList();
                    },
                    error => console.log(error)
                ))
            })
        );
    }

    onTreatmentChange(mrChange: MatRadioChange) {
        this.clinicTrailAmendForm.get('clinicalTrailAmendment.treatment').setValue(this.treatmentList[mrChange.value - 1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.clinicTrailAmendForm.get('clinicalTrailAmendment.provenance').setValue(this.provenanceList[mrChange.value - 3]);
    }

}
