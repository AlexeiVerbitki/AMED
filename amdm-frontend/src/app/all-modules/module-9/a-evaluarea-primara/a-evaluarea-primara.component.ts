import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../models/document';
import {Subscription} from 'rxjs/index';
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
import {MedInstInvestigatorsDialogComponent} from '../dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {AddCtMedicamentComponent} from '../dialog/add-ct-medicament/add-ct-medicament.component';
import {CtMedType} from '../../../shared/enum/ct-med-type.enum';

@Component({
    selector: 'app-a-evaluarea-primara',
    templateUrl: './a-evaluarea-primara.component.html',
    styleUrls: ['./a-evaluarea-primara.component.css']
})
export class AEvaluareaPrimaraComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    evaluateClinicalTrailForm: FormGroup;
    docs: Document[] = [];
    docTypes: any[];
    reqReqInitData: any;
    phaseList: any[] = [];

    //Treatments
    treatmentList: any[] = [];

    //Provenances
    provenanceList: any[] = [];

    //Investigators controls
    allInvestigatorsList: any[] = [];

    //MediacalInstitutions controls
    addMediacalInstitutionForm: FormGroup;
    allMediacalInstitutionsList: any[] = [];
    mediacalInstitutionsList: any[] = [];

    // ctMedTypes: CtMedType = ;
    public ctMedTypes = CtMedType;

    //MIC Testat control
    medicamentList: any[] = [];

    //MIC Referință control
    refProductList: any[] = [];

    //MIC Placebo control
    placeboList: any[] = [];

    //Payments control
    paymentTotal = 0;

    mandatedContactName: string;

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
                'medicaments': [],
                'referenceProducts': [],
                'placebos': [],
                'status': ['P'],
                'pharmacovigilance': [],
                'clinicTrialAmendEntities': [],
                'comissionNr': [],
                'comissionDate': [],
                'clinicTrialNotificationEntities': []
            }),

            'requestHistories': [],
            'ctPaymentOrdersEntities': [],
        });

        this.addMediacalInstitutionForm = this.fb.group({
            'medicalInstitution': [null, Validators.required]
        });

        this.loadClinicalTrialTypes();
        this.loadPhasesList();
        this.loadInvestigatorsList();
    }

    loadClinicalTrialTypes() {
        this.subscriptions.push(
            this.administrationService.getClinicalTrailsTypest().subscribe(findTypes => {
                this.treatmentList = findTypes;
                this.provenanceList = findTypes.splice(2, 2);
                this.initPage();
            }, error => console.log(error))
        );
    }

    loadPhasesList() {
        this.subscriptions.push(
            this.administrationService.getClinicalTrailsPhases().subscribe(data => {
                this.phaseList = data;
            }, error => console.log(error))
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

                            if (data.clinicalTrails.medicalInstitutions !== null) {
                                this.mediacalInstitutionsList = data.clinicalTrails.medicalInstitutions;
                            }
                            if (data.clinicalTrails.medicaments !== null) {
                                this.medicamentList = data.clinicalTrails.medicaments;
                            }
                            if (data.clinicalTrails.referenceProducts !== null) {
                                this.refProductList = data.clinicalTrails.referenceProducts;
                            }
                            if (data.clinicalTrails.placebos !== null) {
                                this.placeboList = data.clinicalTrails.placebos;
                            }

                            this.docs = data.documents;
                            this.docs.forEach(doc => doc.isOld = true);

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

                if (this.mediacalInstitutionsList && this.mediacalInstitutionsList.length > 0) {
                    const missing = this.allMediacalInstitutionsList.filter(item =>
                        !this.mediacalInstitutionsList.some(other => item.id === other.nmMedicalInstitution.id));
                    this.allMediacalInstitutionsList = missing;
                }

            }, error => console.log(error))
        );
    }

    addMedicalInstitution() {
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
                this.mediacalInstitutionsList.push(result.medicalInstitution);
                const intdexToDelete = this.allMediacalInstitutionsList.indexOf(medInst);
                this.allMediacalInstitutionsList.splice(intdexToDelete, 1);
                this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
                this.addMediacalInstitutionForm.get('medicalInstitution').setValue('');
                this.addMediacalInstitutionForm.get('medicalInstitution').markAsUntouched();
            })
        );
    }

    deleteMedicalInstitution(index: number, medInst: any): void {
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
        this.loadingService.show();
        const formModel = this.evaluateClinicalTrailForm.getRawValue();
        formModel.currentStep = 'E';
        formModel.documents = this.docs;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrails.medicamens = this.medicamentList;
        formModel.clinicalTrails.referenceProducts = this.refProductList;
        formModel.clinicalTrails.placebos = this.placeboList;

        formModel.assignedUser = this.authService.getUserName();
        console.log('Save data', formModel);

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

    addMedicament(ctMedType: CtMedType) {
        console.log('ctMedTypes', ctMedType);
        console.log('ctMedTypes == ctMedTypes.MicReferance', ctMedType == this.ctMedTypes.MicReferance);
        const dialogConfig2 = new MatDialogConfig();
        dialogConfig2.disableClose = true;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '1000px';

        if (ctMedType == this.ctMedTypes.MicTestat) {
            dialogConfig2.data = {
                pageTitle: 'Adaugare MIC Testat',
                ctMedType: ctMedType
            };
        } else if (ctMedType == this.ctMedTypes.MicReferance) {
            dialogConfig2.data = {
                pageTitle: 'Adaugare MIC Referință',
                ctMedType: ctMedType
            };
        } else if (ctMedType == this.ctMedTypes.MicPlacebo) {
            dialogConfig2.data = {
                pageTitle: 'Adaugare MIC Placebo',
                ctMedType: ctMedType
            };
        }

        const dialogRef = this.dialog.open(AddCtMedicamentComponent, dialogConfig2);

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                if (result && result.success) {
                    console.log('result', result);
                    if (ctMedType == this.ctMedTypes.MicTestat) {
                        this.medicamentList.push(result.medicament);
                    } else if (ctMedType == this.ctMedTypes.MicReferance) {
                        this.refProductList.push(result.medicament);
                    } else if (ctMedType == this.ctMedTypes.MicPlacebo) {
                        this.placeboList.push(result.medicament);
                    }
                }
            })
        );
    }

    editMedicament(ctMedType: CtMedType, medicament: any, editIndex: number) {
        console.log('adding MIC testat');

        const dialogConfig2 = new MatDialogConfig();
        dialogConfig2.disableClose = true;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '1000px';

        if (ctMedType == this.ctMedTypes.MicTestat) {
            dialogConfig2.data = {
                pageTitle: 'Editare MIC Testat',
                ctMedType: ctMedType,
                medicament: medicament
            };
        } else if (ctMedType == this.ctMedTypes.MicReferance) {
            dialogConfig2.data = {
                pageTitle: 'Editare MIC Referință',
                ctMedType: ctMedType,
                medicament: medicament
            };
        } else if (ctMedType == this.ctMedTypes.MicPlacebo) {
            dialogConfig2.data = {
                pageTitle: 'Editare MIC Placebo',
                ctMedType: ctMedType,
                medicament: medicament
            };
        }

        const dialogRef = this.dialog.open(AddCtMedicamentComponent, dialogConfig2);

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                if (result && result.success) {
                    console.log('result', result);
                    if (ctMedType == this.ctMedTypes.MicTestat) {
                        this.medicamentList[editIndex] = result.medicament;
                    } else if (ctMedType == this.ctMedTypes.MicReferance) {
                        this.refProductList[editIndex] = result.medicament;
                    } else if (ctMedType == this.ctMedTypes.MicPlacebo) {
                        this.placeboList[editIndex] = result.medicament;
                    }
                }
            })
        );
    }

    deleteMedicament(ctMedType: CtMedType, deleteIndex: number) {
        console.log('deleting index', deleteIndex);
        if (ctMedType == this.ctMedTypes.MicTestat) {
            this.medicamentList.splice(deleteIndex, 1);
            this.medicamentList = this.medicamentList.splice(0);
        } else if (ctMedType == this.ctMedTypes.MicReferance) {
            this.refProductList.splice(deleteIndex, 1);
            this.refProductList = this.refProductList.splice(0);
        } else if (ctMedType == this.ctMedTypes.MicPlacebo) {
            this.placeboList.splice(deleteIndex, 1);
            this.placeboList = this.placeboList.splice(0);
        }
    }

    onSubmit() {
        const formModel = this.evaluateClinicalTrailForm.getRawValue();

        if (this.evaluateClinicalTrailForm.invalid) {
            this.dysplayInvalidControl(this.evaluateClinicalTrailForm.get('clinicalTrails') as FormGroup);
            this.errorHandlerService.showError('Datele studiului clinic contine date invalide');
            return;
        }

        if (this.mediacalInstitutionsList.length == 0) {
            this.dysplayInvalidControl(this.addMediacalInstitutionForm);
            this.errorHandlerService.showError('Unitatea medicală pentru desfășurarea studiului nu a fost adaugată');
            return;
        }

        if (this.medicamentList.length == 0) {
            this.dysplayInvalidControl(this.addMediacalInstitutionForm);
            this.errorHandlerService.showError('MIC testat pentru desfășurarea studiului nu a fost adaugată');
            return;
        }

        this.loadingService.show();
        formModel.documents = this.docs;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrails.medicaments = this.medicamentList;
        formModel.clinicalTrails.referenceProducts = this.refProductList;
        formModel.clinicalTrails.placebos = this.placeboList;

        formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
        formModel.requestHistories.push({
            startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'E'
        });

        formModel.assignedUser = this.authService.getUserName();

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

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.navbarTitleService.showTitleMsg('');
    }
}
