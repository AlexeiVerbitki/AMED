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
import {TaskService} from "../../../shared/service/task.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {RequestService} from "../../../shared/service/request.service";

@Component({
    selector: 'app-task',
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

    displayedColumns: any[] = ['step', 'status',  'requestNumber', 'startDate', 'company', 'deponent', 'subject', 'toatlSum', 'currency', 'endDate', ];
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
                private navbarTitleService: NavbarTitleService) {
        this.taskForm = fb.group({
            'requestCode': [null],
            'requestNumber': [null, Validators.pattern('^[0-9]{0,6}$')],
            'startDateFrom': [null],
            'startDateTo': [null],
            'company': [null],
            'request': [null],
            'requestType': [null],
            'step': [null],
            'subject': [null],
            'toatlSum': [null],
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

        this.subscriptions.push(this.taskService.getRequestNames().subscribe(data => {
            this.requests = data;
        }));
        // this.importType = ['1','2']

        this.importType = [
            {description: 'Medicamente inregistrate', medType: '15'},
            {description: 'Medicamente neinregistrate', medType: '16'},
            {description: 'Materia prima', medType: '17'},
            {description: 'Ambalajul', medType: '18'},
        ]

        this.status = [
            {description: 'Aprobată', authorized: '1'},
            {description: 'Respinsa', authorized: '0'}
        ]

        this.taskForm.get('requestNumber').disable();
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
            // requestCode: taskFormValue.requestCode ? taskFormValue.requestCode.registerCode : '',
            // requestNumber: taskFormValue.requestNumber,
            // startDateFrom: taskFormValue.startDateFrom,
            // startDateTo: taskFormValue.startDateTo,
            // comanyId: taskFormValue.company ? taskFormValue.company.id : '',
            // processId: taskFormValue.request ? taskFormValue.request.id : '',
            // processTypeId: taskFormValue.requestType ? taskFormValue.requestType.id : '',
            // stepCode: taskFormValue.step ? taskFormValue.step.code : '',
            // subject: taskFormValue.subject,
            // id: null,
            // applicationRegistrationNumber: null,
            // applicationDate: null,

            // seller: null,
            // basisForImport: null,
            // importer: null,
            // conditionsAndSpecification: null,
            // quantity: null,
            // price: null,

            // producer: null,
            // customsDeclarationDate: null,
            // customsCode: null,
            // customsNumber: null,
            // customsTransactionType: null,
            authorizationsNumber: taskFormValue.subject? taskFormValue.subject: '',
            applicant: /*taskFormValue.applicant ? taskFormValue.applicant.id: '' */ "1",
            expirationDate: '2019-12-20' /*taskFormValue.expirationDate? taskFormValue.expirationDate: null*/,
            summ: "40"/* taskFormValue.summ?  taskFormValue.summ: null*/,
            currency: "6" /*taskFormValue.currency.id? taskFormValue.currency.id: null*/,

            // medType: null,
            // importAuthorizationDetailsEntityList: null,
            // authorized: null,
            // contract: null,
            // contractDate: null,
            // anexa: null,
            // anexaDate: null,
            // specification: null,
            // SpecificationDate: null,
            // nmCustomsPointsList: null,
        };
        console.log('searchCriteria', searchCriteria);
        this.subscriptions.push(this.requestService.getAuthorizationByFilter(searchCriteria.authorizationsNumber, searchCriteria.applicant, searchCriteria.expirationDate, searchCriteria.summ, searchCriteria.currency).subscribe(data => {
        // this.subscriptions.push(this.requestService.getAuthorizationByFilter(searchCriteria).subscribe(data => {
                this.loadingService.hide();
                this.dataSource.data = data;
                console.log('data.body', data);
            }, error => {
                this.loadingService.hide();
            })
        );
        // console.log('searchCriteria', searchCriteria);

    }

    findTasks() {
        this.loadingService.show();
        const taskFormValue = this.taskForm.value;
        console.log('taskFormValue', taskFormValue);
        const searchCriteria = {
            requestCode: taskFormValue.requestCode ? taskFormValue.requestCode.registerCode : '',
            requestNumber: taskFormValue.requestNumber,
            startDateFrom: taskFormValue.startDateFrom,
            startDateTo: taskFormValue.startDateTo,
            comanyId: taskFormValue.company ? taskFormValue.company.id : '',
            processId: taskFormValue.request ? taskFormValue.request.id : '',
            processTypeId: taskFormValue.requestType ? taskFormValue.requestType.id : '',
            stepCode: taskFormValue.step ? taskFormValue.step.code : '',
            subject: taskFormValue.subject,
        };
        console.log('searchCriteria', searchCriteria);
        this.subscriptions.push(this.taskService.getTasksByFilter(searchCriteria).subscribe(data => {
                this.loadingService.hide();
                this.dataSource.data = data.body;
                console.log('data.body', data.body);
            }, error => {
                this.loadingService.hide();
            })
        );
        // console.log('searchCriteria', searchCriteria);
    }

    navigateToUrl(rowDetails: any) {
        const urlToNavigate = rowDetails.navigationUrl + rowDetails.id;
        if (urlToNavigate !== '') {
            this.route.navigate([urlToNavigate]);
        }
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

    allowOnlyNumbers(event: any) {
        //console.log(key);
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
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
        XLSX.utils.book_append_sheet(wb, ws, 'Lista de cereri');

        /* save to file */
        XLSX.writeFile(wb, 'Cereri.xlsx');
    }

    createHeaderColumns(): any[] {
        return ['Numar cerere', 'Data inceperii', 'Compania solicitant', 'Depunator', 'Subiect', 'Data finisare', 'Pas'];
    }

    populateDataForXLSXDocument(arr: any[][]): any[] {
        const displayData: any[] = this.getDisplayData();
        console.log('display data', displayData);
        if (displayData) {
            for (let i = 0; i < displayData.length; i++) {
                const arrIntern: any[] = new Array<any>();
                arrIntern[0] = displayData[i].requestNumber;
                arrIntern[1] = displayData[i].startDate;
                arrIntern[2] = displayData[i].company;
                arrIntern[3] = displayData[i].mandatedContact;
                arrIntern[4] = 'Achtung';
                arrIntern[5] = displayData[i].endDate;
                arrIntern[6] = displayData[i].step;
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
            row.requestNumber = fd.requestNumber;
            row.startDate = dtPipe.transform(new Date(fd.startDate), 'dd/MM/yyyy');
            row.company = fd.company;
            row.mandatedContact = fd.mandatedContact;
            row.endDate = dtPipe.transform(new Date(fd.endDate), 'dd/MM/yyyy');
            row.step = fd.step;
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
        const csv = new Angular5Csv(displayData, 'Cereri', options);
    }

}
