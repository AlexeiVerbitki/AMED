import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  name: string;
  long_name: string;
  units_of_measurement_id: number;
  allow_for_ranges: number;
  start_series: number;
  end_series: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 2, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 3, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 4, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 5, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 6, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 7, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 8, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 9, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 10, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 11, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 12, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 13, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 14, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
  { id: 15, code: '32131', name: 'Test', long_name: 'Test Long', units_of_measurement_id: 312, allow_for_ranges: 3213, start_series: 321321, end_series: 312312, action: '' },
];

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'name', 'long_name', 'units_of_measurement_id', 'allow_for_ranges', 'start_series', 'end_series', 'action'];
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
  nameEdit = new FormControl('', Validators.required);
  long_nameEdit = new FormControl('', Validators.required);
  units_of_measurement_idEdit = new FormControl('', Validators.required);
  allow_for_rangesEdit = new FormControl('', Validators.required);
  start_seriesEdit = new FormControl('', Validators.required);
  end_seriesEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  nameAdd = new FormControl('', Validators.required);
  long_nameAdd = new FormControl('', Validators.required);
  units_of_measurement_idAdd = new FormControl('', Validators.required);
  allow_for_rangesAdd = new FormControl('', Validators.required);
  start_seriesAdd = new FormControl('', Validators.required);
  end_seriesAdd = new FormControl('', Validators.required);
  
}
