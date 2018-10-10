import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  manufacture_id: number;
  bank_account_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 2, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 3, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 4, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 5, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 6, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 7, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 8, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 9, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 10, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 11, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 12, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 13, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 14, manufacture_id: 312312, bank_account_id: 132321, action: '' },
  { id: 15, manufacture_id: 312312, bank_account_id: 132321, action: '' },
];

@Component({
  selector: 'app-manufactures-bank-accounts',
  templateUrl: './manufactures-bank-accounts.component.html',
  styleUrls: ['./manufactures-bank-accounts.component.css']
})
export class ManufacturesBankAccountsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'manufacture_id', 'bank_account_id', 'action'];
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

  manufacture_idEdit = new FormControl('', Validators.required);
  bank_account_idEdit = new FormControl('', Validators.required);

  manufacture_idAdd = new FormControl('', Validators.required);
  bank_account_idAdd = new FormControl('', Validators.required);

}
