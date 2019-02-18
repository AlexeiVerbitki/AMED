import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs/index';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Document} from '../../../models/document';
import {AuthService} from '../../../shared/service/authetication.service';
import {RequestService} from '../../../shared/service/request.service';
import {TaskService} from '../../../shared/service/task.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {ClinicalTrialService} from '../../../shared/service/clinical-trial.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';

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
    loadingCompany = false;
    companyInputs = new Subject<string>();

    clinicalTrails: Observable<any[]>;
    loadingClinicalTrail = false;
    protected clinicalTrailInputs = new Subject<string>();

    clinicalTrailForm: FormGroup;
    showClinicTrail = false;

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private requestService: RequestService,
                private router: Router,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private loadingService: LoaderService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private clinicTrialService: ClinicalTrialService,
                private navbarTitleService: NavbarTitleService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrarea studiilor clinice');
        this.registerClinicalTrailForm = this.fb.group({
            'requestNumber': {value: null, disabled: true},
            'startDate': {value: new Date(), disabled: true},
            'currentStep': ['R'],
            'company': ['', Validators.required],

            'registrationRequestMandatedContacts': this.fb.group({
                'mandatedFirstname': [null, Validators.required],
                'mandatedLastname': [null, Validators.required],
                'idnp': [null, Validators.required],
                'phoneNumber': [null],
                'email': [null, Validators.email],
                'requestMandateNr': [null],
                'requestMandateDate': [null]
            }),

            'initiator': [null],
            'assignedUser': [null],
            'flowControl': ['CLAP', Validators.required],
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
        this.loadDocTypes(Pages[this.registerClinicalTrailForm.get('flowControl').value]);

    }

    manageClinicalTrailForm() {
        this.subscriptions.push(
            this.registerClinicalTrailForm.controls['flowControl'].valueChanges.subscribe(value => {
                this.showClinicTrail = value === 'CLPSC' || value === 'CLNP';
                if (!this.showClinicTrail) {
                    this.clinicalTrailForm.reset();
                }
            })
        );
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
                } else {
                    console.log('Changed value', changedValue);
                    this.clinicalTrailForm.get('title').setValue(changedValue.title);
                    this.clinicalTrailForm.get('sponsor').setValue(changedValue.sponsor);
                    this.clinicalTrailForm.get('phase').setValue(changedValue.phase);
                    // console.log('changedValue.phase', changedValue.phase);
                    this.phaseList = [this.phaseList, changedValue.phase];
                    this.clinicalTrailForm.get('treatment').setValue(changedValue.treatment.description);
                }
            })
        );
    }

    loadClinicalTrails() {
        this.clinicalTrails =
            this.clinicalTrailInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
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
        );
    }

    loadDocTypes(stepId: string) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode(stepId, 'R').subscribe(step => {
                    let availableDocsArr = [];
                    step.availableDocTypes ? availableDocsArr = step.availableDocTypes.split(',') : availableDocsArr = [];
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                if (step.availableDocTypes === null) {
                                    return;
                                }
                                this.docTypes = data;
                                this.docTypes = this.docTypes.filter(r => availableDocsArr.includes(r.category));
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
                    if (result && result.length > 2) {
                        return true;
                    }
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
            this.clinicTrialService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data[0];
                    // console.log('sequence', data[0]);
                    this.registerClinicalTrailForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );
    }

    allowOnlyNumbers(event: any) {
        //console.log(key);
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    dysplayInvalidControl(form: FormGroup) {
        const ctFormControls = form['controls'];
        for (const control of Object.keys(ctFormControls)) {
            ctFormControls[control].markAsTouched();
            ctFormControls[control].markAsDirty();
        }
    }


    onSubmit() {
        const formModel = this.registerClinicalTrailForm.getRawValue();
        console.log('formModel', formModel);

        if (this.registerClinicalTrailForm.invalid /*&& !this.registerClinicalTrailForm.get('flowControl').invalid*/) {
            this.dysplayInvalidControl(this.registerClinicalTrailForm);
            this.dysplayInvalidControl(this.registerClinicalTrailForm.get('registrationRequestMandatedContacts') as FormGroup);
            this.errorHandlerService.showError('Forma de inregistrare contine date invalide');
            return;
        }

        if (formModel.registrationRequestMandatedContacts.idnp.length < 13) {
            this.errorHandlerService.showError('IDNP-ul persoanei responsabile contine mai putin de 13 caractere');
            return;
        }
        this.subscriptions.push(this.clinicTrialService.validIDNP(formModel.registrationRequestMandatedContacts.idnp).subscribe(data => {
                console.log('validationDate', data);
                if (!data) {
                    this.errorHandlerService.showError('IDNP-ul persoanei responsabile este invalid');
                    return;
                }
            }, error => {
                console.log(error);
            })
        );

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
            formModel.registrationRequestMandatedContacts = [formModel.registrationRequestMandatedContacts];

            console.log('clinicTrail', formModel);
            //return;

            this.subscriptions.push(this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                    this.router.navigate(['/dashboard/module/clinic-studies/evaluate/' + data.body]);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    console.log(error);
                })
            );
        } else if (formModel.flowControl === 'CLPSC') {
            if (this.clinicalTrailForm.invalid) {
                this.dysplayInvalidControl(this.clinicalTrailForm);
                this.errorHandlerService.showError('Studiu clinic nu a fost identificat');
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
            formModel.registrationRequestMandatedContacts = [formModel.registrationRequestMandatedContacts];

            this.subscriptions.push(this.requestService.addClinicalTrailAmendmentRequest(formModel).subscribe(data => {
                    this.router.navigate(['/dashboard/module/clinic-studies/evaluate-amendment/' + data.body]);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    console.log(error);
                })
            );
        } else if (formModel.flowControl === 'CLNP') {
            if (this.clinicalTrailForm.invalid) {
                this.dysplayInvalidControl(this.clinicalTrailForm);
                this.errorHandlerService.showError('Studiu clinic nu a fost identificat');
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

            formModel.registrationRequestMandatedContacts = [formModel.registrationRequestMandatedContacts];

            this.subscriptions.push(this.requestService.addClinicalTrailNotificationRequest(formModel).subscribe(data => {
                    this.router.navigate(['/dashboard/module/clinic-studies/notify/' + data.body]);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    console.log(error);
                })
            );

            // console.log('clinicTrail', this.clinicalTrailForm.value);
            console.log('Going to -> Înregistrarea Notificărilor privind Protocolul studiului clinic cu medicamente');
            this.loadingService.hide();
        } else if (formModel.flowControl === 'CLISP') {
            console.log('Going to -> Înregistrarea informației privind siguranța produsului de investigație clinică');
            this.loadingService.hide();
        } else {
            console.log('Going to -> HZ');
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subsription => subsription.unsubscribe());
        this.navbarTitleService.showTitleMsg('');
    }

}
