import {Component, OnInit} from '@angular/core';
import {Cerere} from "../../../models/cerere";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {MatDialog} from "@angular/material";
import {Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {saveAs} from 'file-saver';
import {Document} from "../../../models/document";
import {AuthService} from "../../../shared/service/authetication.service";
import {RequestService} from "../../../shared/service/request.service";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {Subject} from "rxjs/index";




@Component({
    selector: 'app-import-authorization-request',
    templateUrl: './import-authorization-request.component.html',
    styleUrls: ['./import-authorization-request.component.css']
})
export class ImportAuthorizationRequestComponent implements OnInit {
    requestNumber
    generatedDocNrSeq: number;
    rForm: FormGroup;
    solicitantCompanyList: Observable<any[]>;
    formSubmitted: boolean;
    docs: Document [] = [];
    docTypes : any[];

    cereri: Cerere [] = [];
    dataForm: FormGroup;
    sysDate: string;
    currentDate: Date;
    file: any;
    medType: any;

    importer: Observable<any[]>;
    loadingCompany: boolean = false;
    protected companyInputs = new Subject<string>();





    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private requestService: RequestService,
                private router: Router,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private errorHandlerService: ErrorHandlerService,
                private loadingService: LoaderService) {
        this.rForm = fb.group({
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['R'],
            'company': ['', Validators.required],
            'initiator':[null],
            'assignedUser':[null],
            'data': {disabled: true, value: new Date()},
            'importType': [null, Validators.required],
            'type':
                this.fb.group({
                    'id': ['']
                }),
            'importAuthorizationEntity':
                fb.group({
                    'medType': [null]
                }),

        });
        this.dataForm = fb.group({});

        // this.loadSolicitantCompanyList();

    }

    ngOnInit() {
        this.generateDocNr();
        this.loadDocTypes();
        this.loadEconomicAgents();

        this.currentDate = new Date();


        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get( 'requestNumber').setValue(this.generatedDocNrSeq);


                },
                error => console.log(error)
            )
        );


        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3','R').subscribe(step => {
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

    // loadSolicitantCompanyList() {
    //     this.subscriptions.push(
    //         this.administrationService.getAllCompanies().subscribe(data => {
    //                 this.solicitantCompanyList = data;
    //             },
    //             error => console.log(error)
    //         )
    //     )
    // }

    loadEconomicAgents() {
        this.importer =
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
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );
    }




    nextStep() {

        // console.log(this.rForm)
        // console.log(this.rForm.status)
        if (/*this.docs.length == 0 ||*/ this.rForm.invalid ) {
            alert('No Documents attached or Invalid Form data!!')
            return;
        }

        this.medType = this.rForm.get('importType').value
        // this.rForm.get('importAuthorizationEntity.medType').setValue(this.medType);


        let formModel: any = this.rForm.value;
        formModel.importAuthorizationEntity.medType = this.medType;

        this.loadingService.show();

        formModel.type.id = '11';
        formModel.requestHistories = [{
            // startDate: this.rForm.get('startDate').value,
            startDate: formModel.startDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: formModel.currentStep
        }];



        formModel.importAuthorizationEntity.documents = this.docs;
        formModel.currentStep='E';
        formModel.initiator = this.authService.getUserName();
        formModel.assignedUser = this.authService.getUserName();



        this.subscriptions.push(this.requestService.addImportRequest(formModel).subscribe(data => {
            switch(this.rForm.get('importType').value){
                case "1":{this.router.navigate(['dashboard/module/import-authorization/registered-medicament/'  +data.body.id]) ; break;}
                case "2":{this.router.navigate(['dashboard/module/import-authorization/unregistered-medicament/'+data.body.id]) ; break;}
                // case "3":{this.router.navigate(['dashboard/module/import-authorization/materia-prima/'          +data.body]) ; break;}
                case "3":{this.router.navigate(['dashboard/module/import-authorization/ambalaj/'                +data.body.id]) ; break;}
                case "4":{this.router.navigate(['dashboard/module/import-authorization/ambalaj/'                +data.body.id]) ; break;}
            }
            this.loadingService.hide();
                // this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + data.body]);
            }, error => this.loadingService.hide())
        );



    }


}
