import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  period: Date;
  value: number;
  multiplicity: number;
  currency_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 2, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 3, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 4, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 5, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 6, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 7, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 8, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 9, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },
  { id: 10, period: new Date('03 03 2018'), value: 31231, multiplicity: 321312, currency_id: 123, action: '' },

];

@Component({
  selector: 'app-currencies-history',
  templateUrl: './currencies-history.component.html',
  styleUrls: ['./currencies-history.component.css']
})
export class CurrenciesHistoryComponent implements OnInit {

  
  visibility: boolean = false;
  title: string = 'Currencies history';
  displayedColumns: any[] = ['id', 'period', 'value', 'multiplicity', 'currency_id', 'action'];
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
  changeVisibility() {
    this.visibility = !this.visibility;
  }

  periodEdit = new FormControl('', Validators.required);
  valueEdit = new FormControl('', Validators.required);
  multiplicityEdit = new FormControl('', Validators.required);
  currency_idEdit = new FormControl('', Validators.required);

  periodAdd = new FormControl('', Validators.required);
  valueAdd = new FormControl('', Validators.required);
  multiplicityAdd = new FormControl('', Validators.required);
  currency_idAdd = new FormControl('', Validators.required);

}
