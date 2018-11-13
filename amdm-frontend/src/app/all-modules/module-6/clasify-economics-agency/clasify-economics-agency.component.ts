import { FormControl } from '@angular/forms';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-clasify-economics-agency',
  templateUrl: './clasify-economics-agency.component.html',
  styleUrls: ['../nomenclator.component.css']
})
export class ClasifyEconomicsAgencyComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        console.log('ajenti economic onDestroy');
    }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  clasifyDrugsTable = [
    { denumire: 'DM112345', adresa: 'Podvalul lui Jora 2/6', seria: 'A', idno: '123456789' },
    { denumire: 'DM212345', adresa: 'Mazagul lui Guguta 2', seria: 'A', idno: '123456789' },
    { denumire: 'DM312345', adresa: 'Pestera Galinei 29', seria: 'A', idno: '123456789' },
    { denumire: 'DM412345', adresa: 'Vanea Djedai 3', seria: 'A', idno: '123456789' },
    { denumire: 'DM512345', adresa: 'Vlad cel tihii 11', seria: 'A', idno: '123456789' },
    { denumire: 'DM612345', adresa: 'Vladika 1', seria: 'A', idno: '123456789' },
    { denumire: 'DM712345', adresa: 'Don Carleone 5', seria: 'A', idno: '123456789' },
    { denumire: 'DM812345', adresa: 'Podvalul lui Jora 2/5', seria: 'A', idno: '123456789' },
    { denumire: 'DM912345', adresa: 'Podvalul lui Jora 2/4', seria: 'A', idno: '123456789' },
    { denumire: 'DM1012345', adresa: 'Podvalul lui Jora 2/3', seria: 'A', idno: '123456789' }
  ];

    denumireFilter  = new FormControl('');
    adresaFilter = new FormControl('');
    seriaFilter = new FormControl('');
    idnoFilter = new FormControl('');

  dataSource = new MatTableDataSource();

  columnsToDisplay = ['denumire', 'adresa', 'seria', 'idno'];

  filterValues = {
    denumire: '',
    adresa: '',
    seria: '',
    idno: ''
  }

  constructor() {
    this.dataSource.data = this.clasifyDrugsTable;
    this.dataSource.filterPredicate = this.createFilter();
  }

   ngOnInit() {

       console.log('ajenti economic');
    this.dataSource.paginator = this.paginator;

    this.denumireFilter.valueChanges
      .subscribe(
        denumire => {
          this.filterValues.denumire = denumire;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.adresaFilter.valueChanges
      .subscribe(
        adresa => {
          this.filterValues.adresa = adresa;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.seriaFilter.valueChanges
      .subscribe(
        seria => {
          this.filterValues.seria = seria;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.idnoFilter.valueChanges
      .subscribe(
        idno => {
          this.filterValues.idno = idno;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.denumire.toLowerCase().indexOf(searchTerms.denumire) !== -1
        && data.adresa.toLowerCase().indexOf(searchTerms.adresa) !== -1
        && data.seria.toLowerCase().indexOf(searchTerms.seria) !== -1
        && data.idno.toLowerCase().indexOf(searchTerms.idno) !== -1

    }
    return filterFunction;
  }
}
