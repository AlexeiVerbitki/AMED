import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {TaskService} from "../../../shared/service/task.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {LoaderService} from "../../../shared/service/loader.service";
import {AuthService} from "../../../shared/service/authetication.service";

@Component({
    selector: 'app-b-aprobare',
    templateUrl: './b-aprobare.component.html',
    styleUrls: ['./b-aprobare.component.css']
})
export class BAprobareComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    approveClinicalTrailAmendForm: FormGroup;
    clinicalTrailAmendmentForm: FormGroup;
    protected docs: Document[] = [];
    docTypes: any[];
    outDocuments: any[] = [];
    private amendmentIndex: number = -1;

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private taskService: TaskService,
                private administrationService: AdministrationService,
                private loadingService: LoaderService,
                private authService: AuthService,
                private router: Router,
                public dialogConfirmation: MatDialog
    ) {
    }

    ngOnInit() {
        this.approveClinicalTrailAmendForm = this.fb.group({
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
            'clinicalTrails': [],
            'clinicalTrailAmendment': [],
            // 'clinicalTrailAmendment': this.fb.group({
            //     'id': [''],
            //     'registrationRequestId': [],
            //     'clinicalTrialsEntityId': [],
            //     'title': ['title', Validators.required],
            //     'treatment': ['', Validators.required],
            //     'provenance': ['', Validators.required],
            //     'sponsor': ['', Validators.required],
            //     'phase': ['', Validators.required],
            //     'eudraCtNr': ['eudraCtNr', Validators.required],
            //     'code': ['', Validators.required],
            //     'medicalInstitutionsFrom': [],
            //     'trialPopNat': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            //     'trialPopInternat': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            //     'medicament': [],
            //     'referenceProduct': [],
            //     'status': ['P'],
            //     'placebo': [],
            //     'comissionNr': ['', Validators.required],
            //     'comissionDate': ['', Validators.required]
            // }),
            'status': [undefined, Validators.required],
        });

        this.clinicalTrailAmendmentForm = this.fb.group({
            'comissionNr': ['', Validators.required],
            'comissionDate': ['', Validators.required]
        });
        this.initPage();
    }

    loadDocTypes(data) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode(data.type.id, data.currentStep).subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                if (step.availableDocTypes) {
                                    this.docTypes = data;
                                    this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
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
            this.subscriptions.push(this.requestService.getClinicalTrailAmendmentRequest(params['id']).subscribe(data => {
                    console.log('clinicalTrailsData', data);

                    this.approveClinicalTrailAmendForm.get('id').setValue(data.id);
                    this.approveClinicalTrailAmendForm.get('requestNumber').setValue(data.requestNumber);
                    this.approveClinicalTrailAmendForm.get('startDate').setValue(new Date(data.startDate));
                    this.approveClinicalTrailAmendForm.get('company').setValue(data.company);
                    this.approveClinicalTrailAmendForm.get('type').setValue(data.type);
                    this.approveClinicalTrailAmendForm.get('typeCode').setValue(data.type.code);
                    this.approveClinicalTrailAmendForm.get('initiator').setValue(data.initiator);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    this.approveClinicalTrailAmendForm.get('requestHistories').setValue(data.requestHistories);

                    this.approveClinicalTrailAmendForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    let findAmendment = data.clinicalTrails.clinicTrialAmendEntities.find(amendment => data.id == amendment.registrationRequestId);
                    this.amendmentIndex = data.clinicalTrails.clinicTrialAmendEntities.indexOf(findAmendment);

                    findAmendment.comissionDate = '';
                    findAmendment.comissionNr = '';
                    this.approveClinicalTrailAmendForm.get('clinicalTrailAmendment').setValue(findAmendment);
                    console.log('findAmendment', findAmendment);


                    this.docs = data.documents;
                    this.outDocuments = data.outputDocuments;

                    this.loadDocTypes(data);

                    console.log('this.approveClinicalTrailForm', this.approveClinicalTrailAmendForm);
                },
                error => console.log(error)
            ))
        }))
    }

    onSubmit() {
        if (this.clinicalTrailAmendmentForm.invalid) {
            console.log('InvalidForm1', this.clinicalTrailAmendmentForm);
            alert('InvalidForm1');
            return;
        }

        let formModel = this.approveClinicalTrailAmendForm.getRawValue();

        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex].comissionDate = this.clinicalTrailAmendmentForm.get('comissionDate').value;
        formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex].comissionNr = this.clinicalTrailAmendmentForm.get('comissionNr').value;
        console.log(formModel);

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
                    console.log(error)
                })
            )
        }
        else if (formModel.status === '1') {
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

                    let currentAmendment = formModel.clinicalTrails.clinicTrialAmendEntities[this.amendmentIndex];

                    console.log('currentAmendment', currentAmendment);
                    this.subscriptions.push(
                        this.requestService.addClinicalTrailAmendmentNextRequest(formModel).subscribe(data => {
                            this.loadingService.hide();
                            this.router.navigate(['/dashboard/module/clinic-studies/interrupt-amendment/' + data.body]);
                        }, error => {
                            this.loadingService.hide();
                            console.log(error)
                        })
                    )
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

}
