import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: 'Test', description: 'Test', action: '' },
  { id: 2, code: 'Test', description: 'Test', action: '' },
  { id: 3, code: 'Test', description: 'Test', action: '' },
  { id: 4, code: 'Test', description: 'Test', action: '' },
  { id: 5, code: 'Test', description: 'Test', action: '' },
  { id: 6, code: 'Test', description: 'Test', action: '' },
  { id: 7, code: 'Test', description: 'Test', action: '' },
  { id: 8, code: 'Test', description: 'Test', action: '' },
  { id: 9, code: 'Test', description: 'Test', action: '' },
  { id: 10, code: 'Test', description: 'Test', action: '' },
  { id: 11, code: 'Test', description: 'Test', action: '' },
  { id: 12, code: 'Test', description: 'Test', action: '' },
  { id: 13, code: 'Test', description: 'Test', action: '' },
  { id: 14, code: 'Test', description: 'Test', action: '' },
  { id: 15, code: 'Test', description: 'Test', action: '' },
];


@Component({
  selector: 'app-medicament-group',
  templateUrl: './medicament-group.component.html',
  styleUrls: ['./medicament-group.component.css']
})
export class MedicamentGroupComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'action'];
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
  descriptionEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
}
