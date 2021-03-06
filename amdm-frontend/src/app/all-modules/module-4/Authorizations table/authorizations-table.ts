import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs/index';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import * as XLSX from 'xlsx';
import {DatePipe} from '@angular/common';
import {Angular5Csv} from 'angular5-csv/Angular5-csv';
import {TaskService} from '../../../shared/service/task.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {RequestService} from '../../../shared/service/request.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-authorizations-table',
    templateUrl: './authorizations-table.html',
    styleUrls: ['./authorizations-table.css']
})
export class AuthorizationsTable implements OnInit, AfterViewInit, OnDestroy {
    taskForm: FormGroup;
    registerCodes: any[];
    requests: any[];
    importType: any[] = [];
    requestTypes: any[];
    status: any[];

    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();

    displayedColumns: any[] = ['authorizationsNumber', 'importer', 'expirationDate', 'summ', 'currency', /* 'medicament'*/  ];
    dataSource = new MatTableDataSource<any>();
    row: any;
    visibility = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private route: Router,
                private taskService: TaskService,
                private administrationService: AdministrationService,
                private loadingService: LoaderService,
                private requestService: RequestService,
                private navbarTitleService: NavbarTitleService,
                private successOrErrorHandlerService: SuccessOrErrorHandlerService, ) {
        this.taskForm = fb.group({
            'requestCode': [null],
            'medicament': [null],
            'startDateFrom': [null],
            'expirationDate': [null],
            'company': [null],
            'medType': [null],
            'requestType': [null],
            'step': [null],
            'subject': [null],
            'summ': [null],
            'currency': [null],
            'status': [null],
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Procese pe pagina: ';
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Gestionare import');
        // this.retrieveRequestTypeSteps();
        this.onChanges();

        this.subscriptions.push(this.taskService.getRequestNames().subscribe(data => {
            this.requests = data;
        }));
        // this.importType = ['1','2']

        this.importType = [
            {description: 'Medicamente inregistrate', medType: '1'},
            {description: 'Medicamente neinregistrate', medType: '2'},
            {description: 'Materia prima', medType: '3'},
            {description: 'Ambalajul', medType: '4'},
        ];

        this.status = [
            {description: 'Valabilă', authorized: '1'},
            {description: 'Expirată', authorized: '0'}
        ];

        this.taskForm.get('requestCode').valueChanges.subscribe(val1 => {
            console.log('val1', val1);
            this.disabledElements(val1);
        });

        // this.taskForm.get('requestNumber').valueChanges.subscribe(val2 => {
        //     this.disabledElements(val2);
        // });

        this.subscriptions.push(this.taskService.getRegisterCatalogCodes().subscribe(codes => {
            this.registerCodes = codes;
            // console.log('codes', codes);
        }));

        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>
                    this.administrationService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );
    }

    onChanges(): void {
        if (this.taskForm.get('expirationDate')) {

            this.subscriptions.push(this.taskForm.get('expirationDate').valueChanges.subscribe(val => {
                if (val !== null && this.taskForm.get('status').enabled) {
                    // this.taskForm.get('status').reset();
                    this.taskForm.get('status').disable();
                }
                if (val == null && this.taskForm.get('status').disabled) {
                    this.taskForm.get('status').enable();
                }
                console.log('this.taskForm.get(\'status\')', this.taskForm.get('status').value);
            }));
        }

        if (this.taskForm.get('status')) {

            this.subscriptions.push(this.taskForm.get('status').valueChanges.subscribe(val => {
                if (val !== null  && this.taskForm.get('expirationDate').enabled) {
                    // this.taskForm.get('expirationDate').reset();
                    this.taskForm.get('expirationDate').disable();
                }
                if (val == null && this.taskForm.get('expirationDate').disabled) {
                    this.taskForm.get('expirationDate').enable();
                }
                console.log('this.taskForm.get(\'expirationDate\')', this.taskForm.get('expirationDate').value);
            }));
        }

    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
        this.navbarTitleService.showTitleMsg('');
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

    // retrieveRequestTypeSteps() {
    //
    //     // this.taskForm.get('step').setValue(null);
    //     // this.steps = null;
    //     // if (!this.taskForm.get('requestType').value || this.taskForm.get('requestType').value.id == null) {
    //     //     return;
    //     // }
    //
    //     this.subscriptions.push(this.taskService.getRequestTypeSteps(this.taskForm.get('requestType').value.id).subscribe(data => {
    //         this.steps = data;
    //         console.log("steps:", this.steps)
    //     }));
    // }
    findTasks2() {
        this.loadingService.show();
        const taskFormValue = this.taskForm.value;
        console.log('taskFormValue', taskFormValue);
        const searchCriteria = {
            authorizationsNumber: taskFormValue.subject ? taskFormValue.subject : null,
            importer: taskFormValue.company ? taskFormValue.company.id : null,
            summ: taskFormValue.summ ? taskFormValue.summ : null,
            currency: (taskFormValue.currency && taskFormValue.currency.id) ? taskFormValue.currency.id : null,
            medicament: taskFormValue.medicament ? taskFormValue.medicament : null,
            medType: (taskFormValue.medType && taskFormValue.medType.medType) ? taskFormValue.medType.medType : null,
            expirationDate: taskFormValue.expirationDate ? taskFormValue.expirationDate : null,
            lessThanToday: (taskFormValue.status && taskFormValue.status.authorized == '0' ) ?  new Date() : null,
            moreThanToday: (taskFormValue.status && taskFormValue.status.authorized == '1' ) ?  new Date() : null,
        };


        console.log('searchCriteria', searchCriteria);
        this.subscriptions.push(this.requestService.getAuthorizationByFilter(searchCriteria).subscribe(data => {
                this.dataSource.data = data.body;
                console.log('data.body', data.body);

                if (data.body.length == 0) {
                    this.successOrErrorHandlerService.showError('Nu exista nici o autorizatie cu datele introduse');
                }
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            })
        );
        console.log('searchCriteria', searchCriteria);



    }


    navigateToUrl(rowDetails: any) {


        this.subscriptions.push(this.requestService.getRequestByImportId(rowDetails.id).subscribe(requestId => {
            console.log('this.requestService.getImportRequest(rowDetails.id)', requestId);

            const urlToNavigate = 'dashboard/module/import-authorization/view-authorization/';
            console.log('urlToNavigate', urlToNavigate);
            this.route.navigate([urlToNavigate, rowDetails.id]);

        }, error => {
            console.log('this.requestService.getImportRequest(rowDetails.id) errro');
        }));
    }

    isLink(rowDetails: any): boolean {
        return rowDetails.navigationUrl || rowDetails.navigationUrl !== '';
    }

    private disabledElements(val) {
        if (val) {
            this.taskForm.get('request').setValue(null);
            this.taskForm.get('request').disable();
            this.taskForm.get('requestType').setValue(null);
            this.taskForm.get('requestType').disable();
            this.taskForm.get('step').setValue(null);
            this.taskForm.get('step').disable();
            this.taskForm.get('requestNumber').enable();
        } else {
            this.taskForm.get('request').enable();
            this.taskForm.get('requestType').enable();
            this.taskForm.get('step').enable();
            this.taskForm.get('requestNumber').setValue(null);
            this.taskForm.get('requestNumber').disable();
        }
    }


    changeVisibility() {
        this.visibility = !this.visibility;
    }

    exportToExcel() {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        //needed only one shit
        let arr: any[][] = new Array<Array<any>>();
        arr.push(this.createHeaderColumns());
        arr = this.populateDataForXLSXDocument(arr);
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
        /* generate workbook and add the worksheet */
        XLSX.utils.book_append_sheet(wb, ws, 'Lista de autorizatii');

        /* save to file */
        XLSX.writeFile(wb, 'Autorizatii.xlsx');
    }

    createHeaderColumns(): any[] {
        return ['Numarul autorizatiei', 'Compania', 'Data expirarii', 'Suma', 'Valuta'];
    }

    populateDataForXLSXDocument(arr: any[][]): any[] {
        const displayData: any[] = this.getDisplayData();
        console.log('display data', displayData);
        if (displayData) {
            for (let i = 0; i < displayData.length; i++) {
                const arrIntern: any[] = new Array<any>();
                arrIntern[0] = displayData[i].authorizationsNumber;
                arrIntern[1] = displayData[i].importer;
                arrIntern[2] = displayData[i].expirationDate;
                arrIntern[3] = displayData[i].summ;
                arrIntern[4] = displayData[i].currency;
                arr.push(arrIntern);
            }
        }
        return arr;
    }

    private getDisplayData() {
        const dtPipe = new DatePipe('en-US');
        const displayData: any [] = [];
        this.dataSource.filteredData.forEach(fd => {
            const row: any = {};
            // console.log('fd', fd);
            row.authorizationsNumber = fd.authorizationsNumber == 'Numarul ipseste' ? '-------------------' : fd.authorizationsNumber;
            row.importer = fd.importer  ? fd.importer : '---------------';
            row.expirationDate = fd.expirationDate ? dtPipe.transform(new Date(fd.expirationDate), 'dd/MM/yyyy') : '---------------';
            row.summ = fd.summ ? fd.summ : '------';
            row.currency = fd.currency ? fd.currency : '------';
            displayData.push(row);
        });
        return displayData;
    }

    exportToCsv() {
        const displayData = this.getDisplayData();

        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            headers: this.createHeaderColumns()
        };
        const csv = new Angular5Csv(displayData, 'Autorizatii', options);
    }

}
