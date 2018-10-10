import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  stuffs_types: number;
  companies_id: number;
  seller_id: number;
  producer_id: number;
  nr: number;
  stard_date: Date;
  end_date: Date;
  customs_transaction_type_id: number;
  custom_code_id: number;
  sampling: number;
  returned_quantity: number;
  customs_declarations_nr: number;
  customs_declaration_date: Date;
  import_authorization_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 2, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 3, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 4, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 5, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 6, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 7, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 8, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 9, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 10, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 11, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 12, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 13, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 14, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 15, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 16, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 17, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 18, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 19, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
  { id: 20, stuffs_types: 31312, companies_id: 321321, seller_id: 312321312, producer_id: 132312412, nr: 231321312, stard_date: new Date('07 09 2017'), end_date: new Date('09 11 2017'), customs_transaction_type_id: 132321312, custom_code_id: 321312312, sampling: 132421312132, returned_quantity: 123312421, customs_declarations_nr: 132, customs_declaration_date: new Date('04 05 2018'), import_authorization_id: 13232123, action: '' },
];



@Component({
  selector: 'app-import-authorization',
  templateUrl: './import-authorization.component.html',
  styleUrls: ['./import-authorization.component.css']
})

export class ImportAuthorizationComponent implements OnInit {
  displayedColumns: any[] = ['id', 'stuffs_types', 'companies_id', 'seller_id', 'producer_id', 'nr', 'stard_date', 'end_date', 'customs_transaction_type_id', 'custom_code_id', 'sampling', 'returned_quantity', 'customs_declarations_nr', 'customs_declaration_date', 'import_authorization_id', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  stuffsEdit = new FormControl('', Validators.required);
  companiesEdit = new FormControl('', Validators.required);
  sellerEdit = new FormControl('', Validators.required);
  producerEdit = new FormControl('', Validators.required);
  nrEdit = new FormControl('', Validators.required);
  startEdit = new FormControl('', Validators.required);
  endEdit = new FormControl('', Validators.required);
  customTransactionEdit = new FormControl('', Validators.required);
  customCodeEdit = new FormControl('', Validators.required);
  samplingEdit = new FormControl('', Validators.required);
  returnedEdit = new FormControl('', Validators.required);
  customsDeclarationEdit = new FormControl('', Validators.required);
  importEdit = new FormControl('', Validators.required);

  stuffsAdd = new FormControl('', Validators.required);
  companiesAdd = new FormControl('', Validators.required);
  sellerAdd = new FormControl('', Validators.required);
  producerAdd = new FormControl('', Validators.required);
  nrAdd = new FormControl('', Validators.required);
  startAdd = new FormControl('', Validators.required);
  endAdd = new FormControl('', Validators.required);
  customTransactionAdd = new FormControl('', Validators.required);
  customCodeAdd = new FormControl('', Validators.required);
  samplingAdd = new FormControl('', Validators.required);
  returnedAdd = new FormControl('', Validators.required);
  customsDeclarationAdd = new FormControl('', Validators.required);
  importAdd = new FormControl('', Validators.required);


}
