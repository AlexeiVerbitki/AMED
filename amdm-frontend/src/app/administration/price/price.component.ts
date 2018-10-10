import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  description: string;
  medicament_id: number;
  type_id: number;
  currency_history_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 2, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 3, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 4, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 5, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 6, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 7, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 8, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 9, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 10, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 11, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 12, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 13, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 14, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
  { id: 15, description: 'Test', medicament_id: 31231, type_id: 13231, currency_history_id: 132321, action: '' },
];

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
  displayedColumns: any[] = ['id', 'description', 'medicament_id', 'type_id', 'currency_history_id', 'action'];
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
  medicament_idEdit = new FormControl('', Validators.required);
  type_idEdit = new FormControl('', Validators.required);
  currency_history_idEdit = new FormControl('', Validators.required);

  descriptionAdd = new FormControl('', Validators.required);
  medicament_idAdd = new FormControl('', Validators.required);
  type_idAdd = new FormControl('', Validators.required);
  currency_history_idAdd = new FormControl('', Validators.required);

}
