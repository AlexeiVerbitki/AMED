import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

export interface Bank {
  id: number;
  description: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, description: 'VBKA', action: '' },
  { id: 2, description: 'VBKB', action: '' },
  { id: 3, description: 'VBKC', action: '' },
  { id: 4, description: 'VBKD', action: '' },
  { id: 5, description: 'VBKE', action: '' },
  { id: 6, description: 'VBKF', action: '' },
  { id: 7, description: 'VBKG', action: '' },
  { id: 8, description: 'VBKH', action: '' },
  { id: 9, description: 'VBKI', action: '' },
  { id: 10, description: 'VBKJ', action: '' },
  { id: 11, description: 'VBKK', action: '' },
  { id: 12, description: 'VBKL', action: '' },
  { id: 13, description: 'VBKM', action: '' },
  { id: 14, description: 'VBKN', action: '' },
  { id: 15, description: 'VBKO', action: '' },
];


@Component({
  selector: 'app-documents-type',
  templateUrl: './documents-type.component.html',
  styleUrls: ['./documents-type.component.css']
})
export class DocumentsTypeComponent implements OnInit {

  visibility: boolean = false;
  title: string = 'Documents type';

  displayedColumns: any[] = ['id', 'description', 'action'];
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



  denumireEdit = new FormControl('', Validators.required);

  denumireAdd = new FormControl('', Validators.required);



}
