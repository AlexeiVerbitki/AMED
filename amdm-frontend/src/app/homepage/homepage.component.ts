import {MatDialog, MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {TaskService} from '../shared/service/task.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HomepageService} from '../shared/service/homepage.service';
import {LoaderService} from '../shared/service/loader.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit {

    taskForm: FormGroup;
    displayedColumns: any[] = ['requestNumber', 'startDate', 'company', 'deponent', 'subject', 'endDate', 'step'];
    dataSource = new MatTableDataSource<any>();
    private subscriptions: Subscription[] = [];
    requestsNumber = 0;
    expiredReqNumber = 0;
    emergentReqNumber = 0;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private route: Router,
                private homepageService: HomepageService,
                private loadingService: LoaderService) {
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
        this.loadingService.show();
        this.subscriptions.push(this.homepageService.getUnfinishedTasks().subscribe(unfinishedTasks => {
                // console.log('unfinishedTasks', unfinishedTasks);
                this.dataSource.data = unfinishedTasks as [any];
                this.dataSource.data.forEach(task => {
                    if (task.critical) {
                        this.emergentReqNumber++;
                    }
                    if (task.expired) {
                        this.expiredReqNumber++;
                    }
                });
                this.requestsNumber = unfinishedTasks.length;
                this.loadingService.hide();
            }, error1 => {
                this.loadingService.hide();
            })
        );
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
