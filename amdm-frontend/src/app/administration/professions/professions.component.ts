import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  description: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, description: 'Test', action: '' },
  { id: 2, description: 'Test', action: '' },
  { id: 3, description: 'Test', action: '' },
  { id: 4, description: 'Test', action: '' },
  { id: 5, description: 'Test', action: '' },
  { id: 6, description: 'Test', action: '' },
  { id: 7, description: 'Test', action: '' },
  { id: 8, description: 'Test', action: '' },
  { id: 9, description: 'Test', action: '' },
  { id: 10, description: 'Test', action: '' },
  { id: 11, description: 'Test', action: '' },
  { id: 12, description: 'Test', action: '' },
  { id: 13, description: 'Test', action: '' },
  { id: 14, description: 'Test', action: '' },
  { id: 15, description: 'Test', action: '' },
  { id: 16, description: 'Test', action: '' },
  { id: 17, description: 'Test', action: '' },
  { id: 18, description: 'Test', action: '' },
  { id: 19, description: 'Test', action: '' },
  { id: 20, description: 'Test', action: '' },
  { id: 21, description: 'Test', action: '' },
  { id: 22, description: 'Test', action: '' },
  { id: 23, description: 'Test', action: '' },
  { id: 24, description: 'Test', action: '' },
  { id: 25, description: 'Test', action: '' },

];

@Component({
  selector: 'app-professions',
  templateUrl: './professions.component.html',
  styleUrls: ['./professions.component.css']
})
export class ProfessionsComponent implements OnInit {
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

  codeEdit = new FormControl('', Validators.required);
  descriptionEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
}
