import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {Observable, Subject, Subscription} from 'rxjs';
import {AdministrationService} from '../../../shared/service/administration.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {LoaderService} from '../../../shared/service/loader.service';
import {MatDialog} from '@angular/material';
import {TaskService} from '../../../shared/service/task.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DrugSubstanceTypesService} from '../../../shared/service/drugs/drugsubstancetypes.service';
import {DrugDocumentsService} from '../../../shared/service/drugs/drugdocuments.service';
import {DrugDecisionsService} from '../../../shared/service/drugs/drugdecisions.service';
import {AddEcAgentComponent} from '../../../administration/economic-agent/add-ec-agent/add-ec-agent.component';
import {LocalityService} from '../../../shared/service/locality.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {CpcdAuthLangComponent} from '../cpcd-auth-lang/cpcd-auth-lang.component';
import {CpcdRejectLetterComponent} from '../cpcd-reject-letter/cpcd-reject-letter.component';

@Component({
    selector: 'app-cerere-solic-autor',
    templateUrl: './cerere-solic-autor.component.html',
    styleUrls: ['./cerere-solic-autor.component.css']
})
export class CerereSolicAutorComponent implements OnInit, OnDestroy {

    cerereSolicAutorForm: FormGroup;
    documents: Document [] = [];
    currentDate: Date;
    formSubmitted: boolean;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    companies: Observable<any[]>;
    private subscriptions: Subscription[] = [];
    states: any[] = [];
    localities: any[] = [];
    paymentTotal: number;
    locality: any[] = [];
    docTypes: any[];
    docTypesInitial: any[];
    outDocuments: any[] = [];
    isNonAttachedDocuments = false;
    initialData: any;
    isResponseReceived = false;
    drugSubstanceTypes: any[];
    drugCheckDecisions: any[] = [];
    disabled: boolean;
    companyInputs = new Subject<string>();
    loadingCompany = false;
    company: any;
    selectedFilials: any[] = [];
    companyExistInTable = false;
    reqReqInitData: any;
    hasNoPreviousData: boolean;


