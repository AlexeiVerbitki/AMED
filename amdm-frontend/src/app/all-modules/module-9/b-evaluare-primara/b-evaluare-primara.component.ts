import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs/index';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {TaskService} from '../../../shared/service/task.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog, MatDialogConfig, MatRadioChange} from '@angular/material';
import {MedInstInvestigatorsDialogComponent} from '../dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {LoaderService} from '../../../shared/service/loader.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {AdditionalDataDialogComponent} from '../dialog/additional-data-dialog/additional-data-dialog.component';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {AddCtExpertComponent} from '../dialog/add-ct-expert/add-ct-expert.component';
import {DocumentService} from '../../../shared/service/document.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {CtMedType} from '../../../shared/enum/ct-med-type.enum';
import {AddCtMedicamentComponent} from '../dialog/add-ct-medicament/add-ct-medicament.component';

@Component({
    selector: 'app-b-evaluare-primara',
    templateUrl: './b-evaluare-primara.component.html',
    styleUrls: ['./b-evaluare-primara.component.css']
})
export class BEvaluarePrimaraComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    clinicTrailAmendForm: FormGroup;
    stepName: string;
    isAnalizePage = false;
    docs: Document[] = [];
    docTypes: any[] = [];
    reqReqInitData: any;
    phaseList: any[] = [];
    outDocuments: any[] = [];
    expertList: any[] = [];
    treatmentList: any[] = [];
    provenanceList: any[] = [];
    allInvestigatorsList: any[] = [];
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

    paymentTotal = 0;

    mandatedContactName: string;
    private amendmentIndex = -1;

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private taskService: TaskService,
                private administrationService: AdministrationService,
                private loadingService: LoaderService,
                private authService: AuthService,
                private router: Router,
                private dialogConfirmation: MatDialog,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private documentService: DocumentService,
                private navbarTitleService: NavbarTitleService) {
    }

    ngOnInit() {
        this.clinicTrailAmendForm = this.fb.group({
            'id': [''],
            'requestNumber': {value: '', disabled: true},
            'startDate': {value: '', disabled: true},
            'company': [null],
            'type': [''],
            'typeCode': [''],
            'initiator': [null],
            'assignedUser': [null],
            'outputDocuments': [],
            'currentStep': [''],
            'clinicalTrails': [],
            'ddIncluded': [],
            'registrationRequestMandatedContacts': [],
            'clinicalTrailAmendment': this.fb.group({
                'id': [''],
                'registrationRequestId': [],
                'clinicalTrialsEntityId': [],
                'amendCode': [[Validators.required, Validators.pattern('^[1-9][0-9]')]],
                'note': ['', Validators.required],
                'titleFrom': [''],
                'titleTo': [{value: null, disabled: false}],
                'treatmentFrom': [''],
                'treatmentTo': ['', Validators.required],
                'provenanceFrom': [''],
                'provenanceTo': ['', Validators.required],
                'sponsorFrom': [''],
                'sponsorTo': ['', Validators.required],
                'phaseFrom': [''],
                'phaseTo': ['', Validators.required],
                'eudraCtNrFrom': [''],
                'eudraCtNrTo': [{value: null, disabled: true}],
                'codeFrom': [''],
                'codeTo': [{value: null, disabled: true}],
                'medicalInstitutions': [],
                'trialPopNatFrom': [''],
                'trialPopNatTo': ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
                'trialPopInternatFrom': [''],
                'trialPopInternatTo': ['', [Validators.pattern('^[0-9]*$')]],
                'medicaments': [],
                'referenceProducts': [],
                'placebos': [],
                'status': ['P'],
                'comissionNr': [],
                'comissionDate': []
            }),
            'requestHistories': []
        });

        this.addMediacalInstitutionForm = this.fb.group({
            'medicalInstitution': []
        });

        this.loadClinicalTrialTypes();
        this.loadPhasesList();
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

    loadInvestigatorsList() {
        this.subscriptions.push(
            this.administrationService.getAllInvestigators().subscribe(data => {
                    this.allInvestigatorsList = data;
                    this.allInvestigatorsList.forEach(item => {
                        item.main = false;
                    });

                }
            )
        );
    }

    loadPhasesList() {
        this.subscriptions.push(
            this.administrationService.getClinicalTrailsPhases().subscribe(data => {
                this.phaseList = data;
            })
        );
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    addMedicalInstitution() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = true;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '800px';

        dialogConfig2.data = {
            nmMedicalInstitution: this.addMediacalInstitutionForm.get('medicalInstitution').value,
            investigatorsList: this.allInvestigatorsList
        };

        const dialogRef = this.dialog.open(MedInstInvestigatorsDialogComponent, dialogConfig2);

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                if (result == null || result == undefined || result.success === false) {
                    return;
                }

                const medInst = result.medicalInstitution.nmMedicalInstitution;
                result.medicalInstitution.isNew = true;
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

    deleteMedicalInstitution(index: number, medInst: any) {
        this.allMediacalInstitutionsList.push(medInst);
        this.mediacalInstitutionsList.splice(index, 1);
        this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
    }


    loadMedicalInstitutionsList() {
        this.subscriptions.push(
            this.administrationService.getAllMedicalInstitutions().subscribe(data => {
                this.allMediacalInstitutionsList = data;

                if (this.mediacalInstitutionsList.length > 0) {
                    const missing = this.allMediacalInstitutionsList.filter(item =>
                        !this.mediacalInstitutionsList.some(other => item.id === other.nmMedicalInstitution.id));
                    this.allMediacalInstitutionsList = missing;
                }
            })
        );
    }

    loadDocTypes(data) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode(data.type.id, data.currentStep).subscribe(step => {
                this.subscriptions.push(
                    this.administrationService.getAllDocTypes().subscribe(data2 => {
                        let availableDocsArr = [];
                        step.availableDocTypes ? availableDocsArr = step.availableDocTypes.split(',') : availableDocsArr = [];
                        let outputDocsArr = [];
                        step.outputDocTypes ? outputDocsArr = step.outputDocTypes.split(',') : outputDocsArr = [];
                        if (step.availableDocTypes) {
                            this.docTypes = data2;
                            this.docTypes = this.docTypes.filter(r => availableDocsArr.includes(r.category));
                            this.outDocuments = this.outDocuments.filter(r => outputDocsArr.includes(r.docType.category));
                        }
                    })
                );
            })
        );
    }

    initPage() {
        this.subscriptions.push(
            this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getClinicalTrailAmendmentRequest(params['id']).subscribe(data => {
                        console.log('data', data);
                        this.reqReqInitData = data;
                        this.isAnalizePage = data.type.id == 4 && data.currentStep == 'A';

                        this.stepName = this.isAnalizePage ? 'Analiza dosarului' : 'Evaluarea primara';
                        this.navbarTitleService.showTitleMsg(this.stepName);
                        this.clinicTrailAmendForm.get('id').setValue(data.id);
                        this.clinicTrailAmendForm.get('requestNumber').setValue(data.requestNumber);
                        this.clinicTrailAmendForm.get('startDate').setValue(new Date(data.startDate));
                        if (data.company) {
                            this.clinicTrailAmendForm.get('company').setValue(data.company);
                        } else {
                            this.mandatedContactName = data.registrationRequestMandatedContacts[0].mandatedFirstname.concat(' ')
                                .concat(data.registrationRequestMandatedContacts[0].mandatedLastname);
                        }
                        this.clinicTrailAmendForm.get('type').setValue(data.type);
                        this.clinicTrailAmendForm.get('typeCode').setValue(data.type.code);
                        this.clinicTrailAmendForm.get('initiator').setValue(data.initiator);
                        this.clinicTrailAmendForm.get('requestHistories').setValue(data.requestHistories);
                        this.clinicTrailAmendForm.get('clinicalTrails').setValue(data.clinicalTrails);
                        this.clinicTrailAmendForm.get('currentStep').setValue(data.currentStep);
                        this.clinicTrailAmendForm.get('ddIncluded').setValue(data.ddIncluded);
                        this.clinicTrailAmendForm.get('registrationRequestMandatedContacts').setValue(data.registrationRequestMandatedContacts);

                        const findAmendment = data.clinicalTrails.clinicTrialAmendEntities.find(amendment => data.id == amendment.registrationRequestId);
                        this.amendmentIndex = data.clinicalTrails.clinicTrialAmendEntities.indexOf(findAmendment);

                        this.clinicTrailAmendForm.get('clinicalTrailAmendment').setValue(findAmendment);

                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.medicalInstitutions').setValue(
                            findAmendment.medicalInstitutions == null ? [] : findAmendment.medicalInstitutions);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.treatmentTo').setValue(
                            findAmendment.treatmentTo == null ? this.treatmentList[0] : findAmendment.treatmentTo);
                        this.clinicTrailAmendForm.get('clinicalTrailAmendment.provenanceTo').setValue(
                            findAmendment.provenanceTo == null ? this.provenanceList[0] : findAmendment.provenanceTo);

                        if (findAmendment.medicalInstitutions !== null) {
                            this.mediacalInstitutionsList = findAmendment.medicalInstitutions;
                        }
                        if (findAmendment.medicaments !== null) {
                            this.medicamentList = findAmendment.medicaments;
                        }
                        if (findAmendment.referenceProducts !== null) {
                            this.refProductList = findAmendment.referenceProducts;
                        }
                        if (findAmendment.placebos !== null) {
                            this.placeboList = findAmendment.placebos;
                        }

                        this.docs = data.documents;
                        this.docs.forEach(doc => doc.isOld = true);
                        this.outDocuments = data.outputDocuments;

                        this.expertList = data.expertList;

                        this.loadDocTypes(data);
                        this.loadInvestigatorsList();
                        this.loadMedicalInstitutionsList();
                    }
                ));
            })
        );
    }

    addExpert() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(AddCtExpertComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.expertList.push(result);
                }
            }
        );
    }

    removeExpert(index: number) {
        this.expertList.splice(index, 1);
    }

    onTreatmentChange(mrChange: MatRadioChange) {
        this.clinicTrailAmendForm.get('clinicalTrailAmendment.treatmentTo').setValue(this.treatmentList[mrChange.value - 1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.clinicTrailAmendForm.get('clinicalTrailAmendment.provenanceTo').setValue(this.provenanceList[mrChange.value - 3]);
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
                    result.medicament.isNew = true;
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

    save() {
        this.loadingService.show();

        const formModel = this.clinicTrailAmendForm.getRawValue();
        formModel.documents = this.docs;
        formModel.outputDocuments = this.outDocuments;

        formModel.clinicalTrailAmendment.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrailAmendment.medicaments = this.medicamentList;
        formModel.clinicalTrailAmendment.referenceProducts = this.refProductList;
        formModel.clinicalTrailAmendment.placebos = this.placeboList;

        formModel.assignedUser = this.authService.getUserName();

        //const currentAmendment = formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex];

        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex] = formModel.clinicalTrailAmendment;
        formModel.expertList = this.expertList;

        this.subscriptions.push(
            this.requestService.saveClinicalTrailAmendmentRequest(formModel).subscribe(data => {
                this.loadingService.hide();
                this.errorHandlerService.showSuccess('Datele salvate cu success');
            }, error => {
                this.loadingService.hide();
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
        const formModel = this.clinicTrailAmendForm.getRawValue();
        if (this.clinicTrailAmendForm.invalid) {
            this.dysplayInvalidControl(this.clinicTrailAmendForm.get('clinicalTrailAmendment') as FormGroup);
            this.errorHandlerService.showError('Datele studiului clinic contine date invalide');
            return;
        }

        if (this.mediacalInstitutionsList.length == 0) {
            this.dysplayInvalidControl(this.addMediacalInstitutionForm);
            this.errorHandlerService.showError('Unitatea medicală pentru desfășurarea studiului nu a fost aleasa');
            return;
        }

        if (this.medicamentList.length == 0) {
            this.dysplayInvalidControl(this.addMediacalInstitutionForm);
            this.errorHandlerService.showError('MIC testat pentru nu a fost adaugată');
            return;
        }

        if (this.isAnalizePage) {
            const docDistrib = this.docs.find(doc => doc.docType.category == 'DDA');
            if (!docDistrib) {
                this.errorHandlerService.showError('Dispozitia de distribuire nu este atashata');
                return;
            }
            const outDocDistrib = this.outDocuments.filter(doc => doc.docType.category == 'SL');
            for (let i = 0; i < outDocDistrib.length; i++) {
                if (!outDocDistrib[i].responseReceived) {
                    this.errorHandlerService.showError('Raspuns la scrisoarea de solicitare date additionale ' + outDocDistrib[i].number + ' nu a fost primit');
                    return;
                }
            }
        }

        this.loadingService.show();
        formModel.documents = this.docs;
        formModel.outputDocuments = this.outDocuments;

        formModel.clinicalTrailAmendment.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrailAmendment.medicaments = this.medicamentList;
        formModel.clinicalTrailAmendment.referenceProducts = this.refProductList;
        formModel.clinicalTrailAmendment.placebos = this.placeboList;

        formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
        formModel.requestHistories.push({
            startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: this.isAnalizePage ? 'E' : 'A'
        });

        formModel.assignedUser = this.authService.getUserName();
        formModel.currentStep = this.isAnalizePage ? 'AP' : 'A';

        const currentAmendment = formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex];
        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex] = formModel.clinicalTrailAmendment;

        console.log('formModel to submit', formModel);

        const pagePath = this.isAnalizePage ? '/dashboard/module/clinic-studies/approval-amendment/' : '/dashboard/module/clinic-studies/analyze-amendment/';
        this.subscriptions.push(
            this.requestService.addClinicalTrailAmendmentNextRequest(formModel).subscribe(data => {
                this.router.navigate([pagePath + data.body]);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
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
                if (result) {
                    this.loadingService.show();
                    const formModel = this.clinicTrailAmendForm.getRawValue();
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
                            this.router.navigate(['/dashboard/module/clinic-studies/interrupt-amendment/' + data.body]);
                            this.loadingService.hide();
                        }, error => {
                            this.loadingService.hide();
                        })
                    );
                }
            })
        );
    }

    requestAdditionalData() {
        this.loadingService.show();
        this.subscriptions.push(this.requestService.getClinicalTrailRequest(this.clinicTrailAmendForm.get('id').value).subscribe(data => {
                this.docs = data.documents;
                const expertDispozition = data.documents.find(doc => doc.docType.category == 'DDA');
                if (!expertDispozition) {
                    this.errorHandlerService.showError('Dispozitia de distribuire nu este atashata.');
                    this.loadingService.hide();
                    return;
                }

                const addDataList = data.outputDocuments.filter(doc => doc.docType.category == 'SL');
                const dialogRef2 = this.dialogConfirmation.open(AdditionalDataDialogComponent, {
                    width: '800px',
                    height: '600px',
                    data: {
                        requestNumber: 'SL-' + this.clinicTrailAmendForm.get('requestNumber').value + '-' + (addDataList.length + 1),
                        requestId: this.clinicTrailAmendForm.get('id').value,
                        modalType: 'REQUEST_ADDITIONAL_DATA',
                        startDate: this.clinicTrailAmendForm.get('startDate').value,
                        registrationRequestMandatedContacts: data.registrationRequestMandatedContacts[0],
                        company: data.company
                    },
                    hasBackdrop: false
                });

                dialogRef2.afterClosed().subscribe(result => {
                    if (result && result) {
                        const dataToSubmit = {
                            date: result.date,
                            name: 'Scrisoare de solicitare date aditionale',
                            number: result.number,
                            content: result.content,
                            docType: this.docTypes.find(r => r.category == 'SL'),
                            responseReceived: 0,
                            dateOfIssue: new Date(),
                            signerName: result.signer.value,
                            signerFunction: result.signer.description,
                            requestId: this.clinicTrailAmendForm.get('id').value
                        };

                        this.documentService.addSLC(dataToSubmit).subscribe(data2 => {
                            this.outDocuments.push(data2.body);

                        });
                    }
                });

                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            })
        );
    }

    viewDoc(document: any) {
        const formValue = this.clinicTrailAmendForm.value;
        const modelToSubmit = {
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
        let observable: Observable<any> = null;
        observable = this.documentService.viewRequestNew(modelToSubmit);

        this.subscriptions.push(observable.subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            })
        );
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked ? 1 : 0;
    }

    remove(doc: any, index: number) {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });
        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.subscriptions.push(
                    this.documentService.deleteSLById(doc.id).subscribe(data => {
                        // this.reqReqInitData.outputDocuments.splice(index, 1);
                        this.outDocuments.splice(index, 1);
                    })
                );
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.navbarTitleService.showTitleMsg('');
    }
}
