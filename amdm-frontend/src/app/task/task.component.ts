import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from "rxjs";
import {TaskService} from "../shared/service/task.service";

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {
    taskForm: FormGroup;

    requests: any[];
    requestTypes: any[];
    steps: any[];

    displayedColumns: any[] = ['requestNumber','processName','requestType', 'username', 'startDate', 'endDate', 'step'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('taskForm') taskFormElem: ElementRef;

    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, private taskService: TaskService) {
        this.taskForm = fb.group({
            'requestNumber': [null, {validators: Validators.required}],
            'request': [null],
            'requestType': [null],
            'assignedPerson': [null],
            'startDate': [null],
            'endDate': [null],
            'step': [null],
        });
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.subscriptions.push(this.taskService.getRequestNames().subscribe(data => {
            this.requests = data;
        }));

        this.taskForm.get('requestNumber').valueChanges.subscribe(val => {
            this.disabledElements(val);

        });
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
        console.log(this.taskFormElem.nativeElement);
        this.subscriptions.push(this.taskService.getTasksByFilter(this.taskForm.value).subscribe(data => {
            console.log(data);
        }))
    }

}
