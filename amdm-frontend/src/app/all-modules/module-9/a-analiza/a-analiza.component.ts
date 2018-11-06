import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from "../../../models/document";
import {BehaviorSubject, Subscription} from "rxjs/index";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {MatDialog, MatRadioChange} from "@angular/material";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {ModalService} from "../../../shared/service/modal.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {DocumentService} from "../../../shared/service/document.service";
import {AdditionalDataDialogComponent} from "../dialog/additional-data-dialog/additional-data-dialog.component";
import {AuthService} from "../../../shared/service/authetication.service";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {subscriptionLogsToBeFn} from "rxjs/internal/testing/TestScheduler";

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
    medicamentSearches: any[] = [];
    referenceProductFormn: FormGroup;
    referenceProductSearches: any[] = [];

    //MediacalInstitutions controls
    addMediacalInstitutionForm: FormGroup;
    allMediacalInstitutionsList: any[] = [];
    mediacalInstitutionsList: any[] = [];

    //Investigators controls
    addInvestigatorForm: FormGroup;
    allInvestigatorsList: any[] = [];
    investigatorsList: any[] = [];

    //Payments control
    receiptsList: Receipt[] = [];
    paymentOrdersList: PaymentOrder[] = [];
    paymentTotal: number = 0;

    initialData: any;
    outDocuments: any[] = [];

    constructor(private fb: FormBuilder,
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
            'initiator':[null],
            'assignedUser':[null],
            'clinicalTrails': this.fb.group({
                'id': [''],
                'documents': [],
                'title': [{value: '', disabled: this.isWaitingStep}],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['sponsor'],
                'phase': ['faza', Validators.required],
                'eudraCtNr': ['eudraCtNr', Validators.required],
                'code': ['code', Validators.required],
                'medicalInstitutions': [],
                'trialPopulation': ['5446', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'medicament': [],
                'referenceProduct': [],
                'investigators': [],
                'status': ['P'],
                'receipts': [],
                'paymentOrders': [],
                'medicamentCommitteeOpinion': [],
                'eticCommitteeOpinion': [],
                'approvalOrder': [],
                'pharmacovigilance': [],
                'openingDeclarationId': [],
                'outputDocuments': []
            })
        });

        this.medicamentForm = this.fb.group({
            'searchField': [{value: '', disabled: true}],
            'producer': [{value: '', disabled: true}],
            'dose': [{value: '', disabled: true}],
            'group': [{value: '', disabled: true}],
            'pharmaceuticalForm': [{value: '', disabled: true}],
            'administeringMode': [{value: '', disabled: true}],
        });

        this.referenceProductFormn = this.fb.group({
            'searchField': [{value: '', disabled: true}],
            'producer': [{value: '', disabled: true}],
            'dose': [{value: '', disabled: true}],
            'group': [{value: '', disabled: true}],
            'pharmaceuticalForm': [{value: '', disabled: true}],
            'administeringMode': [{value: '', disabled: true}],
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
    }

    loadDocTypes(){
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3','A').subscribe(step => {
                    console.log('getRequestStepByIdAndCode', step);
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                console.log('getAllDocTypes', data);
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
                    console.log('clinicalTrails', data);

                    this.analyzeClinicalTrailForm.get('id').setValue(data.id);
                    this.analyzeClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.analyzeClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.analyzeClinicalTrailForm.get('company').setValue(data.company);
                    this.analyzeClinicalTrailForm.get('type').setValue(data.type);
                    this.analyzeClinicalTrailForm.get('typeCode').setValue(data.type.code);
                    this.analyzeClinicalTrailForm.get('initiator').setValue(data.initiator);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));

                    this.analyzeClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);
                    this.analyzeClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    this.analyzeClinicalTrailForm.get('clinicalTrails.treatment').setValue(
                        data.clinicalTrails.treatment == null ? this.treatmentList[0] : data.clinicalTrails.treatment);
                    this.analyzeClinicalTrailForm.get('clinicalTrails.provenance').setValue(
                        data.clinicalTrails.provenance == null ? this.provenanceList[0] : data.clinicalTrails.provenance);

                    this.docs = data.clinicalTrails.documents;
                    //this.docs.forEach(doc => doc.isOld = true);

                    if (data.clinicalTrails.medicament !== null) {
                        this.medicamentForm.get('searchField').setValue(data.clinicalTrails.medicament.name);
                        this.fillMedicamentData(data.clinicalTrails.medicament);
                    }

                    if (data.clinicalTrails.referenceProduct !== null) {
                        this.referenceProductFormn.get('searchField').setValue(data.clinicalTrails.referenceProduct.name);
                        this.fillReferenceProductData(data.clinicalTrails.referenceProduct);
                    }

                    this.investigatorsList = data.clinicalTrails.investigators;
                    this.mediacalInstitutionsList = data.clinicalTrails.medicalInstitutions;
                    this.receiptsList = data.clinicalTrails.receipts;
                    this.paymentOrdersList = data.clinicalTrails.paymentOrders;
                    this.outDocuments = data.clinicalTrails.outputDocuments;

                    this.loadInvestigatorsList();
                    this.loadMedicalInstitutionsList();

                    console.log('clinicalTrailsForm', this.analyzeClinicalTrailForm);
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

    loadInvestigatorsList() {
        this.subscriptions.push(
            this.administrationService.getAllInvestigators().subscribe(data => {
                    this.allInvestigatorsList = data;

                    if (this.investigatorsList.length > 0) {
                        let missing = this.allInvestigatorsList.filter(item =>
                            !this.investigatorsList.some(other => item.id === other.id));

                        missing.forEach(investigator => investigator.description = investigator.firstName + ' ' + investigator.lastName + ' - ' + investigator.title);
                        this.allInvestigatorsList = missing;
                    }
                    else {
                        this.allInvestigatorsList.forEach(investigator => {
                            investigator.description = investigator.firstName + ' ' + investigator.lastName + ' - ' + investigator.title;
                        })
                    }
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

    fillMedicamentData(data: any) {
        this.medicamentForm.get('producer').setValue(data.manufacture === null ? '' : data.manufacture.longDescription);
        this.medicamentForm.get('dose').setValue('250Mg');
        this.medicamentForm.get('group').setValue('antiinflamatoare');
        this.medicamentForm.get('pharmaceuticalForm').setValue('comprimate ');
        this.medicamentForm.get('administeringMode').setValue('oral ');
        this.analyzeClinicalTrailForm.get('clinicalTrails.medicament').setValue(data);
    }

    onMedicamentsSearchSelect(option) {
        this.subscriptions.push(this.medicamentService.getMedicamentById(option.id).subscribe(data => {
                this.fillMedicamentData(data);
            },
            error => console.log(error)
        ))
    }

    onReferenceProductSearchSelect(option) {
        this.subscriptions.push(this.medicamentService.getMedicamentById(option.id).subscribe(data => {
                this.fillReferenceProductData(data);
            },
            error => console.log(error)
        ))
    }

    fillReferenceProductData(data: any) {
        this.referenceProductFormn.get('producer').setValue(data.manufacture === null ? '' : data.manufacture.longDescription);
        this.referenceProductFormn.get('dose').setValue('250Mg');
        this.referenceProductFormn.get('group').setValue('antiinflamatoare');
        this.referenceProductFormn.get('pharmaceuticalForm').setValue('comprimate ');
        this.referenceProductFormn.get('administeringMode').setValue('oral ');
        this.analyzeClinicalTrailForm.get('clinicalTrails.referenceProduct').setValue(data);
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    requestAdditionalData() {
        const dialogRef2 = this.dialogConfirmation.open(AdditionalDataDialogComponent, {
            data: {
                requestNumber: this.analyzeClinicalTrailForm.get('requestNumber').value,
                requestId: this.analyzeClinicalTrailForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA',
                startDate: this.analyzeClinicalTrailForm.get('startDate').value
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                result.docType = this.docTypes.find(doc=>doc.category==='SL');
                console.log('find doc type', result.docType);
                this.initialData.clinicalTrails.outputDocuments.push(result);
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

                this.initialData.clinicalTrails.outputDocuments.forEach((item, index) => {
                    if (item === doc) this.initialData.clinicalTrails.outputDocuments.splice(index, 1);
                });

                this.subscriptions.push(this.requestService.addClinicalTrailRequest(this.initialData).subscribe(data => {
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
        } else if(document.docType.category == 'DD'){
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
        formModel.clinicalTrails.documents = this.docs;
        formModel.clinicalTrails.investigators = this.investigatorsList;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.assignedUser = this.authService.getUserName();
        console.log("Save data", formModel);
        this.subscriptions.push(
            this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
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
        formModel.clinicalTrails.documents = this.docs;
        formModel.clinicalTrails.investigators = this.investigatorsList;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrails.receipts = this.receiptsList;
        formModel.clinicalTrails.paymentOrders = this.paymentOrdersList;

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
                formModel.currentStep = 'C';
                formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                formModel.requestHistories.push({
                    startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
                    endDate: new Date(),
                    username: this.authService.getUserName(),
                    step: 'A'
                });
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
    }

}
