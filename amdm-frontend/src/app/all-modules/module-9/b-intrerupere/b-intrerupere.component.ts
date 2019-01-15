import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/service/authetication.service';
import {Document} from '../../../models/document';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoaderService} from '../../../shared/service/loader.service';

@Component({
    selector: 'app-b-intrerupere',
    templateUrl: './b-intrerupere.component.html',
    styleUrls: ['./b-intrerupere.component.css']
})
export class BIntrerupereComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    cancelClinicalTrailAmendmentForm: FormGroup;
    protected docs: Document[] = [];
    docTypes: any[];
    outDocuments: any[] = [];

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private authService: AuthService,
                private router: Router,
                private loadingService: LoaderService
    ) {
    }

    ngOnInit() {
        this.cancelClinicalTrailAmendmentForm = this.fb.group({
            'id': [''],
            'requestNumber': [{value: '', disabled: true}],
            'startDate': [{value: '', disabled: true}],
            'endDate': [''],
            'company': [''],
            'currentStep': [''],
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
            this.subscriptions.push(this.requestService.getClinicalTrailAmendmentRequest(params['id']).subscribe(data => {
                    console.log('data', data);
                    this.cancelClinicalTrailAmendmentForm.get('id').setValue(data.id);
                    this.cancelClinicalTrailAmendmentForm.get('requestNumber').setValue(data.requestNumber);
                    this.cancelClinicalTrailAmendmentForm.get('startDate').setValue(new Date(data.startDate));
                    this.cancelClinicalTrailAmendmentForm.get('company').setValue(data.company);
                    this.cancelClinicalTrailAmendmentForm.get('type').setValue(data.type);
                    this.cancelClinicalTrailAmendmentForm.get('typeCode').setValue(data.type.code);
                    this.cancelClinicalTrailAmendmentForm.get('initiator').setValue(data.initiator);
                    this.cancelClinicalTrailAmendmentForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    this.cancelClinicalTrailAmendmentForm.get('requestHistories').setValue(data.requestHistories);

                    console.log('clinicalTrailsData', this.cancelClinicalTrailAmendmentForm);

                    this.docs = data.documents;
                    this.outDocuments = data.outputDocuments;
                },
                error => console.log(error)
            ));
        }));
    }

    doSubmit() {
        const formModel = this.cancelClinicalTrailAmendmentForm.getRawValue();
        console.log('Submit data', formModel);

        if (this.cancelClinicalTrailAmendmentForm.invalid) {
            alert('Invalid Form!!');
            console.log('Not submitted data', formModel);
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
    }

}
