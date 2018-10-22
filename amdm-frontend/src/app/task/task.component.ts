import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';

export interface TaskTable {
  id: number;
  requestNumber: number;
  username: string;
  startDate: Date;
  endDate: Date;
  step: string;
  status: string;

}

const ELEMENT_DATA: TaskTable[] = [
  { id: 1, requestNumber: 32321, username: 'Jora Cardan', startDate: new Date(), endDate: new Date(), step: 'Step 1', status: 'In garaj' },
  { id: 2, requestNumber: 5, username: 'Vasilisa Prekrasnaya', startDate: new Date(), endDate: new Date(), step: 'Step 2', status: 'In beci' },
  { id: 3, requestNumber: 1234, username: 'Ghita Boamba', startDate: new Date(), endDate: new Date(), step: 'Step 3', status: 'In podval' },
  { id: 4, requestNumber: 4, username: 'Vanea Djedai', startDate: new Date(), endDate: new Date(), step: 'Step 4', status: 'In pod' },
  { id: 5, requestNumber: 69, username: 'Vlad Mutu', startDate: new Date(), endDate: new Date(), step: 'Step 5', status: 'In canalizare' },
  { id: 6, requestNumber: 898, username: 'Zina Magaz', startDate: new Date(), endDate: new Date(), step: 'Step 6', status: 'In bordei' },
  { id: 7, requestNumber: 777, username: 'Tolea Krasavcik', startDate: new Date(), endDate: new Date(), step: 'Step 7', status: 'In soba' },

];

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  taskForm: FormGroup;

  displayedColumns: any[] = ['id', 'requestNumber', 'username', 'startDate', 'endDate', 'step', 'status'];
  dataSource = new MatTableDataSource<TaskTable>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder) {
    this.taskForm = fb.group({
      'requestNumber': [null],
      'stapan': [null],
      'startDate': [null],
      'endDate': [null],
      'step': [null],
      'status': [null],
  });
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

}
