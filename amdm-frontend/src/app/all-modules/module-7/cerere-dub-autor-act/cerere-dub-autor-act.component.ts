import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../../shared/service/administration.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {RequestService} from '../../../shared/service/request.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Document} from '../../../models/document';
import {Subscription} from 'rxjs';
import {DocumentService} from '../../../shared/service/document.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material';
import {TaskService} from '../../../shared/service/task.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DrugDocumentsService} from '../../../shared/service/drugs/drugdocuments.service';
import {DrugDecisionsService} from '../../../shared/service/drugs/drugdecisions.service';

@Component({
    selector: 'app-cerere-dub-autor-act',
    templateUrl: './cerere-dub-autor-act.component.html',
    styleUrls: ['./cerere-dub-autor-act.component.css']
})
export class CerereDubAutorActComponent implements OnInit {

    cerereDupAutorForm: FormGroup;
    documents: Document [] = [];
    docTypes: any[];
    formSubmitted: boolean;
    currentDate: Date;
    generatedDocNrSeq: number;
    private subscriptions: Subscription[] = [];
    paymentTotal: number;
    outDocuments: any[] = [];
    initialData: any;
    isNonAttachedDocuments = false;
    isResponseReceived = false;
    docTypesInitial: any[];
    disabled = true;
    states: any[] = [];
    reqReqInitData: any;

    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private authService: AuthService, private requestService: RequestService, private router: Router,
                private activatedRoute: ActivatedRoute, private documentService: DocumentService,
                private loadingService: LoaderService, public dialogConfirmation: MatDialog, private taskService: TaskService,
                private errorHandlerService: SuccessOrErrorHandlerService, private drugDocumentsService: DrugDocumentsService,
                private drugDecisionsService: DrugDecisionsService) {

        this.cerereDupAutorForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'dataReg': {disabled: true, value: null},
            'currentStep': ['E'],
            'startDate': [new Date()],
            'endDate': [''],
            'requestNumber': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'company': [null, Validators.required],
            'companyValue': [''],
            'documents': [],
            'requestHistories': [],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'dataExp': [],
            'resPerson': {disabled: false, value: null},
            'drugSubstanceTypesCode': [null],
            'street': [],
            'locality': [],
            'state': [],
            'precursor': [{value: false, disabled: this.disabled}],
            'psihotrop': [{value: false, disabled: this.disabled}],
            'stupefiant': [{value: false, disabled: this.disabled}]
        });
    }

    ngOnInit() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.reqReqInitData = data;
                        this.cerereDupAutorForm.get('id').setValue(data.id);
                        this.cerereDupAutorForm.get('dataReg').setValue(data.startDate);
                        this.cerereDupAutorForm.get('requestNumber').setValue(data.requestNumber);
                        this.cerereDupAutorForm.get('initiator').setValue(data.initiator);
                        this.cerereDupAutorForm.get('company').setValue(data.company);
                        this.cerereDupAutorForm.get('companyValue').setValue(data.company.name);
                        this.cerereDupAutorForm.get('requestHistories').setValue(data.requestHistories);
                        this.cerereDupAutorForm.get('type').setValue(data.type);
                        this.cerereDupAutorForm.get('typeValue').setValue(data.type.code);
                        this.cerereDupAutorForm.get('street').setValue(data.company.street);
                        this.cerereDupAutorForm.get('locality').setValue(data.company.locality);
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let resPerson: any;
                        if (data.registrationRequestMandatedContacts[0].mandatedLastname) {
                            this.cerereDupAutorForm.get('resPerson').setValue(data.registrationRequestMandatedContacts[0].mandatedLastname);
                            resPerson = data.registrationRequestMandatedContacts[0].mandatedLastname + ' ';
                        }
                        if (data.registrationRequestMandatedContacts[0].mandatedFirstname) {
                            this.cerereDupAutorForm.get('resPerson').setValue(resPerson + data.registrationRequestMandatedContacts[0].mandatedFirstname);
                        }
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });

                        this.loadDocTypes();
                        if (data.company != null && data.company.drugCheckDecisionsId != null) {
                            this.subscriptions.push(this.drugDecisionsService.getDrugDecisionById(data.company.drugCheckDecisionsId).subscribe(data => {
                                if (data[0].drugSubstanceTypesCode) {
                                    this.cerereDupAutorForm.get('drugSubstanceTypesCode').setValue(data[0].drugSubstanceTypesCode);

                                    if (this.cerereDupAutorForm.get('drugSubstanceTypesCode')) {
                                        this.populateTypeOfSubstances();
                                    }
                                }
                            }));
                        }
                        this.getAddressDetails();
                    })
                );
            })
        );

        this.currentDate = new Date();

    }

    getAddressDetails() {

        this.subscriptions.push(
            this.administrationService.getAllStates().subscribe(data => {
                    this.states = data;
                    if (this.cerereDupAutorForm.value.locality != null) {
                        this.getCurrentState();
                    }
                }
            )
        );
    }

    getCurrentState() {

        for (const entry of this.states) {
            if (entry.id == this.cerereDupAutorForm.get('locality').value.stateId) {
                this.cerereDupAutorForm.get('state').setValue(entry);
            }
        }
    }

    populateTypeOfSubstances() {

        if (this.cerereDupAutorForm.get('drugSubstanceTypesCode').value) {
            if (this.cerereDupAutorForm.get('drugSubstanceTypesCode').value == 'PRECURSOR') {
                this.cerereDupAutorForm.get('precursor').setValue(true);
            } else if (this.cerereDupAutorForm.get('drugSubstanceTypesCode').value == 'PSIHOTROP') {
                this.cerereDupAutorForm.get('psihotrop').setValue(true);
            } else if (this.cerereDupAutorForm.get('drugSubstanceTypesCode').value == 'STUPEFIANT') {
                this.cerereDupAutorForm.get('stupefiant').setValue(true);
            } else if (this.cerereDupAutorForm.get('drugSubstanceTypesCode').value == 'PRECURSOR/PSIHOTROP') {
                this.cerereDupAutorForm.get('precursor').setValue(true);
                this.cerereDupAutorForm.get('psihotrop').setValue(true);
            } else if (this.cerereDupAutorForm.get('drugSubstanceTypesCode').value == 'PRECURSOR/STUPEFIANT') {
                this.cerereDupAutorForm.get('precursor').setValue(true);
                this.cerereDupAutorForm.get('stupefiant').setValue(true);
            } else if (this.cerereDupAutorForm.get('drugSubstanceTypesCode').value == 'PSIHOTROP/STUPEFIANT') {
                this.cerereDupAutorForm.get('stupefiant').setValue(true);
                this.cerereDupAutorForm.get('psihotrop').setValue(true);
            } else if (this.cerereDupAutorForm.get('drugSubstanceTypesCode').value == 'PRECURSOR/PSIHOTROP/STUPEFIANT') {
                this.cerereDupAutorForm.get('precursor').setValue(true);
                this.cerereDupAutorForm.get('psihotrop').setValue(true);
                this.cerereDupAutorForm.get('stupefiant').setValue(true);
            }
        }
    }

    saveRequest() {

        this.formSubmitted = true;
        let isFormInvalid = false;
        this.isResponseReceived = false;
        this.isNonAttachedDocuments = false;

        if (this.cerereDupAutorForm.invalid || this.paymentTotal < 0) {
            isFormInvalid = true;
        }

        this.checkSelectedDocumentsStatus();

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
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

        this.cerereDupAutorForm.get('endDate').setValue(new Date());
        this.cerereDupAutorForm.get('company').setValue(this.cerereDupAutorForm.value.company);

        const modelToSubmit: any = this.cerereDupAutorForm.value;

        this.populateModelToSubmit(modelToSubmit);

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
                this.router.navigate(['/dashboard/management/cpcadtask']);
            }, error => console.log(error))
        );
    }

    populateModelToSubmit(modelToSubmit: any) {

        modelToSubmit.requestHistories.push({
            startDate: this.cerereDupAutorForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'F'
        });

        modelToSubmit.assignedUser = this.authService.getUserName();
        modelToSubmit.documents = this.documents;
        modelToSubmit.currentStep = 'F';
        modelToSubmit.endDate = new Date();
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

            const locality = this.cerereDupAutorForm.get('locality').value;
            const state = this.cerereDupAutorForm.get('state').value;
            const data = {

                requestNumber: this.cerereDupAutorForm.get('requestNumber').value,
                protocolDate: this.cerereDupAutorForm.get('data').value,
                resPerson: this.cerereDupAutorForm.get('resPerson').value,
                companyValue: this.cerereDupAutorForm.get('companyValue').value,
                street: this.cerereDupAutorForm.get('street').value,
                locality: locality.description,
                state: state.description,
                dataExp: this.cerereDupAutorForm.get('dataExp').value,
                precursor: this.cerereDupAutorForm.get('precursor').value,
                psihotrop: this.cerereDupAutorForm.get('psihotrop').value,
                stupefiant: this.cerereDupAutorForm.get('stupefiant').value
            };

            console.log(data);
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

    loadDocTypes() {

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('13', 'E').subscribe(step => {
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
            number: 'AP-' + this.cerereDupAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentAP);

        const outDocumentSR = {
            name: 'Scrisoare de refuz',
            docType: this.docTypesInitial.find(r => r.category == 'SR'),
            number: 'SR-' + this.cerereDupAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentSR);
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
                    id: this.cerereDupAutorForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.authService.getUserName(),
                    type: this.cerereDupAutorForm.get('type').value,
                    requestNumber: this.cerereDupAutorForm.get('requestNumber').value,
                    startDate: this.cerereDupAutorForm.get('startDate').value,
                    endDate: new Date()
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.cerereDupAutorForm.get('data').value, endDate: new Date(),
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
}
