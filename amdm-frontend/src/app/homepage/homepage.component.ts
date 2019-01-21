import {MatDialog, MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {TaskService} from "../shared/service/task.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RequestService} from "../shared/service/request.service";

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

    taskForm: FormGroup;
    displayedColumns: any[] = ['requestNumber', 'processName', 'requestType', 'username', 'startDate', 'endDate', 'step'];
    OLD_REQUEST_DAYS = "OLD_REQUEST_DAYS";
    dataSource = new MatTableDataSource<any>();
    private subscriptions: Subscription[] = [];
    requestsNumber;
    oldRequestsNumber;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private fb: FormBuilder, public dialog: MatDialog, private route: Router, private taskService: TaskService, private requestService: RequestService) {
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

            const source = data.body.filter(r => r.step !== 'Proces finisat' && r.step !== 'Finisat' && r.step !== 'Proces anulat');
            this.dataSource.data = source.sort((a, b) => a.startDate.localeCompare(b.startDate));

            this.requestsNumber = this.dataSource.data.length;

            this.subscriptions.push(this.requestService.getOldRequestTerm(this.OLD_REQUEST_DAYS).subscribe(data2 => {
                    this.calculateOldRequests(this.dataSource.data, data2);
                })
            );

        }));
    }

    calculateOldRequests(data: any, oldRequestTerm: number) {

        const date = new Date();
        date.setDate(date.getDate() - oldRequestTerm);
        const requests = data.filter(r => new Date(r.startDate).getTime() <= date.getTime());
        this.oldRequestsNumber = requests.length;
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
