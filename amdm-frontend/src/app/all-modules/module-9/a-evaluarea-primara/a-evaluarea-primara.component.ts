import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs/index";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {MedicamentService} from "../../../shared/service/medicament.service";

import {debounceTime} from 'rxjs/operators';
import {AdministrationService} from "../../../shared/service/administration.service";
import {Receipt} from "../../../models/receipt";
import {PaymentOrder} from "../../../models/paymentOrder";
import {AuthService} from "../../../shared/service/authetication.service";
import {MatDialog, MatRadioChange} from "@angular/material";
import {MatRadioButton} from "@angular/material/radio";
import {DocumentService} from "../../../shared/service/document.service";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";

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

    medicamentForm: FormGroup;
    medicamentSearches: any[] = [];
    referenceProductFormn: FormGroup;
    referenceProductSearches: any[] = [];

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


    constructor(private fb: FormBuilder,
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
            'startDate': {value:'', disabled: true},
            'company': [''],
            'type': [''],
            'typeCode': [''],
            'initiator':[null],
            'assignedUser':[null],
            'clinicalTrails': this.fb.group({
                'id': [''],
                'documents': [],
                'title': ['title', Validators.required],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],

                'sponsor': ['sponsor', Validators.required],
                'phase': ['faza', Validators.required],
                'eudraCtNr': ['eudraCtNr', Validators.required],
                'code': ['code', Validators.required],
                'medicalInstitutions': [],
                'investigators': [],
                'trialPopulation': ['5446', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'medicament': [],
                'referenceProduct': [],
                'status': ['P'],
                'receipts': [],
                'paymentOrders': [],
                'medicamentCommitteeOpinion': [],
                'eticCommitteeOpinion': [],
                'approvalOrder': [],
                'pharmacovigilance': [],
                'openingDeclarationId': [],
                'outputDocuments':[]
            }),

            'requestHistories': []
        });

        this.medicamentForm = this.fb.group({
            'searchField': [''],
            'producer': [{value: '', disabled: true}],
            'dose': [{value: '', disabled: true}],
            'group': [{value: '', disabled: true}],
            'pharmaceuticalForm': [{value: '', disabled: true}],
            'administeringMode': [{value: '', disabled: true}],
        }),

            this.referenceProductFormn = this.fb.group({
                'searchField': [''],
                'producer': [{value: '', disabled: true}],
                'dose': [{value: '', disabled: true}],
                'group': [{value: '', disabled: true}],
                'pharmaceuticalForm': [{value: '', disabled: true}],
                'administeringMode': [{value: '', disabled: true}],
            }),

            this.addInvestigatorForm = this.fb.group({
                'investigator': []
            });

            this.addMediacalInstitutionForm = this.fb.group({
                'medicalInstitution': []
            });

        this.initPage();
        this.controlMedicamentsSearch();
        this.controlReferenceProductSearch();
        this.cleanMedicamentFormGroup();
        this.cleanReferenceProductFormGroup();
        this.loadDocTypes();
    }

    loadDocTypes(){
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3','E').subscribe(step => {
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

    initPage() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                    console.log('clinicalTrails',data);

                    this.evaluateClinicalTrailForm.get('id').setValue(data.id);
                    this.evaluateClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.evaluateClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.evaluateClinicalTrailForm.get('company').setValue(data.company);
                    this.evaluateClinicalTrailForm.get('type').setValue(data.type);
                    this.evaluateClinicalTrailForm.get('typeCode').setValue(data.type.code);
                    this.evaluateClinicalTrailForm.get('initiator').setValue(data.initiator);
                    this.evaluateClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);


                    this.evaluateClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    this.evaluateClinicalTrailForm.get('clinicalTrails.medicalInstitutions').setValue(
                        data.medicalInstitution == null ? [] :  data.clinicalTrails.medicalInstitutions);
                    this.evaluateClinicalTrailForm.get('clinicalTrails.treatment').setValue(
                        data.clinicalTrails.treatment == null ? this.treatmentList[0] : data.clinicalTrails.treatment);
                    this.evaluateClinicalTrailForm.get('clinicalTrails.provenance').setValue(
                        data.clinicalTrails.provenance == null ? this.provenanceList[0] : data.clinicalTrails.provenance);

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
                    this.docs = data.clinicalTrails.documents;
                    this.docs.forEach(doc => doc.isOld = true);

                    this.receiptsList = data.clinicalTrails.receipts;
                    this.paymentOrdersList = data.clinicalTrails.paymentOrders;

                    this.loadInvestigatorsList();
                    this.loadMedicalInstitutionsList();
                },
                error => console.log(error)
            ))
        }))
    }

    loadMedicalInstitutionsList(){
        this.subscriptions.push(
            this.administrationService.getAllMedicalInstitutions().subscribe(data=>{
              this.allMediacalInstitutionsList = data;

              if(this.mediacalInstitutionsList.length > 0){
                  let missing = this.allMediacalInstitutionsList.filter(item =>
                      !this.mediacalInstitutionsList.some(other => item.id === other.id) );
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

                    if(this.investigatorsList.length > 0){
                        let missing = this.allInvestigatorsList.filter(item =>
                            !this.investigatorsList.some(other => item.id === other.id) );

                        missing.forEach(investigator => investigator.description = investigator.firstName + ' ' + investigator.lastName + ' - ' +investigator.title);
                        this.allInvestigatorsList = missing;
                    }
                    else {
                        this.allInvestigatorsList.forEach(investigator =>{
                            investigator.description = investigator.firstName + ' ' + investigator.lastName + ' - ' +investigator.title;
                        })
                    }
                },error => console.log(error)
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

    controlMedicamentsSearch() {
        const searchConstrol = this.medicamentForm.get('searchField');

        this.subscriptions.push(
            searchConstrol.valueChanges
                .pipe(debounceTime(400))
                .subscribe(changedValue => {
                    if (changedValue.length > this.SEARCH_STRING_LENGTH) {
                        this.subscriptions.push(this.medicamentService.getMedicamentNamesList(changedValue).subscribe(data => {
                                this.medicamentSearches = data;
                            },
                            error => console.log(error)
                        ))
                    }
                })
        )


    }

    controlReferenceProductSearch() {
        const searchConstrol = this.referenceProductFormn.get('searchField');
        this.subscriptions.push(
            searchConstrol.valueChanges
                .pipe(debounceTime(400))
                .subscribe(changedValue => {
                    if (changedValue.length > this.SEARCH_STRING_LENGTH) {
                        this.subscriptions.push(this.medicamentService.getMedicamentNamesList(changedValue).subscribe(data => {
                                this.referenceProductSearches = data;
                            },
                            error => console.log(error)
                        ))
                    }
                })
        )
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

    fillMedicamentData(data: any) {
        this.medicamentForm.get('producer').setValue(data.manufacture === null ? '' : data.manufacture.longDescription);
        this.medicamentForm.get('dose').setValue('250Mg');
        this.medicamentForm.get('group').setValue('antiinflamatoare');
        this.medicamentForm.get('pharmaceuticalForm').setValue('comprimate ');
        this.medicamentForm.get('administeringMode').setValue('oral ');
        this.evaluateClinicalTrailForm.get('clinicalTrails.medicament').setValue(data);
    }

    fillReferenceProductData(data: any) {
        this.referenceProductFormn.get('producer').setValue(data.manufacture === null ? '' : data.manufacture.longDescription);
        this.referenceProductFormn.get('dose').setValue('250Mg');
        this.referenceProductFormn.get('group').setValue('antiinflamatoare');
        this.referenceProductFormn.get('pharmaceuticalForm').setValue('comprimate ');
        this.referenceProductFormn.get('administeringMode').setValue('oral ');
        this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct').setValue(data);
    }


    cleanMedicamentFormGroup() {
        const searchConstrol = this.medicamentForm.get('searchField');
        this.subscriptions.push(
            searchConstrol.valueChanges
                .subscribe(changedValue => {
                    this.medicamentForm.get('producer').reset();
                    this.medicamentForm.get('dose').reset();
                    this.medicamentForm.get('group').reset();
                    this.medicamentForm.get('pharmaceuticalForm').reset();
                    this.medicamentForm.get('administeringMode').reset();
                    this.evaluateClinicalTrailForm.get('clinicalTrails.medicament').setValue(null);
                    this.medicamentSearches = [];
                })
        )
    }

    cleanReferenceProductFormGroup() {
        const searchConstrol = this.referenceProductFormn.get('searchField');
        this.subscriptions.push(
            searchConstrol.valueChanges
                .subscribe(changedValue => {
                    this.referenceProductFormn.get('producer').reset();
                    this.referenceProductFormn.get('dose').reset();
                    this.referenceProductFormn.get('group').reset();
                    this.referenceProductFormn.get('pharmaceuticalForm').reset();
                    this.referenceProductFormn.get('administeringMode').reset();
                    this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct').setValue(null);
                    this.referenceProductSearches = [];
                })
        )
    }


    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    save() {
        this.loadingService.show();
        let formModel = this.evaluateClinicalTrailForm.getRawValue();
        formModel.currentStep = 'E';
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
        let formModel = this.evaluateClinicalTrailForm.getRawValue();
        console.log("Submit data", formModel);

        if (this.evaluateClinicalTrailForm.invalid || this.paymentTotal < 0) {
            alert('Invalid Form!!');
            console.log("Not submitted data", formModel);
            return;
        }

        this.loadingService.show();

        formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
        formModel.requestHistories.push({
            startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'E'
        });
        formModel.clinicalTrails.documents = this.docs;
        formModel.clinicalTrails.investigators = this.investigatorsList;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrails.receipts = this.receiptsList;
        formModel.clinicalTrails.paymentOrders = this.paymentOrdersList;
        formModel.assignedUser = this.authService.getUserName();
        console.log("evaluareaPrimaraObjectLet", JSON.stringify(formModel));

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

    interruptProcess(){
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
                let formModel = this.evaluateClinicalTrailForm.getRawValue();
                formModel.currentStep = 'C';
                formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                formModel.requestHistories.push({
                    startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
                    endDate: new Date(),
                    username: this.authService.getUserName(),
                    step: 'E'
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

}
