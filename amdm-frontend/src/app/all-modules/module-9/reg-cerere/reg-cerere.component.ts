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

@Component({
    selector: 'app-reg-cerere',
    templateUrl: './reg-cerere.component.html',
    styleUrls: ['./reg-cerere.component.css']
})
export class RegCerereComponent implements OnInit, OnDestroy {

    generatedDocNrSeq: number;
    registerClinicalTrailForm: FormGroup;
    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    docTypes : any[];

    companii: Observable<any[]>;
    loadingCompany : boolean = false;
    protected companyInputs = new Subject<string>();

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
            'initiator':[null],
            'assignedUser':[null],
            'flowControl': ['CLAP', Validators.required],
            'clinicalTrails': this.fb.group({
                'status': ['P']
            }),
            'type':
                this.fb.group({
                    'id': ['']
                })
        });

        this.generateDocNr();
        this.loadDocTypes();

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

    loadDocTypes(){
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3','R').subscribe(step => {
                    //console.log('getRequestStepByIdAndCode', step);
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                            //console.log('getAllDocTypes', data);
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
            formModel.currentStep='E';
            formModel.initiator = this.authService.getUserName();
            formModel.assignedUser = this.authService.getUserName();

            console.log("formModel", formModel);
            // console.log("regCerereJSON", JSON.stringify(formModel));

            this.subscriptions.push(this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                    this.router.navigate(['/dashboard/module/clinic-studies/evaluate/' + data.body]);
                    this.loadingService.hide();
                },error => {
                    this.loadingService.hide();
                    console.log(error)
                })
            );
        }
        else if (formModel.flowControl === 'CLPSC') {
            this.registerClinicalTrailForm.get('type.id').setValue('4')
            console.log('Going to -> Aprobarea amendamentelor la Protocoalele Studiilor Clinice la medicamente')
        }
        else if (formModel.flowControl === 'CLNP') {
            console.log('Going to -> Înregistrarea Notificărilor privind Protocolul studiului clinic cu medicamente')
        }
        else if (formModel.flowControl === 'CLISP') {
            console.log('Going to -> Înregistrarea informației privind siguranța produsului de investigație clinică')
        }
        else {
            console.log('Going to -> HZ')
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subsription=>subsription.unsubscribe());
    }

}
