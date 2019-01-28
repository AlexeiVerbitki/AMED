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
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
    selector: 'app-a-aprobare',
    templateUrl: './a-aprobare.component.html',
    styleUrls: ['./a-aprobare.component.css']
})
export class AAprobareComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    approveClinicalTrailForm: FormGroup;
    protected docs: Document[] = [];
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
                private errorHandlerService: ErrorHandlerService,
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
                'title': ['', Validators.required],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['', Validators.required],
                'phase': ['', Validators.required],
                'eudraCtNr': ['', Validators.required],
                'code': ['code', Validators.required],
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
        // console.log('data', data);
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode(data.type.id, data.currentStep).subscribe(step => {
                    // console.log('step', step);
                    // console.log('this.outDocuments', this.outDocuments);
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                                this.outDocuments = this.outDocuments.filter(r => step.outputDocTypes.includes(r.docType.category));
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
        let findDoc = this.docs.find(document => document.docType.category === 'AC');
        if (findDoc) {
            if (findDoc.id) {
                console.log('findDoc1', findDoc);
                let observable: Observable<any> = null;
                observable = this.documentService.generateAvizC(this.approveClinicalTrailForm.get('id').value, doc.docType.category);

                this.subscriptions.push(observable.subscribe(data => {
                        let file = new Blob([data], {type: 'application/pdf'});
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                        this.loadingService.hide();
                    }, error => {
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
        // console.log('1',formModel);
        formModel.documents = this.docs;
        formModel.outputDocuments = this.outDocuments;
        this.subscriptions.push(
            this.requestService.saveClinicalTrailRequest(formModel).subscribe(data => {
                // console.log('data',data);
                // console.log('data',data.body);

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

    onSubmit() {
        const formModel = this.approveClinicalTrailForm.getRawValue();

        console.log(formModel.status);
        if (formModel.status === '0') {
            console.log(formModel);
            if (this.approveClinicalTrailForm.invalid) {
                alert('InvalidForm');
                console.log('this.approveClinicalTrailForm.invalid', this.approveClinicalTrailForm);
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

            console.log('evaluareaPrimaraObjectLet', JSON.stringify(formModel));

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
