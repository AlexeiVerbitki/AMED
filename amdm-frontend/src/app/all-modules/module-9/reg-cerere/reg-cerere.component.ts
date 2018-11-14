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

    companii: Observable<any[]>;
    loadingCompany: boolean = false;
    protected companyInputs = new Subject<string>();

    clinicalTrails: Observable<any[]>;
    loadingClinicalTrail: boolean = false;
    protected clinicalTrailInputs = new Subject<string>();

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
                'status': ['P']
            }),
            'type':
                this.fb.group({
                    'id': ['']
                })
        });

        this.generateDocNr();
        this.loadEconomicAgents();
        this.catchFlowControl();
        this.loadClinicalTrails();

        console.log('this.registerClinicalTrailForm.get(\'flowControl\')', this.registerClinicalTrailForm.get('flowControl'));
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
            this.registerClinicalTrailForm.get('flowControl').valueChanges.subscribe(changedValue=>{
                console.log('Pages[changedValue]',Pages[changedValue]);
                this.loadDocTypes(Pages[changedValue]);
            })
        )
    }

    loadDocTypes(stepId:string) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode(stepId, 'R').subscribe(step => {
                    console.log('getRequestStepByIdAndCode', step);
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                //console.log('getAllDocTypes', data);
                                if(step.availableDocTypes === null) {
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
            alert('Invalid Form!!')
            return;
        }
        let formModel = this.registerClinicalTrailForm.value;

        this.loadingService.show();

        if (formModel.flowControl === 'CLAP') {
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

            console.log("formModel", formModel);
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
            this.registerClinicalTrailForm.get('type.id').setValue('4')
            console.log('Going to -> Aprobarea amendamentelor la Protocoalele Studiilor Clinice la medicamente')

            console.log(Pages.CLAP);

            this.loadingService.hide();
        }
        else if (formModel.flowControl === 'CLNP') {
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
