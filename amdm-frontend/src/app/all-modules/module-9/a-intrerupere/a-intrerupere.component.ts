import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../models/document';
import {Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {TaskService} from '../../../shared/service/task.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-a-intrerupere',
    templateUrl: './a-intrerupere.component.html',
    styleUrls: ['./a-intrerupere.component.css']
})
export class AIntrerupereComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    cancelClinicalTrailForm: FormGroup;
    docs: Document[] = [];
    docTypes: any[];
    outDocuments: any[] = [];

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private authService: AuthService,
                private router: Router,
                private loadingService: LoaderService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private navbarTitleService: NavbarTitleService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Intrerupere inregistrare studiu clinic');
        this.cancelClinicalTrailForm = this.fb.group({
            'id': [''],
            'requestNumber': [{value: '', disabled: true}],
            'startDate': [{value: '', disabled: true}],
            'endDate': [''],
            'company': [''],
            'currentStep': ['E'],
            'type': [],
            'typeCode': [''],
            'interruptionReason': ['', Validators.required],
            'requestHistories': [],
            'initiator': [null],
            'assignedUser': [null],
            'clinicalTrails': undefined,
        });
        this.initPage();
    }

    initPage() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                    console.log('data', data);
                    this.cancelClinicalTrailForm.get('id').setValue(data.id);
                    this.cancelClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.cancelClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.cancelClinicalTrailForm.get('company').setValue(data.company);
                    this.cancelClinicalTrailForm.get('type').setValue(data.type);
                    this.cancelClinicalTrailForm.get('typeCode').setValue(data.type.code);
                    this.cancelClinicalTrailForm.get('initiator').setValue(data.initiator);
                    this.cancelClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    this.cancelClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);

                    console.log('clinicalTrailsData', this.cancelClinicalTrailForm);

                    this.loadDocTypes(data);
                    // this.docs = data.documents;
                    // this.outDocuments = data.outputDocuments;
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
        const formModel = this.cancelClinicalTrailForm.getRawValue();
        console.log('Submit data', formModel);

        if (this.cancelClinicalTrailForm.invalid) {
            this.dysplayInvalidControl(this.cancelClinicalTrailForm as FormGroup);
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

        console.log('evaluareaPrimaraObjectLet', JSON.stringify(formModel));

        formModel.currentStep = 'C';
        formModel.assignedUser = this.authService.getUserName();
        formModel.endDate = new Date();
        formModel.clinicalTrails.status = 'C';
        this.subscriptions.push(
            this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                this.router.navigate(['/dashboard/module/']);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
                console.log(error);
            })
        );
    }

    requestNL() {


    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
        this.navbarTitleService.showTitleMsg('');
    }

}
