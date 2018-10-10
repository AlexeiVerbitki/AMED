import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


export interface Bank {
  period: number;
  value: number;
  multiplicity: number;
  currencyId: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { currencyId: 1, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 2, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 3, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 4, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 5, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 6, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 7, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 8, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 9, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 10, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 11, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 12, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 13, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 14, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
  { currencyId: 15, period: Date.now(), value: 321321312, multiplicity: 13321312312, action: '' },
];

@Component({
  selector: 'app-valute-type',
  templateUrl: './valute-type.component.html',
  styleUrls: ['./valute-type.component.css']
})
export class ValuteTypeComponent implements OnInit {


  displayedColumns: any[] = [ 'currencyId', 'period', 'value', 'multiplicity', 'action'];
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

  // period: number;
  // value: number;
  // multiplicity: number;
  // currencyId: number;
  // action: any;

  currencyIdEdit = new FormControl('', Validators.required);
  periodEdit = new FormControl('', Validators.required);
  valueEdit = new FormControl('', Validators.required);
  multiplicityEdit = new FormControl('', Validators.required);

  currencyIdAdd = new FormControl('', Validators.required);
  periodAdd = new FormControl('', Validators.required);
  valueAdd = new FormControl('', Validators.required);
  multiplicityAdd = new FormControl('', Validators.required);


}
