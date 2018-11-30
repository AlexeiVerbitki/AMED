import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {TaskService} from "../../../shared/service/task.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";

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
                public dialogConfirmation: MatDialog) {

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
                'title': ['title', Validators.required],
                'treatment': ['', Validators.required],
                'provenance': ['', Validators.required],
                'sponsor': ['sponsor', Validators.required],
                'phase': ['faza', Validators.required],
                'eudraCtNr': ['eudraCtNr', Validators.required],
                'code': ['code', Validators.required],
                'medicalInstitutions': [],
                'trialPopNat': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'trialPopInternat': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
                'medicament': [],
                'referenceProduct': [],
                'status': ['P'],
                'pharmacovigilance': [],
                'placebo': [],
                'clinicTrialAmendEntities': [],
                'comissionNr': ['', Validators.required],
                'comissionDate': ['', Validators.required]
            }),
            'status': [undefined, Validators.required],
        });
        this.initPage();
        this.loadDocTypes();

    }

    loadDocTypes() {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3', 'AP').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
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

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    this.approveClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);

                    this.approveClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);
                    if(data.clinicalTrails.comissionDate !== null) {
                        this.approveClinicalTrailForm.get('clinicalTrails.comissionDate').setValue(new Date(data.clinicalTrails.comissionDate));
                    }


                    this.docs = data.documents;
                    this.outDocuments = data.outputDocuments;

                    console.log('this.approveClinicalTrailForm', this.approveClinicalTrailForm);
                },
                error => console.log(error)
            ))
        }))
    }

    onSubmit() {
        let formModel = this.approveClinicalTrailForm.getRawValue();

        console.log(formModel.status);
        if (formModel.status === '0') {
            console.log(formModel);
            if (this.approveClinicalTrailForm.invalid ) {
               alert('InvalidForm');
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

            console.log("evaluareaPrimaraObjectLet", JSON.stringify(formModel));

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
                    let formModel = this.approveClinicalTrailForm.getRawValue();
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
                            console.log(error)
                        })
                    )
                }
            });
        }
    }

    interruptProcess() {

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

}
