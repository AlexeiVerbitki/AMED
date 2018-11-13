import { TaskService } from './../../shared/service/task.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { LoaderService } from "./../../shared/service/loader.service";

@Component({
  selector: 'app-gest-doc',
  templateUrl: './gest-doc.component.html',
  styleUrls: ['./gest-doc.component.css']
})
export class GestDocComponent {
  taskForm: FormGroup;
  requests: any[];
  requestTypes: any[];
  steps: any[];
    expeditors : any[];
    destinatars : any[];
    termenDeExecutares : any[];
    tipDocs : any[];

  displayedColumns: any[] = ['requestNumber', 'processName', 'requestType', 'username', 'startDate', 'endDate', 'step'];
  dataSource = new MatTableDataSource<any>();
  row: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, private route: Router, private taskService: TaskService, private loaderService: LoaderService) {
    this.taskForm = fb.group({
      'nrDocumentului': [null, { validators: Validators.required }],
      'dataDoc': [null],
      'expeditor': [null],
      'destinatar': [null],
      'termenDeExecutare': [null],
      'tipDoc': [null],
      'dataPrimirii': [null],
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = "Prorcese pe pagina: ";
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.subscriptions.push(this.taskService.getRequestNames().subscribe(data => {
      this.requests = data;
    }));

    this.taskForm.get('nrDocumentului').valueChanges.subscribe(val => {
      this.disabledElements(val);

    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  retrieveRequestTypes() {
    this.taskForm.get('requestType').setValue(null);
    this.requestTypes = null;
    if (!this.taskForm.get('request').value) {
      return;
    }

    this.subscriptions.push(this.taskService.getRequestTypes(this.taskForm.get('request').value.id).subscribe(data => {
      this.requestTypes = data;
    }));
  }

  retrieveRequestTypeSteps() {

    this.taskForm.get('step').setValue(null);
    this.steps = null;
    if (!this.taskForm.get('requestType').value || this.taskForm.get('requestType').value.id == null) {
      return;
    }

    this.subscriptions.push(this.taskService.getRequestTypeSteps(this.taskForm.get('requestType').value.id).subscribe(data => {
      this.steps = data;
    }))
  }

  findTasks() {

    // this.requestNumber.nativeElement.focus();
    this.subscriptions.push(this.taskService.getTasksByFilter(this.taskForm.value).subscribe(data => {
      this.dataSource.data = data.body;
    }))
  }

  navigateToUrl(rowDetails: any) {
    const urlToNavigate = rowDetails.navigationUrl + rowDetails.id
    this.route.navigate([urlToNavigate]);
  }

  private disabledElements(val) {
    if (val) {
      this.taskForm.get('request').disable();
      this.taskForm.get('requestType').disable();
      this.taskForm.get('assignedPerson').disable();
      this.taskForm.get('startDate').disable();
      this.taskForm.get('endDate').disable();
      this.taskForm.get('step').disable();
    } else {
      this.taskForm.get('request').enable();
      this.taskForm.get('requestType').enable();
      this.taskForm.get('assignedPerson').enable();
      this.taskForm.get('startDate').enable();
      this.taskForm.get('endDate').enable();
      this.taskForm.get('step').enable();

    }
  }
}
