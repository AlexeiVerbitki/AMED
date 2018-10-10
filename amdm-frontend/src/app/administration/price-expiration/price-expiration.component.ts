import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  description: string;
  expiration_reason_id: number;
  price_id: number;
  expiration_date: Date;
  start_date: Date;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 2, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 3, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 4, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 5, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 6, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 7, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 8, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 9, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 10, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 11, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 12, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 13, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 14, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 15, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 16, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 17, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 18, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 19, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 20, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 21, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 22, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 23, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 24, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' },
  { id: 25, description: 'Test', expiration_reason_id: 231321, price_id: 13212321, expiration_date: new Date('03 03 2018'), start_date: new Date('03 03 2018'), action: '' }
];




@Component({
  selector: 'app-price-expiration',
  templateUrl: './price-expiration.component.html',
  styleUrls: ['./price-expiration.component.css']
})
export class PriceExpirationComponent implements OnInit {
  displayedColumns: any[] = ['id', 'description', 'expiration_reason_id', 'price_id', 'expiration_date', 'start_date', 'action'];
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

  descriptionEdit = new FormControl('', Validators.required); 
  expiration_reason_idEdit = new FormControl('', Validators.required); 
  price_idEdit = new FormControl('', Validators.required); 
  expiration_dateEdit = new FormControl('', Validators.required); 
  start_dateEdit = new FormControl('', Validators.required); 

  descriptionAdd = new FormControl('', Validators.required); 
  expiration_reason_idAdd = new FormControl('', Validators.required); 
  price_idAdd = new FormControl('', Validators.required); 
  expiration_dateAdd = new FormControl('', Validators.required); 
  start_dateAdd = new FormControl('', Validators.required); 



}
