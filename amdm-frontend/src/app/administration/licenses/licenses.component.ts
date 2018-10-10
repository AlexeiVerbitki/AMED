import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  object_address: string;
  serial_nr: string;
  nr: number;
  release_date: Date;
  cessation_date: Date;
  cessation_reason_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 2, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 3, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 4, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 5, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 6, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 7, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 8, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 9, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 10, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 11, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 12, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 13, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 14, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 15, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 16, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 17, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 18, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 19, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 20, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 21, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 22, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 23, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 24, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 25, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 26, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 27, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 28, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 29, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
  { id: 30, object_address: 'test', serial_nr: 'a132321412', nr: 1321321312, release_date: new Date('09 09 2018'), cessation_date: new Date('09 09 2018'), cessation_reason_id: 312312312, action: '' },
];


@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.css']
})
export class LicensesComponent implements OnInit {

  displayedColumns: any[] = ['id', 'object_address', 'serial_nr', 'nr', 'release_date', 'cessation_date', 'cessation_reason_id', 'action'];
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

  objectAddressEdit = new FormControl('', Validators.required);
  seriaNrEdit = new FormControl('', Validators.required);
  nrEdit = new FormControl('', Validators.required);
  releaseDateEdit = new FormControl('', Validators.required);
  cessationDateEdit = new FormControl('', Validators.required);
  cessationReasonIdEdit = new FormControl('', Validators.required);
  
  objectAddressAdd = new FormControl('', Validators.required);
  seriaNrAdd = new FormControl('', Validators.required);
  nrAdd = new FormControl('', Validators.required);
  releaseDateAdd = new FormControl('', Validators.required);
  cessationDateAdd = new FormControl('', Validators.required);
  cessationReasonIdAdd = new FormControl('', Validators.required);

}
