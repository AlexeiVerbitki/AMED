import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  value: number;
  currency_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  {id: 1, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 2, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 3, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 4, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 5, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 6, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 7, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 8, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 9, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 10, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 11, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 12, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 13, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 14, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 15, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 16, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 17, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 18, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 19, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 20, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 21, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 22, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 23, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 24, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},
  {id: 25, code: 'Code12345', description: 'Test', value: 321321, currency_id: 312321, action: ''},

];


@Component({
  selector: 'app-taxe',
  templateUrl: './taxe.component.html',
  styleUrls: ['./taxe.component.css']
})
export class TaxeComponent implements OnInit {

  visibility: boolean = false;
  title: string = 'Taxe';
  displayedColumns: any[] = ['id', 'code', 'description', 'value', 'currency_id', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  codeEdit = new FormControl('', Validators.required);
  descriptionEdit = new FormControl('', Validators.required);
  valueEdit = new FormControl('', Validators.required);
  currency_idEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  valueAdd = new FormControl('', Validators.required);
  currency_idAdd = new FormControl('', Validators.required);

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

}
