import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


export interface Bank {
  id: number;
  cod: string;
  description: string;
  data: Date;
  partner_id: number;
  analysis_num: string;
  analysis_date: Date;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 2, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 3, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 4, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 5, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 6, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 7, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 8, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 9, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 10, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 11, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 12, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 13, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 14, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 15, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 16, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 17, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 18, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 19, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' },
  { id: 20, cod: '0000000000001', description: 'VBKA', data: new Date('07 26 2006'), partner_id: 12312, analysis_num: '321321312', analysis_date: new Date('07 28 2007'), action: '' }
];

@Component({
  selector: 'app-documents-archive',
  templateUrl: './documents-archive.component.html',
  styleUrls: ['./documents-archive.component.css']
})
export class DocumentsArchiveComponent implements OnInit {
  displayedColumns: any[] = ['id', 'cod', 'description', 'data', 'partner_id', 'analysis_num', 'analysis_date', 'action'];
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


  codEdit = new FormControl('', Validators.required);
  denumireEdit = new FormControl('', Validators.required);
  dataEdit = new FormControl('', Validators.required);
  partner_idEdit = new FormControl('', Validators.required);
  analysis_numEdit = new FormControl('', Validators.required);
  analysis_dateEdit = new FormControl('', Validators.required);

  codAdd = new FormControl('', Validators.required);
  denumireAdd = new FormControl('', Validators.required);
  dataAdd= new FormControl('', Validators.required);
  partner_idAdd = new FormControl('', Validators.required);
  analysis_numAdd = new FormControl('', Validators.required);
  analysis_dateAdd = new FormControl('', Validators.required);



}
