import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LicenseService} from '../../../shared/service/license/license.service';
import {LicenseDetailsComponent} from '../license-details/license-details.component';
import {NavbarTitleService} from 'src/app/shared/service/navbar-title.service';
import {Angular5Csv} from 'angular5-csv/Angular5-csv';
import {DatePipe} from '@angular/common';
import {LicenseStatusPipe} from '../../../shared/pipe/license-status.pipe';
import * as XLSX from 'xlsx';
import {DocumentService} from '../../../shared/service/document.service';
import {LoaderService} from '../../../shared/service/loader.service';

@Component({
    selector: 'app-license-management',
    templateUrl: './license-management.component.html',
    styleUrls: ['./license-management.component.css']
})
export class LicenseManagementComponent implements OnInit, OnDestroy {

    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];
    visibility = false;


    //Datasource table
    displayedColumns: any[] = ['agentEconomic', 'numar', 'seria', 'releaseDate', 'expirationDate', 'status'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    rFormSubbmitted = false;
    rForm: FormGroup;


    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService,
                private licenseService: LicenseService,
                private navbarTitleService: NavbarTitleService,
                public dialogLicense: MatDialog,
                private documentService: DocumentService,
                private loadingService: LoaderService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Gestionare Licente');

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) { return true; }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.administrationService.getCompanyDetailsForLicense(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );


        this.initFormData();

        this.onChanges();
    }


    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Licente per pagina: ';
        this.dataSource.sort = this.sort;
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'ecAgent': null,
            'seriaLicenta': null,
            'nrLicenta': null,
        });
    }

    onChanges(): void {
    }

    changeVisibility() {
        this.visibility = !this.visibility;
    }


    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    findLicente() {
        const filter = this.rForm.value;
        if (this.rForm.get('ecAgent').value) {
            filter.idno = this.rForm.get('ecAgent').value.idno;
        }

        this.subscriptions.push(this.licenseService.loadLicenseListByFilter(filter).subscribe(data => {
            this.dataSource.data = data;
        }));
    }

    openLicenseDetails(licenseId: number) {
        const dialogRef2 = this.dialogLicense.open(LicenseDetailsComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
                licenseId: licenseId,
            },
            hasBackdrop: true
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                //do nothing
            }
        });
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
        new Angular5Csv(displayData, 'Licente', options);
    }



    exportToExcel() {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        //needed only one shit
        let arr: any[][] = new Array<Array<any>>();
        arr.push(this.createHeaderColumns());
        arr = this.populateDataForXLSXDocument(arr);
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
        /* generate workbook and add the worksheet */
        XLSX.utils.book_append_sheet(wb, ws, 'Lista de licente');

        /* save to file */
        XLSX.writeFile(wb, 'Licente.xlsx');

    }

    exportToPdf() {
        this.subscriptions.push(this.documentService.viewTableData(this.createHeaderColumns(), this.getDisplayData()).subscribe(data => {
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
        const stPipe = new LicenseStatusPipe();
        const displayData: any [] = [];
        this.dataSource.filteredData.forEach(fd => {
            const row: any = {};

            row.agentEconomic = fd.ecAgentLongName;
            row.numar = fd.nr;
            row.seria = fd.serialNr;
            row.releaseDate = dtPipe.transform(new Date(fd.releaseDate), 'dd/MM/yyyy');
            row.expirationDate = dtPipe.transform(new Date(fd.expirationDate), 'dd/MM/yyyy');
            row.status = stPipe.transform(fd.status);

            displayData.push(row);
        });
        return displayData;
    }


    createHeaderColumns(): any[] {
        return ['Agentul economic', 'Numar licenta', 'Seria Licenta', 'Data eliberarii', 'Data expirarii', 'Statut Licenta'];
    }

    populateDataForXLSXDocument(arr: any[][]): any[] {
        const displayData: any[] = this.getDisplayData();
        if (displayData) {
            for (let i = 0; i < displayData.length; i++) {
                const arrIntern: any[] = new Array<any>();
                arrIntern[0] = displayData[i].agentEconomic;
                arrIntern[1] = displayData[i].numar;
                arrIntern[2] = displayData[i].seria;
                arrIntern[3] = displayData[i].releaseDate;
                arrIntern[4] = displayData[i].expirationDate;
                arrIntern[5] = displayData[i].status;
                arr.push(arrIntern);
            }
        }

        return arr;
    }


    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
