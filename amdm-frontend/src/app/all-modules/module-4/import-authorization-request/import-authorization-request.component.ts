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
    documents: Document [] = [];
    cereri: Cerere [] = [];
    // companii: any[];
    // primRep: string;
    rForm: FormGroup;
    // medReg: FormGroup;
    dataForm: FormGroup;
    sysDate: string;
    currentDate: Date;
    file: any;

    docTypes : any[];
    solicitantCompanyList: Observable<any[]>;

    // filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    // isWrongValueCompany: boolean;
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
            'data': {disabled: true, value: new Date()},
            'radioButton': [null, Validators.required],

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

        // this.subscriptions.push(
        //     this.administrationService.getAllCompanies().subscribe(data => {
        //             this.companii = data;
        //         },
        //         error => console.log(error)
        //     )
        // );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('1','R').subscribe(step => {
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

    displayFn(user?: any): string | undefined {
        return user ? user.name : undefined;
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

        this.formSubmitted = true;

        if (this.documents.length != 0 || !this.rForm.valid) {
            return;
        }

        this.formSubmitted = false;

        // this.loadingService.show();


        var modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'R'
        }];
        modelToSubmit.documents = this.documents;
        modelToSubmit.registrationDate = new Date();

        // switch(this.rForm.get('radioButton').value){
        //     case "1":{this.router.navigate(['dashboard/module/import-authorization/registered-medicament'])   ; break;}
        //     case "2":{this.router.navigate(['dashboard/module/import-authorization/unregistered-medicament']) ; break;}
        //     case "3":{this.router.navigate(['dashboard/module/import-authorization/materia-prima'])           ; break;}
        //     case "4":{this.router.navigate(['dashboard/module/import-authorization/ambalaj'])                 ; break;}
        // }

        this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
            switch(this.rForm.get('radioButton').value){
                case "1":{this.router.navigate(['dashboard/module/import-authorization/registered-medicament'  + data.body.id ]) ; break;}
                case "2":{this.router.navigate(['dashboard/module/import-authorization/unregistered-medicament'+ data.body.id ]) ; break;}
                case "3":{this.router.navigate(['dashboard/module/import-authorization/materia-prima'          + data.body.id ]) ; break;}
                case "4":{this.router.navigate(['dashboard/module/import-authorization/ambalaj'                + data.body.id ]) ; break;}
            }
            this.loadingService.hide();
                // this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + data.body]);
            }, error => this.loadingService.hide())
        );

    }


}
