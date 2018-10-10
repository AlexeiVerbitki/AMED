import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';


export interface Bank {
  id: number;
  cod: string;
  description: string;
  parent: number;
  long_description: string;
  address: string;
  bank_code: string;
  phonenumbers: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, cod: '0000000000001', description: 'VBKA', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 2, cod: '0000000000002', description: 'VBKB', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 3, cod: '0000000000003', description: 'VBKC', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 4, cod: '0000000000004', description: 'VBKD', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 5, cod: '0000000000005', description: 'VBKE', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 6, cod: '0000000000006', description: 'VBKF', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 7, cod: '0000000000007', description: 'VBKG', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 8, cod: '0000000000008', description: 'VBKH', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 9, cod: '0000000000009', description: 'VBKI', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 10, cod: '000000000010', description: 'VBKM', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 11, cod: '000000000011', description: 'VBKN', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 12, cod: '000000000012', description: 'VBKO', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 13, cod: '0000000000013', description: 'VBKP', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 14, cod: '0000000000014', description: 'VBKQ', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
  { id: 15, cod: '0000000000015', description: 'VBKR', parent: 12345678901, long_description: 'Victoria Bank', address: '33, Puskin str., Republic of Moldova', bank_code: 'VICBMD2X416', phonenumbers: '+37361234567', action: '' },
];

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  displayedColumns: any[] = ['id', 'cod', 'description', 'parent', 'long_description', 'address', 'bank_code', 'phonenumbers', 'action'];
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
  parentEdit = new FormControl('', Validators.required);
  denumireaFullEdit = new FormControl('', Validators.required);
  adresaEdit = new FormControl('', Validators.required);
  contEdit = new FormControl('', Validators.required);
  phoneEdit = new FormControl('', Validators.required);

  codAdd = new FormControl('', Validators.required);
  denumireAdd = new FormControl('', Validators.required);
  parentAdd = new FormControl('', Validators.required);
  denumireaFullAdd = new FormControl('', Validators.required);
  adresaAdd= new FormControl('', Validators.required);
  contAdd = new FormControl('', Validators.required);
  phoneAdd = new FormControl('', Validators.required);

}
