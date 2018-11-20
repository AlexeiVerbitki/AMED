import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, Subscription} from "rxjs";
import {MatDialog} from "@angular/material";
import {Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {saveAs} from 'file-saver';
import {Document} from "../../../models/document";
import {RequestService} from "../../../shared/service/request.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {TaskService} from "../../../shared/service/task.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {CanModuleDeactivate} from "../../../shared/auth-guard/can-deactivate-guard.service";
import {MedicamentService} from "../../../shared/service/medicament.service";

@Component({
    selector: 'app-reg-modify-cerere',
    templateUrl: './reg-modify-cerere.component.html',
    styleUrls: ['./reg-modify-cerere.component.css']
})
export class RegModifyCerereComponent implements OnInit, CanModuleDeactivate {
    documents: Document [] = [];
    companii: Observable<any[]>;
    rForm: FormGroup;
    docTypes: any[];

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    loadingCompany: boolean = false;
    companyInputs = new Subject<string>();

    companyMedicaments: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;

    constructor(private fb: FormBuilder,
                private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private medicamentService: MedicamentService,
                private errorHandlerService: ErrorHandlerService,
                private loadingService: LoaderService,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog) {
        this.rForm = fb.group({
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['E'],
            'medicament': [null, Validators.required],
            'company': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'type':
                fb.group({
                    'code': ['INMP', Validators.required]
                }),
        });
    }

    ngOnInit() {
        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

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

        this.companyMedicaments =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.medLoading = true;

                }),
                flatMap(term =>

                    this.medicamentService.getMedicamentByRegisterNumber(term).pipe(
                        tap((r) => {this.medLoading = false; })
                    )
                )
            );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('21', 'R').subscribe(step => {
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

    nextStep() {
        this.formSubmitted = true;
        if (!this.rForm.valid) {
            return;
        }

        this.formSubmitted = false;

        this.loadingService.show();

        var useranameDB = this.authService.getUserName()

        var modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: 'R'
        }];
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;
        modelToSubmit.medicamentPostauthorizationRegisterNr = this.rForm.get('medicament').value.regnr;
        modelToSubmit.medicament = null;

        console.log(modelToSubmit);

        this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/post-modify/evaluate/' + data.body.id]);
            }, error => this.loadingService.hide())
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }
}
