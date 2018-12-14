import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  group_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  {id: 1, code: '213312321321', description: 'VBKA', group_id: 1323221312321, action: ''},
  {id: 2, code: '213312321321', description: 'VBKB', group_id: 1323221312321, action: ''},
  {id: 3, code: '213312321321', description: 'VBKC', group_id: 1323221312321, action: ''},
  {id: 4, code: '213312321321', description: 'VBKD', group_id: 1323221312321, action: ''},
  {id: 5, code: '213312321321', description: 'VBKE', group_id: 1323221312321, action: ''},
  {id: 6, code: '213312321321', description: 'VBKF', group_id: 1323221312321, action: ''},
  {id: 7, code: '213312321321', description: 'VBKG', group_id: 1323221312321, action: ''},
  {id: 8, code: '213312321321', description: 'VBKH', group_id: 1323221312321, action: ''},
  {id: 9, code: '213312321321', description: 'VBKI', group_id: 1323221312321, action: ''},
  {id: 10, code: '213312321321', description: 'VBKJ', group_id: 1323221312321, action: ''},
  {id: 11, code: '213312321321', description: 'VBKK', group_id: 1323221312321, action: ''},
  {id: 12, code: '213312321321', description: 'VBKL', group_id: 1323221312321, action: ''},
  {id: 13, code: '213312321321', description: 'VBKM', group_id: 1323221312321, action: ''},
  {id: 14, code: '213312321321', description: 'VBKN', group_id: 1323221312321, action: ''},
  {id: 15, code: '213312321321', description: 'VBKO', group_id: 1323221312321, action: ''},
];


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'group_id', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  visibility: boolean = false;
  title: string = 'Country';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  codeEdit = new FormControl('', Validators.required);
  denumireEdit = new FormControl('', Validators.required);
  group_idEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  denumireAdd = new FormControl('', Validators.required);
  group_idAdd = new FormControl('', Validators.required);

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
