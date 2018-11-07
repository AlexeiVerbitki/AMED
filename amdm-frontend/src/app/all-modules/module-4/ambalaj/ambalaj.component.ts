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
  ambalajForm: FormGroup;
  dataForm: FormGroup;
  sysDate: string;
  currentDate: Date;
  file: any;
  generatedDocNrSeq: number;
  filteredOptions: Observable<any[]>;
  formSubmitted: boolean;
  isWrongValueCompany: boolean;
  private subscriptions: Subscription[] = [];
  docs: Document [] = [];


  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private router: Router,
              private administrationService: AdministrationService) {

    this.ambalajForm = fb.group({
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
                'id;': [],
                'applicationRegistrationNumber': [],
                'applicationDate': [ new Date()],
                'applicant': ['', Validators.required],
                'seller': ['', Validators.required],
                'basisForImport': [],
                'importer': ['', Validators.required],
                'conditionsAndSpecification': [''],
                'producer': ['', Validators.required],

                //TODO to be deleted
                'quantity': [''],

                'price': ['', Validators.required],
                'currency': ['', Validators.required],
                'summ': ['', Validators.required],
                'customsDeclarationDate': [''],
                'expirationDate': [],
                'customsCode': [],
                'customsNumber': [],
                'customsTransactionType': [],
                'authorizationsNumber': [],
                'medType': [],
                'importAuthorizationDetailsEntityList': [],

            }),
        //=====================
      'compGet': [null, Validators.required],
      'seller': [null, Validators.required],
      'sellerTaraAdresa': [null, Validators.required],
      'autorizatiaImport': [null, Validators.required],
      'importator': [null, Validators.required],
      'importatorTaraAdresa': [null, Validators.required],
      'conditiiPrecizari': [null, Validators.required],
      'firmaProducatoare': [null, Validators.required],
      'producatorTaraAdresa': [null, Validators.required],
      'medReg': [null, Validators.required],
      'medUnreg': [null, Validators.required],
      'MatPrima': [null, Validators.required],
      'AmbalajProd': [null, Validators.required],
    });

    this.dataForm = fb.group({
      'data': { disabled: true, value: null },
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
        this.filteredOptions = this.ambalajForm.controls['compGet'].valueChanges
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
    this.cereri.push({ denumirea: fileName, format: fileFormat, dataIncarcarii: this.sysDate });
  }

  removeDocument(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false }
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
      return this.ambalajForm .get('compGet').value == null ? true : elem.name === this.ambalajForm.get('compGet').value.name;
    });
  }

  nextStep() {
    this.formSubmitted = true;

    this.isWrongValueCompany = !this.companii.some(elem => {
      return this.ambalajForm.get('compGet').value == null ? true : elem.name === this.ambalajForm.get('compGet').value.name;
    });

    if (!this.ambalajForm.controls['compGet'].valid || !this.ambalajForm.controls['primRep'].valid || !this.ambalajForm.controls['med'].valid
      || this.cereri.length === 0 || this.isWrongValueCompany) {
      return;
    }

    this.formSubmitted = false;

    // TODO save in DB values from form
    // this.subscriptions.push(this.claimService.editClaim(this.model).subscribe(data => {
    //     this.router.navigate(['/evaluate/initial']);
    //   })
    // );
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
