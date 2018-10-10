import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


export interface Bank {
  id: number;
  cod: string;
  short_description: string;
  description: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, cod: '0000000000001', short_description: 'AED', description: 'Dirham E.A.U.', action: '' },
  { id: 2, cod: '0000000000002', short_description: 'ALL', description: 'Lek albanez', action: '' },
  { id: 3, cod: '0000000000003', short_description: 'AMD', description: 'Dram armean', action: '' },
  { id: 4, cod: '0000000000004', short_description: 'AUD', description: 'Dolar australian', action: '' },
  { id: 5, cod: '0000000000005', short_description: 'AZN', description: 'Manat azerbaidjan', action: '' },
  { id: 6, cod: '0000000000006', short_description: 'BGN', description: 'Leva bulgara', action: '' },
  { id: 7, cod: '0000000000007', short_description: 'BYR', description: 'Rubla bielorusa', action: '' },
  { id: 8, cod: '0000000000008', short_description: 'CAD', description: 'Dolar canadian', action: '' },
  { id: 9, cod: '0000000000009', short_description: 'CHF', description: 'Franc elvetian', action: '' },
  { id: 10, cod: '000000000010', short_description: 'CNY', description: 'Yan chinez', action: '' },
  { id: 11, cod: '000000000011', short_description: 'CYP', description: 'Lira cipriota', action: '' },
  { id: 12, cod: '000000000012', short_description: 'CZK', description: 'Coroana ceha', action: '' },
  { id: 13, cod: '000000000013', short_description: 'DKK', description: 'Coroana daneza', action: '' },
  { id: 14, cod: '000000000014', short_description: 'EKK', description: 'Euro', action: '' },
  { id: 15, cod: '000000000015', short_description: 'EUR', description: 'Lira sterlina', action: '' },
];
@Component({
  selector: 'app-valute',
  templateUrl: './valute.component.html',
  styleUrls: ['./valute.component.css']
})
export class ValuteComponent implements OnInit {
  displayedColumns: any[] = ['id', 'cod', 'short_description', 'description', 'action'];
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
  short_denumireEdit = new FormControl('', Validators.required);
  denumireEdit = new FormControl('', Validators.required);

  codAdd = new FormControl('', Validators.required);
  short_denumireAdd = new FormControl('', Validators.required);
  denumireAdd = new FormControl('', Validators.required);


}
