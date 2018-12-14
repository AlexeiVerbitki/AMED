import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  fiscal_code: string;
  vat_code: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 2, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 3, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 4, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 5, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 6, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 7, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 8, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 9, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 10, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 11, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 12, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 13, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 14, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
  { id: 15, code: '32131', description: 'Test', fiscal_code: '321', vat_code:'321321', action: '' },
];

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'fiscal_code', 'vat_code', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  visibility: boolean = false;
  title: string = 'Partners';

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
  fiscal_codeEdit = new FormControl('', Validators.required);
  vat_codeEdit = new FormControl('', Validators.required);
  
  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  fiscal_codeAdd = new FormControl('', Validators.required);
  vat_codeAdd = new FormControl('', Validators.required);
  

}
