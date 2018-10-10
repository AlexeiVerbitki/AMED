import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  organization_id: number;
  bank_account_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 2, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 3, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 4, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 5, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 6, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 7, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 8, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 9, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 10, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 11, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 12, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 13, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 14, organization_id: 13232, bank_account_id: 321312, action: '' },
  { id: 15, organization_id: 13232, bank_account_id: 321312, action: '' },
];

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  displayedColumns: any[] = ['id', 'organization_id', 'bank_account_id', 'action'];
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

  organization_idEdit = new FormControl('', Validators.required);
  bank_account_idEdit = new FormControl('', Validators.required);
  
  organization_idAdd = new FormControl('', Validators.required);
  bank_account_idAdd = new FormControl('', Validators.required);
  
}
