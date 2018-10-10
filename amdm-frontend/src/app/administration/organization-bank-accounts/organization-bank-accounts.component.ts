import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  fiscal_code: string;
  address: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 2, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 3, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 4, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 5, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 6, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 7, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 8, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 9, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 10, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 11, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 12, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 13, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 14, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
  { id: 15, code: 'Test', description: 'Test', fiscal_code: 'Code1234', address: 'Adresa12345', action: '' },
];

@Component({
  selector: 'app-organization-bank-accounts',
  templateUrl: './organization-bank-accounts.component.html',
  styleUrls: ['./organization-bank-accounts.component.css']
})
export class OrganizationBankAccountsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'fiscal_code', 'address', 'action'];
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

  codeEdit = new FormControl('', Validators.required);
  descriptionEdit = new FormControl('', Validators.required);
  fiscal_codeEdit = new FormControl('', Validators.required);
  addressEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  fiscal_codeAdd = new FormControl('', Validators.required);
  addressAdd = new FormControl('', Validators.required);

}
