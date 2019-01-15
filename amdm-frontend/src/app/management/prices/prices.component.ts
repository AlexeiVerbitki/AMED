import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {TaskService} from '../../shared/service/task.service';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, filter, tap} from 'rxjs/operators';
import {flatMap} from 'rxjs/internal/operators';
import {PriceService} from '../../shared/service/prices.service';
import {PriceReqEditModalComponent} from './price-req-edit-modal/price-req-edit-modal.component';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import * as XLSX from 'xlsx';
import {DatePipe} from '@angular/common';
import {LicenseStatusPipe} from '../../shared/pipe/license-status.pipe';
import {Angular5Csv} from 'angular5-csv/Angular5-csv';
import {LoaderService} from '../../shared/service/loader.service';

@Component({
    selector: 'app-prices',
    templateUrl: './prices.component.html',
    styleUrls: ['./prices.component.css']
})
export class PricesComponent implements OnInit, AfterViewInit, OnDestroy {
    taskForm: FormGroup;
    requests: any[];
    medTypes: any[];
    priceTypes: any[];
    steps: any[] = [
        {short: 'R', description: 'Înregistrare'},
        {short: 'E', description: 'Evaluare'},
        {short: 'C', description: 'Întrerupt'},
        {short: 'A', description: 'Acceptat'},
        {short: 'F', description: 'Finisat'},
    ];

    companyMedicaments: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;

    displayedColumns: any[] = ['orderNr', 'folderNr', 'medicament', 'medicamentCode', 'division', 'medicamentType', 'orderApprovDate', 'expirationDate'];
    dataSource = new MatTableDataSource<any>();
    row: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private route: Router,
                private navbarTitleService: NavbarTitleService,
                private taskService: TaskService,
                private priceService: PriceService,
                private loadingService: LoaderService,
                public dialog: MatDialog) {

        const thisObject = this;
        window.onbeforeunload = function(e) {
            thisObject.onCloseWindow();
            return 'onbeforeunload';
        };

        this.taskForm = fb.group({
            'orderNr': [null],
            'folderNr': [null],
            'medicament': [null],
            'division': [null],
            'medicamentCode': [null],
            'orderApprovDate': [null],
            'expirationDate': [null],
            'medicamentType': [null],
            'priceType': [null],
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Procese pe pagină: ';
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Gestionarea prețurilor');

        this.companyMedicaments =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) { return true; }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.medLoading = true;

                }),
                flatMap(term =>

                    this.priceService.getMedicamentNamesAndCodeList(term).pipe(
                        tap(() => this.medLoading = false)
                    )
                )
            );

        this.subscriptions.push(
            this.priceService.getAllMedicamentTypes().subscribe(data => {
                    this.medTypes = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.priceService.getPriceTypes('1').subscribe(priceTypes => {
                    this.priceTypes = priceTypes;
                    console.log('getPriceTypes', this.priceTypes);
                },
                error => console.log(error)
            ));

        this.subscriptions.push(this.taskService.getRequestNames().subscribe(data => {
            this.requests = data;
        }));

        // this.taskForm.get('requestNumber').valueChanges.subscribe(val => {
        //     this.disabledElements(val);
        // });
    }

    exportToExcel() {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        //needed only one shit
        let arr: any[][] = new Array<Array<any>>();
        arr.push(this.createHeaderColumns());
        arr = this.populateDataForXLSXDocument(arr);
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
        /* generate workbook and add the worksheet */
        XLSX.utils.book_append_sheet(wb, ws, 'Lista de preturi');

        /* save to file */
        XLSX.writeFile(wb, 'Prices.xlsx');

    }

    createHeaderColumns(): any[] {
        return ['Nr ordin', 'Nr dosar', 'Medicament', 'Codul AMED', 'Divizare', 'Tip medicament', 'Data aprobarii', 'data expirarii'];
    }

    populateDataForXLSXDocument(arr: any[][]): any[] {
        const dtPipe = new DatePipe('en-US');
        const displayData: any[] = this.getDisplayData();
        if (displayData) {
            for (let i = 0; i < displayData.length; i++) {
                const arrIntern: any[] = new Array<any>();
                arrIntern[0] = displayData[i].orderNr;
                arrIntern[1] = displayData[i].folderNr;
                arrIntern[2] = displayData[i].medicament;
                arrIntern[3] = displayData[i].medicamentCode;
                arrIntern[4] = displayData[i].division;
                arrIntern[5] = displayData[i].medicamentType;
                arrIntern[6] =  dtPipe.transform(displayData[i].orderApprovDat, 'dd/MM/yyyy');
                arrIntern[7] = dtPipe.transform(displayData[i].expirationDate, 'dd/MM/yyyy');
                arr.push(arrIntern);
            }
        }

        return arr;
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
        new Angular5Csv(displayData, 'Prices', options);
    }

    exportToPdf() {
        this.subscriptions.push(this.priceService.viewTableData(this.createHeaderColumns(), this.getDisplayData()).subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    private getDisplayData() {
        const dtPipe = new DatePipe('en-US');
        const displayData: any [] = [];
        this.dataSource.filteredData.forEach(fd => {
            const row: any = {};

            row.orderNr = fd.orderNr;
            row.folderNr = fd.folderNr;
            row.medicament = fd.medicament;
            row.medicamentCode = fd.medicamentCode;
            row.division = fd.division;
            row.medicamentType = fd.medicamentType;
            row.orderApprovDate = dtPipe.transform(fd.orderApprovDate, 'dd/MM/yyyy');
            row.expirationDate = dtPipe.transform(fd.expirationDate, 'dd/MM/yyyy');
            displayData.push(row);
        });
        return displayData;
    }

    getPrices() {
        const dto = this.taskForm.value;
        dto.medicamentCode = dto.medicament ? dto.medicament.code : undefined;
        dto.medicament = undefined;
        dto.medicamentType = dto.medicamentType ? dto.medicamentType.description : undefined;
        dto.priceType = dto.priceType ? dto.priceType.description : undefined;

        this.taskForm.reset();
        this.subscriptions.push(
            this.priceService.getPricesByFilter(dto
            ).subscribe(pricesRequests => {
                    this.dataSource.data = pricesRequests.body;
                    console.log('pricesRequests', this.dataSource.data);
                },
                error => console.log(error)
            ));
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    navigateToUrl(index: number, rowDetails: any) {
         this.priceEditModalOpen(index, rowDetails);
        // this.route.navigate(['dashboard/module/price/evaluate/' + rowDetails.id]);

        // const urlToNavigate = rowDetails.navigationUrl + rowDetails.id;
        // if (urlToNavigate !== '') {
        //     this.route.navigate([urlToNavigate]);
        // }
    }

    priceEditModalOpen(index: number, rowDetails: any): void {
        const dialogRef = this.dialog.open(PriceReqEditModalComponent, {
            data: {request: rowDetails, medTypes: this.medTypes, steps: this.steps, priceTypes: this.priceTypes},
            width: '1000px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);

            if (result) {
                this.dataSource.data[index] = result;
                this.dataSource._updateChangeSubscription();
            }
        });
    }

    onCloseWindow() {
        // this.priceService.makeAvailableAgain(this.dataSource.data);

        // let win = window.open('about:blank', '_blank');
        // let win = window.open('http://localhost:4200/dashboard/management/prices', '_blank');
        // win.focus();
    }

    isLink(rowDetails: any): boolean {
        return rowDetails.navigationUrl !== '';
    }

}
