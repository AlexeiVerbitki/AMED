import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {TaskService} from '../../../shared/service/task.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DocumentService} from '../../../shared/service/document.service';

@Component({
    selector: 'app-a-aprobare',
    templateUrl: './a-aprobare.component.html',
    styleUrls: ['./a-aprobare.component.css']
})
export class AAprobareComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    approveClinicalTrailForm: FormGroup;
    docs: Document[] = [];
    docTypes: any[];
    outDocuments: any[] = [];

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private taskService: TaskService,
                private administrationService: AdministrationService,
                private authService: AuthService,
                private router: Router,
                private loadingService: LoaderService,
                public dialogConfirmation: MatDialog,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private documentService: DocumentService) {

    }

    ngOnInit() {
        this.approveClinicalTrailForm = this.fb.group({
            'id': [''],
            'requestNumber': [{value: '', disabled: true}],
            'startDate': [{value: '', disabled: true}],
            'endDate': [''],
            'company': [''],
            'currentStep': [''],
            'type': [],
            'typeCode': [''],
            'requestHistories': [],
            'initiator': [null],
            'assignedUser': [null],
            'outputDocuments': [],
            'clinicalTrails': this.fb.group({
                'id': [''],
                'startDateInternational': [''],
                'startDateNational': [''],
                'endDateNational': [''],
                'endDateInternational': [''],
                'title': [''],
                'treatment': [''],
                'provenance': [''],
                'sponsor': [''],
                'phase': [''],
                'eudraCtNr': [''],
                'code': ['code'],
                'medicalInstitutions': [],
                'trialPopNat': [''],
                'trialPopInternat': [''],
                'medicament': [],
                'referenceProduct': [],
                'status': ['P'],
                'pharmacovigilance': [],
                'placebo': [],
                'clinicTrialAmendEntities': [],
                'comissionNr': ['', Validators.required],
                'comissionDate': ['', Validators.required],
                'clinicTrialNotificationEntities': []
            }),
            'status': [undefined, Validators.required],
        });
        this.initPage();
    }

    loadDocTypes(data) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode(data.type.id, data.currentStep).subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                let availableDocsArr = [];
                                step.availableDocTypes ? availableDocsArr = step.availableDocTypes.split(',') : availableDocsArr = [];
                                let outputDocsArr = [];
                                step.outputDocTypes ? outputDocsArr = step.outputDocTypes.split(',') : outputDocsArr = [];
                                if (step.availableDocTypes) {
                                    this.docTypes = data;
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
                    console.log('clinicalTrailsData', data);

                    this.approveClinicalTrailForm.get('id').setValue(data.id);
                    this.approveClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.approveClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.approveClinicalTrailForm.get('company').setValue(data.company);
                    this.approveClinicalTrailForm.get('type').setValue(data.type);
                    this.approveClinicalTrailForm.get('typeCode').setValue(data.type.code);
                    this.approveClinicalTrailForm.get('initiator').setValue(data.initiator);
                    this.approveClinicalTrailForm.get('currentStep').setValue(data.currentStep);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    this.approveClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);

                    this.approveClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);
                    if (data.clinicalTrails.comissionDate !== null) {
                        this.approveClinicalTrailForm.get('clinicalTrails.comissionDate').setValue(new Date(data.clinicalTrails.comissionDate));
                    }


                    this.docs = data.documents;
                    this.outDocuments = data.outputDocuments;

                    this.loadDocTypes(data);
                    // console.log('this.approveClinicalTrailForm', this.approveClinicalTrailForm);
                },
                error => console.log(error)
            ));
        }));
    }

    viewDoc(doc: any) {
        // console.log('doc', doc);
        // console.log('this.docs', this.docs);
        const findDoc = this.docs.find(document => document.docType.category === 'AC');
        if (findDoc) {
            if (findDoc.id) {
                console.log('findDoc1', findDoc);
                let observable: Observable<any> = null;
                observable = this.documentService.generateAvizC(this.approveClinicalTrailForm.get('id').value, doc.docType.category);

                this.subscriptions.push(observable.subscribe(data => {
                        const file = new Blob([data], {type: 'application/pdf'});
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                        this.loadingService.hide();
                    }, error => {
                        console.log('error', error);
                        this.errorHandlerService.showError(error);
                        this.loadingService.hide();
                    })
                );
            } else {
                this.errorHandlerService.showError('Avizul comitetului de etica trebuie salvat');
            }
        } else {
            this.errorHandlerService.showError('Avizul comitetului de etica nu a fost incarcat');
        }
    }

    save() {
        const formModel = this.approveClinicalTrailForm.getRawValue();
        this.loadingService.show();
        formModel.documents = this.docs;
        formModel.documents.forEach(docum => docum.registrationRequestId = formModel.id);
        formModel.outputDocuments = this.outDocuments;
        console.log('formModel.documents', formModel.documents);

        this.subscriptions.push(
            this.requestService.saveClinicalTrailRequest(formModel).subscribe(data => {
                this.docs = data.body.documents;
                this.outDocuments = data.body.outputDocuments;

                console.log('this.docs', this.docs);

                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
                console.log(error);
            })
        );
    }

    dysplayInvalidControl(form: FormGroup) {
        const ctFormControls = form['controls'];
        for (const control in ctFormControls) {
            ctFormControls[control].markAsTouched();
            ctFormControls[control].markAsDirty();
        }
    }

    onSubmit() {
        const formModel = this.approveClinicalTrailForm.getRawValue();

        // console.log(formModel);
        if (formModel.status === '0') {
            if (this.approveClinicalTrailForm.invalid) {
                // let form:FormGroup = this.approveClinicalTrailForm['controls'].find(control=>control)
                this.dysplayInvalidControl(this.approveClinicalTrailForm.get('clinicalTrails') as FormGroup);
                this.errorHandlerService.showError('Datele comisiei medicamentului sunt invalide');
                return;
            }

            this.loadingService.show();

            formModel.currentStep = 'F';
            formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
            formModel.requestHistories.push({
                startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: 'AP'
            });
            formModel.documents = this.docs;

            // console.log('evaluareaPrimaraObjectLet', JSON.stringify(formModel));

            formModel.currentStep = 'F';
            formModel.endDate = new Date();
            formModel.assignedUser = this.authService.getUserName();

            formModel.clinicalTrails.status = 'F';
            console.log('formModel', formModel);
            this.subscriptions.push(
                this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                    this.router.navigate(['dashboard/module']);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    console.log(error);
                })
            );
        } else if (formModel.status === '1') {
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
                    const formModel = this.approveClinicalTrailForm.getRawValue();
                    formModel.currentStep = 'I';
                    formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    formModel.requestHistories.push({
                        startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
                        endDate: new Date(),
                        username: this.authService.getUserName(),
                        step: 'AP'
                    });

                    formModel.assignedUser = this.authService.getUserName();
                    formModel.documents = this.docs;
                    this.subscriptions.push(
                        this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                            this.loadingService.hide();
                            this.router.navigate(['/dashboard/module/clinic-studies/interrupt/' + data.body]);
                        }, error => {
                            this.loadingService.hide();
                            console.log(error);
                        })
                    );
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
