import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  long_description: string;
  idno: string;
  country_id: number;
  authorization_holder: number;
  address: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 2, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 3, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 4, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 5, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 6, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 7, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 8, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 9, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 10, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 11, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 12, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 13, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 14, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
  { id: 15, code: 'Test', description: 'Test', long_description: 'Test Long Description', idno: '31232132131232132', country_id: 321321, authorization_holder: 321, address: 'Test Address',  action: '' },
];

@Component({
  selector: 'app-manufactures',
  templateUrl: './manufactures.component.html',
  styleUrls: ['./manufactures.component.css']
})
export class ManufacturesComponent implements OnInit {

  visibility: boolean = false;
  title: string = 'Manufactures';

  displayedColumns: any[] = ['id', 'code', 'description', 'long_description', 'idno', 'country_id', 'authorization_holder', 'address','action'];
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

  codeEdit = new FormControl('', Validators.required);
  descriptionEdit = new FormControl('', Validators.required);
  long_descriptionEdit = new FormControl('', Validators.required);
  idnoEdit = new FormControl('', Validators.required);
  country_idEdit = new FormControl('', Validators.required);
  authorization_holderEdit = new FormControl('', Validators.required);
  addressEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  long_descriptionAdd = new FormControl('', Validators.required);
  idnoAdd = new FormControl('', Validators.required);
  country_idAdd = new FormControl('', Validators.required);
  authorization_holderAdd = new FormControl('', Validators.required);
  addressAdd = new FormControl('', Validators.required);

}
