import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from "../../../models/document";
import {Observable, Subject, Subscription} from "rxjs/index";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {Receipt} from "../../../models/receipt";
import {PaymentOrder} from "../../../models/paymentOrder";
import {AuthService} from "../../../shared/service/authetication.service";
import {MatDialog, MatDialogConfig, MatRadioChange} from "@angular/material";
import {DocumentService} from "../../../shared/service/document.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {ActiveSubstanceDialogComponent} from "../../../dialog/active-substance-dialog/active-substance-dialog.component";
import {MedInstInvestigatorsDialogComponent} from "../dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component";

@Component({
    selector: 'app-a-evaluarea-primara',
    templateUrl: './a-evaluarea-primara.component.html',
    styleUrls: ['./a-evaluarea-primara.component.css']
})
export class AEvaluareaPrimaraComponent implements OnInit, OnDestroy {
    private readonly SEARCH_STRING_LENGTH: number = 2;

    private subscriptions: Subscription[] = [];
    evaluateClinicalTrailForm: FormGroup;
    docs: Document[] = [];
    docTypes: any[];

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
    paymentTotal: number = 0;

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

    medActiveSubstances: any[] = [];
    refProdActiveSubstances: any[] = [];

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
                private loadingService: LoaderService) {

    }

    ngOnInit() {
        this.evaluateClinicalTrailForm = this.fb.group({
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
            'clinicalTrails': this.fb.group({
                'id': [''],
                'title': ['title', Validators.required],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['sponsor', Validators.required],
                'phase': ['faza', Validators.required],
                'eudraCtNr': ['eudraCtNr', Validators.required],
                'code': ['code', Validators.required],
                'medicalInstitutions': [],
                'trialPopNat': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'trialPopInternat': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'medicament': [],
                'referenceProduct': [],
                'status': ['P'],
                'pharmacovigilance': [],
                'placebo': [],
                'clinicTrialAmendEntities': [],
                'comissionNr': [],
                'comissionDate': []
            }),

            'requestHistories': []
        });

        this.medicamentForm = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'registrationNumber': [null],
            'registrationDate': [null],
            'internationalMedicamentName': [null],
            'manufacture': [null, Validators.required],
            'dose': [null, Validators.required],
            'volumeQuantityMeasurement': [null],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null, Validators.required],
            'administratingMode': [null, Validators.required],
            'activeSubstances': [null]
        });

        this.referenceProductFormn = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'registrationNumber': [null],
            'registrationDate': [null],
            'internationalMedicamentName': [null],
            'manufacture': [null, Validators.required],
            'dose': [null, Validators.required],
            'volumeQuantityMeasurement': [null],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null, Validators.required],
            'administratingMode': [null, Validators.required],
            'activeSubstances': [null]
        });

        this.placeboFormn = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'registrationNumber': [null],
            'registrationDate': [null],
            'internationalMedicamentName': [null],
            'manufacture': [null, Validators.required],
            'dose': [null, Validators.required],
            'volumeQuantityMeasurement': [null],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null, Validators.required],
            'administratingMode': [null, Validators.required],
            'activeSubstances': [null, Validators.required]
        });

        this.addInvestigatorForm = this.fb.group({
            'investigator': []
        });

        this.addMediacalInstitutionForm = this.fb.group({
            'medicalInstitution': [{}]
        });

        this.initPage();
        this.loadDocTypes();

        this.loadManufacturers();
        this.initMeasureUnits();
        this.loadFarmForms();
        this.loadATCCodes();

        this.loadManufacturersRfPr();
        this.loadFarmFormsRfPr();
        this.loadATCCodesRfPr();

        this.loadPhasesList();
        this.loadInvestigatorsList();
    }

    loadPhasesList() {
        this.subscriptions.push(
            this.administrationService.getClinicalTrailsPhases().subscribe(data => {
                this.phaseList = data;
            }, error => console.log(error))
        )
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


    loadDocTypes() {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3', 'E').subscribe(step => {
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

    initPage() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                    console.log('clinicalTrails', data);

                    this.evaluateClinicalTrailForm.get('id').setValue(data.id);
                    this.evaluateClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.evaluateClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.evaluateClinicalTrailForm.get('company').setValue(data.company);
                    this.evaluateClinicalTrailForm.get('type').setValue(data.type);
                    this.evaluateClinicalTrailForm.get('typeCode').setValue(data.type.code);
                    this.evaluateClinicalTrailForm.get('initiator').setValue(data.initiator);
                    this.evaluateClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);
                    console.log("data.requestHistories",data.requestHistories)


                    this.evaluateClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    this.evaluateClinicalTrailForm.get('clinicalTrails.medicalInstitutions').setValue(
                        data.medicalInstitution == null ? [] : data.clinicalTrails.medicalInstitutions);
                    this.evaluateClinicalTrailForm.get('clinicalTrails.treatment').setValue(
                        data.clinicalTrails.treatment == null ? this.treatmentList[0] : data.clinicalTrails.treatment);
                    this.evaluateClinicalTrailForm.get('clinicalTrails.provenance').setValue(
                        data.clinicalTrails.provenance == null ? this.provenanceList[0] : data.clinicalTrails.provenance);

                    if (data.clinicalTrails.medicament !== null) {
                        this.medicamentForm.setValue(data.clinicalTrails.medicament);
                        this.medActiveSubstances = data.clinicalTrails.medicament.activeSubstances;
                    }

                    if (data.clinicalTrails.referenceProduct !== null) {
                        this.referenceProductFormn.setValue(data.clinicalTrails.referenceProduct);
                        this.refProdActiveSubstances = data.clinicalTrails.referenceProduct.activeSubstances;
                    }

                    if (data.clinicalTrails.placebo !== null) {
                        this.placeboFormn.setValue(data.clinicalTrails.placebo);
                    }

                    if ( data.clinicalTrails.medicalInstitutions !== null) {
                        this.mediacalInstitutionsList = data.clinicalTrails.medicalInstitutions;
                    }


                    this.docs = data.documents;
                    this.docs.forEach(doc => doc.isOld = true);

                    this.receiptsList = data.receipts;
                    this.paymentOrdersList = data.paymentOrders;

                    console.log('clinicalTrails', this.evaluateClinicalTrailForm);

                    this.loadInvestigatorsList();
                    this.loadMedicalInstitutionsList();
                },
                error => console.log(error)
            ))
        }))
    }

    loadMedicalInstitutionsList() {
        this.subscriptions.push(
            this.administrationService.getAllMedicalInstitutions().subscribe(data => {
                this.allMediacalInstitutionsList = data;

                if (this.mediacalInstitutionsList !== undefined && this.mediacalInstitutionsList !== null && this.mediacalInstitutionsList.length > 0) {
                    let missing = this.allMediacalInstitutionsList.filter(item =>
                        !this.mediacalInstitutionsList.some(other => item.id === other.id));
                    this.allMediacalInstitutionsList = missing;
                }
            }, error => console.log(error))
        )
    }

    addMedicalInstitution() {
        // console.log( 'this.addMediacalInstitutionForm',  this.addMediacalInstitutionForm);

        let dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '600px';
        dialogConfig2.width = '650px';

        dialogConfig2.data = {
            medicalInstitution: this.addMediacalInstitutionForm.get('medicalInstitution').value,
            investigatorsList: this.allInvestigatorsList
        }

        let dialogRef = this.dialog.open(MedInstInvestigatorsDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result == null || result == undefined || result.success === false) {
                return;
            }

            let medInst = this.addMediacalInstitutionForm.get('medicalInstitution').value;
            medInst.investigators = result.investigators;
            console.log('result.investigators', result.investigators);
            this.mediacalInstitutionsList.push(medInst);
            let intdexToDelete = this.allMediacalInstitutionsList.indexOf(this.addMediacalInstitutionForm.get('medicalInstitution').value);
            this.allMediacalInstitutionsList.splice(intdexToDelete, 1);
            this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
            this.addMediacalInstitutionForm.get('medicalInstitution').setValue('');
        });
    }

    deleteMedicalInstitution(i) {
        // console.log('i', i);
        // console.log('this.mediacalInstitutionsList', this.mediacalInstitutionsList);
        // console.log('this.allMediacalInstitutionsList', this.allMediacalInstitutionsList);

        this.allMediacalInstitutionsList.push(this.mediacalInstitutionsList[i]);
        this.mediacalInstitutionsList.splice(i, 1);
        this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
    }

    editMedicalInstitution(i) {
        let dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '600px';
        dialogConfig2.width = '650px';

        dialogConfig2.data = {
            medicalInstitution: this.addMediacalInstitutionForm.get('medicalInstitution').value,
            investigatorsList: this.allInvestigatorsList,
            collectedInvestigators: this.mediacalInstitutionsList[i].investigators
        }

        let dialogRef = this.dialog.open(MedInstInvestigatorsDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result == null || result == undefined || result.success === false) {
                return;
            }
            this.mediacalInstitutionsList[i].investigators = result.investigators;
        });

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
        )
    }

    addInvestigator() {
        this.investigatorsList.push(this.addInvestigatorForm.get('investigator').value);
        let intdexToDelete = this.allInvestigatorsList.indexOf(this.addInvestigatorForm.get('investigator').value);
        this.allInvestigatorsList.splice(intdexToDelete, 1);
        this.allInvestigatorsList = this.allInvestigatorsList.splice(0);
        this.addInvestigatorForm.get('investigator').setValue('');
    }

    deleteInvestigator(investigator) {
        var intdexToDelete = this.investigatorsList.indexOf(investigator);
        this.investigatorsList.splice(intdexToDelete, 1);
        this.allInvestigatorsList.push(investigator);
        this.allInvestigatorsList = this.allInvestigatorsList.splice(0);
    }


    onTreatmentChange(mrChange: MatRadioChange) {
        this.evaluateClinicalTrailForm.get('clinicalTrails.treatment').setValue(this.treatmentList[mrChange.value - 1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.evaluateClinicalTrailForm.get('clinicalTrails.provenance').setValue(this.provenanceList[mrChange.value - 3]);
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    save() {
        this.loadingService.show();
        let formModel = this.evaluateClinicalTrailForm.getRawValue();
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
        console.log("Save data", formModel);
        this.subscriptions.push(
            this.requestService.saveClinicalTrailRequest(formModel).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module']);
            }, error => {
                this.loadingService.hide();
                console.log(error)
            })
        )

    }

    onSubmit() {
        let formModel = this.evaluateClinicalTrailForm.getRawValue();

        if (this.evaluateClinicalTrailForm.invalid || this.paymentTotal < 0) {
            alert('Invalid Form1!');
            console.log("Not submitted data", formModel);
            return;
        }

        if (this.medicamentForm.invalid || this.referenceProductFormn.invalid) {
            console.log("this.medicamentForm", this.medicamentForm);
            console.log("this.referenceProductFormn", this.referenceProductFormn);
            alert('Invalid Form2!');
            return;
        }
        console.log("this.medicamentForm", this.medicamentForm);
        console.log("this.referenceProductFormn", this.referenceProductFormn);

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


        formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
        formModel.requestHistories.push({
            startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'E'
        });
        // formModel.clinicalTrails.investigators = this.investigatorsList;

        formModel.assignedUser = this.authService.getUserName();
        console.log("formModel", JSON.stringify(formModel));

        formModel.currentStep = 'A';
        this.subscriptions.push(
            this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                this.router.navigate(['/dashboard/module/clinic-studies/analize/' + data.body]);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
                console.log(error)
            })
        )
    }

    interruptProcess() {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            // console.log('result', result);
            if (result) {
                this.loadingService.show();
                let formModel = this.evaluateClinicalTrailForm.getRawValue();
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
                        console.log(error)
                    })
                )
            }
        });
    }

    addMedActiveSubstanceDialog() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result !== null && result !== undefined && result.response) {
                this.medActiveSubstances.push({
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufacture: result.manufactureSA
                });
            }
        });
    }

    addRefProdActiveSubstanceDialog() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result !== null && result !== undefined &&result.response) {
                this.refProdActiveSubstances.push({
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufacture: result.manufactureSA
                });
            }
        });
    }

    editMedActiveSubstance(substance: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';
        dialogConfig2.data = substance;

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined && result.response) {
                this.medActiveSubstances[index] = {
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufacture: result.manufactureSA
                };
            }
        });
    }

    editRefProdActiveSubstance(substance: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';
        dialogConfig2.data = substance;

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined && result.response) {
                this.refProdActiveSubstances[index] = {
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufacture: result.manufactureSA
                };
            }
        });
    }

    removeMedActiveSubstance(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.medActiveSubstances.splice(index, 1);
            }
        });
    }

    removeRefProdActiveSubstance(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refProdActiveSubstances.splice(index, 1);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

}
