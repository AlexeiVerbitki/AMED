import {MatDialog, MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {TaskService} from "../shared/service/task.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

    taskForm: FormGroup;
    displayedColumns: any[] = ['requestNumber', 'processName', 'requestType', 'username', 'startDate', 'endDate', 'step'];
    dataSource = new MatTableDataSource<any>();
    private subscriptions: Subscription[] = [];
    requestsNumber;
    expiredReqNumber;
    emergentReqNumber;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private fb: FormBuilder, public dialog: MatDialog, private route: Router, private taskService: TaskService) {
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

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Procese pe pagina: ';
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.getRequestsInWork();

    }

    getRequestsInWork() {
        this.subscriptions.push(this.taskService.getTasksByFilter(this.taskForm.value).subscribe(data => {

            const source = data.body.filter(r => r.currentStep !== 'F' && r.currentStep !== 'C' && r.endDate === null);
            this.dataSource.data = source.sort((a, b) => a.startDate.localeCompare(b.startDate));
            const expired = data.body.filter(r => r.expired !== null && r.expired === true );
            const emergent = data.body.filter(r => r.critical !== null && r.critical === true && (r.expired == null || r.expired === false));
            this.requestsNumber = this.dataSource.data.length;
            this.expiredReqNumber = expired.length;
            this.emergentReqNumber = emergent.length;

        }));
    }

    isLink(rowDetails: any): boolean {
        return rowDetails.navigationUrl !== '';
    }

    navigateToUrl(rowDetails: any) {
        const urlToNavigate = rowDetails.navigationUrl + rowDetails.id;
        if (urlToNavigate !== '') {
            this.route.navigate([urlToNavigate]);
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
