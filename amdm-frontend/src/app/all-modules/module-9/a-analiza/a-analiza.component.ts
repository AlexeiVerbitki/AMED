import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../models/document';
import {Observable, Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {AddCtExpertComponent} from '../dialog/add-ct-expert/add-ct-expert.component';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {CtMedType} from '../../../shared/enum/ct-med-type.enum';
import {AddCtMedicamentComponent} from '../dialog/add-ct-medicament/add-ct-medicament.component';

@Component({
    selector: 'app-a-analiza',
    templateUrl: './a-analiza.component.html',
    styleUrls: ['./a-analiza.component.css']
})
export class AAnalizaComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    analyzeClinicalTrailForm: FormGroup;
    docs: Document[] = [];
    docTypes: any[];
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

    //Payments control
    paymentTotal = 0;

    mandatedContactName: string;

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
                private errorHandlerService: SuccessOrErrorHandlerService,
                private navbarTitleService: NavbarTitleService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Analiza dosarului');
        this.analyzeClinicalTrailForm = this.fb.group({
            'id': [''],
            'requestNumber': [{value: '', disabled: true}],
            'startDate': [{value: '', disabled: true}],
            'company': [null],
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
                'title': ['', Validators.required],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['', Validators.required],
                'phase': ['', Validators.required],
                'eudraCtNr': [''],
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
            })
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
                                let outputDocsArr = [];
                                step.outputDocTypes ? outputDocsArr = step.outputDocTypes.split(',') : outputDocsArr = [];
                                if (step.availableDocTypes) {
                                    this.docTypes = data2;
                                    this.docTypes = this.docTypes.filter(r => availableDocsArr.includes(r.category));
                                    this.outDocuments = this.outDocuments.filter(r => outputDocsArr.includes(r.docType.category));
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
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                    console.log('clinicalTrails', data);
                    this.reqReqInitData = data;
                    this.analyzeClinicalTrailForm.get('id').setValue(data.id);
                    this.analyzeClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.analyzeClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    if (data.company) {
                        this.analyzeClinicalTrailForm.get('company').setValue(data.company);
                    } else {
                        this.mandatedContactName = data.registrationRequestMandatedContacts[0].mandatedFirstname.concat(' ')
                            .concat(data.registrationRequestMandatedContacts[0].mandatedLastname);
                    }
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
                    this.outDocuments = data.outputDocuments;
                    this.expertList = data.expertList;
                    // console.log('data', data);
                    // console.log('this.analyzeClinicalTrailForm', this.analyzeClinicalTrailForm.value);

                    this.loadInvestigatorsList();
                    this.loadMedicalInstitutionsList();
                    this.loadDocTypes(data);

                },
                error => console.log(error)
            ));
        }));
    }

    loadMedicalInstitutionsList() {
        this.subscriptions.push(
            this.administrationService.getAllMedicalInstitutions().subscribe(data => {
                this.allMediacalInstitutionsList = data;
                // console.log('this.allMediacalInstitutionsList', this.allMediacalInstitutionsList);
                // console.log('this.mediacalInstitutionsList', this.mediacalInstitutionsList);

                if (this.mediacalInstitutionsList.length > 0) {
                    const missing = this.allMediacalInstitutionsList.filter(item =>
                        !this.mediacalInstitutionsList.some(other => item.id === other.nmMedicalInstitution.id));
                    this.allMediacalInstitutionsList = missing;
                    // console.log('missing', missing);
                }
            }, error => console.log(error))
        );
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
                this.docs = data.documents;
                const expertDispozition = data.documents.find(doc => doc.docType.category == 'DDC');
                //console.log('expertDispozition', expertDispozition);
                if (!expertDispozition) {
                    this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
                    this.loadingService.hide();
                    return;
                }

                const addDataList = data.outputDocuments.filter(doc => doc.docType.category == 'SL');

                let company = null;
                if (data.company) {
                    company = data.company;
                } else {
                    company = {
                        name: data.registrationRequestMandatedContacts[0].mandatedLastname + ' ' + data.registrationRequestMandatedContacts[0].mandatedFirstname
                    };
                }
                const dialogRef2 = this.dialogConfirmation.open(AdditionalDataDialogComponent, {
                    width: '800px',
                    height: '600px',
                    data: {
                        requestNumber: 'SL-' + this.analyzeClinicalTrailForm.get('requestNumber').value + '-' + (addDataList.length + 1),
                        requestId: this.analyzeClinicalTrailForm.get('id').value,
                        modalType: 'REQUEST_ADDITIONAL_DATA',
                        startDate: this.analyzeClinicalTrailForm.get('startDate').value,
                        registrationRequestMandatedContacts: data.registrationRequestMandatedContacts[0],
                        company: company
                    },
                    hasBackdrop: false
                });

                dialogRef2.afterClosed().subscribe(result => {
                    console.log('dialog result', result);
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
                            requestId: this.analyzeClinicalTrailForm.get('id').value
                        };

                        this.documentService.addSLC(dataToSubmit).subscribe(data2 => {
                            console.log('outDocument', data2);
                            this.outDocuments.push(data2.body);
                            console.log('outDocuments', this.outDocuments);
                        });
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
            console.log('result', result);
            if (result) {
                this.subscriptions.push(
                    this.documentService.deleteSLById(doc.id).subscribe(data => {
                        console.log('data', data);
                        this.outDocuments.splice(index, 1);
                    }, error => console.log(error))
                );
            }
        });
    }

    viewDoc(document: any) {
        const formValue = this.analyzeClinicalTrailForm.value;
        // console.log('formValue', formValue);
        // console.log('viewDoc', document);
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
        // console.log('modelToSubmit', modelToSubmit);
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

    save() {
        this.loadingService.show();
        const formModel = this.analyzeClinicalTrailForm.getRawValue();
        formModel.currentStep = 'A';
        formModel.documents = this.docs;
        formModel.outputDocuments = this.outDocuments;
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrails.medicaments = this.medicamentList;
        formModel.clinicalTrails.referenceProducts = this.refProductList;
        formModel.clinicalTrails.placebos = this.placeboList;

        formModel.assignedUser = this.authService.getUserName();
        formModel.expertList = this.expertList;
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
        const formModel = this.analyzeClinicalTrailForm.getRawValue();
        console.log('Submit data', formModel);

        if (this.analyzeClinicalTrailForm.invalid) {
            // this.dysplayInvalidControl(this.analyzeClinicalTrailForm['controls'].clinicalTrails['controls']);
            this.dysplayInvalidControl(this.analyzeClinicalTrailForm.get('clinicalTrails') as FormGroup);
            this.errorHandlerService.showError('Datele studiului clinic contine date invalide');
            return;
        }

        const docDistrib = this.docs.find(doc => doc.docType.category == 'DDC');
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

        if (this.mediacalInstitutionsList.length == 0) {
            this.errorHandlerService.showError('Unitatea medicală pentru desfășurarea studiului nu a fost aleasa');
            return;
        }

        if (this.medicamentList.length == 0) {
            this.errorHandlerService.showError('MIC testat pentru desfășurarea studiului nu a fost adaugată');
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
        formModel.clinicalTrails.medicalInstitutions = this.mediacalInstitutionsList;

        formModel.clinicalTrails.medicaments = this.medicamentList;
        formModel.clinicalTrails.referenceProducts = this.refProductList;
        formModel.clinicalTrails.placebos = this.placeboList;

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

    addExpert() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = true;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';
        dialogConfig2.height = '350px';

        const dialogRef = this.dialog.open(AddCtExpertComponent, dialogConfig2);

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
        this.navbarTitleService.showTitleMsg('');
    }

}
