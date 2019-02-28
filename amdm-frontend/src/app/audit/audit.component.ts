import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoaderService} from '../shared/service/loader.service';
import {NavbarTitleService} from '../shared/service/navbar-title.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuditService} from '../shared/service/audit.service';
import {AdministrationService} from '../shared/service/administration.service';

@Component({
    selector: 'app-audit',
    templateUrl: './audit.component.html',
    styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit, OnDestroy, AfterViewInit {

    private subscriptions: Subscription[] = [];

    //Datasource table
    displayedColumns: any[] = ['category', 'subcategory', 'field', 'oldValue', 'newValue', 'dateTime', 'action', 'user'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    categories: any[] = [];
    subcategories: any[] = [];
    actions: any[] = [];

    users: any[] = [];

    visibility = false;

    maxDate = new Date();

    rFormSubbmitted = false;
    rForm: FormGroup;

    constructor(private fb: FormBuilder,
                private navbarTitleService: NavbarTitleService,
                private loadingService: LoaderService,
                private auditService: AuditService,
                private administrationService: AdministrationService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Audit');

        this.initFormData();

        this.onChanges();

        this.subscriptions.push(this.auditService.findAllCategories().subscribe(data => {
            this.categories = data;
        }));

        this.subscriptions.push(this.administrationService.getAllValidUsers().subscribe(data => {
            this.users = data;
        }));

        this.initActions();

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Rinduri per pagina: ';
        this.dataSource.sort = this.sort;
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'category': null,
            'subcategory': null,
            'fromDate': null,
            'toDate': null,
            'action': null,
            'username': null,
        });
    }

    private initActions() {
        this.actions.push(
            {
                name: 'ADD', description: 'Creare'
            },
            {
                name: 'MODIFY', description: 'Modificare'
            },
            {
                name: 'DELETE', description: 'Stergere'
            },
            {
                name: 'INTERRUPT', description: 'Intrerupere'
            },
            {
                name: 'SUSPEND', description: 'Suspendare'
            },
            {
                name: 'ACTIVATE', description: 'Activare'
            },
            {
                name: 'EXTENSION', description: 'Prelungire'
            },
            {
                name: 'RETIRE', description: 'Retragere'
            },
        );
    }

    onChanges(): void {
        this.rForm.get('category').valueChanges.subscribe(val => {
            if (val) {
                this.subcategories = val.subcategories;
                this.subcategories.find(a => a.name === 'test');
            } else {
                this.subcategories = [];
                this.rForm.get('subcategory').setValue(null);
            }
        });
    }


    findAudit() {
        const filter: any = this.rForm.value;
        if (filter.action) {
            filter.action = this.rForm.get('action').value.name;
        }
        this.subscriptions.push(this.auditService.loadAuditListByFilter(this.rForm.value).subscribe(data => {
            const dt: any [] = data;
            dt.forEach(d => {
                if (d.action) {
                    d.action = this.actions.find(f => f.name == d.action).description;                    
                }

            });
            this.dataSource.data = dt;
        }));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    changeVisibility() {
        this.visibility = !this.visibility;
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
