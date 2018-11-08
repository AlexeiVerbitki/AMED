import { Cerere } from './../../../models/cerere';
import { Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { AdministrationService } from "../../../shared/service/administration.service";
import { map, startWith } from "rxjs/operators";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { saveAs } from 'file-saver';
import {Document} from "../../../models/document";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-ambalaj',
  templateUrl: './ambalaj.component.html',
  styleUrls: ['./ambalaj.component.css']
})
export class AmbalajComponent implements OnInit {
  cereri: Cerere[] = [];
  companii: any[];
  primRep: string;
  evaluateImportForm: FormGroup;
  importTypeForm: FormGroup;
  sysDate: string;
  currentDate: Date;
  file: any;
  generatedDocNrSeq: number;
  filteredOptions: Observable<any[]>;
  formSubmitted: boolean;
  isWrongValueCompany: boolean;
  private subscriptions: Subscription[] = [];
  docs: Document [] = [];

  solicitantCompanyList: Observable<any[]>;


  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private router: Router,
              private administrationService: AdministrationService) {

    this.evaluateImportForm = fb.group({
        'requestNumber': [null],
        'startDate': [new Date()],
        'currentStep': ['R'],
        'company': ['', Validators.required],
        'initiator':[null],
        'assignedUser':[null],
        'data': {disabled: true, value: new Date()},
        'importType': [null, Validators.required],
        'applicationRegistrationNumber': [],
        'applicationDate': [ new Date()],
        'applicant': ['', Validators.required],
        'seller': ['', Validators.required], // Tara si adresa lui e deja in baza
        'basisForImport': [],
        'importer': ['', Validators.required], // Tara si adresa lui e deja in baza
        'conditionsAndSpecification': [''],
        'type':
            this.fb.group({
                'id': ['']
            }),
        'importAuthorizationEntity':
            fb.group({
                'id;': [],
                'producer': ['', Validators.required],

                //TODO to be deleted
                'quantity': [''],
                'name': [''],
                'price': ['', Validators.required],
                'currency': ['', Validators.required],
                'summ': ['', Validators.required],
                'customsDeclarationDate': [''],
                'expirationDate': [],
                'customsNumber': [],
                'customsTransactionType': [],
                'authorizationsNumber': [], // inca nu exista la pasul acesta
                'medType': [],
                'importAuthorizationDetailsEntityList': [],

            }),

    });

    this.importTypeForm = fb.group({
      'customsCode': [''],
      'name': [null, Validators.required],
      'quantity': [''],
      'price': [''],
      'currency': [''],
      'summ': [''],
      'producer': [''],
      'expirationDate': [''],

    });
  }

  ngOnInit() {
    this.currentDate = new Date();

    this.subscriptions.push(
      this.administrationService.generateDocNr().subscribe(data => {
        this.generatedDocNrSeq = data;
        this.importTypeForm.get('nrCererii').setValue(this.generatedDocNrSeq);
      },
        error => console.log(error)
      )
    );



    this.importTypeForm.get('data').setValue(this.currentDate);
    this.loadSolicitantCompanyList();
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

  // onChange(event) {
  //   this.file = event.srcElement.files[0];
  //   const fileName = this.file.name;
  //   const lastIndex = fileName.lastIndexOf('.');
  //   let fileFormat = '';
  //   if (lastIndex !== -1) {
  //     fileFormat = '*.' + fileName.substring(lastIndex + 1);
  //   }
  //   this.sysDate = `${this.currentDate.getDate()}.${this.currentDate.getMonth() + 1}.${this.currentDate.getFullYear()}`;
  //   this.cereri.push({ denumirea: fileName, format: fileFormat, dataIncarcarii: this.sysDate });
  // }
  //
  // removeDocument(index) {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     data: { message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.cereri.splice(index, 1);
  //     }
  //   });
  // }
  //
  // loadFile() {
  //   saveAs(this.file, this.file.name);
  // }


  nextStep() {
      let formModel = this.evaluateImportForm.getRawValue();
      console.log(formModel);
      // console.log(this.evaluateImportForm.value);
      // console.log(this.importTypeForm.value);
    // this.formSubmitted = true;
    //
    // this.isWrongValueCompany = !this.companii.some(elem => {
    //   return this.evaluateImportForm.get('compGet').value == null ? true : elem.name === this.evaluateImportForm.get('compGet').value.name;
    // });
    //
    // if (!this.evaluateImportForm.controls['compGet'].valid || !this.evaluateImportForm.controls['primRep'].valid || !this.evaluateImportForm.controls['med'].valid
    //   || this.cereri.length === 0 || this.isWrongValueCompany) {
    //   return;
    // }
    //
    // this.formSubmitted = false;
    //
    // // TODO save in DB values from form
    // // this.subscriptions.push(this.claimService.editClaim(this.model).subscribe(data => {
    // //     this.router.navigate(['/evaluate/initial']);
    // //   })
    // // );
  }

  // private _filter(name: string): any[] {
  //   const filterValue = name.toLowerCase();
  //
  //   return this.companii.filter(option => option.name.toLowerCase().includes(filterValue));
  // }
  //
  // private saveToFileSystem(response: any, docName: string) {
  //   const blob = new Blob([response]);
  //   saveAs(blob, docName);
  // }

}
