import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface PriceCatalog {
  id: number;
  denumire: string;
  adresa: string;
  seria: string;
  idno: string;
}

const ELEMENT_DATA: PriceCatalog[] = [
  { id: 1, denumire: 'DM112345', adresa: 'Podvalul lui Jora 2/6', seria: 'A', idno: '123456789'},
  { id: 2, denumire: 'DM212345', adresa: 'Mazagul lui Guguta 2', seria: 'A', idno: '123456789'},
  { id: 3, denumire: 'DM312345', adresa: 'Pestera Galinei 29', seria: 'A', idno: '123456789'},
  { id: 4, denumire: 'DM412345', adresa: 'Vanea Djedai 3', seria: 'A', idno: '123456789'},
  { id: 5, denumire: 'DM512345', adresa: 'Vlad cel tihii 11', seria: 'A', idno: '123456789'},
  { id: 6, denumire: 'DM612345', adresa: 'Vladika 1', seria: 'A', idno: '123456789'},
  { id: 7, denumire: 'DM712345', adresa: 'Don Carleone 5', seria: 'A', idno: '123456789'},
  { id: 8, denumire: 'DM812345', adresa: 'Podvalul lui Jora 2/5', seria: 'A', idno: '123456789'},
  { id: 9, denumire: 'DM912345', adresa: 'Podvalul lui Jora 2/4', seria: 'A', idno: '123456789'},
  { id: 10, denumire: 'DM1012345', adresa: 'Podvalul lui Jora 2/3', seria: 'A', idno: '123456789'},
];

@Component({
  selector: 'app-clasify-economics-agency',
  templateUrl: './clasify-economics-agency.component.html',
  styleUrls: ['./clasify-economics-agency.component.css']
})
export class ClasifyEconomicsAgencyComponent implements OnInit {

  displayedColumns: any[] = ['id', 'denumire', 'adresa', 'seria', 'idno'];
  dataSource = new MatTableDataSource<PriceCatalog>(ELEMENT_DATA);

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
}
