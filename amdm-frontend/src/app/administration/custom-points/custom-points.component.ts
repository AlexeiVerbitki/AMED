import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  {id: 1, code: 'Code', description: 'Test', action: ''},
  {id: 2, code: 'Code', description: 'Test', action: ''},
  {id: 3, code: 'Code', description: 'Test', action: ''},
  {id: 4, code: 'Code', description: 'Test', action: ''},
  {id: 5, code: 'Code', description: 'Test', action: ''},
  {id: 6, code: 'Code', description: 'Test', action: ''},
  {id: 7, code: 'Code', description: 'Test', action: ''},
  {id: 8, code: 'Code', description: 'Test', action: ''},
  {id: 9, code: 'Code', description: 'Test', action: ''},
  {id: 10, code: 'Code', description: 'Test', action: ''},
  {id: 11, code: 'Code', description: 'Test', action: ''},
  {id: 12, code: 'Code', description: 'Test', action: ''},
  {id: 13, code: 'Code', description: 'Test', action: ''},
  {id: 14, code: 'Code', description: 'Test', action: ''},
  {id: 15, code: 'Code', description: 'Test', action: ''},
  {id: 16, code: 'Code', description: 'Test', action: ''},
  {id: 17, code: 'Code', description: 'Test', action: ''},
  {id: 18, code: 'Code', description: 'Test', action: ''},
  {id: 19, code: 'Code', description: 'Test', action: ''},
  {id: 20, code: 'Code', description: 'Test', action: ''},
  {id: 21, code: 'Code', description: 'Test', action: ''},
  {id: 22, code: 'Code', description: 'Test', action: ''},
  {id: 23, code: 'Code', description: 'Test', action: ''},
  {id: 24, code: 'Code', description: 'Test', action: ''},
  {id: 25, code: 'Code', description: 'Test', action: ''},

];

@Component({
  selector: 'app-custom-points',
  templateUrl: './custom-points.component.html',
  styleUrls: ['./custom-points.component.css']
})
export class CustomPointsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  codeEdit = new FormControl('', Validators.required);
  descriptionEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);

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
