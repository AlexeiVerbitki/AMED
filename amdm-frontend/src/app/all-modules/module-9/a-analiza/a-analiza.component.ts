import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../models/document';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs/index';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {MatDialog, MatDialogConfig, MatRadioChange} from '@angular/material';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {ModalService} from '../../../shared/service/modal.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {DocumentService} from '../../../shared/service/document.service';
import {AdditionalDataDialogComponent} from '../dialog/additional-data-dialog/additional-data-dialog.component';
import {AuthService} from '../../../shared/service/authetication.service';
import {TaskService} from '../../../shared/service/task.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {MedInstInvestigatorsDialogComponent} from '../dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component';
import {ActiveSubstanceDialogComponent} from '../../../dialog/active-substance-dialog/active-substance-dialog.component';
import {AddExpertComponent} from "../../../dialog/add-expert/add-expert.component";
import {AddCtExpertComponent} from "../dialog/add-ct-expert/add-ct-expert.component";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";

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
    reqReqInitData: any;

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
    paymentTotal = 0;

    initialData: any;
    outDocuments: any[] = [];

    protected manufacturers: Observable<any[]>;
    protected loadingManufacturer = false;
    protected manufacturerInputs = new Subject<string>();

    medActiveSubstances: any[] = [];
    refProdActiveSubstances: any[] = [];

    protected farmForms: Observable<any[]>;
    protected loadingFarmForms = false;
    protected farmFormsInputs = new Subject<string>();

    protected atcCodes: Observable<any[]>;
    protected loadingAtcCodes = false;
    protected atcCodesInputs = new Subject<string>();

    protected manufacturersRfPr: Observable<any[]>;
    protected loadingManufacturerRfPr = false;
    protected manufacturerInputsRfPr = new Subject<string>();

    protected farmFormsRfPr: Observable<any[]>;
    protected loadingFarmFormsRfPr = false;
    protected farmFormsInputsRfPr = new Subject<string>();

    protected atcCodesRfPr: Observable<any[]>;
    protected loadingAtcCodesRfPr = false;
    protected atcCodesInputsRfPr = new Subject<string>();

    protected measureUnitsPlacebo: any[] = [];

    expertList: any[] = [];

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
                private loadingService: LoaderService,
                private errorHandlerService: ErrorHandlerService) {

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
            'ddIncluded': [],
            'registrationRequestMandatedContacts': [],
            'clinicalTrails': this.fb.group({
                'id': [''],
                'startDateInternational': [''],
                'startDateNational': [''],
                'endDateNational': [''],
                'endDateInternational': [''],
                'title': [{value: '', disabled: this.isWaitingStep}],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': [''],
                'phase': ['faza', Validators.required],
                'eudraCtNr': ['', Validators.required],
                'code': ['code', Validators.required],
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
        );
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
            const clinicalTrailFGroup = <FormArray>this.analyzeClinicalTrailForm.get('clinicalTrails');
            for (const control in clinicalTrailFGroup.controls) {
                value ? clinicalTrailFGroup.controls[control].disable() : clinicalTrailFGroup.controls[control].enable();
            }


            for (const control in  this.addInvestigatorForm.controls) {
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
                    this.analyzeClinicalTrailForm.get('registrationRequestMandatedContacts').setValue(data.registrationRequestMandatedContacts);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));

                    this.analyzeClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);
                    this.analyzeClinicalTrailForm.get('ddIncluded').setValue(data.ddIncluded);

                    this.analyzeClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    this.analyzeClinicalTrailForm.get('clinicalTrails.treatment').setValue(
                        data.clinicalTrails.treatment == null ? this.treatmentList[0] : data.clinicalTrails.treatment);


                    if (data.clinicalTrails.provenance == null) {
                        this.analyzeClinicalTrailForm.get('clinicalTrails.provenance').setValue(this.provenanceList[0]);
                        this.analyzeClinicalTrailForm.get('clinicalTrails.trialPopInternat').disable();
                    } else {
                        this.analyzeClinicalTrailForm.get('clinicalTrails.provenance').setValue(data.clinicalTrails.provenance);
                        data.clinicalTrails.provenance.id != 4 ?
                            this.analyzeClinicalTrailForm.get('clinicalTrails.trialPopInternat').disable() :
                            this.analyzeClinicalTrailForm.get('clinicalTrails.trialPopInternat').enable();
                    }

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

                    this.expertList = data.expertList;
                    console.log('data', data);
                    // console.log('this.analyzeClinicalTrailForm', this.analyzeClinicalTrailForm.value);

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

                if (this.mediacalInstitutionsList.length > 0) {
                    const missing = this.allMediacalInstitutionsList.filter(item =>
                        !this.mediacalInstitutionsList.some(other => item.id === other.id));
                    this.allMediacalInstitutionsList = missing;
                }
            }, error => console.log(error))
        );
    }

    addMedicalInstitution() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '600px';
        dialogConfig2.width = '650px';

        dialogConfig2.data = {
            medicalInstitution: this.addMediacalInstitutionForm.get('medicalInstitution').value,
            investigatorsList: this.allInvestigatorsList
        };

        const dialogRef = this.dialog.open(MedInstInvestigatorsDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result == null || result == undefined || result.success === false) {
                return;
            }

            const medInst = this.addMediacalInstitutionForm.get('medicalInstitution').value;
            medInst.investigators = result.investigators;
            this.mediacalInstitutionsList.push(medInst);
            const intdexToDelete = this.allMediacalInstitutionsList.indexOf(this.addMediacalInstitutionForm.get('medicalInstitution').value);
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
        );
    }

    addInvestigator() {
        this.investigatorsList.push(this.addInvestigatorForm.get('investigator').value);
        const intdexToDelete = this.allInvestigatorsList.indexOf(this.addInvestigatorForm.get('investigator').value);
        this.allInvestigatorsList.splice(intdexToDelete, 1);
        this.allInvestigatorsList = this.allInvestigatorsList.splice(0);
        this.addInvestigatorForm.get('investigator').setValue('');
    }

    deleteInvestigator(investigator) {
        const intdexToDelete = this.investigatorsList.indexOf(investigator);
        this.investigatorsList.splice(intdexToDelete, 1);
        this.allInvestigatorsList.push(investigator);
        this.allInvestigatorsList = this.allInvestigatorsList.splice(0);
    }

    onTreatmentChange(mrChange: MatRadioChange) {
        this.analyzeClinicalTrailForm.get('clinicalTrails.treatment').setValue(this.treatmentList[mrChange.value - 1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.analyzeClinicalTrailForm.get('clinicalTrails.provenance').setValue(this.provenanceList[mrChange.value - 3]);
        if (mrChange.value === 4) {
            this.analyzeClinicalTrailForm.get('clinicalTrails.trialPopInternat').enable();
        } else {
            this.analyzeClinicalTrailForm.get('clinicalTrails.trialPopInternat').reset();
            this.analyzeClinicalTrailForm.get('clinicalTrails.trialPopInternat').disable();
        }
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    requestAdditionalData() {
        this.loadingService.show();
        this.subscriptions.push(this.requestService.getClinicalTrailRequest(this.analyzeClinicalTrailForm.get('id').value).subscribe(data => {
                console.log('getClinicalTrailRequest', data);
                let expertDispozition = data.documents.find(doc => doc.docType.category == 'DDC');
                //console.log('expertDispozition', expertDispozition);
                if (!expertDispozition) {
                    this.errorHandlerService.showError('Dispozitia de distribuire nu este atashata.');
                    return;
                }

                let addDataList = data.outputDocuments.filter(doc => doc.docType.category == 'SL');
                // console.log('addDataList', addDataList);
                // console.log('addDataList.length', addDataList.length);
                const dialogRef2 = this.dialogConfirmation.open(AdditionalDataDialogComponent, {
                    width: '800px',
                    height: '600px',
                    data: {
                        requestNumber: 'SL-' + this.analyzeClinicalTrailForm.get('requestNumber').value + '-' + (addDataList.length + 1),
                        requestId: this.analyzeClinicalTrailForm.get('id').value,
                        modalType: 'REQUEST_ADDITIONAL_DATA',
                        startDate: this.analyzeClinicalTrailForm.get('startDate').value,
                        registrationRequestMandatedContacts: data.registrationRequestMandatedContacts[0],
                        company: data.company
                    },
                    hasBackdrop: false
                });

                dialogRef2.afterClosed().subscribe(result => {
                    console.log('dialog result', result);
                    if (result && result) {
                        let dataToSubmit = {
                            date: result.date,
                            name: 'Scrisoare de solicitare date aditionale',
                            number: result.number,
                            content: result.content,
                            docType: this.docTypes.find(r => r.category == 'SL'),
                            responseReceived: 0,
                            dateOfIssue: new Date(),
                            signerName: result.signer.value,
                            signerFunction: result.signer.description,
                            requestId: this.analyzeClinicalTrailForm.get('id').value
                        }

                        this.documentService.addSLC(dataToSubmit).subscribe(data => {
                            console.log('outDocument', data);
                            this.outDocuments.push(data.body);
                            console.log('outDocuments', this.outDocuments);

                        })
                    }
                });

                this.loadingService.hide();
            }, error => {
                console.log(error);
                this.loadingService.hide();
            })
        );
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked;
    }

    remove(doc: any, index: number) {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result) {
                console.log('doc.id', doc.id);

                this.subscriptions.push(
                    this.documentService.deleteSLById(doc.id).subscribe(data => {
                        console.log('data', data);
                        this.initialData.outputDocuments.splice(index, 1);
                    }, error => console.log(error))
                );
            }
        });
    }

    viewDoc(document: any) {
        let formValue = this.analyzeClinicalTrailForm.value;
        // console.log('formValue', formValue);
        // console.log('viewDoc', document);
        let modelToSubmit = {
            nrDoc: document.number,
            responsiblePerson: formValue.registrationRequestMandatedContacts[0].mandatedLastname + ' ' + formValue.registrationRequestMandatedContacts[0].mandatedFirstname,
            companyName: formValue.company.name,
            requestDate: document.date,
            country: 'Moldova',
            address: formValue.company.legalAddress,
            phoneNumber: formValue.registrationRequestMandatedContacts[0].phoneNumber,
            email: formValue.registrationRequestMandatedContacts[0].email,
            message: document.content,
            function: document.signerFunction,
            signerName: document.signerName
        };
        // console.log('modelToSubmit', modelToSubmit);
        let observable: Observable<any> = null;
        observable = this.documentService.viewRequestNew(modelToSubmit);

        this.subscriptions.push(observable.subscribe(data => {
                let file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            })
        );
    }

    save() {
        this.loadingService.show();
        const formModel = this.analyzeClinicalTrailForm.getRawValue();
        formModel.currentStep = 'A';
        formModel.documents = this.docs;
        formModel.outputDocuments = this.outDocuments;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.assignedUser = this.authService.getUserName();
        formModel.expertList = this.expertList;
        console.log('Save data', formModel);
        this.subscriptions.push(
            this.requestService.saveClinicalTrailRequest(formModel).subscribe(data => {
                this.loadingService.hide();
                // this.router.navigate(['dashboard/module']);
            }, error => {
                this.loadingService.hide();
                console.log(error);
            })
        );
    }

    onSubmit() {
        const formModel = this.analyzeClinicalTrailForm.getRawValue();
        console.log('Submit data', formModel);

        if (this.analyzeClinicalTrailForm.invalid || this.paymentTotal < 0) {
            alert('Invalid Form!!');
            console.log('Not submitted data', formModel);
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
        formModel.outputDocuments = this.outDocuments;
        formModel.clinicalTrails.investigators = this.investigatorsList;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        // console.log('evaluareaPrimaraObjectLet', JSON.stringify(formModel));

        formModel.currentStep = 'AP';
        formModel.assignedUser = this.authService.getUserName();
        // formModel.expertList = this.expertList;
        this.subscriptions.push(
            this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                this.router.navigate(['/dashboard/module/clinic-studies/approval/' + data.body]);
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

        dialogRef2.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result) {
                this.loadingService.show();
                const formModel = this.analyzeClinicalTrailForm.getRawValue();
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
                        console.log(error);
                    })
                );
            }
        });
    }

    disableEnableForm() {
        this.isWaitingStep.next(!this.isWaitingStep.value);
    }

    editMedicalInstitution(i) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '600px';
        dialogConfig2.width = '650px';

        dialogConfig2.data = {
            medicalInstitution: this.addMediacalInstitutionForm.get('medicalInstitution').value,
            investigatorsList: this.allInvestigatorsList,
            collectedInvestigators: this.mediacalInstitutionsList[i].investigators
        };

        const dialogRef = this.dialog.open(MedInstInvestigatorsDialogComponent, dialogConfig2);

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

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result !== undefined && result.response) {
                this.medActiveSubstances.push({
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufacture: result.manufactures[0].manufacture
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

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined && result.response) {
                this.medActiveSubstances[index] = {
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufacture: result.manufactures[0].manufacture
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

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

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

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

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

    addExpert() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';
        dialogConfig2.height = '350px';

        let dialogRef = this.dialog.open(AddCtExpertComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    console.log('result', result);
                    this.expertList.push(result);
                }
            }
        );
    }

    removeExpert(index: number) {
        this.expertList.splice(index, 1);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
    }

}
