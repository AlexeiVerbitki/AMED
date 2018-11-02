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




@Component({
    selector: 'app-import-authorization-request',
    templateUrl: './import-authorization-request.component.html',
    styleUrls: ['./import-authorization-request.component.css']
})
export class ImportAuthorizationRequestComponent implements OnInit {
    documents: Document [] = [];
    cereri: Cerere [] = [];
    // companii: any[];
    primRep: string;
    rForm: FormGroup;
    medReg: FormGroup;
    dataForm: FormGroup;
    sysDate: string;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    generatedDocNrSeq2: number;

    // filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    // isWrongValueCompany: boolean;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService) {
        this.rForm = fb.group({
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['E'],
            'data': {disabled: true, value: new Date()},
            'nrCererii': [null, Validators.required, ],
            'radioButton': [null, Validators.required],
        });
        this.dataForm = fb.group({

        });

        this.medReg = fb.group({
            
        });
    }

    ngOnInit() {
        this.currentDate = new Date();


        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
            // this.administrationService.generateRandomDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.dataForm.get('nrCererii').setValue(this.generatedDocNrSeq);

                },
                error => console.log(error)
            )
        );

        // this.subscriptions.push(
        //     this.administrationService.getAllCompanies().subscribe(data => {
        //             this.companii = data;
        //             this.filteredOptions = this.rForm.controls['compGet'].valueChanges
        //                 .pipe(
        //                     startWith<string | any>(''),
        //                     // map(value => this._filter(value.viewValue))
        //                     map(value => typeof value === 'string' ? value : value.name),
        //                     map(name => this._filter(name))
        //                 );
        //         },
        //         error => console.log(error)
        //     )
        // );

        this.dataForm.get('data').setValue(this.currentDate);
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

        alert(this.rForm.get('startDate').value);
        alert(this.generatedDocNrSeq);
        alert(this.documents.values());

        this.formSubmitted = true;

        // if (this.documents.length != 0 || !this.rForm.valid) {
        //     return;
        // }

        var modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'R'
        }];
        modelToSubmit.medicament.documents = this.documents;
        modelToSubmit.medicament.registrationDate = new Date();

        // switch(this.rForm.get('radioButton').value){
        //     case "1":{this.router.navigate(['dashboard/module/import-authorization/registered-medicament'])   ; break;}
        //     case "2":{this.router.navigate(['dashboard/module/import-authorization/unregistered-medicament']) ; break;}
        //     case "3":{this.router.navigate(['dashboard/module/import-authorization/materia-prima'])           ; break;}
        //     case "4":{this.router.navigate(['dashboard/module/import-authorization/ambalaj'])                 ; break;}
        // }

        this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
            switch(this.rForm.get('radioButton').value){
                case "1":{this.router.navigate(['dashboard/module/import-authorization/registered-medicament'])  + data.body ; break;}
                case "2":{this.router.navigate(['dashboard/module/import-authorization/unregistered-medicament'])+ data.body ; break;}
                case "3":{this.router.navigate(['dashboard/module/import-authorization/materia-prima'])          + data.body ; break;}
                case "4":{this.router.navigate(['dashboard/module/import-authorization/ambalaj'])                + data.body ; break;}
            }
                // this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + data.body]);
            })
        );



        this.formSubmitted = true;

        // this.isWrongValueCompany = !this.companii.some(elem => {
        //     return this.rForm.get('compGet').value == null ? true : elem.name === this.rForm.get('compGet').value.name;
        // });
        //
        // if (!this.rForm.controls['compGet'].valid || !this.rForm.controls['primRep'].valid || !this.rForm.controls['med'].valid
        //     || this.cereri.length === 0 || this.isWrongValueCompany) {
        //     return;
        // }

        this.formSubmitted = false;





        // TODO save in DB values from form
        // this.subscriptions.push(this.claimService.editClaim(this.model).subscribe(data => {
        //     this.router.navigate(['/evaluate/initial']);
        //   })
        // );
    }

    // private _filter(name: string): any[] {
    //     const filterValue = name.toLowerCase();
    //
    //     return this.companii.filter(option => option.name.toLowerCase().includes(filterValue));
    // }
    //
    // private saveToFileSystem(response: any, docName: string) {
    //     const blob = new Blob([response]);
    //     saveAs(blob, docName);
    // }
}
