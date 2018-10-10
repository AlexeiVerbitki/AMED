import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  type_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 2, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 3, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 4, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 5, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 6, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 7, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 8, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 9, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 10, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 11, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 12, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 13, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 14, code: '32131', description: 'Test', type_id: 13231, action: '' },
  { id: 15, code: '32131', description: 'Test', type_id: 13231, action: '' },
];

@Component({
  selector: 'app-pharmaceutical-forms',
  templateUrl: './pharmaceutical-forms.component.html',
  styleUrls: ['./pharmaceutical-forms.component.css']
})
export class PharmaceuticalFormsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'type_id', 'action'];
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
  type_idEdit = new FormControl('', Validators.required);
  
  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  type_idAdd = new FormControl('', Validators.required);
  
}
