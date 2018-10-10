import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  medicament_id: number;
  distribution_mandate_nr: number;
  distribution_mandate_date: Date;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 2, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 3, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 4, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 5, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 6, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 7, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 8, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 9, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 10, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 11, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 12, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 13, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 14, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 15, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 16, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 17, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 18, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 19, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 20, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 21, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 22, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 23, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 24, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
  { id: 25, medicament_id: 100213312321312, distribution_mandate_nr: 10321321, distribution_mandate_date: new Date('03 04 2018'), action: '' },
];



@Component({
  selector: 'app-samsa-admin',
  templateUrl: './samsa-admin.component.html',
  styleUrls: ['./samsa-admin.component.css']
})
export class SamsaAdminComponent implements OnInit {
  displayedColumns: any[] = ['id', 'medicament_id', 'distribution_mandate_nr', 'distribution_mandate_date', 'action'];
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

  medicamentIdEdit = new FormControl('', Validators.required);
  distributionMandateNrEdit = new FormControl('', Validators.required);
  distributionMandateDateEdit = new FormControl('', Validators.required);

  medicamentIdAdd = new FormControl('', Validators.required);
  distributionMandateNrAdd = new FormControl('', Validators.required);
  distributionMandateDateAdd = new FormControl('', Validators.required);


}
