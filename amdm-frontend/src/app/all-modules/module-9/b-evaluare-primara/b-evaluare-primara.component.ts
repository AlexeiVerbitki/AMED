import {Component, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs/index";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {TaskService} from "../../../shared/service/task.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog, MatDialogConfig, MatRadioChange} from "@angular/material";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {MedInstInvestigatorsDialogComponent} from "../dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component";
import {ActiveSubstanceDialogComponent} from "../../../dialog/active-substance-dialog/active-substance-dialog.component";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {LoaderService} from "../../../shared/service/loader.service";
import {AuthService} from "../../../shared/service/authetication.service";

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
    paymentTotal: number = 0;

    medActiveSubstances: any[] = [];
    refProdActiveSubstances: any[] = [];

    phaseList: any[] = [];
    allInvestigatorsList: any[] = [];


    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private taskService: TaskService,
                private administrationService: AdministrationService,
                private loadingService: LoaderService,
                private authService: AuthService,
                private router: Router,) {
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
            'outputDocuments': [],
            'clinicalTrailAmendment': this.fb.group({
                'id': [''],
                'registrationRequestId' : [],
                'clinicalTrialsEntityId' : [],
                'title': ['title', Validators.required],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['', Validators.required],
                'phase': ['', Validators.required],
                'eudraCtNr': ['eudraCtNr', Validators.required],
                'code': ['', Validators.required],
                'medicalInstitutions': [],
                'trialPopNat': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'trialPopInternat': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'medicament': [],
                'referenceProduct': [],
                'status': ['P'],
                'placebo': [],
                'comissionNr': [],
                'comissionDate': []
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
            'administratingMode': [null, Validators.required],
            'activeSubstances': [null]
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
            'administratingMode': [null, Validators.required],
            'activeSubstances': [null]
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
            'administratingMode': [null, Validators.required],
            'activeSubstances': [null, Validators.required]
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
        this.loadPhasesList();
        this.loadInvestigatorsList();
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

    loadPhasesList() {
        this.subscriptions.push(
            this.administrationService.getClinicalTrailsPhases().subscribe(data => {
                this.phaseList = data;
            }, error => console.log(error))
        )
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

                        this.clinicTrailAmendForm.get('clinicalTrailAmendment').setValue(data.clinicalTrails.clinicTrialAmendEntities[0]);

                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.medicalInstitutions').setValue(
                            data.clinicalTrails.clinicTrialAmendEntities[0].medicalInstitutions == null ? [] : data.clinicalTrails.clinicTrialAmendEntities[0].medicalInstitutions);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.treatment').setValue(
                            data.clinicalTrails.clinicTrialAmendEntities[0].treatment == null ? this.treatmentList[0] : data.clinicalTrails.treatment);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.provenance').setValue(
                            data.clinicalTrails.clinicTrialAmendEntities[0].provenance == null ? this.provenanceList[0] : data.clinicalTrails.provenance);


                        if (data.clinicalTrails.clinicTrialAmendEntities[0].medicament !== null) {
                            //this.medicamentForm.setValue(data.clinicalTrails.clinicTrialAmendEntities[0].medicament);
                            this.medicamentForm.setValue(data.clinicalTrails.clinicTrialAmendEntities[0].medicament);
                            this.medActiveSubstances = data.clinicalTrails.clinicTrialAmendEntities[0].medicament.activeSubstances;
                        }
                        if (data.clinicalTrails.clinicTrialAmendEntities[0].referenceProduct !== null) {
                            //this.referenceProductFormn.setValue(data.clinicalTrails.clinicTrialAmendEntities[0].referenceProduct);
                            this.referenceProductFormn.setValue(data.clinicalTrails.clinicTrialAmendEntities[0].referenceProduct);
                            this.refProdActiveSubstances = data.clinicalTrails.clinicTrialAmendEntities[0].referenceProduct.activeSubstances;
                        }
                        if (data.clinicalTrails.clinicTrialAmendEntities[0].placebo !== null) {
                            this.placeboFormn.setValue(data.clinicalTrails.clinicTrialAmendEntities[0].placebo);
                        }

                        if ( data.clinicalTrails.clinicTrialAmendEntities[0].medicalInstitutions !== null) {
                            this.mediacalInstitutionsList = data.clinicalTrails.clinicTrialAmendEntities[0].medicalInstitutions;
                        }

                        console.log(' this.clinicTrailAmendForm', this.clinicTrailAmendForm);
                        // console.log('data.clinicalTrails.clinicTrialAmendEntities[0]', data.clinicalTrails.clinicTrialAmendEntities);
                        // console.log(' this.clinicTrailAmendForm', this.clinicTrailAmendForm);

                        this.docs = data.documents;
                        this.docs.forEach(doc => doc.isOld = true);

                        this.loadInvestigatorsList();
                        this.loadMedicalInstitutionsList();
                    },
                    error => console.log(error)
                ))
            })
        );
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


    onTreatmentChange(mrChange: MatRadioChange) {
        this.clinicTrailAmendForm.get('clinicalTrailAmendment.treatment').setValue(this.treatmentList[mrChange.value - 1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.clinicTrailAmendForm.get('clinicalTrailAmendment.provenance').setValue(this.provenanceList[mrChange.value - 3]);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

    save() {
        this.loadingService.show();
        let formModel = this.clinicTrailAmendForm.getRawValue();
        formModel.currentStep = 'E';
        formModel.documents = this.docs;
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
                //this.router.navigate(['dashboard/module']);
            }, error => {
                this.loadingService.hide();
                console.log(error)
            })
        )

    }

}
