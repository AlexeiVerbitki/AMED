import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {Company} from '../../../models/company';
import {Medicament} from '../../../models/medicament';
import {Document} from '../../../models/document';
import {MatDialog} from '@angular/material';
import {PricesRegService} from '../../../shared/service/reg-prices.service';
import {map, startWith} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {Select} from '../../../models/select';
import {saveAs} from 'file-saver';
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";


@Component({
  selector: 'app-price-reg-med',
  templateUrl: './price-reg-med.component.html',
  styleUrls: ['./price-reg-med.component.css']
})
export class PriceRegMedComponent implements OnInit, OnDestroy {

  PriceRegForm: FormGroup;
  documents: Document[] = [];
  private subscriptions: Subscription[] = [];
  private generatedDocNrSeq: any;
  companies: Company[] = [];
  medicaments: Medicament[] = [];
  currentFile: any;
  filteredOptions: Observable<any[]>;
  companyMedicaments: Observable<Medicament[]>;
  uploadDate: Date;
  lastCompanyId: number;
  isWrongValueCompany: boolean;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private priceService: PricesRegService) {

    this.PriceRegForm = fb.group({
      'nrCerereInput': {disabled: true, value: null},
      'dataReg': {disabled: true, value: null},
      'companiesDropDown': [null, Validators.required],
      'medDropDown': [null, Validators.required],
    });
  }

  ngOnInit() {
    this.uploadDate = new Date();
    this.PriceRegForm.get('dataReg').setValue(this.uploadDate);

    this.subscriptions.push(
      this.priceService.generateDocNumber().subscribe(generatedNumber => {
          this.generatedDocNrSeq = generatedNumber;
          this.PriceRegForm.get('nrCerereInput').setValue(this.generatedDocNrSeq);
        },
        error => console.log(error)
      )
    );

    this.subscriptions.push(
      this.priceService.getCompanies().subscribe(companiesData => {
          this.companies = companiesData;
          this.filteredOptions = this.PriceRegForm.controls['companiesDropDown'].valueChanges
            .pipe(
              startWith<string | any>(''),
             // map( value => {this.getMedicaments(value.id); return value; }),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => this._filter(name))
            );
        },
        error => console.log(error)
    ));

    // this.PriceRegForm.controls['medDropDown'].valueChanges
    //   .pipe(
    //     startWith<string | any>(''),
    //     map( value => {this.getMedicaments(value.id); return value; }),
    //     map(value => typeof value === 'string' ? value : value.denumirea),
    //     map(denumirea => this._filter(denumirea))
    //   );
  }

  private getMedicaments(id) {
    if (id === this.lastCompanyId) return;

    this.lastCompanyId = id;
    this.PriceRegForm.controls['medDropDown'].setValue('');
    if (id !== undefined) {
      this.companyMedicaments = this.priceService.getCompanyMedicaments(id); // .pipe(map(medicament => this.populateMedicamentFields(medicament as Medicament)));

    }
  }

  populateMedicamentFields(medicament: Medicament) {
    // this.PriceRegForm.controls['quantity'].setValue(medicament.quantity);
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.companies.filter(option => option.name.toLowerCase().includes(filterValue) );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(value => value.unsubscribe());
  }

  chekCompanyValue()
  {
    this.isWrongValueCompany = !this.companies.some(elem => {
      return this.PriceRegForm.get('companiesDropDown').value == null ? true : elem.name == this.PriceRegForm.get('companiesDropDown').value.name;
    });
  }

  chekMedValue()
  {}


  displayFn(entity?: any): string | undefined {
    return entity ? entity.name : undefined;
  }

  viewFile(index) {
    this.currentFile = this.documents[index].name;
    saveAs(this.currentFile, this.currentFile.name);
  }

  removeDocument(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documents.splice(index, 1);
      }
    });
  }

  addDocument(event) {
    this.currentFile = event.srcElement.files[0];
    const fileName = this.currentFile.name;
    const lastIndex = fileName.lastIndexOf( '.' );
    let fileFormat = '';
    if (lastIndex !== -1) {
      fileFormat = '*.' + fileName.substring(lastIndex + 1);
    }
    // this.documents.push({ name: this.currentFile,
    //   format: fileFormat,
    //   uploadDate: new DatePipe('en-US').transform(this.uploadDate,  'dd.MM.yyyy') });
  }

  compSolicitant: Select[] = [
    { value: 'comp-1', viewValue: 'Compania 1' },
    { value: 'comp-2', viewValue: 'Compania 2' },
    { value: 'comp-3', viewValue: 'Compania 3' },
    { value: 'comp-4', viewValue: 'Compania 4' },
    { value: 'comp-5', viewValue: 'Compania 5' }
  ];
  doza: Select[] = [
    { value: 'micrograme', viewValue: 'micrograme' },
    { value: 'mg', viewValue: 'mg' },
    { value: 'g', viewValue: 'g' }
  ];
  valuta: Select[] = [
    { value: 'MDL', viewValue: 'Lei MD' },
    { value: 'RON', viewValue: 'Lei RO' },
    { value: 'HRU', viewValue: 'Hrivne UKR' },
    { value: 'RUR', viewValue: 'Ruble RU' },
    { value: 'EUR', viewValue: 'Euro' },
    { value: 'USD', viewValue: 'Dolari SUA' },
  ];
  country: Select[] = [
    { value: 'ROM', viewValue: 'Romania' },
    { value: 'UKR', viewValue: 'Ucraina' },
    { value: 'RU', viewValue: 'Rusia' },
    { value: 'FR', viewValue: 'Franta' },
    { value: 'GER', viewValue: 'Germania' },
  ];

}
