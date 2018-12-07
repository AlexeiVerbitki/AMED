import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from "../../../models/document";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs/index";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {MatDialog, MatDialogConfig, MatRadioChange} from "@angular/material";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {ModalService} from "../../../shared/service/modal.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {DocumentService} from "../../../shared/service/document.service";
import {AdditionalDataDialogComponent} from "../dialog/additional-data-dialog/additional-data-dialog.component";
import {AuthService} from "../../../shared/service/authetication.service";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {MedInstInvestigatorsDialogComponent} from "../dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component";
import {ActiveSubstanceDialogComponent} from "../../../dialog/active-substance-dialog/active-substance-dialog.component";

@Component({
    selector: 'app-a-analiza',
    templateUrl: './a-analiza.component.html',
    styleUrls: ['./a-analiza.component.css']
})
export class AAnalizaComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    analyzeClinicalTrailForm: FormGroup;
    protected docs: Document[] = [];
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

    isWaitingStep: BehaviorSubject<boolean>;

    medicamentForm: FormGroup;
    referenceProductFormn: FormGroup;
    placeboFormn: FormGroup;


    //MediacalInstitutions controls
    addMediacalInstitutionForm: FormGroup;
    allMediacalInstitutionsList: any[] = [];
    mediacalInstitutionsList: any[] = [];

    //Investigators controls
    addInvestigatorForm: FormGroup;
    allInvestigatorsList: any[] = [];
    investigatorsList: any[] = [];

    //Payments control
    paymentTotal: number = 0;

    initialData: any;
    outDocuments: any[] = [];

    protected manufacturers: Observable<any[]>;
    protected loadingManufacturer: boolean = false;
    protected manufacturerInputs = new Subject<string>();

    medActiveSubstances: any[] = [];
    refProdActiveSubstances: any[] = [];

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

    protected measureUnitsPlacebo: any[] = [];

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private medicamentService: MedicamentService,
                private modalService: ModalService,
                private administrationService: AdministrationService,
                public dialogConfirmation: MatDialog,
                private documentService: DocumentService,
                private requestService: RequestService,
                private authService: AuthService,
                private router: Router,
                private taskService: TaskService,
                private loadingService: LoaderService) {

    }

    ngOnInit() {
        this.analyzeClinicalTrailForm = this.fb.group({
            'id': [''],
            'requestNumber': [{value: '', disabled: true}],
            'startDate': [{value: '', disabled: true}],
            'company': [''],
            'currentStep': ['E'],
            'type': [],
            'typeCode': [''],
            'requestHistories': [],
            'initiator': [null],
            'assignedUser': [null],
            'outputDocuments': [],
            'clinicalTrails': this.fb.group({
                'id': [''],
                'title': [{value: '', disabled: this.isWaitingStep}],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['sponsor'],
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
                'clinicTrialAmendEntities':[],
                'comissionNr': [],
                'comissionDate': []
            })
        });

        this.medicamentForm = this.fb.group({
            'id': [null],
            'name': [{value: null, disabled: true}],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufacture': [{value: null, disabled: true}],
            'dose': [{value: null, disabled: true}],
            'volumeQuantityMeasurement': [{value: null, disabled: true}],
            'pharmaceuticalForm': [{value: null, disabled: true}],
            'atcCode': [{value: null, disabled: true}],
            'administratingMode': [{value: null, disabled: true}],
            'activeSubstances': [null, Validators.required]
        });

        this.referenceProductFormn = this.fb.group({
            'id': [null],
            'name': [{value: null, disabled: true}],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufacture': [{value: null, disabled: true}],
            'dose': [{value: null, disabled: true}],
            'volumeQuantityMeasurement': [{value: null, disabled: true}],
            'pharmaceuticalForm': [{value: null, disabled: true}],
            'atcCode': [{value: null, disabled: true}],
            'administratingMode': [{value: null, disabled: true}],
            'activeSubstances': [null, Validators.required]
        });

        this.placeboFormn = this.fb.group({
            'id': [null],
            'name': [{value: null, disabled: true}],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufacture': [{value: null, disabled: true}],
            'dose': [{value: null, disabled: true}],
            'volumeQuantityMeasurement': [{value: null, disabled: true}],
            'pharmaceuticalForm': [{value: null, disabled: true}],
            'atcCode': [{value: null, disabled: true}],
            'administratingMode': [{value: null, disabled: true}],
            'activeSubstances': [null, Validators.required]
        });

        this.addInvestigatorForm = this.fb.group({
            'investigator': []
        });

        this.addMediacalInstitutionForm = this.fb.group({
            'medicalInstitution': []
        });

        this.isWaitingStep = new BehaviorSubject<boolean>(false);

        this.initPage();
        this.disableEnablePage();
        this.loadDocTypes();

        this.loadPhasesList();
    }

    loadPhasesList() {
        this.subscriptions.push(
            this.administrationService.getClinicalTrailsPhases().subscribe(data => {
                this.phaseList = data;
            }, error => console.log(error))
        )
    }

    loadDocTypes() {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3', 'A').subscribe(step => {
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

    disableEnablePage() {
        this.isWaitingStep.asObservable().subscribe(value => {
            let clinicalTrailFGroup = <FormArray>this.analyzeClinicalTrailForm.get('clinicalTrails');
            for (var control in clinicalTrailFGroup.controls) {
                value ? clinicalTrailFGroup.controls[control].disable() : clinicalTrailFGroup.controls[control].enable();
            }
            ;

            for (var control in  this.addInvestigatorForm.controls) {
                value ? this.addInvestigatorForm.controls[control].disable() : this.addInvestigatorForm.controls[control].enable();
            }
        });
    }


    initPage() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                    this.initialData = data;
                    this.analyzeClinicalTrailForm.get('id').setValue(data.id);
                    this.analyzeClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.analyzeClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.analyzeClinicalTrailForm.get('company').setValue(data.company);
                    this.analyzeClinicalTrailForm.get('type').setValue(data.type);
                    this.analyzeClinicalTrailForm.get('typeCode').setValue(data.type.code);
                    this.analyzeClinicalTrailForm.get('initiator').setValue(data.initiator);
                    this.analyzeClinicalTrailForm.get('outputDocuments').setValue(data.outputDocuments);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));

                    this.analyzeClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);
                    this.analyzeClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    this.analyzeClinicalTrailForm.get('clinicalTrails.treatment').setValue(
                        data.clinicalTrails.treatment == null ? this.treatmentList[0] : data.clinicalTrails.treatment);
                    this.analyzeClinicalTrailForm.get('clinicalTrails.provenance').setValue(
                        data.clinicalTrails.provenance == null ? this.provenanceList[0] : data.clinicalTrails.provenance);

                    this.docs = data.documents;
                    //this.docs.forEach(doc => doc.isOld = true);

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
                        //this.placeboFormn.get('volumeQuantityMeasurement').setValue(data.clinicalTrails.placebo.volumeQuantityMeasurement.description);
                    }

                    this.investigatorsList = data.clinicalTrails.investigators;
                    this.mediacalInstitutionsList = data.clinicalTrails.medicalInstitutions;
                    this.outDocuments = data.outputDocuments;

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

                if (this.mediacalInstitutionsList.length > 0) {
                    let missing = this.allMediacalInstitutionsList.filter(item =>
                        !this.mediacalInstitutionsList.some(other => item.id === other.id));
                    this.allMediacalInstitutionsList = missing;
                }
            }, error => console.log(error))
        )
    }

    addMedicalInstitution() {
        // this.mediacalInstitutionsList.push(this.addMediacalInstitutionForm.get('medicalInstitution').value);
        // let intdexToDelete = this.allMediacalInstitutionsList.indexOf(this.addMediacalInstitutionForm.get('medicalInstitution').value);
        // this.allMediacalInstitutionsList.splice(intdexToDelete, 1);
        // this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
        // this.addMediacalInstitutionForm.get('medicalInstitution').setValue('');

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

    // deleteMedicalInstitution(institution) {
    //     var intdexToDelete = this.mediacalInstitutionsList.indexOf(institution);
    //     this.mediacalInstitutionsList.splice(intdexToDelete, 1);
    //     this.allMediacalInstitutionsList.push(institution);
    //     this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
    // }

    deleteMedicalInstitution(i) {
        // console.log('i', i);
        // console.log('this.mediacalInstitutionsList', this.mediacalInstitutionsList);
        // console.log('this.allMediacalInstitutionsList', this.allMediacalInstitutionsList);

        this.allMediacalInstitutionsList.push(this.mediacalInstitutionsList[i]);
        this.mediacalInstitutionsList.splice(i, 1);
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
        this.analyzeClinicalTrailForm.get('clinicalTrails.treatment').setValue(this.treatmentList[mrChange.value - 1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.analyzeClinicalTrailForm.get('clinicalTrails.provenance').setValue(this.provenanceList[mrChange.value - 3]);
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    requestAdditionalData() {
        const dialogRef2 = this.dialogConfirmation.open(AdditionalDataDialogComponent, {
            data: {
                requestNumber: 'SL-' + this.analyzeClinicalTrailForm.get('requestNumber').value,
                requestId: this.analyzeClinicalTrailForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA',
                startDate: this.analyzeClinicalTrailForm.get('startDate').value
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                result.docType = this.docTypes.find(doc => doc.category === 'SL');
                this.initialData.outputDocuments.push(result);
                this.subscriptions.push(this.requestService.addOutputDocumentRequest(this.initialData).subscribe(data => {
                        console.log('outDocuments', data);
                        //this.outDocuments = data.body.clinicalTrails.outputDocuments;
                    }, error => console.log(error))
                );
            }
        });
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked;
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

                console.log('this.analyzeClinicalTrailForm.getRawValue().outputDocuments', this.analyzeClinicalTrailForm.getRawValue());
                console.log('this.initialData.', this.initialData);

                this.initialData.outputDocuments.forEach((item, index) => {
                    if (item === doc) this.initialData.outputDocuments.splice(index, 1);
                });

                this.subscriptions.push(this.requestService.saveClinicalTrailRequest(this.initialData).subscribe(data => {
                    }, error => console.log(error))
                );
            }
        });
    }

    viewDoc(document: any) {
        console.log('viewDoc', document);
        if (document.docType.category == 'RA') {
            this.subscriptions.push(this.documentService.viewRequest(document.number,
                document.content,
                document.title,
                document.docType.category).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }, error => {
                    console.log('error ', error);
                }
                )
            );
        } else if (document.docType.category == 'DD') {
            this.subscriptions.push(this.documentService.viewDD(document.number).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }, error => {
                    console.log('error ', error);
                }
                )
            );
        }
    }

    save() {
        this.loadingService.show();
        let formModel = this.analyzeClinicalTrailForm.getRawValue();
        formModel.currentStep = 'A';
        formModel.documents = this.docs;
        formModel.outputDocuments = this.outDocuments;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

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
        let formModel = this.analyzeClinicalTrailForm.getRawValue();
        console.log("Submit data", formModel);

        if (this.analyzeClinicalTrailForm.invalid || this.paymentTotal < 0) {
            alert('Invalid Form!!');
            console.log("Not submitted data", formModel);
            return;
        }

        this.loadingService.show();

        formModel.currentStep = 'AP';
        formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
        formModel.requestHistories.push({
            startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'A'
        });
        formModel.documents = this.docs;
        formModel.clinicalTrails.investigators = this.investigatorsList;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        console.log("evaluareaPrimaraObjectLet", JSON.stringify(formModel));

        formModel.currentStep = 'AP';
        formModel.assignedUser = this.authService.getUserName();
        this.subscriptions.push(
            this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                this.router.navigate(['/dashboard/module/clinic-studies/approval/' + data.body]);
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
            console.log('result', result);
            if (result) {
                this.loadingService.show();
                let formModel = this.analyzeClinicalTrailForm.getRawValue();
                formModel.currentStep = 'I';
                formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                formModel.requestHistories.push({
                    startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
                    endDate: new Date(),
                    username: this.authService.getUserName(),
                    step: 'A'
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

    disableEnableForm() {
        this.isWaitingStep.next(!this.isWaitingStep.value);
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
            if (result !== undefined && result.response) {
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
            if (result !== undefined && result.response) {
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
            if (result.response) {
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
            if (result.response) {
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
    }

}
