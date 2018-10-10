import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  medicament_id: number;
  start_series: number;
  end_series: number;
  document_id: number;
  certificate_number: string;
  certificate_date: Date;
  medicament_series: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 2, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 3, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 4, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 5, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 6, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 7, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 8, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 9, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 10, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 11, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 12, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 13, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 14, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 15, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 16, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 17, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 18, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 19, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
  { id: 20, code: 'Code12345', medicament_id: 3131231, start_series: 31321321, end_series: 1341, document_id: 312321, certificate_number: '515153', certificate_date: new Date('03 30 2018'), medicament_series: 'dawdwa', action: '' },
];


@Component({
  selector: 'app-traffic-archive',
  templateUrl: './traffic-archive.component.html',
  styleUrls: ['./traffic-archive.component.css']
})
export class TrafficArchiveComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'medicament_id', 'start_series', 'end_series', 'document_id', 'certificate_number', 'certificate_date', 'medicament_series', 'action'];
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
  medicament_idEdit = new FormControl('', Validators.required);
  start_seriesEdit = new FormControl('', Validators.required);
  end_seriesEdit = new FormControl('', Validators.required);
  document_idEdit = new FormControl('', Validators.required);
  certificate_numberEdit = new FormControl('', Validators.required);
  certificate_dateEdit = new FormControl('', Validators.required);
  medicament_seriesEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  medicament_idAdd = new FormControl('', Validators.required);
  start_seriesAdd = new FormControl('', Validators.required);
  end_seriesAdd = new FormControl('', Validators.required);
  document_idAdd = new FormControl('', Validators.required);
  certificate_numberAdd = new FormControl('', Validators.required);
  certificate_dateAdd = new FormControl('', Validators.required);
  medicament_seriesAdd = new FormControl('', Validators.required);
}
