import {Component, OnInit} from '@angular/core';
import {Cerere} from '../../../models/cerere';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {saveAs} from 'file-saver';
import {Document} from '../../../models/document';
import {AuthService} from '../../../shared/service/authetication.service';
import {RequestService} from '../../../shared/service/request.service';
import {TaskService} from '../../../shared/service/task.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {Subject} from 'rxjs/index';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';


@Component({
    selector: 'app-import-authorization-request',
    templateUrl: './import-authorization-request.component.html',
    styleUrls: ['./import-authorization-request.component.css']
})
export class ImportAuthorizationRequestComponent implements OnInit {
    requestNumber;
    generatedDocNrSeq: number;
    rForm: FormGroup;
    formSubmitted: boolean;
    docs: Document [] = [];
    docTypes: any[];

    cereri: Cerere [] = [];
    dataForm: FormGroup;
    currentDate: Date;
    file: any;
    medType: any;

    importer: Observable<any[]>;
    loadingCompany = false;
    authorizationNumber: any = '';
    importRadioButton: any;
    companyInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private requestService: RequestService,
                private router: Router,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private successOrErrorHandlerService: SuccessOrErrorHandlerService,
                private loadingService: LoaderService) {
        this.rForm = fb.group({
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['R'],
            'company': ['', Validators.required],
            'initiator': [null],
            'assignedUser': [null],
            'data': {disabled: true, value: new Date()},
            'importType': [null, Validators.required],
            'idnp': [null],
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
        this.onChanges();
        // this.activeLicenses=false;

        this.currentDate = new Date();


        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);


                },
                error => console.log(error)
            )
        );


        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3', 'R').subscribe(step => {
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

    loadDocTypes() {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('3', 'R').subscribe(step => {
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


    loadEconomicAgents() {
        this.importer =
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
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );
    }

    onChanges(): void {
        this.subscriptions.push(this.rForm.get('importType').valueChanges.subscribe(val => {
            if (val) {
                this.importRadioButton = val;

            }
        }));
    }

    nextStep() {
        this.formSubmitted = true;


        this.medType = this.rForm.get('importType').value;
        console.log('this.medType', this.medType);
        // this.rForm.get('importAuthorizationEntity.medType').setValue(this.medType);


        const formModel: any = this.rForm.value;
        formModel.importAuthorizationEntity.medType = this.medType;
        console.log('formModel.importAuthorizationEntity.medType', formModel.importAuthorizationEntity.medType);


        switch (this.rForm.get('importType').value) {
            case '1': {
                formModel.type.id = '15';
                break;
            }
            case '2': {
                formModel.type.id = '16';
                break;
            }
            case '3': {
                formModel.type.id = '17';
                break;
            }
            case '4': {
                formModel.type.id = '18';
                break;
            }
            case '5': {
                formModel.type.id = '18';
                break;
            }
        }

        formModel.requestHistories = [{
            // startDate: this.rForm.get('startDate').value,
            startDate: formModel.startDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: formModel.currentStep
        }];


        // formModel.importAuthorizationEntity.documents = this.docs;
        formModel.documents = this.docs;
        formModel.currentStep = 'E';
        formModel.initiator = this.authService.getUserName();
        formModel.assignedUser = this.authService.getUserName();
        formModel.idnp = null;
        formModel.registrationRequestMandatedContacts = [{
            idnp: this.rForm.get('idnp').value
        }];


        console.log('formModel', formModel);
        console.log('rForm.valid', this.rForm.valid);

        if (this.rForm.valid ) {
            this.loadingService.show();
            // this.subscriptions.push(this.requestService.addImportRequest(formModel).subscribe(data => {
                    switch (this.rForm.get('importType').value) {
                        case '1': {
                            this.subscriptions.push(this.requestService.addImportRequest(formModel).subscribe(data => {
                            this.router.navigate(['dashboard/module/import-authorization/registered-medicament/' + data.body.id]);
                                }, error => this.loadingService.hide())
                            );
                            break;
                        }
                        case '2': {
                            this.subscriptions.push(this.requestService.addImportRequest(formModel).subscribe(data => {
                            this.router.navigate(['dashboard/module/import-authorization/unregistered-medicament/' + data.body.id]);
                                }, error => this.loadingService.hide())
                            );
                            break;

                        }
                        case '3': {
                            this.subscriptions.push(this.requestService.addImportRequest(formModel).subscribe(data => {
                            this.router.navigate(['dashboard/module/import-authorization/materia-prima/' + data.body.id]);
                                }, error => this.loadingService.hide())
                            );
                            break;
                        }
                        case '4': {
                            this.subscriptions.push(this.requestService.addImportRequest(formModel).subscribe(data => {
                                    this.router.navigate(['dashboard/module/import-authorization/ambalaj/' + data.body.id]);
                                }, error => this.loadingService.hide())
                            );
                            break;
                        }
                        case '5': {
                            // this.authorizationNumber = "33134/2019-AM";
                            // this.authorizationNumber = "33134/2019-AM";
                            this.subscriptions.push(this.requestService.getAuthorizationByAuth(this.authorizationNumber).subscribe(data => {
                                this.router.navigate(['dashboard/module/import-authorization/import-management/' + data.id]);
                                }, error => this.loadingService.hide())
                            );
                            break;
                        }
                    }
                    this.loadingService.hide();
                    this.formSubmitted = false;
            //     }, error => this.loadingService.hide())
            // );

        }
    }

}
