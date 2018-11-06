import {Component, OnInit} from '@angular/core';
import {Cerere} from "../../../models/cerere";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {MatDialog} from "@angular/material";
import {Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {map, startWith} from "rxjs/operators";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {saveAs} from 'file-saver';
import {Document} from "../../../models/document";
import {AuthService} from "../../../shared/service/authetication.service";
import {RequestService} from "../../../shared/service/request.service";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";




@Component({
    selector: 'app-import-authorization-request',
    templateUrl: './import-authorization-request.component.html',
    styleUrls: ['./import-authorization-request.component.css']
})
export class ImportAuthorizationRequestComponent implements OnInit {

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
                    'company': [null, Validators.required],
                    'medType': [null]
                }),

        });
        this.dataForm = fb.group({});

        this.loadSolicitantCompanyList();
        this.generateDocNr();
        this.loadDocTypes();
    }

    ngOnInit() {
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

    loadSolicitantCompanyList() {
        this.subscriptions.push(
            this.administrationService.getAllCompanies().subscribe(data => {
                    this.solicitantCompanyList = data;
                },
                error => console.log(error)
            )
        )
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


    onChange(event) {
        this.file = event.srcElement.files[0];
        const fileName = this.file.name;
        const lastIndex = fileName.lastIndexOf('.');
        let fileFormat = '';
        if (lastIndex !== -1) {
            fileFormat = '*.' + fileName.substring(lastIndex + 1);
        }
        this.sysDate = `${this.currentDate.getDate()}.${this.currentDate.getMonth() + 1}.${this.currentDate.getFullYear()}`;
        this.cereri.push({denumirea: fileName, format: fileFormat, dataIncarcarii: this.sysDate});
    }

    removeDocument(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cereri.splice(index, 1);
            }
        });
    }

    loadFile() {
        saveAs(this.file, this.file.name);
    }

    // chekCompanyValue() {
    //     this.isWrongValueCompany = !this.companii.some(elem => {
    //         return this.rForm.get('compGet').value == null ? true : elem.name === this.rForm.get('compGet').value.name;
    //     });
    // }

    nextStep() {
        // this.router.navigate(['dashboard/module/import-authorization/ambalaj'   ]) ;
        // alert(this.rForm.get('startDate').value);
        // alert(this.generatedDocNrSeq);
        // alert(this.documents.values());
        // if (this.rForm.invalid) {
        //     alert('Invalid Form data!!')
        //     return;
        // }
        // this.formSubmitted = true;
        //
        // if (this.docs.length != 0 || !this.rForm.valid) {
        //     return;
        // }

        // this.formSubmitted = false;

        this.medType = this.rForm.get('importType').value
        // this.rForm.get('importAuthorizationEntity.medType').setValue(this.medType);


        let formModel: any = this.rForm.value;
        formModel.importAuthorizationEntity.medType = this.medType;

        this.loadingService.show();

        formModel.type.id = '4';
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
                case "1":{this.router.navigate(['dashboard/module/import-authorization/registered-medicament'  ]) ; break;}
                case "2":{this.router.navigate(['dashboard/module/import-authorization/unregistered-medicament']) ; break;}
                case "3":{this.router.navigate(['dashboard/module/import-authorization/materia-prima'          ]) ; break;}
                case "4":{this.router.navigate(['dashboard/module/import-authorization/ambalaj'                ]) ; break;}
            }
            this.loadingService.hide();
                // this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + data.body]);
            }, error => this.loadingService.hide())
        );

    }


}
