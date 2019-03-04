import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../models/document';
import {Observable, Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {TaskService} from '../../../shared/service/task.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material';
import {LoaderService} from '../../../shared/service/loader.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {DocumentService} from '../../../shared/service/document.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';

@Component({
    selector: 'app-b-aprobare',
    templateUrl: './b-aprobare.component.html',
    styleUrls: ['./b-aprobare.component.css']
})
export class BAprobareComponent implements OnInit, OnDestroy {

    approveClinicalTrailAmendForm: FormGroup;
    clinicalTrailAmendmentForm: FormGroup;
    docTypes: any[];
    outDocuments: any[] = [];
    docs: Document[] = [];
    private subscriptions: Subscription[] = [];
    private amendmentIndex = -1;
    mandatedContactName: string;

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private taskService: TaskService,
                private administrationService: AdministrationService,
                private loadingService: LoaderService,
                private authService: AuthService,
                private router: Router,
                public dialogConfirmation: MatDialog,
                private documentService: DocumentService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private navbarTitleService: NavbarTitleService) {
    }

    ngOnInit() {
        this.approveClinicalTrailAmendForm = this.fb.group({
            'id': [''],
            'requestNumber': [{value: '', disabled: true}],
            'startDate': [{value: '', disabled: true}],
            'endDate': [''],
            'company': [null],
            'currentStep': [''],
            'type': [],
            'typeCode': [''],
            'requestHistories': [],
            'initiator': [null],
            'assignedUser': [null],
            'outputDocuments': [],
            'clinicalTrails': [],
            'clinicalTrailAmendment': [],
            'registrationRequestMandatedContacts': [],
            'status': [undefined, Validators.required],
        });

        this.clinicalTrailAmendmentForm = this.fb.group({
            'comissionNr': ['', Validators.required],
            'comissionDate': ['', Validators.required],
            'amendCode': ['', Validators.required]
        });
        this.initPage();
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
        this.navbarTitleService.showTitleMsg('Aprobare amendament la studiu clinic');
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailAmendmentRequest(params['id']).subscribe(data => {
                    console.log('clinicalTrailsData', data);

                    this.approveClinicalTrailAmendForm.get('id').setValue(data.id);
                    this.approveClinicalTrailAmendForm.get('requestNumber').setValue(data.requestNumber);
                    this.approveClinicalTrailAmendForm.get('startDate').setValue(new Date(data.startDate));
                    if (data.company) {
                        this.approveClinicalTrailAmendForm.get('company').setValue(data.company);
                    } else {
                        this.mandatedContactName = data.registrationRequestMandatedContacts[0].mandatedFirstname.concat(' ')
                            .concat(data.registrationRequestMandatedContacts[0].mandatedLastname);
                    }
                    this.approveClinicalTrailAmendForm.get('type').setValue(data.type);
                    this.approveClinicalTrailAmendForm.get('typeCode').setValue(data.type.code);
                    this.approveClinicalTrailAmendForm.get('initiator').setValue(data.initiator);
                    this.approveClinicalTrailAmendForm.get('currentStep').setValue(data.currentStep);
                    this.approveClinicalTrailAmendForm.get('registrationRequestMandatedContacts').setValue(data.registrationRequestMandatedContacts);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    this.approveClinicalTrailAmendForm.get('requestHistories').setValue(data.requestHistories);

                    this.approveClinicalTrailAmendForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    const findAmendment = data.clinicalTrails.clinicTrialAmendEntities.find(amendment => data.id == amendment.registrationRequestId);
                    this.amendmentIndex = data.clinicalTrails.clinicTrialAmendEntities.indexOf(findAmendment);

                    this.clinicalTrailAmendmentForm.get('comissionNr').setValue(findAmendment.comissionNr);
                    this.clinicalTrailAmendmentForm.get('comissionDate')
                        .setValue(findAmendment.comissionDate ? new Date(findAmendment.comissionDate) : findAmendment.comissionDate);
                    this.clinicalTrailAmendmentForm.get('amendCode')
                        .setValue(findAmendment.amendCode ? findAmendment.amendCode.substring(findAmendment.amendCode.lastIndexOf('-') + 1, findAmendment.amendCode.length) : '');

                    // findAmendment.comissionDate = '';
                    // findAmendment.comissionNr = '';
                    this.approveClinicalTrailAmendForm.get('clinicalTrailAmendment').setValue(findAmendment);
                    console.log('findAmendment', findAmendment);


                    this.docs = data.documents;
                    this.outDocuments = data.outputDocuments;

                    this.loadDocTypes(data);

                    console.log('this.approveClinicalTrailForm', this.approveClinicalTrailAmendForm);
                },
                error => console.log(error)
            ));
        }));
    }

    save() {
        const formModel = this.approveClinicalTrailAmendForm.getRawValue();
        this.loadingService.show();
        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex].comissionDate = this.clinicalTrailAmendmentForm.get('comissionDate').value;
        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex].comissionNr = this.clinicalTrailAmendmentForm.get('comissionNr').value;
        const codeBuilder = this.clinicalTrailAmendmentForm.get('amendCode').value == '' ?
            null : formModel.clinicalTrailAmendment.codeTo + '-' + this.clinicalTrailAmendmentForm.get('amendCode').value;
        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex].amendCode = codeBuilder;
        formModel.documents = this.docs;
        formModel.documents.forEach(docum => docum.registrationRequestId = formModel.id);
        formModel.outputDocuments = this.outDocuments;
        console.log('formModel', formModel);
        // return;

        this.subscriptions.push(
            this.requestService.saveClinicalTrailAmendmentRequest(formModel).subscribe(data => {
                this.docs = data.body.documents;
                this.outDocuments = data.body.outputDocuments;
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


    onSubmit() {
        if (this.clinicalTrailAmendmentForm.invalid) {
            this.dysplayInvalidControl(this.clinicalTrailAmendmentForm);
            this.errorHandlerService.showError('Datele comisiei medicamentului sunt invalide');
            return;
        }

        const formModel = this.approveClinicalTrailAmendForm.getRawValue();

        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex].comissionDate = this.clinicalTrailAmendmentForm.get('comissionDate').value;
        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex].comissionNr = this.clinicalTrailAmendmentForm.get('comissionNr').value;
        const codeBuilder = formModel.clinicalTrailAmendment.codeTo + '-' + this.clinicalTrailAmendmentForm.get('amendCode').value;
        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex].amendCode = codeBuilder;
        // console.log('codeBuilder', codeBuilder);

        // return;

        if (formModel.status === '0') {
            console.log(formModel);
            this.loadingService.show();
            //
            formModel.currentStep = 'F';
            formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
            formModel.requestHistories.push({
                startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: 'AP'
            });
            formModel.documents = this.docs;

            // console.log("evaluareaPrimaraObjectLet", JSON.stringify(formModel));

            formModel.endDate = new Date();
            formModel.assignedUser = this.authService.getUserName();

            // formModel.clinicalTrails.status = 'N';
            console.log('formModel', formModel);
            this.subscriptions.push(
                this.requestService.finishClinicalTrailAmendmentRequest(formModel).subscribe(data => {
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
                    // let formModel = this.approveClinicalTrailAmendForm.getRawValue();
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

                    const currentAmendment = formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex];

                    console.log('currentAmendment', currentAmendment);
                    this.subscriptions.push(
                        this.requestService.addClinicalTrailAmendmentNextRequest(formModel).subscribe(data => {
                            this.loadingService.hide();
                            this.router.navigate(['/dashboard/module/clinic-studies/interrupt-amendment/' + data.body]);
                        }, error => {
                            this.loadingService.hide();
                            console.log(error);
                        })
                    );
                }
            });
        }
    }

    viewDoc(doc: any) {
        // console.log('doc', doc);
        // console.log('this.docs', this.docs);
        const findDoc = this.docs.find(document => document.docType.category === 'AC');
        if (findDoc) {
            if (findDoc.id) {
                console.log('findDoc1', findDoc);
                let observable: Observable<any> = null;
                observable = this.documentService.generateAvizAC(this.approveClinicalTrailAmendForm.get('id').value, doc.docType.category);

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

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.navbarTitleService.showTitleMsg('');
    }

}
