import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  group_id: number;
  long_description: string;
  units: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  {id: 1, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 2, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 3, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 4, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 5, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 6, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 7, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 8, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 9, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 10, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 11, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 12, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 13, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 14, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 15, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 16, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 17, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 18, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 19, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 20, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 21, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 22, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 23, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 24, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},
  {id: 25, code: 'Code', description: 'Test', group_id: 13212, long_description: 'Long Description', units: 'dwada', action: ''},

];

@Component({
  selector: 'app-custom-codes',
  templateUrl: './custom-codes.component.html',
  styleUrls: ['./custom-codes.component.css']
})
export class CustomCodesComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'group_id', 'long_description', 'units', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  codeEdit = new FormControl('', Validators.required);
  descriptionEdit = new FormControl('', Validators.required);
  group_idEdit = new FormControl('', Validators.required);
  long_descriptionEdit = new FormControl('', Validators.required);
  unitsEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  group_idAdd = new FormControl('', Validators.required);
  long_descriptionAdd = new FormControl('', Validators.required);
  unitsAdd = new FormControl('', Validators.required);

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
