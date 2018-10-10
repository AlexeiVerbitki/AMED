import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';


export interface Bank {
  id: number;
  cod: string;
  description: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, cod: '0000000000001', description: 'VBKA', action: '' },
  { id: 2, cod: '0000000000002', description: 'VBKB', action: '' },
  { id: 3, cod: '0000000000003', description: 'VBKC', action: '' },
  { id: 4, cod: '0000000000004', description: 'VBKD', action: '' },
  { id: 5, cod: '0000000000005', description: 'VBKE', action: '' },
  { id: 6, cod: '0000000000006', description: 'VBKF', action: '' },
  { id: 7, cod: '0000000000007', description: 'VBKG', action: '' },
  { id: 8, cod: '0000000000008', description: 'VBKH', action: '' },
  { id: 9, cod: '0000000000009', description: 'VBKI', action: '' },
  { id: 10, cod: '000000000010', description: 'VBKJ', action: '' },
  { id: 11, cod: '000000000011', description: 'VBKK', action: '' },
  { id: 12, cod: '000000000012', description: 'VBKL', action: '' },
  { id: 13, cod: '000000000013', description: 'VBKM', action: '' },
  { id: 14, cod: '000000000014', description: 'VBKN', action: '' },
  { id: 15, cod: '000000000015', description: 'VBKO', action: '' },
];


@Component({
  selector: 'app-substanta-activa',
  templateUrl: './substanta-activa.component.html',
  styleUrls: ['./substanta-activa.component.css']
})
export class SubstantaActivaComponent implements OnInit {

  displayedColumns: any[] = ['id', 'cod', 'description', 'action'];
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

  codAdd = new FormControl('', Validators.required);
  denumireAdd = new FormControl('', Validators.required);


}
