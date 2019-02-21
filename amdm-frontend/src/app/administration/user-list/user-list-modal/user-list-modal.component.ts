import { Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatPaginator} from '@angular/material';

export interface PeriodicElement {
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {description: '123'},
  {description: '123'},
  {description: '123'},
  {description: '123'},
  {description: '123'},
  {description: '123'},
  {description: '123'},
  {description: '123'},
  {description: '123'},
  {description: '123'},
  {description: '123'},
];

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-list-modal',
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.css']
})
export class UserListModalComponent implements OnInit {

  displayedColumns: string[] = ['select','description'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}