    companiiPerIdnoNotSelected: any[] = [];
    companiiPerIdnoSelected: any[] = [];


    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private medicamentService: MedicamentService,
                private activatedRoute: ActivatedRoute, private requestService: RequestService,
                private ref: ChangeDetectorRef, private authService: AuthService, private router: Router,
                private loadingService: LoaderService,
                private drugDocumentsService: DrugDocumentsService,
                public dialogConfirmation: MatDialog,
                private taskService: TaskService, private errorHandlerService: SuccessOrErrorHandlerService,
                private drugSubstanceTypesService: DrugSubstanceTypesService,
                private drugDecisionsService: DrugDecisionsService,
                private localityService: LocalityService,
                private navbarTitleService: NavbarTitleService,
                public dialog: MatDialog,
                public dialogRejectLetter: MatDialog
    ) {

        this.cerereSolicAutorForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'dataReg': {disabled: true, value: null},
            'requestNumber': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'currentStep': ['E'],
            'startDate': [],
            'company': [],
            'companyValue': [''],
            'street': [null],
            'locality': [null],
            'state': [null],
            'requestHistories': [],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'documents': [],
            'legalAddress': [null],
            'substanceType': [],
            'drugCheckDecision':
                fb.group({
                    'id': null,
                    'registrationRequestId': null,
                    'protocolNr': [null, Validators.required],
                    'protocolDate': null,
                    'drugSubstanceTypesId': [],
                    'region': [{value: null, disabled: true}],
                    'locality': [{value: null, disabled: true}],
                    'street': [{value: null, disabled: true}],
                    'precursor': [{value: null, disabled: false}],
                    'psihotrop': [{value: null, disabled: false}],
                    'stupefiant': [{value: null, disabled: false}],
                    'farmDir': [{value: null, disabled: true}, Validators.required],
                    'nmEconomicAgents': [[]],
                    'economicAgent': [null, Validators.required],
                    'decision': null,
                    'reasonDecision': [{value: null, disabled: true}],
                    'expireDate': null,
                }),

        });
    }

    ngOnInit() {



        this.subscriptions.push(
            this.drugSubstanceTypesService.getDrugSubstanceTypesList().subscribe(data => {
                    this.drugSubstanceTypes = data;
                    this.populateRequestDetails();
                }
            )
        );


        // this.currentDate = new Date();
        // this.cerereSolicAutorForm.get('dataReg').setValue(this.currentDate);

        // this.subscriptions.push(
        //     this.administrationService.generateDocNr().subscribe(data => {
        //             this.generatedDocNrSeq = data;
        //             this.cerereSolicAutorForm.get('requestNumber').setValue(this.generatedDocNrSeq);
        //         }
        //     )
        // );


        this.onChanges();
    }

    populateRequestDetails() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.drugDecisionsService.getRequest(params['id']).subscribe(data => {
                        this.reqReqInitData = data;
                        if (this.reqReqInitData.type.code === 'ATAC') {
                            this.navbarTitleService.showTitleMsg('Cerere de solicitare a autorizatiei de activitate cu precursori/psihotrope/stupefiante');
                        } else  if (this.reqReqInitData.type.code === 'MACPS') {
                            this.navbarTitleService.showTitleMsg('Cerere de modificare a autorizarii de activitate cu precursori/psihotrope/stupefiante');
                        } else if (this.reqReqInitData.type.code === 'DACPS') {
                            this.navbarTitleService.showTitleMsg('Cerere de solicitare a duplicatului autorizatiei de activitate cu precursori/psihotrope/stupefiante');

                            this.cerereSolicAutorForm.get('drugCheckDecision.expireDate').disable();
                            this.cerereSolicAutorForm.get('drugCheckDecision.protocolNr').disable();
                            this.cerereSolicAutorForm.get('drugCheckDecision.protocolDate').disable();
                            this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').disable();
                            this.cerereSolicAutorForm.get('drugCheckDecision.decision').disable();
                            this.cerereSolicAutorForm.get('drugCheckDecision.precursor').disable();
                            this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').disable();
                            this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').disable();
                        }
                        this.cerereSolicAutorForm.get('id').setValue(data.id);
                        this.cerereSolicAutorForm.get('dataReg').setValue(data.startDate);
                        this.cerereSolicAutorForm.get('requestNumber').setValue(data.requestNumber);
                        this.cerereSolicAutorForm.get('initiator').setValue(data.initiator);
                        this.cerereSolicAutorForm.get('company').setValue(data.company);
                        this.cerereSolicAutorForm.get('companyValue').setValue(data.company.name);
                        this.cerereSolicAutorForm.get('street').setValue(data.company.street);
                        this.cerereSolicAutorForm.get('locality').setValue(data.company.locality);
                        this.cerereSolicAutorForm.get('requestHistories').setValue(data.requestHistories);
                        this.cerereSolicAutorForm.get('type').setValue(data.type);
                        this.cerereSolicAutorForm.get('typeValue').setValue(data.type.code);
                        this.cerereSolicAutorForm.get('startDate').setValue(data.startDate);
                        this.cerereSolicAutorForm.get('legalAddress').setValue(data.company.legalAddress);
                        this.cerereSolicAutorForm.get('documents').setValue(data.documents);
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        this.company = data.company;
                        this.locality = data.company.locality;
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        this.loadDocTypes(data);
                        this.subscriptions.push(
                            this.administrationService.getAllStates().subscribe(data => {
                                    this.states = data;
                                    if (this.cerereSolicAutorForm.value.locality != null) {
                                        this.getCurrentState();
                                    }
                                }
                            )
                        );

                        this.retrieveFilials(data.company.idno);

                        //populate decision

                        if (data.drugCheckDecisions && data.drugCheckDecisions[0]) {
                            const drugCheckDecision = data.drugCheckDecisions[0];
                            this.cerereSolicAutorForm.get('drugCheckDecision.id').setValue(drugCheckDecision.id);
                            this.cerereSolicAutorForm.get('drugCheckDecision.registrationRequestId').setValue(drugCheckDecision.registrationRequestId);
                            this.cerereSolicAutorForm.get('drugCheckDecision.protocolNr').setValue(drugCheckDecision.protocolNr);
                            this.cerereSolicAutorForm.get('drugCheckDecision.protocolDate').setValue(drugCheckDecision.protocolDate ? new Date(drugCheckDecision.protocolDate) : null);
                            this.cerereSolicAutorForm.get('drugCheckDecision.economicAgent').setValue(drugCheckDecision.economicAgent);
                            this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').setValue(drugCheckDecision.reasonDecision);
                            this.cerereSolicAutorForm.get('drugCheckDecision.expireDate').setValue(drugCheckDecision.expireDate ? new Date(drugCheckDecision.expireDate) : null);

                            let dec;
                            if (drugCheckDecision.decision && drugCheckDecision.decision === 1) {
                                dec = '1';
                            } else if (drugCheckDecision.decision === 0) {
                                dec = '0';
                            }
                            this.cerereSolicAutorForm.get('drugCheckDecision.decision').setValue(dec);
                            this.populateCheckBoxex(drugCheckDecision.drugSubstanceTypesId);
                        }


                    })
                );
            })
        );
    }

    loadDocTypes(dataDB: any) {

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('10', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));

                                this.initOutputDocuments();
                                this.checkOutputDocumentsStatus();
                            }
                        )
                    );
                }
            )
        );
    }

    private initOutputDocuments() {

        this.outDocuments = [];
        const outDocumentAP = {
            name: 'Autorizatia de activitate',
            docType: this.docTypesInitial.find(r => r.category == 'AP'),
            number: 'AP-' + this.cerereSolicAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentAP);

        const outDocumentSR = {
            name: 'Scrisoare de refuz',
            docType: this.docTypesInitial.find(r => r.category == 'SR'),
            number: 'SR-' + this.cerereSolicAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentSR);
    }

    getCurrentState() {

        for (const entry of this.states) {
            if (entry.id == this.cerereSolicAutorForm.get('locality').value.stateId) {
                this.cerereSolicAutorForm.get('state').setValue(entry);
            }
        }
    }

    onChanges(): void {
        this.cerereSolicAutorForm.get('state').valueChanges.subscribe(val => {
            if (this.cerereSolicAutorForm.get('state') && this.cerereSolicAutorForm.get('state').value) {
                this.subscriptions.push(
                    this.administrationService.getLocalitiesByState(this.cerereSolicAutorForm.get('state').value.id).subscribe(data => {
                            this.localities = data;
                            this.cerereSolicAutorForm.get('locality').setValue(this.locality);
                            this.locality = [];
                        }
                    )
                );
            }
        });

        this.cerereSolicAutorForm.get('drugCheckDecision.economicAgent').valueChanges.subscribe(val => {
            if (val) {
                this.cerereSolicAutorForm.get('drugCheckDecision.region').setValue(null);
                this.cerereSolicAutorForm.get('drugCheckDecision.locality').setValue(null);
                this.cerereSolicAutorForm.get('drugCheckDecision.street').setValue(null);
                this.cerereSolicAutorForm.get('drugCheckDecision.farmDir').setValue(null);

                //Find previous details
                let oldDetails = null;

                if ((this.reqReqInitData.type.code === 'MACPS' || this.reqReqInitData.type.code === 'DACPS') && (!this.reqReqInitData.drugCheckDecisions || !this.reqReqInitData.drugCheckDecisions[0] || !this.reqReqInitData.drugCheckDecisions[0].economicAgent)) {
                        if (this.reqReqInitData.type.code === 'DACPS') {
                            this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').setValue(null);
                            this.cerereSolicAutorForm.get('drugCheckDecision.expireDate').setValue(null);
                            this.cerereSolicAutorForm.get('drugCheckDecision.decision').setValue(null);
                            this.cerereSolicAutorForm.get('drugCheckDecision.protocolNr').setValue(null);
                            this.cerereSolicAutorForm.get('drugCheckDecision.protocolDate').setValue(null);
                            this.cerereSolicAutorForm.get('drugCheckDecision.precursor').setValue(null);
                            this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').setValue(null);
                            this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').setValue(null);

                        }
                    this.subscriptions.push(this.drugDecisionsService.searchLastRequest(val.id).subscribe(data => {
                        if (data) {
                            oldDetails = data;
                            this.hasNoPreviousData = false;
                        } else {
                            this.errorHandlerService.showError('Aceasta filiala nu are nici o inregistrare.');
                            this.hasNoPreviousData = true;
                            return;
                        }
                        this.completeFilialData(val, oldDetails);
                    }));
                } else {
                    this.completeFilialData(val, oldDetails);
                }
            } else {
                this.cerereSolicAutorForm.get('drugCheckDecision.region').setValue(null);
                this.cerereSolicAutorForm.get('drugCheckDecision.locality').setValue(null);
                this.cerereSolicAutorForm.get('drugCheckDecision.street').setValue(null);
                this.cerereSolicAutorForm.get('drugCheckDecision.farmDir').setValue(null);
            }
        });


        this.cerereSolicAutorForm.get('drugCheckDecision.decision').valueChanges.subscribe(val => {
            if (val) {
                if (val === '0') {
                    this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').enable();
                } else if (val === '1') {
                    this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').setValue(null);
                    this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').disable();
                }

            } else {
                this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').setValue(null);
                this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').disable();
            }
        });


    }

    private completeFilialData(val, oldDetails) {
        if (val.locality) {
            this.subscriptions.push(
                this.localityService.loadLocalityDetails(val.locality.id).subscribe(data => {
                        const lst: any[] = val.agentPharmaceutist;
                        if (lst && lst.length > 0) {
                            const result = lst.filter(af => af.selectionDate !== null).reduce(function (prev, curr) {
                                return prev.selectionDate < curr.selectionDate ? curr : prev;
                            });

                            this.cerereSolicAutorForm.get('drugCheckDecision.farmDir').setValue(result.fullName);
                            this.cerereSolicAutorForm.get('drugCheckDecision.region').setValue(data.stateName);
                            this.cerereSolicAutorForm.get('drugCheckDecision.locality').setValue(data.description);
                            this.cerereSolicAutorForm.get('drugCheckDecision.street').setValue(val.street);
                        } else {
                            this.errorHandlerService.showError('Aceasta filiala nu are farmacist diriginte');
                        }

                        if (this.reqReqInitData.type.code === 'MACPS' && oldDetails) {
                            //populate data from previous values
                            this.populateCheckBoxex(oldDetails.drugSubstanceTypesId);
                            this.cerereSolicAutorForm.get('drugCheckDecision.expireDate').setValue(new Date(oldDetails.expireDate));
                        } else if (this.reqReqInitData.type.code === 'DACPS' && oldDetails) {
                            //populate data from previous values
                            this.populateCheckBoxex(oldDetails.drugSubstanceTypesId);
                            this.cerereSolicAutorForm.get('drugCheckDecision.expireDate').setValue(new Date(oldDetails.expireDate));

                            this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').setValue(oldDetails.reasonDecision);

                            let dec;
                            if (oldDetails.decision && oldDetails.decision === 1) {
                                dec = '1';
                            } else if (oldDetails.decision === 0) {
                                dec = '0';
                            }
                            this.cerereSolicAutorForm.get('drugCheckDecision.decision').setValue(dec);

                            this.cerereSolicAutorForm.get('drugCheckDecision.protocolNr').setValue(oldDetails.protocolNr);
                            this.cerereSolicAutorForm.get('drugCheckDecision.protocolDate').setValue(oldDetails.protocolDate);
                        }
                    }
                )
            );
        }
    }

    displayFn(user?: any): string | undefined {
        return user ? user.name : undefined;
    }

    nextStepRequest() {

        this.formSubmitted = true;
        let isFormInvalid = false;
        this.isResponseReceived = false;
        this.isNonAttachedDocuments = false;

        if (this.cerereSolicAutorForm.invalid) {
            isFormInvalid = true;
        }

        // this.checkSelectedDocumentsStatus();

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        }

        if (isFormInvalid) {
            return;
        }

        if (this.cerereSolicAutorForm.get('drugCheckDecision.decision') && this.cerereSolicAutorForm.get('drugCheckDecision.decision').value === '0') {
            this.errorHandlerService.showError('Cererea a fost refuzata.');
            return;
        }

        if (this.reqReqInitData.type.code === 'DACPS' && this.hasNoPreviousData) {
            this.errorHandlerService.showError('Nu au fost gasite date precedente pentru a elibera duplicatul.');
            return;
        }

        // this.isResponseReceived = true;
        this.formSubmitted = false;

        this.cerereSolicAutorForm.get('company').setValue(this.cerereSolicAutorForm.value.company);

        const modelToSubmit: any = this.reqReqInitData;

        this.populateModelToSubmit(modelToSubmit, 'F');

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
                this.router.navigate(['/dashboard/management/cpcadtask']);
            }
        ));

    }


    save() {
        // this.cerereSolicAutorForm.get('company').setValue(this.cerereSolicAutorForm.value.company);

        const modelToSubmit: any = this.reqReqInitData;
        // modelToSubmit = this.cerereSolicAutorForm.value;

        this.populateModelToSubmit(modelToSubmit, 'E');

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
                //do nothing
                this.errorHandlerService.showSuccess('Datele au fost salvate');
            }
        ));

    }

    populateModelToSubmit(modelToSubmit: any, step: string) {

        modelToSubmit.requestHistories.push({
            startDate: this.cerereSolicAutorForm.get('data').value,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: step
        });

        modelToSubmit.assignedUser = this.authService.getUserName();


        this.drugCheckDecisions = [];
        let drugDecision;
        if (this.reqReqInitData.type.code === 'DACPS') {
            drugDecision = this.cerereSolicAutorForm.getRawValue().drugCheckDecision;
        } else {
            drugDecision = this.cerereSolicAutorForm.get('drugCheckDecision').value;
        }


        this.populateSelectedSubstances(drugDecision);

        // drugDecision.economicAgent = this.cerereSolicAutorForm.get('economicAgent').value;

        this.drugCheckDecisions.push(drugDecision);

        modelToSubmit.drugCheckDecisions = this.drugCheckDecisions;

        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.medicaments = [];
        if (step === 'F') {
            modelToSubmit.currentStep = 'F';
            modelToSubmit.endDate = new Date();
        }
    }

    populateSelectedSubstances(drugDecision: any) {

        if (this.cerereSolicAutorForm.get('drugCheckDecision.precursor').value || this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').value || this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').value) {

            const precursor = this.cerereSolicAutorForm.get('drugCheckDecision.precursor').value;
            const psihotrop = this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').value;
            const stupefiant = this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').value;

            if (precursor && !psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR');
                drugDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PSIHOTROP');
                drugDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && !psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'STUPEFIANT');
                drugDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/PSIHOTROP');
                drugDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && !psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/STUPEFIANT');
                drugDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PSIHOTROP/STUPEFIANT');
                drugDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/PSIHOTROP/STUPEFIANT');
                drugDecision.drugSubstanceTypesId = medicamnet.id;
            }

        }
    }


    populateCheckBoxex(drugSubstanceTypesId: any) {
        this.cerereSolicAutorForm.get('drugCheckDecision.precursor').setValue(null);
        this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').setValue(null);
        this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').setValue(null);
        if (!drugSubstanceTypesId) {
            return;
        }

        const substance = this.drugSubstanceTypes.find(r => r.id === drugSubstanceTypesId);

        if (substance.code === 'PRECURSOR') {
            this.cerereSolicAutorForm.get('drugCheckDecision.precursor').setValue(true);
        } else if (substance.code === 'PSIHOTROP') {
            this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').setValue(true);
        } else if (substance.code === 'STUPEFIANT') {
            this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').setValue(true);
        } else if (substance.code === 'PRECURSOR/PSIHOTROP') {
            this.cerereSolicAutorForm.get('drugCheckDecision.precursor').setValue(true);
            this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').setValue(true);
        } else if (substance.code === 'PRECURSOR/STUPEFIANT') {
            this.cerereSolicAutorForm.get('drugCheckDecision.precursor').setValue(true);
            this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').setValue(true);
        } else if (substance.code === 'PSIHOTROP/STUPEFIANT') {
            this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').setValue(true);
            this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').setValue(true);
        } else if (substance.code === 'PRECURSOR/PSIHOTROP/STUPEFIANT') {
            this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').setValue(true);
            this.cerereSolicAutorForm.get('drugCheckDecision.precursor').setValue(true);
            this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').setValue(true);
        }
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked;
    }

    checkSelectedDocumentsStatus() {

        for (const entry of this.outDocuments) {

            if (entry.responseReceived || entry.status == 'Atasat') {
                this.isResponseReceived = true;
                if (entry.status == 'Nu este atasat') {
                    this.isNonAttachedDocuments = true;
                }
            }
        }
    }

    viewDoc(document: any) {
        if (document.docType.category == 'AP') {
            this.loadingService.show();
            const locality = this.cerereSolicAutorForm.get('locality').value;
            const state = this.cerereSolicAutorForm.get('state').value;
            const data = {

                requestNumber: this.cerereSolicAutorForm.get('requestNumber').value,
                protocolDate: this.cerereSolicAutorForm.get('drugCheckDecision.protocolDate').value,
                companyValue: this.cerereSolicAutorForm.get('companyValue').value,
                street: this.cerereSolicAutorForm.get('drugCheckDecision.street').value,
                locality: this.cerereSolicAutorForm.get('drugCheckDecision.locality').value,
                state: this.cerereSolicAutorForm.get('drugCheckDecision.region').value,
                dataExp: this.cerereSolicAutorForm.get('drugCheckDecision.expireDate').value,
                precursor: this.cerereSolicAutorForm.get('drugCheckDecision.precursor').value,
                psihotrop: this.cerereSolicAutorForm.get('drugCheckDecision.psihotrop').value,
                stupefiant: this.cerereSolicAutorForm.get('drugCheckDecision.stupefiant').value,
                endDate: new Date(),
                resPerson: this.cerereSolicAutorForm.get('drugCheckDecision.farmDir').value,
                legalAddress: this.cerereSolicAutorForm.get('drugCheckDecision.economicAgent').value.legalAddress,
            };

            this.subscriptions.push(this.drugDocumentsService.viewAuthorization(data).subscribe(data => {
                    const file = new Blob([data], {type: 'application/pdf'});
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                }
                )
            );
        } else  if (document.docType.category == 'SR') {
            const data = {
                requestDate: this.cerereSolicAutorForm.get('data').value,
                requestNumber: this.cerereSolicAutorForm.get('requestNumber').value,
                protocolDate: this.cerereSolicAutorForm.get('drugCheckDecision.protocolDate').value,
                companyValue: this.cerereSolicAutorForm.get('companyValue').value,
                street: this.cerereSolicAutorForm.get('drugCheckDecision.street').value,
                locality: this.cerereSolicAutorForm.get('drugCheckDecision.locality').value,
                state: this.cerereSolicAutorForm.get('drugCheckDecision.region').value,
                dataExp: this.cerereSolicAutorForm.get('drugCheckDecision.expireDate').value,
                endDate: new Date(),
                resPerson: this.reqReqInitData.registrationRequestMandatedContacts[0].mandatedFirstname + ' ' + this.reqReqInitData.registrationRequestMandatedContacts[0].mandatedLastname,
                legalAddress: this.cerereSolicAutorForm.get('drugCheckDecision.economicAgent').value.legalAddress,
                rejectReason: this.cerereSolicAutorForm.get('drugCheckDecision.reasonDecision').value,
            };


            const dialogRef2 = this.dialogRejectLetter.open(CpcdRejectLetterComponent, {
                data : {
                    details : data,
                    parentWindow: window
                },
                hasBackdrop: false,
                disableClose : false,
                autoFocus : true,
                panelClass : 'custom-dialog-container'
            });

            dialogRef2.afterClosed().subscribe(result => {
                if (result.success) {

                }
            });
        }
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
                this.loadingService.show();
                this.outDocuments.forEach((item, index) => {
                    if (item === doc) {
                        this.outDocuments.splice(index, 1);
                    }
                });
                this.initialData.outputDocuments = this.outDocuments;

                this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.loadingService.hide();
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    checkOutputDocumentsStatus() {
        for (const entry of this.outDocuments) {
            const isMatch = this.documents.some(elem => {
                return (elem.docType.category == entry.docType.category && elem.number == entry.number) ? true : false;
            });
            if (isMatch) {
                entry.status = 'Atasat';
            } else {
                entry.status = 'Nu este atasat';
            }
        }
    }

    documentModified(event) {
        this.formSubmitted = false;
        this.checkOutputDocumentsStatus();
    }

    interruptProcess() {
        if (this.cerereSolicAutorForm.get('drugCheckDecision.decision') && this.cerereSolicAutorForm.get('drugCheckDecision.decision').value === '1') {
            this.errorHandlerService.showError('Cererea a fost acceptata.');
            return;
        }

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                const usernameDB = this.authService.getUserName();
                const modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    id: this.cerereSolicAutorForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.authService.getUserName(),
                    type: this.cerereSolicAutorForm.get('type').value,
                    requestNumber: this.cerereSolicAutorForm.get('requestNumber').value,
                    startDate: this.cerereSolicAutorForm.get('startDate').value,
                    endDate: new Date()
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.cerereSolicAutorForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });

                this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module']);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    addCompany() {
        /* this.companyExistInTable = false;
         if (this.cerereSolicAutorForm.get('company') && this.cerereSolicAutorForm.get('company').value) {

             const company = this.selectedFilials.find(r => r.code == this.cerereSolicAutorForm.get('company').value.code);

             if (company != null) {
                 this.companyExistInTable = true;
                 return;
             } else {
                 this.selectedFilials.push(this.cerereSolicAutorForm.get('company').value);
             }
         } else {
             return;
         }*/

        this.drugCheckDecisions.push(this.cerereSolicAutorForm.get('drugCheckDecision').value);

        this.cerereSolicAutorForm.get('drugCheckDecision').reset();

    }

    removeCompany(index) {

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });
        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.selectedFilials.splice(index, 1);
            }
        });
    }

    newFilial() {
        const dialogRef2 = this.dialog.open(AddEcAgentComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
                idno: this.company.idno,
                onlyNewFilial: true
            },
            hasBackdrop: false
        });
    }


    private retrieveFilials(idno: string) {
        this.subscriptions.push(
            this.administrationService.getCompanyesListByIdno(idno).subscribe(data => {
                    this.companiiPerIdnoNotSelected = data;
                    this.companiiPerIdnoNotSelected.forEach(co => {
                        if (co.locality) {
                            this.subscriptions.push(
                                this.localityService.loadLocalityDetails(co.locality.id).subscribe(data => {
                                        co.address = data.stateName + ', ' + data.description + ', ' + co.street;
                                    }
                                )
                            );
                        }
                    });

                }
            )
        );
    }


    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
