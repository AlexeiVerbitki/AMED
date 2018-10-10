import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  short_description: string;
  description: string;
  symbol: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 2, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 3, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 4, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 5, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 6, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 7, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 8, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 9, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },
  { id: 10, code: 'C12345', short_description: 'SD12345', description: 'Description', symbol: 's',action: '' },

];

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'short_description', 'description', 'symbol', 'action'];
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
  short_descriptionEdit = new FormControl('', Validators.required);
  descriptionEdit = new FormControl('', Validators.required);
  symbolEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  short_descriptionAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  symbolAdd = new FormControl('', Validators.required);

}
