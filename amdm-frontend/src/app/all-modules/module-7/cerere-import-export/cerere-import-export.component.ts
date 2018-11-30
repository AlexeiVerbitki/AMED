import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select} from '../../../models/select';
import {Document} from "../../../models/document";
import {Observable, Subject, Subscription} from "rxjs";
import {AdministrationService} from "../../../shared/service/administration.service";
import {debounceTime, distinctUntilChanged, filter, map, startWith, tap, flatMap} from "rxjs/operators";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {MedicamentTypeService} from "../../../shared/service/medicamenttype.service";
import {MedicamentGroupService} from "../../../shared/service/medicamentgroup.service";
import {PharmaceuticalFormsService} from "../../../shared/service/pharmaceuticalforms.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {DocumentService} from "../../../shared/service/document.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {TaskService} from "../../../shared/service/task.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {DrugSubstanceTypesService} from "../../../shared/service/drugs/drugsubstancetypes.service";

@Component({
    selector: 'app-cerere-import-export',
    templateUrl: './cerere-import-export.component.html',
    styleUrls: ['./cerere-import-export.component.css']
})
export class CerereImportExportComponent implements OnInit {

    cerereImpExpForm: FormGroup;
    documents: Document [] = [];
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    generatedDocNrSeq: number;
    companies: any[];
    filteredOptions: Observable<any[]>;
    medicamentTypes: any[];
    medicamentGroups: any[];
    pharmaceuticalForms: any[];
    unitsOfMeasurement: any[];
    paymentTotal: number;
     docTypes: any[];
    allDocTypes: any[];
    activeSubstancesTable: any[] = [];
    initialData: any;
    outDocuments: any[] = [];
    isNonAttachedDocuments: boolean = false;
    isResponseReceived: boolean = false;
    docTypesInitial: any[];
    drugCheckDecisions: any[] = [];
    drugSubstanceTypes: any[];
    medicamente: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;
    selectedMedicament: any;
    selectedMedicamentsTable: any[] = [];
    medicamentNotSelected: boolean;
    medicamentExistInTable: boolean;
    disabled: boolean;

    authorizationTypes: Select[] = [
        {value: 'none', viewValue: '(None)'},
        {value: 'Import', viewValue: 'Import'},
        {value: 'Export', viewValue: 'Export'},
    ];

