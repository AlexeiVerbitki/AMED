import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

@Component({
    selector: 'app-cerere-solic-autor',
    templateUrl: './cerere-solic-autor.component.html',
    styleUrls: ['./cerere-solic-autor.component.css']
})
export class CerereSolicAutorComponent implements OnInit {

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
                public dialog: MatDialog
    ) {

        this.cerereSolicAutorForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'dataReg': {disabled: true, value: null},
            'requestNumber': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'dataExp': [''],
            'currentStep': ['E'],
            'startDate': [],
            'company': [],
            'companyValue': [''],
            'street': [null, Validators.required],
            'locality': [null, Validators.required],
            'state': [null, Validators.required],
            'requestHistories': [],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'documents': [],
            'legalAddress': [null, Validators.required],
            'substanceType': [],
            'drugCheckDecision':
                fb.group({
                    'protocolNr': [null, Validators.required],
                    'protocolDate': Date,
                    'drugSubstanceTypesId': [],
                    'nmEconomicAgents': [[]]
                }),
            'resPerson': {disabled: true, value: null},
            'precursor': [{value: false, disabled: this.disabled}],
            'psihotrop': [{value: false, disabled: this.disabled}],
            'stupefiant': [{value: false, disabled: this.disabled}]
        });
    }

    ngOnInit() {

        this.populateRequestDetails();

        this.currentDate = new Date();
        this.cerereSolicAutorForm.get('dataReg').setValue(this.currentDate);

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.cerereSolicAutorForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.getDrugSubstanceTypes();

        this.onChanges();
    }

    populateRequestDetails() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.reqReqInitData = data;
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
                        let resPerson: any;
                        if (data.registrationRequestMandatedContacts[0].mandatedLastname) {
                            this.cerereSolicAutorForm.get('resPerson').setValue(data.registrationRequestMandatedContacts[0].mandatedLastname);
                            resPerson = data.registrationRequestMandatedContacts[0].mandatedLastname + ' ';
                        }
                        if (data.registrationRequestMandatedContacts[0].mandatedFirstname) {
                            this.cerereSolicAutorForm.get('resPerson').setValue(resPerson + data.registrationRequestMandatedContacts[0].mandatedFirstname);
                        }
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

                        this.getAllCompanies();
                    })
                );
            })
        );
    }

    getAllCompanies() {
        this.companies =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) { return true; }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),

                flatMap(term =>
                    this.drugDecisionsService.getCompaniesByNameCodeAndIdno(term, this.company.idno).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            )
        ;
    }

    getDrugSubstanceTypes() {

        this.subscriptions.push(
            this.drugSubstanceTypesService.getDrugSubstanceTypesList().subscribe(data => {
                    this.drugSubstanceTypes = data;
                },
                error => console.log(error)
            )
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
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
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
                        },
                        error => console.log(error)
                    )
                );
            }
        });

        this.cerereSolicAutorForm.get('company').valueChanges.subscribe(val => {
            this.companyExistInTable = false;
        });
    }

    displayFn(user?: any): string | undefined {
        return user ? user.name : undefined;
    }

    saveRequest() {

        this.formSubmitted = true;
        let isFormInvalid = false;
        this.isResponseReceived = false;
        this.isNonAttachedDocuments = false;

        if (this.cerereSolicAutorForm.invalid) {
            isFormInvalid = true;
        }

        this.checkSelectedDocumentsStatus();

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        } else if (!this.isResponseReceived) {
            this.errorHandlerService.showError('Nici un document pentru emitere nu a fost selectat.');
            return;
        } else if (this.isNonAttachedDocuments && this.isResponseReceived) {
            this.errorHandlerService.showError('Exista documente care nu au fost atasate.');
            return;
        }

        if (isFormInvalid) {
            return;
        }

        this.isResponseReceived = true;
        this.formSubmitted = false;

        this.cerereSolicAutorForm.get('company').setValue(this.cerereSolicAutorForm.value.company);

        const modelToSubmit: any = this.cerereSolicAutorForm.value;

        this.populateModelToSubmit(modelToSubmit);

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
                this.router.navigate(['/dashboard/management/cpcadtask']);
            }, error => console.log(error))
        );

    }

    populateModelToSubmit(modelToSubmit: any) {

        modelToSubmit.requestHistories.push({
            startDate: this.cerereSolicAutorForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'F'
        });

        modelToSubmit.assignedUser = this.authService.getUserName();

        this.populateSelectedSubstances(modelToSubmit);

        this.drugCheckDecisions = [];
        this.drugCheckDecisions.push(this.cerereSolicAutorForm.get('drugCheckDecision').value);
        modelToSubmit.drugCheckDecisions = this.drugCheckDecisions;
        modelToSubmit.company.locality = this.cerereSolicAutorForm.get('locality').value;
        modelToSubmit.company.street = this.cerereSolicAutorForm.get('street').value;
        modelToSubmit.company.legalAddress = this.cerereSolicAutorForm.get('legalAddress').value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.drugCheckDecision.nmEconomicAgents = this.selectedFilials;
        if (modelToSubmit.medicaments != null && modelToSubmit.medicaments[0]) {
            modelToSubmit.medicaments[0].expirationDate = this.cerereSolicAutorForm.get('dataExp').value;
        }
        modelToSubmit.currentStep = 'F';
        modelToSubmit.endDate = new Date();
    }

    populateSelectedSubstances(modelToSubmit: any) {

        if (this.cerereSolicAutorForm.get('precursor').value || this.cerereSolicAutorForm.get('psihotrop').value || this.cerereSolicAutorForm.get('stupefiant').value) {

            const precursor = this.cerereSolicAutorForm.get('precursor').value;
            const psihotrop = this.cerereSolicAutorForm.get('psihotrop').value;
            const stupefiant = this.cerereSolicAutorForm.get('stupefiant').value;

            if (precursor && !psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PSIHOTROP');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && !psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/PSIHOTROP');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && !psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PSIHOTROP/STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/PSIHOTROP/STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            }

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

        let isFormInvalid = false;
        if (this.cerereSolicAutorForm.invalid) {
            isFormInvalid = true;
        }
        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        }
        if (isFormInvalid) {
            return;
        }
        if (document.docType.category == 'AP') {
            this.loadingService.show();
            const locality = this.cerereSolicAutorForm.get('locality').value;
            const state = this.cerereSolicAutorForm.get('state').value;
            const data = {

                requestNumber: this.cerereSolicAutorForm.get('requestNumber').value,
                protocolDate: this.cerereSolicAutorForm.get('drugCheckDecision.protocolDate').value,
                resPerson: this.cerereSolicAutorForm.get('resPerson').value,
                companyValue: this.cerereSolicAutorForm.get('companyValue').value,
                street: this.cerereSolicAutorForm.get('street').value,
                locality: locality.description,
                state: state.description,
                dataExp: this.cerereSolicAutorForm.get('dataExp').value,
                precursor: this.cerereSolicAutorForm.get('precursor').value,
                psihotrop: this.cerereSolicAutorForm.get('psihotrop').value,
                stupefiant: this.cerereSolicAutorForm.get('stupefiant').value,
                endDate: new Date()
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
                    if (item === doc) { this.outDocuments.splice(index, 1); }
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
        this.companyExistInTable = false;
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
        }
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
                idno : this.company.idno,
                onlyNewFilial : true
            },
            hasBackdrop: false
        });
    }
}
