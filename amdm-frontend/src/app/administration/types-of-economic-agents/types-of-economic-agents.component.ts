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
  { id: 1, code: '13321312132', description: 'Test', action: '' },
  { id: 2, code: '13321312132', description: 'Test', action: '' },
  { id: 3, code: '13321312132', description: 'Test', action: '' },
  { id: 4, code: '13321312132', description: 'Test', action: '' },
  { id: 5, code: '13321312132', description: 'Test', action: '' },
  { id: 6, code: '13321312132', description: 'Test', action: '' },
  { id: 7, code: '13321312132', description: 'Test', action: '' },
  { id: 8, code: '13321312132', description: 'Test', action: '' },
  { id: 9, code: '13321312132', description: 'Test', action: '' },
  { id: 10, code: '13321312132', description: 'Test', action: '' },
  { id: 11, code: '13321312132', description: 'Test', action: '' },
  { id: 12, code: '13321312132', description: 'Test', action: '' },
  { id: 13, code: '13321312132', description: 'Test', action: '' },
  { id: 14, code: '13321312132', description: 'Test', action: '' },
  { id: 15, code: '13321312132', description: 'Test', action: '' },
];


@Component({
  selector: 'app-types-of-economic-agents',
  templateUrl: './types-of-economic-agents.component.html',
  styleUrls: ['./types-of-economic-agents.component.css']
})
export class TypesOfEconomicAgentsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  visibility: boolean = false;
  title: string = 'Types of economic agents';

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

  descriptionEdit = new FormControl('', Validators.required);
  codeEdit = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  codeAdd = new FormControl('', Validators.required);


}