    constructor(private fb: FormBuilder, private administrationService: AdministrationService, private medicamentService: MedicamentService,
                private medicamentTypeService: MedicamentTypeService, private medicamentGroupService: MedicamentGroupService,
                private pharmaceuticalFormsService: PharmaceuticalFormsService, private activatedRoute: ActivatedRoute, private router: Router,
                private requestService: RequestService, private authService: AuthService,
                private documentService: DocumentService, private loadingService: LoaderService, public dialogConfirmation: MatDialog,
                private taskService: TaskService, private ref: ChangeDetectorRef, private errorHandlerService: ErrorHandlerService,
                private drugSubstanceTypesService: DrugSubstanceTypesService) {

        this.cerereImpExpForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'startDate': [],
            'requestNumber': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'company': [''],
            'companyValue': [],
            'currentStep': ['E'],
            'documents': [],
            'medicamentName': [],
            'medicament':
                fb.group({
                    'id': [],
                    'name': [''],
                    'pharmaceuticalForm': {disabled: true, value: null},
                    'documents': [],
                    'volume': {disabled: true, value: [null]},
                    'volumeQuantityMeasurement': {disabled: true, value: []},
                    'dose': {disabled: true, value: [null]},
                    'serialNr': {disabled: true, value: [null]},
                    'medicamentType': {disabled: true, value: []},
                    'activeSubstances': [],
                    'code': {disabled: true, value: []},
                }),
            'drugCheckDecision':
                fb.group({
                    'id': null,
                    'protocolNr': [null, Validators.required],
                    'protocolDate': Date,
                    'medicaments': [[]],
                    'drugSubstanceTypesId': []
                }),
            'drugCheckDecisions': [],
            'requestHistories': [],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'authorizationType': [null, Validators.required],
            'selectedMedicaments':
                fb.group({
                    'selectedMedicament': [null]

                }),
            'substanceType': [],
            'precursor': [{value: false, disabled: this.disabled}],
            'psihotrop': [{value: false, disabled: this.disabled}],
            'stupefiant': [{value: false, disabled: this.disabled}]
        });
    }

    ngOnInit() {

        this.populateRequestDetails();

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.cerereImpExpForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.getAllCompanies();

        this.getDrugSubstanceTypes();

        this.medicamente =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.medLoading = true;

                }),
                flatMap(term =>

                    this.medicamentService.getMedicamentNamesAndCodeList(term).pipe(
                        tap(() => this.medLoading = false)
                    )
                )
            );

        this.onChanges();
    }

    populateRequestDetails() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.initialData.medicaments = Object.assign([], data.medicaments);
                        this.cerereImpExpForm.get('id').setValue(data.id);
                        this.cerereImpExpForm.get('initiator').setValue(data.initiator);
                        this.cerereImpExpForm.get('startDate').setValue(data.startDate);
                        this.cerereImpExpForm.get('requestNumber').setValue(data.requestNumber);
                        this.cerereImpExpForm.get('requestHistories').setValue(data.requestHistories);
                        this.cerereImpExpForm.get('type').setValue(data.type);
                        this.cerereImpExpForm.get('typeValue').setValue(data.type.code);
                        this.cerereImpExpForm.get('company').setValue(data.company);
                        this.cerereImpExpForm.get('companyValue').setValue(data.company.name);
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });

                        this.loadDocTypes();
                    })
                );
            })
        );
    }

    getAllCompanies() {

        this.subscriptions.push(
            this.administrationService.getAllCompanies().subscribe(data => {
                    this.companies = data;
                    this.filteredOptions = this.cerereImpExpForm.get('company').valueChanges
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

    loadDocTypes() {

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('11', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.allDocTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                this.allDocTypes = this.allDocTypes.filter(r => step.availableDocTypes.includes(r.category));
                                this.docTypes = this.allDocTypes.filter(r => r.category === 'None');

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

    private _filter(name: string): any[] {

        const filterValue = name.toLowerCase();

        return this.companies.filter(option => option.name.toLowerCase().includes(filterValue));

    }

    private initOutputDocuments() {

        let outDocumentSR = {
            name: 'Scrisoare de refuz',
            docType: this.docTypesInitial.find(r => r.category == 'SR'),
            number: 'SR-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentSR);

        this.outDocuments = this.outDocuments.filter(r => r.category === 'SR');
    }

    onChanges(): void {
        this.cerereImpExpForm.get('authorizationType').valueChanges.subscribe(val => {
            this.outDocuments = [];
            if (val.value == 'Import') {
                this.initOutImportDocuments();
            } else if (val.value == 'Export') {
                this.initOutExportDocuments();
            } else {
                this.docTypes = this.allDocTypes.filter(r => r.category === 'SR');
            }
            let outDocumentSR = {
                name: 'Scrisoare de refuz',
                docType: this.docTypesInitial.find(r => r.category == 'SR'),
                number: 'SR-' + this.cerereImpExpForm.get('requestNumber').value,
                date: new Date()
            };
            this.outDocuments.push(outDocumentSR);
            this.checkOutputDocumentsStatus();
        });
        this.cerereImpExpForm.get('selectedMedicaments.selectedMedicament').valueChanges.subscribe(val => {
            this.medicamentExistInTable = false;
            this.selectedMedicament = this.cerereImpExpForm.get('selectedMedicaments.selectedMedicament').value;
            if (this.selectedMedicament != null) {
                this.medicamentNotSelected = false;
                this.getMedicamentDetails();
            } else {
                this.initMedicamentData();
            }

        });
    }

    initOutExportDocuments() {
        let outDocumentEP = {
            name: 'Autorizatia de export a precursorilor',
            docType: this.docTypesInitial.find(r => r.category == 'EP'),
            number: 'EP-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentEP);

        let outDocumentEH = {
            name: 'Autorizatia de export a psihotropelor',
            docType: this.docTypesInitial.find(r => r.category == 'EH'),
            number: 'EH-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentEH);

        let outDocumentEF = {
            name: 'Autorizatia de export a stupefiantelor',
            docType: this.docTypesInitial.find(r => r.category == 'EF'),
            number: 'EF-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentEF);
        this.docTypes = this.allDocTypes.filter(r => r.category === 'SR' || r.category === 'EP' || r.category === 'EH' || r.category === 'EF');
    }

    initOutImportDocuments() {
        let outDocumentIP = {
            name: 'Autorizatia de import a precursorilor',
            docType: this.docTypesInitial.find(r => r.category == 'IP'),
            number: 'IP-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentIP);

        let outDocumentIH = {
            name: 'Autorizatia de import a psihotropelor',
            docType: this.docTypesInitial.find(r => r.category == 'IH'),
            number: 'IH-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentIH);

        let outDocumentIF = {
            name: 'Autorizatia de import a stupefiantelor',
            docType: this.docTypesInitial.find(r => r.category == 'IF'),
            number: 'IF-' + this.cerereImpExpForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentIF);
        this.docTypes = this.allDocTypes.filter(r => r.category === 'SR' || r.category === 'IP' || r.category === 'IH' || r.category === 'IF');
    }

    getMedicamentDetails() {

        this.subscriptions.push(
            this.medicamentService.getMedicamentById(this.selectedMedicament.id).subscribe(data => {
                this.cerereImpExpForm.get('medicament.serialNr').setValue(data.serialNr);
                this.activeSubstancesTable = data.activeSubstances;
                this.cerereImpExpForm.get('medicament.code').setValue(data.code);
                this.cerereImpExpForm.get('medicament.dose').setValue(data.dose);
                this.cerereImpExpForm.get('medicament.volume').setValue(data.volume);
                this.cerereImpExpForm.get('medicament.volumeQuantityMeasurement').setValue(data.volumeQuantityMeasurement);
                if (data.medicamentType != null) {
                    this.cerereImpExpForm.get('medicament.medicamentType').setValue(data.medicamentType.description);
                }
                if (data.pharmaceuticalForm != null) {
                    this.cerereImpExpForm.get('medicament.pharmaceuticalForm').setValue(data.pharmaceuticalForm.description);
                }
            })
        );

    }

    initMedicamentData() {
        this.cerereImpExpForm.get('medicament.serialNr').setValue([null]);
        this.activeSubstancesTable = [];
        this.cerereImpExpForm.get('medicament.code').setValue([]);
        this.cerereImpExpForm.get('medicament.dose').setValue([null]);
        this.cerereImpExpForm.get('medicament.volume').setValue([null]);
        this.cerereImpExpForm.get('medicament.volumeQuantityMeasurement').setValue([]);
        this.cerereImpExpForm.get('medicament.medicamentType').setValue([]);
        this.cerereImpExpForm.get('medicament.pharmaceuticalForm').setValue(null);
    }

    addMedicament() {

        this.medicamentNotSelected = true;
        this.medicamentExistInTable = false;
        this.selectedMedicament = this.cerereImpExpForm.get('selectedMedicaments.selectedMedicament').value;
        if (this.selectedMedicament != null) {
            this.medicamentNotSelected = false;
            let medicamnet = this.selectedMedicamentsTable.find(r => r.id == this.selectedMedicament.id);

            if (medicamnet != null) {
                this.medicamentExistInTable = true;
                return
            } else {
                this.selectedMedicamentsTable.push(this.selectedMedicament);
            }
        } else {
            return;
        }
    }

    removeMedicament(index) {

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });
        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.selectedMedicamentsTable.splice(index, 1);
            }
        });

    }

    saveRequest() {

        this.formSubmitted = true;
        let isFormInvalid = false;
        this.isResponseReceived = false;
        this.isNonAttachedDocuments = false;

        if (this.cerereImpExpForm.invalid || this.paymentTotal < 0) {
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

        this.cerereImpExpForm.get('company').setValue(this.cerereImpExpForm.value.company);

        let modelToSubmit: any = this.cerereImpExpForm.value;

        this.populateModelToSubmit(modelToSubmit);

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.router.navigate(['dashboard/module']);
            }, error => console.log(error))
        );

    }

    populateModelToSubmit(modelToSubmit: any) {

        modelToSubmit.requestHistories.push({
            startDate: this.cerereImpExpForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        modelToSubmit.assignedUser = this.authService.getUserName();

        this.populateSelectedSubstances(modelToSubmit);

        modelToSubmit.drugCheckDecision.medicaments = this.selectedMedicamentsTable;

        this.drugCheckDecisions = [];
        this.drugCheckDecisions.push(this.cerereImpExpForm.get('drugCheckDecision').value);
        modelToSubmit.drugCheckDecisions = this.drugCheckDecisions;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;

    }

    populateSelectedSubstances(modelToSubmit: any) {

        if (this.cerereImpExpForm.get('precursor').value || this.cerereImpExpForm.get('psihotrop').value || this.cerereImpExpForm.get('stupefiant').value) {

            let precursor = this.cerereImpExpForm.get('precursor').value;
            let psihotrop = this.cerereImpExpForm.get('psihotrop').value;
            let stupefiant = this.cerereImpExpForm.get('stupefiant').value;

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
                    id: this.cerereImpExpForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.authService.getUserName()
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.cerereImpExpForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });

                this.subscriptions.push(this.requestService.addMedicamentHistory(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module']);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }
}