import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  reason_id: number;
  description: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, description: 'VBKA', reason_id: 1321312, action: '' },
  { id: 2, description: 'VBKB', reason_id: 1321312, action: '' },
  { id: 3, description: 'VBKC', reason_id: 1321312, action: '' },
  { id: 4, description: 'VBKD', reason_id: 1321312, action: '' },
  { id: 5, description: 'VBKE', reason_id: 1321312, action: '' },
  { id: 6, description: 'VBKF', reason_id: 1321312, action: '' },
  { id: 7, description: 'VBKG', reason_id: 1321312, action: '' },
  { id: 8, description: 'VBKH', reason_id: 1321312, action: '' },
  { id: 9, description: 'VBKI', reason_id: 1321312, action: '' },
  { id: 10, description: 'VBKJ', reason_id: 1321312, action: '' },
  { id: 11, description: 'VBKK', reason_id: 1321312, action: '' },
  { id: 12, description: 'VBKL', reason_id: 1321312, action: '' },
  { id: 13, description: 'VBKM', reason_id: 1321312, action: '' },
  { id: 14, description: 'VBKN', reason_id: 1321312, action: '' },
  { id: 15, description: 'VBKO', reason_id: 1321312, action: '' },
];



@Component({
  selector: 'app-cessation-reasons',
  templateUrl: './cessation-reasons.component.html',
  styleUrls: ['./cessation-reasons.component.css']
})
export class CessationReasonsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'description', 'reason_id', 'action'];
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

  denumireEdit = new FormControl('', Validators.required);

  denumireAdd = new FormControl('', Validators.required);

}
