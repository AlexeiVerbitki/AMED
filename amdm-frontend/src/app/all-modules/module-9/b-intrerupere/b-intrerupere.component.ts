import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/service/authetication.service';
import {Document} from '../../../models/document';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoaderService} from '../../../shared/service/loader.service';
import {TaskService} from '../../../shared/service/task.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-b-intrerupere',
    templateUrl: './b-intrerupere.component.html',
    styleUrls: ['./b-intrerupere.component.css']
})
export class BIntrerupereComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    cancelClinicalTrailAmendmentForm: FormGroup;
    docs: Document[] = [];
    docTypes: any[];
    outDocuments: any[] = [];
    mandatedContactName: string;

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private authService: AuthService,
                private router: Router,
                private loadingService: LoaderService,
                private taskService: TaskService,
                private administrationService: AdministrationService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Intrerupere amendament la studiu clinic');
        this.cancelClinicalTrailAmendmentForm = this.fb.group({
            'id': [''],
            'requestNumber': [{value: '', disabled: true}],
            'startDate': [{value: '', disabled: true}],
            'endDate': [''],
            'company': [null],
            'currentStep': [''],
            'type': [],
            'typeCode': [''],
            'interruptionReason': ['', Validators.required],
            'requestHistories': [],
            'initiator': [null],
            'assignedUser': [null],
            'clinicalTrails': undefined,
            'registrationRequestMandatedContacts': []
        });
        this.initPage();
    }

    initPage() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailAmendmentRequest(params['id']).subscribe(data => {
                    console.log('data', data);
                    this.cancelClinicalTrailAmendmentForm.get('id').setValue(data.id);
                    this.cancelClinicalTrailAmendmentForm.get('requestNumber').setValue(data.requestNumber);
                    this.cancelClinicalTrailAmendmentForm.get('startDate').setValue(new Date(data.startDate));
                    if (data.company) {
                        this.cancelClinicalTrailAmendmentForm.get('company').setValue(data.company);
                    } else {
                        this.mandatedContactName = data.registrationRequestMandatedContacts[0].mandatedFirstname.concat(' ')
                            .concat(data.registrationRequestMandatedContacts[0].mandatedLastname);
                    }
                    this.cancelClinicalTrailAmendmentForm.get('type').setValue(data.type);
                    this.cancelClinicalTrailAmendmentForm.get('typeCode').setValue(data.type.code);
                    this.cancelClinicalTrailAmendmentForm.get('initiator').setValue(data.initiator);
                    this.cancelClinicalTrailAmendmentForm.get('clinicalTrails').setValue(data.clinicalTrails);
                    this.cancelClinicalTrailAmendmentForm.get('registrationRequestMandatedContacts').setValue(data.registrationRequestMandatedContacts);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    this.cancelClinicalTrailAmendmentForm.get('requestHistories').setValue(data.requestHistories);

                    console.log('clinicalTrailsData', this.cancelClinicalTrailAmendmentForm);

                    this.docs = data.documents;
                    this.outDocuments = data.outputDocuments;
                    this.loadDocTypes(data);
                },
                error => console.log(error)
            ));
        }));
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

    dysplayInvalidControl(form: FormGroup) {
        const ctFormControls = form['controls'];
        for (const control of Object.keys(ctFormControls)) {
            ctFormControls[control].markAsTouched();
            ctFormControls[control].markAsDirty();
        }
    }

    doSubmit() {
        const formModel = this.cancelClinicalTrailAmendmentForm.getRawValue();
        console.log('Submit data', formModel);

        if (this.cancelClinicalTrailAmendmentForm.invalid) {
            this.dysplayInvalidControl(this.cancelClinicalTrailAmendmentForm as FormGroup);
            this.errorHandlerService.showError('Motivul intreruperii este invalid');
            return;
        }

        this.loadingService.show();

        formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
        formModel.requestHistories.push({
            startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'C'
        });
        formModel.documents = this.docs;

        formModel.currentStep = 'C';
        formModel.assignedUser = this.authService.getUserName();
        formModel.endDate = new Date();

        const findAmendment = formModel.clinicalTrails.clinicTrialAmendEntities.find(amendment => formModel.id == amendment.registrationRequestId);
        findAmendment.status = 'C';
        this.subscriptions.push(
            this.requestService.addClinicalTrailAmendmentNextRequest(formModel).subscribe(data => {
                this.router.navigate(['/dashboard/module/']);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
                console.log(error);
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
        this.navbarTitleService.showTitleMsg('');
    }

}
