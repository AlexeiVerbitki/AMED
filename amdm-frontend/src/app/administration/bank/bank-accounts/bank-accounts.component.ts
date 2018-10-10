import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';


export interface Bank {
  id: number;
  cod: string;
  description: string;
  bankNumber: number;
  bankId: number;
  currency_id: number;
  treasurys_code: string;
  correspondent_bank_id: number;
  correspondent_info: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, cod: '0000000000001', description: 'VBKA', bankNumber: 12345629231, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 2, cod: '0000000000002', description: 'VBKB', bankNumber: 12345678901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 3, cod: '0000000000003', description: 'VBKC', bankNumber: 12345238901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 4, cod: '0000000000004', description: 'VBKD', bankNumber: 12345448901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 5, cod: '0000000000005', description: 'VBKE', bankNumber: 12345558901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 6, cod: '0000000000006', description: 'VBKF', bankNumber: 12345668901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 7, cod: '0000000000007', description: 'VBKG', bankNumber: 12345118901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 8, cod: '0000000000008', description: 'VBKH', bankNumber: 12345228901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 9, cod: '0000000000009', description: 'VBKI', bankNumber: 12345338901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 10, cod: '000000000010', description: 'VBKJ', bankNumber: 123562318901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 11, cod: '000000000011', description: 'VBKK', bankNumber: 131245678901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 12, cod: '000000000012', description: 'VBKL', bankNumber: 12345678901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 13, cod: '000000000013', description: 'VBKM', bankNumber: 12345678901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 14, cod: '000000000014', description: 'VBKN', bankNumber: 12345678901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
  { id: 15, cod: '000000000015', description: 'VBKO', bankNumber: 12345678901, bankId: 1321321, currency_id: 32132132145, treasurys_code: '123123321', correspondent_bank_id: 123456, correspondent_info: 'stabhadhjbbhjwa' , action: '' },
];

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.css']
})
export class BankAccountsComponent implements OnInit {

  displayedColumns: any[] = ['id', 'cod', 'description', 'bankNumber', 'currency_id', 'treasurys_code', 'correspondent_bank_id', 'correspondent_info', 'action'];
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



  codEdit = new FormControl('', Validators.required);
  denumireEdit = new FormControl('', Validators.required);
  bankNumEdit = new FormControl('', Validators.required);
  idValuteEdit = new FormControl('', Validators.required);
  treasureCodeEdit = new FormControl('', Validators.required);
  bankIdEdit = new FormControl('', Validators.required);
  infoEdit = new FormControl('', Validators.required);

  codAdd = new FormControl('', Validators.required);
  denumireAdd = new FormControl('', Validators.required);
  bankNumAdd = new FormControl('', Validators.required);
  idValuteAdd = new FormControl('', Validators.required);
  treasureCodeAdd = new FormControl('', Validators.required);
  bankIdAdd = new FormControl('', Validators.required);
  infoAdd = new FormControl('', Validators.required);

}
