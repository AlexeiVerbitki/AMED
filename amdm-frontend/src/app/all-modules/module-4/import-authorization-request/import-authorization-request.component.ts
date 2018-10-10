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
import {ImportAuthorizationEvaluateComponent} from "../import-authorization-evaluate/import-authorization-evaluate.component";

@Component({
    selector: 'app-import-authorization-request',
    templateUrl: './import-authorization-request.component.html',
    styleUrls: ['./import-authorization-request.component.css']
})
export class ImportAuthorizationRequestComponent implements OnInit {
    cereri: Cerere [] = [];
    companii: any[];
    primRep: string;
    rForm: FormGroup;
    dataForm: FormGroup;
    sysDate: string;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    isWrongValueCompany: boolean;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                private administrationService: AdministrationService) {
        this.rForm = fb.group({
            'compGet': [null, Validators.required],
            'med': [null, Validators.required],
            'primRep': [null, Validators.required],
        });
        this.dataForm = fb.group({
            'data': {disabled: true, value: null},
            'nrCererii': [null, Validators.required]
        });
    }

    ngOnInit() {
        this.currentDate = new Date();

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.dataForm.get('nrCererii').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllCompanies().subscribe(data => {
                    this.companii = data;
                    this.filteredOptions = this.rForm.controls['compGet'].valueChanges
                        .pipe(
                            startWith<string | any>(''),
                            // map(value => this._filter(value.viewValue))
                            map(value => typeof value === 'string' ? value : value.name),
                            map(name => this._filter(name))
                        );
                },
                error => console.log(error)
            )
        );

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

    chekCompanyValue() {
        this.isWrongValueCompany = !this.companii.some(elem => {
            return this.rForm.get('compGet').value == null ? true : elem.name === this.rForm.get('compGet').value.name;
        });
    }

    checkCompanyValue() {
        this.isWrongValueCompany = !this.companii.some(elem => {
            return this.rForm.get('compGet').value == null ? true : elem.name === this.rForm.get('compGet').value.name;
        });
    }

    nextStep() {

        this.formSubmitted = true;

        this.isWrongValueCompany = !this.companii.some(elem => {
            return this.rForm.get('compGet').value == null ? true : elem.name === this.rForm.get('compGet').value.name;
        });
        // alert(this.isWrongValueCompany);


        if (!this.rForm.controls['compGet'].valid || !this.rForm.controls['med'].valid
            || this.cereri.length === 0 || this.isWrongValueCompany) {
            // alert("!this.rForm.controls['compGet'].valid = " + this.rForm.controls['compGet'].value + " = "+ !this.rForm.controls['compGet'].valid +
            //     // "\n!this.rForm.controls['primRep'].valid = "+ !this.rForm.controls['primRep'].valid +
            //     "\n!this.rForm.controls['med'].valid = " + this.rForm.controls['med'].value + " = "+ !this.rForm.controls['med'].valid +
            //     "\nthis.isWrongValueCompany = " + this.isWrongValueCompany );
            // alert( this.cereri.length === 0);
            // return;
         alert("oops something went wrong\nField verification failed most probably")
        }
        else   this.router.navigate(['dashboard/module/import-authorization/evaluate'])

        // this.formSubmitted = false;


        // TODO save in DB values from form
        // this.subscriptions.push(this.claimService.editClaim(this.model).subscribe(data => {
        //     this.router.navigate(['/evaluate/initial']);
        //   })
        // );


    }

//nextStep lui Raclaru
    // nextStep() {
    //     this.formSubmitted = true;
    //
    //     if(this.documents.length === 0 || !this.rForm.get('medicament.company').valid || !this.rForm.get('type.id').valid || !this.rForm.get('medicament.name').valid)
    //     {
    //         return;
    //     }
    //
    //     this.formSubmitted = false;
    //
    //     this.rForm.get('endDate').setValue(new Date());
    //     this.rForm.get('company').setValue(this.rForm.value.medicament.company);
    //
    //     let modelToSubmit : any = this.rForm.value;
    //     modelToSubmit.requestHistories = [{startDate : this.rForm.get('startDate').value,endDate : this.rForm.get('endDate').value,
    //         username : this.authService.getUserName(), step : 'R' }];
    //     modelToSubmit.medicament.documents = this.documents;
    //
    //     this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
    //             this.router.navigate(['dashboard/module/medicament-registration/evaluate/'+data.body]);
    //         })
    //     );
    // }


    navigateToEvaluate(){
        this.router.navigate(['dashboard/module/import-authorization/evaluate'])
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.companii.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }
}
