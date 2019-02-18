import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ClinicalTrialService} from '../../shared/service/clinical-trial.service';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import * as XLSX from 'xlsx';
import {DatePipe} from '@angular/common';
import {Angular5Csv} from 'angular5-csv/Angular5-csv';
import {DocumentService} from '../../shared/service/document.service';
import {LoaderService} from '../../shared/service/loader.service';
import {ClinicalTrialsDetailsComponent} from './dialog/clinical-trials-details/clinical-trials-details.component';

@Component({
    selector: 'app-clinical-trials',
    templateUrl: './clinical-trials.component.html',
    styleUrls: ['./clinical-trials.component.css']
})
export class ClinicalTrialsComponent implements OnInit, OnDestroy, AfterViewInit {

    ctForm: FormGroup;
    //Datasource table
    displayedColumns: any[] = ['code', 'eudraCt_nr', 'treatment', 'provenance', 'cometee', 'cometeeDate', 'sponsor'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    visibility = false;
    //Treatments
    treatmentList: any[] = [
        {'id': 1, 'description': 'Unicentric', 'code': 'U'},
        {'id': 2, 'description': 'Multicentric', 'code': 'M'}
    ];
    //Provenances
    provenanceList: any[] = [
        {'id': 3, 'description': 'Național', 'code': 'N'},
        {'id': 4, 'description': 'Internațional', 'code': 'I'}
    ];
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private navbarTitleService: NavbarTitleService,
                private clinicTrialService: ClinicalTrialService,
                private documentService: DocumentService,
                private loadingService: LoaderService,
                public dialogClinicTrial: MatDialog) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Fisa studiu clinic');

        this.ctForm = this.fb.group({
            'code': [''],
            'eudraCtNr': [''],
            'treatment': [],
            'provenance': [],
            'treatmentId': [''],
            'provenanceId': [''],
            'company': [''],
            'sponsor': [''],
            'startDateInternational': [''],
            'startDateNational': [''],
            'endDateNational': [''],
            'endDateInternational': [''],
            'phase': [''],
            'medicalInstitution': [],
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Studii clinice per pagina: ';
        this.dataSource.sort = this.sort;
    }

    exportToExcel() {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        //needed only one shit
        let arr: any[][] = new Array<Array<any>>();
        arr.push(this.createHeaderColumns());
        arr = this.populateDataForXLSXDocument(arr);
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
        /* generate workbook and add the worksheet */
        XLSX.utils.book_append_sheet(wb, ws, 'Lista studiilor clinice');

        /* save to file */
        XLSX.writeFile(wb, 'Studii clinice.xlsx');

    }

    createHeaderColumns(): any[] {
        return ['Codul studiului', 'Numar Eudra', 'Tratament', 'Provenienta', 'Numarul comisiei', 'Data comisiei', 'Sponsor'];
    }

    populateDataForXLSXDocument(arr: any[][]): any[] {
        const displayData: any[] = this.getDisplayData();
        if (displayData) {
            for (let i = 0; i < displayData.length; i++) {
                const arrIntern: any[] = new Array<any>();
                arrIntern[0] = displayData[i].code;
                arrIntern[1] = displayData[i].eudraCt_nr;
                arrIntern[2] = displayData[i].treatment;
                arrIntern[3] = displayData[i].provenance;
                arrIntern[4] = displayData[i].cometee;
                arrIntern[5] = displayData[i].cometeeDate;
                arrIntern[6] = displayData[i].sponsor;
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
        const csv = new Angular5Csv(displayData, 'Studii clinice', options);
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

    changeVisibility() {
        this.visibility = !this.visibility;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public clear(): void {
        this.ctForm.reset();
    }

    public getClinicalTrials(): void {

        const submitForm = this.ctForm.value;
        if (submitForm.treatment) {
            submitForm.treatmentId = submitForm.treatment.id;
        }
        if (submitForm.provenance) {
            submitForm.provenanceId = submitForm.provenance.id;
        }

        this.subscriptions.push(this.clinicTrialService.loadClinicalTrailListByFilter(this.ctForm.value).subscribe(data => {
                this.dataSource.data = data;
                //this.dataSource.data = data;
            }, error => {
                // this.loadingService.hide();
                console.log(error);
            })
        );

    }

    private getDisplayData() {
        const dtPipe = new DatePipe('en-US');
        const displayData: any [] = [];
        this.dataSource.filteredData.forEach(fd => {
            const row: any = {};

            row.code = fd.code;
            row.eudraCt_nr = fd.eudraCt_nr;
            row.treatment = fd.treatment;
            row.provenance = fd.provenance;
            row.cometee = fd.cometee;
            row.cometeeDate = dtPipe.transform(new Date(fd.cometeeDate), 'dd/MM/yyyy');
            row.sponsor = fd.sponsor;

            displayData.push(row);
        });
        return displayData;
    }

    private openCLinicatTrialDetails(id: number) {
        const dialogRef = this.dialogClinicTrial.open(ClinicalTrialsDetailsComponent, {
            width: '1400px',
            data: {
                id: id,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //do nothing
            }
        });
    }

}
