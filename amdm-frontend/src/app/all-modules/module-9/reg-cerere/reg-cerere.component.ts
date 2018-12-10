import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs/index";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog} from "@angular/material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Document} from "../../../models/document";
import {AuthService} from "../../../shared/service/authetication.service";
import {RequestService} from "../../../shared/service/request.service";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";

enum Pages {
    CLAP = '3',
    CLPSC = '4',
    CLNP = '5',
    CLISP = '6'
}


@Component({
    selector: 'app-reg-cerere',
    templateUrl: './reg-cerere.component.html',
    styleUrls: ['./reg-cerere.component.css']
})

export class RegCerereComponent implements OnInit, OnDestroy {

    Pages: typeof Pages = Pages;
    generatedDocNrSeq: number;
    registerClinicalTrailForm: FormGroup;
    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    docTypes: any[] = [];

    phaseList: any[] = [];

    companii: Observable<any[]>;
    loadingCompany: boolean = false;
    protected companyInputs = new Subject<string>();

    clinicalTrails: Observable<any[]>;
    loadingClinicalTrail: boolean = false;
    protected clinicalTrailInputs = new Subject<string>();

    clinicalTrailForm: FormGroup;
    showClinicTrail: boolean = false;

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private requestService: RequestService,
                private router: Router,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private loadingService: LoaderService) {
    }

    ngOnInit() {
        this.registerClinicalTrailForm = this.fb.group({
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['R'],
            'company': ['', Validators.required],
            'initiator': [null],
            'assignedUser': [null],
            'flowControl': [null, Validators.required],
            'clinicalTrails': this.fb.group({
                'status': ['P'],
                'clinicTrialAmendEntities': []
            }),
            'type':
                this.fb.group({
                    'id': ['']
                })
        });

        this.clinicalTrailForm = this.fb.group({
            'title': {value: '', disabled: true},
            'clinicalTrail': [null, Validators.required],
            'sponsor': {value: '', disabled: true},
            'phase': {value: '', disabled: true},
            'treatment': {value: '', disabled: true},
        });

        this.generateDocNr();
        this.loadEconomicAgents();
        this.catchFlowControl();
        this.loadClinicalTrails();
        this.autocompleteClinicalTrailSearch();
        this.manageClinicalTrailForm();
    }

    manageClinicalTrailForm() {
        this.subscriptions.push(
            this.registerClinicalTrailForm.controls['flowControl'].valueChanges.subscribe(value => {
                this.showClinicTrail = value === "CLPSC" || value === "CLNP";
                if (!this.showClinicTrail) {
                    this.clinicalTrailForm.reset();
                }
            })
        )
    }

    autocompleteClinicalTrailSearch() {
        this.subscriptions.push(
            this.clinicalTrailForm.get('clinicalTrail').valueChanges.subscribe(changedValue => {
                if (changedValue === null) {
                    this.clinicalTrailForm.get('title').reset();
                    this.clinicalTrailForm.get('sponsor').reset();
                    this.clinicalTrailForm.get('phase').reset();
                    this.phaseList = [];
                    this.clinicalTrailForm.get('treatment').reset();
                }
                else {
                    console.log('Changed value', changedValue);
                    this.clinicalTrailForm.get('title').setValue(changedValue.title);
                    this.clinicalTrailForm.get('sponsor').setValue(changedValue.sponsor);
                    this.clinicalTrailForm.get('phase').setValue(changedValue.phase);
                    // console.log('changedValue.phase', changedValue.phase);
                    this.phaseList = [this.phaseList, changedValue.phase];
                    this.clinicalTrailForm.get('treatment').setValue(changedValue.treatment.description);
                }
            })
        )
    }

    loadClinicalTrails() {
        this.clinicalTrails =
            this.clinicalTrailInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingClinicalTrail = true;
                }),
                flatMap(term =>
                    this.administrationService.getClinicalTrailsCodAndEudra(term).pipe(
                        tap(() => this.loadingClinicalTrail = false)
                    )
                )
            );
    }

    catchFlowControl() {
        this.registerClinicalTrailForm.get('flowControl');
        this.subscriptions.push(
            this.registerClinicalTrailForm.get('flowControl').valueChanges.subscribe(changedValue => {
                // console.log('Pages[changedValue]', Pages[changedValue]);
                this.loadDocTypes(Pages[changedValue]);
            })
        )
    }

    loadDocTypes(stepId: string) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode(stepId, 'R').subscribe(step => {
                    // console.log('getRequestStepByIdAndCode', step);
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                //console.log('getAllDocTypes', data);
                                if (step.availableDocTypes === null) {
                                    return;
                                }

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

    loadEconomicAgents() {
        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>
                    this.administrationService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );
    }

    generateDocNr() {
        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.registerClinicalTrailForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );
    }


    onSubmit() {
        if (this.registerClinicalTrailForm.invalid) {
            alert('Invalid Form1!!')
            return;
        }
        let formModel = this.registerClinicalTrailForm.value;

        if (formModel.flowControl === 'CLAP') {
            this.loadingService.show();
            formModel.type.id = '3';
            formModel.requestHistories = [{
                startDate: formModel.startDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: formModel.currentStep
            }];

            formModel.documents = this.docs;
            formModel.currentStep = 'E';
            formModel.initiator = this.authService.getUserName();
            formModel.assignedUser = this.authService.getUserName();

            // console.log("formModel", formModel);
            // console.log("regCerereJSON", JSON.stringify(formModel));

            this.subscriptions.push(this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                    this.router.navigate(['/dashboard/module/clinic-studies/evaluate/' + data.body]);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    console.log(error)
                })
            );
        }
        else if (formModel.flowControl === 'CLPSC') {
            if (this.clinicalTrailForm.invalid) {
                alert('Invalid Form2!!');
                return;
            }
            this.loadingService.show();

            formModel.type.id = '4';
            formModel.requestHistories = [{
                startDate: formModel.startDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: formModel.currentStep
            }];
            formModel.documents = this.docs;
            formModel.currentStep = 'E';
            formModel.initiator = this.authService.getUserName();
            formModel.assignedUser = this.authService.getUserName();
            formModel.clinicalTrails = this.clinicalTrailForm.get('clinicalTrail').value;

            formModel.clinicalTrails.clinicTrialAmendEntities = this.clinicalTrailForm.get('clinicalTrail').value.clinicTrialAmendEntities;

            this.subscriptions.push(this.requestService.addClinicalTrailAmendmentRequest(formModel).subscribe(data => {
                    this.router.navigate(['/dashboard/module/clinic-studies/evaluate-amendment/' + data.body]);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    console.log(error)
                })
            );
        }
        else if (formModel.flowControl === 'CLNP') {
            if (this.clinicalTrailForm.invalid) {
                alert('Invalid Form2!!');
                return;
            }

            formModel.type.id = '5';
            formModel.requestHistories = [{
                startDate: formModel.startDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: formModel.currentStep
            }];
            formModel.documents = this.docs;
            formModel.currentStep = 'N';

            formModel.initiator = this.authService.getUserName();
            formModel.assignedUser = this.authService.getUserName();
            formModel.clinicalTrails = this.clinicalTrailForm.get('clinicalTrail').value;

            this.subscriptions.push(this.requestService.addClinicalTrailNotificationRequest(formModel).subscribe(data => {
                    this.router.navigate(['/dashboard/module/clinic-studies/notify/' + data.body]);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    console.log(error)
                })
            );

            console.log('clinicTrail', this.clinicalTrailForm.value);
            console.log('Going to -> Înregistrarea Notificărilor privind Protocolul studiului clinic cu medicamente')
            this.loadingService.hide();
        }
        else if (formModel.flowControl === 'CLISP') {
            console.log('Going to -> Înregistrarea informației privind siguranța produsului de investigație clinică')
            this.loadingService.hide();
        }
        else {
            console.log('Going to -> HZ')
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subsription => subsription.unsubscribe());
    }

}
