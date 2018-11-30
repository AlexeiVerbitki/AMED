import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from "../../../shared/service/administration.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {RequestService} from "../../../shared/service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Document} from "../../../models/document";
import {Subscription} from "rxjs";
import {DocumentService} from "../../../shared/service/document.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {TaskService} from "../../../shared/service/task.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";

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
    isNonAttachedDocuments: boolean = false;
    isResponseReceived: boolean = false;
    docTypesInitial: any[];

    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private authService: AuthService, private requestService: RequestService, private router: Router,
                private activatedRoute: ActivatedRoute, private documentService: DocumentService,
                private loadingService: LoaderService, public dialogConfirmation: MatDialog, private taskService: TaskService,
                private errorHandlerService: ErrorHandlerService) {

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
            'medicaments': [[]],
            'requestHistories': [],
            'type': [],
            'typeValue': {disabled: true, value: null}
        });
    }

    ngOnInit() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.cerereDupAutorForm.get('id').setValue(data.id);
                        this.cerereDupAutorForm.get('dataReg').setValue(data.startDate);
                        this.cerereDupAutorForm.get('requestNumber').setValue(data.requestNumber);
                        this.cerereDupAutorForm.get('initiator').setValue(data.initiator);
                        this.cerereDupAutorForm.get('company').setValue(data.company);
                        this.cerereDupAutorForm.get('companyValue').setValue(data.company.name);
                        this.cerereDupAutorForm.get('requestHistories').setValue(data.requestHistories);
                        this.cerereDupAutorForm.get('type').setValue(data.type);
                        this.cerereDupAutorForm.get('typeValue').setValue(data.type.code);
                        this.cerereDupAutorForm.get('medicaments').setValue(data.medicaments);
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

        this.currentDate = new Date();

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

        let modelToSubmit: any = this.cerereDupAutorForm.value;

        this.populateModelToSubmit(modelToSubmit);

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.router.navigate(['dashboard/module']);
            }, error => console.log(error))
        );
    }

    populateModelToSubmit(modelToSubmit: any) {

        modelToSubmit.requestHistories.push({
            startDate: this.cerereDupAutorForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        modelToSubmit.assignedUser = this.authService.getUserName();
        modelToSubmit.documents = this.documents;
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
        let outDocumentAP = {
            name: 'Autorizatia de activitate cu precursori',
            docType: this.docTypesInitial.find(r => r.category == 'AP'),
            number: 'AP-' + this.cerereDupAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentAP);

        let outDocumentAH = {
            name: 'Autorizatia de activitate cu psihotrope',
            docType: this.docTypesInitial.find(r => r.category == 'AH'),
            number: 'AH-' + this.cerereDupAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentAH);

        let outDocumentAF = {
            name: 'Autorizatia de activitate cu stupefiante',
            docType: this.docTypesInitial.find(r => r.category == 'AF'),
            number: 'AF-' + this.cerereDupAutorForm.get('requestNumber').value,
            date: new Date()
        };
        this.outDocuments.push(outDocumentAF);

        let outDocumentSR = {
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
                let usernameDB = this.authService.getUserName();
                var modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    id: this.cerereDupAutorForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.authService.getUserName()
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.cerereDupAutorForm.get('data').value, endDate: new Date(),
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
