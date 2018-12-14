import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from "../../../models/document";
import {Observable, Subscription} from "rxjs";
import {AdministrationService} from "../../../shared/service/administration.service";
import {map, startWith} from "rxjs/operators";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {LoaderService} from "../../../shared/service/loader.service";
import {DocumentService} from "../../../shared/service/document.service";
import {MatDialog} from "@angular/material";
import {TaskService} from "../../../shared/service/task.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {DrugSubstanceTypesService} from "../../../shared/service/drugs/drugsubstancetypes.service";

@Component({
    selector: 'app-cerere-mod-autor-act',
    templateUrl: './cerere-mod-autor-act.component.html',
    styleUrls: ['./cerere-mod-autor-act.component.css']
})
export class CerereModAutorActComponent implements OnInit {

    cerereModAutorForm: FormGroup;
    documents: Document [] = [];
    currentDate: Date;
    formSubmitted: boolean;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    companies: any[];
    private subscriptions: Subscription[] = [];
    states: any[] = [];
    localities: any[] = [];
    paymentTotal: number;
    locality: any[] = [];
    docTypes: any[];
    docTypesInitial: any[];
    outDocuments: any[] = [];
    isNonAttachedDocuments: boolean = false;
    initialData: any;
    isResponseReceived: boolean = false;
    drugSubstanceTypes: any[];
    drugCheckDecisions: any[] = [];
    disabled: boolean;

    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private medicamentService: MedicamentService,
                private activatedRoute: ActivatedRoute, private requestService: RequestService,
                private ref: ChangeDetectorRef, private authService: AuthService, private router: Router,
                private loadingService: LoaderService,
                private documentService: DocumentService,
                public dialogConfirmation: MatDialog,
                private taskService: TaskService, private errorHandlerService: ErrorHandlerService,
                private drugSubstanceTypesService: DrugSubstanceTypesService
    ) {

        this.cerereModAutorForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'dataReg': {disabled: true, value: null},
            'requestNumber': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'dataExp': [null],
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
                    'drugSubstanceTypesId': []
                }),
            'employee':
                fb.group({
                    'id': [],
                    'name': {disabled: true, value: null},
                    'lastname': {disabled: true, value: null},
                    'idnp': {disabled: true, value: null},
                    'phonenumbers': {disabled: true, value: null},
                    'email': {disabled: true, value: null}
                }),
            'precursor': [{value: false, disabled: this.disabled}],
            'psihotrop': [{value: false, disabled: this.disabled}],
            'stupefiant': [{value: false, disabled: this.disabled}]
        });
    }

    ngOnInit() {

        this.populateRequestDetails();

        this.currentDate = new Date();
        this.cerereModAutorForm.get('dataReg').setValue(this.currentDate);

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.cerereModAutorForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.getAllCompanies();

        this.getDrugSubstanceTypes();

        this.onChanges();
    }

    populateRequestDetails() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.cerereModAutorForm.get('id').setValue(data.id);
                        this.cerereModAutorForm.get('dataReg').setValue(data.startDate);
                        this.cerereModAutorForm.get('requestNumber').setValue(data.requestNumber);
                        this.cerereModAutorForm.get('initiator').setValue(data.initiator);
                        this.cerereModAutorForm.get('company').setValue(data.company);
                        this.cerereModAutorForm.get('companyValue').setValue(data.company.name);
                        this.cerereModAutorForm.get('street').setValue(data.company.street);
                        this.cerereModAutorForm.get('locality').setValue(data.company.locality);
                        this.cerereModAutorForm.get('requestHistories').setValue(data.requestHistories);
                        this.cerereModAutorForm.get('type').setValue(data.type);
                        this.cerereModAutorForm.get('typeValue').setValue(data.type.code);
                        this.cerereModAutorForm.get('startDate').setValue(data.startDate);
                        this.cerereModAutorForm.get('legalAddress').setValue(data.company.legalAddress);
                        this.cerereModAutorForm.get('documents').setValue(data.documents);
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        this.companies = data.company;
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
                                    if (this.cerereModAutorForm.value.locality != null) {
                                        this.getCurrentState();
                                    }
                                }
                            )
                        );
                    })
                );
            })
        );
    }

    getAllCompanies() {

        this.subscriptions.push(
            this.administrationService.getAllCompanies().subscribe(data => {
                    this.companies = data;
                    this.filteredOptions = this.cerereModAutorForm.get('company').valueChanges
                        .pipe(
                            startWith<string | any>(''),
                            map(value => typeof value === 'string' ? value : value.name),
                            map(name => this._filter(name))
                        );
                },
                error => console.log(error)
            )
        );
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
        let outDocumentAP = {
            name: 'Autorizatia de activitate',
            docType: this.docTypesInitial.find(r => r.category == 'AP'),
            number: 'AP-' + this.cerereModAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentAP);

        // let outDocumentAH = {
        //     name: 'Autorizatia de activitate cu psihotrope',
        //     docType: this.docTypesInitial.find(r => r.category == 'AH'),
        //     number: 'AH-' + this.cerereModAutorForm.get('requestNumber').value,
        //     date: new Date()
        // };
        // this.outDocuments.push(outDocumentAH);
        //
        // let outDocumentAF = {
        //     name: 'Autorizatia de activitate cu stupefiante',
        //     docType: this.docTypesInitial.find(r => r.category == 'AF'),
        //     number: 'AF-' + this.cerereModAutorForm.get('requestNumber').value,
        //     date: new Date()
        // };
        // this.outDocuments.push(outDocumentAF);

        let outDocumentSR = {
            name: 'Scrisoare de refuz',
            docType: this.docTypesInitial.find(r => r.category == 'SR'),
            number: 'SR-' + this.cerereModAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentSR);
    }

    getCurrentState() {

        for (let entry of this.states) {
            if (entry.id == this.cerereModAutorForm.get('locality').value.stateId) {
                this.cerereModAutorForm.get('state').setValue(entry);
            }
        }
    }

    onChanges(): void {
        this.cerereModAutorForm.get('state').valueChanges.subscribe(val => {
            if (this.cerereModAutorForm.get('state') && this.cerereModAutorForm.get('state').value) {
                this.subscriptions.push(
                    this.administrationService.getLocalitiesByState(this.cerereModAutorForm.get('state').value.id).subscribe(data => {
                            this.localities = data;
                            this.cerereModAutorForm.get('locality').setValue(this.locality);
                            this.locality = [];
                        },
                        error => console.log(error)
                    )
                );
            }
        });
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.companies.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    displayFn(user?: any): string | undefined {
        return user ? user.name : undefined;
    }

    saveRequest() {

        this.formSubmitted = true;
        let isFormInvalid = false;
        this.isResponseReceived = false;
        this.isNonAttachedDocuments = false;

        if (this.cerereModAutorForm.invalid) {
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

        this.cerereModAutorForm.get('company').setValue(this.cerereModAutorForm.value.company);

        let modelToSubmit: any = this.cerereModAutorForm.value;

        this.populateModelToSubmit(modelToSubmit);

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.router.navigate(['/dashboard/management/cpcadtask']);
            }, error => console.log(error))
        );

    }

    populateModelToSubmit(modelToSubmit: any) {

        modelToSubmit.requestHistories.push({
            startDate: this.cerereModAutorForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        modelToSubmit.assignedUser = this.authService.getUserName();

        this.populateSelectedSubstances(modelToSubmit);

        this.drugCheckDecisions = [];
        this.drugCheckDecisions.push(this.cerereModAutorForm.get('drugCheckDecision').value);
        modelToSubmit.drugCheckDecisions = this.drugCheckDecisions;
        modelToSubmit.company.locality = this.cerereModAutorForm.get('locality').value;
        modelToSubmit.company.street = this.cerereModAutorForm.get('street').value;
        modelToSubmit.company.legalAddress = this.cerereModAutorForm.get('legalAddress').value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        if (modelToSubmit.medicaments != null && modelToSubmit.medicaments[0]) {
            modelToSubmit.medicaments[0].expirationDate = this.cerereModAutorForm.get('dataExp').value;
        }
    }

    populateSelectedSubstances(modelToSubmit: any) {

        if (this.cerereModAutorForm.get('precursor').value || this.cerereModAutorForm.get('psihotrop').value || this.cerereModAutorForm.get('stupefiant').value) {

            let precursor = this.cerereModAutorForm.get('precursor').value;
            let psihotrop = this.cerereModAutorForm.get('psihotrop').value;
            let stupefiant = this.cerereModAutorForm.get('stupefiant').value

            if (precursor && !psihotrop && !stupefiant) {
                let medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && psihotrop && !stupefiant) {
                let medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PSIHOTROP');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && !psihotrop && stupefiant) {
                let medicamnet = this.drugSubstanceTypes.find(r => r.code == 'STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && psihotrop && !stupefiant) {
                let medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/PSIHOTROP');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && !psihotrop && stupefiant) {
                let medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (!precursor && psihotrop && stupefiant) {
                let medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PSIHOTROP/STUPEFIANT');
                modelToSubmit.drugCheckDecision.drugSubstanceTypesId = medicamnet.id;
            } else if (precursor && psihotrop && stupefiant) {
                let medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/PSIHOTROP/STUPEFIANT');
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

        for (let entry of this.outDocuments) {

            if (entry.responseReceived || entry.status == 'Atasat') {
                this.isResponseReceived = true;
                if (entry.status == 'Nu este atasat') {
                    this.isNonAttachedDocuments = true;
                }
            }
        }
    }

    viewDoc(document: any) {
        this.loadingService.show();
        if (document.docType.category == 'SR' || document.docType.category == 'AP') {
            this.subscriptions.push(this.documentService.viewRequest(document.number,
                document.content,
                document.title,
                document.docType.category).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                }
                )
            );
        } else {
            this.subscriptions.push(this.documentService.viewDD(document.number).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
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
                    if (item === doc) this.outDocuments.splice(index, 1);
                });
                this.initialData.outputDocuments = this.outDocuments;

                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.loadingService.hide();
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    checkOutputDocumentsStatus() {
        for (let entry of this.outDocuments) {
            var isMatch = this.documents.some(elem => {
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
                let usernameDB = this.authService.getUserName();
                var modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    id: this.cerereModAutorForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.authService.getUserName(),
                    type: this.cerereModAutorForm.get('type').value,
                    requestNumber: this.cerereModAutorForm.get('requestNumber').value,
                    startDate: this.cerereModAutorForm.get('startDate').value
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.cerereModAutorForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });

                this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module']);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }
}
