import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../../shared/service/administration.service';
import {LicenseService} from '../../../shared/service/license/license.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {DocumentService} from '../../../shared/service/document.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {AnnihilationService} from '../../../shared/service/annihilation/annihilation.service';
import {Angular5Csv} from 'angular5-csv/Angular5-csv';
import * as XLSX from 'xlsx';
import {LicenseDetailsComponent} from '../../license/license-details/license-details.component';
import {AnnihilationDetailsComponent} from '../annihilation-details/annihilation-details.component';

@Component({
  selector: 'app-annihilation-management',
  templateUrl: './annihilation-management.component.html',
  styleUrls: ['./annihilation-management.component.css']
})
export class AnnihilationManagementComponent implements OnInit, OnDestroy {

    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];
    visibility = false;

    maxDate: Date = new Date();


    //Datasource table
    displayedColumns: any[] = ['agentEconomic', 'medicamentName', 'quantity', 'uselessReason', 'seria', 'destroyMethod', 'executionDate', 'details'];
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
              private loadingService: LoaderService,
              private medicamentService: MedicamentService,
              private annihilationService: AnnihilationService) { }

  ngOnInit() {
      this.navbarTitleService.showTitleMsg('Gestionare nimicirii medicamentelor');

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

  }


    private initFormData() {
        this.rForm = this.fb.group({
            'ecAgent': null,
            'dataExecutariiFrom': [null, Validators.required],
            'dataExecutariiTo': [null, Validators.required],
        });
    }

    findMedicamenteNimicite() {
        const filter: any = {};
        if (this.rForm.get('ecAgent').value) {
            filter.idno = this.rForm.get('ecAgent').value.idno;
        }

        if (this.rForm.get('dataExecutariiFrom').value) {
            filter.fromDate = this.rForm.get('dataExecutariiFrom').value;
        }
        if (this.rForm.get('dataExecutariiTo').value) {
            filter.toDate = this.rForm.get('dataExecutariiTo').value;
        }



        this.subscriptions.push(this.annihilationService.loadAnnihListByFilter(filter).subscribe(data => {
            this.dataSource.data = data;
        }));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    changeVisibility() {
        this.visibility = !this.visibility;
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
        new Angular5Csv(displayData, 'Nimiciri', options);
    }



    exportToExcel() {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        //needed only one shit
        let arr: any[][] = new Array<Array<any>>();
        arr.push(this.createHeaderColumns());
        arr = this.populateDataForXLSXDocument(arr);
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
        /* generate workbook and add the worksheet */
        XLSX.utils.book_append_sheet(wb, ws, 'Lista de nimiciri');

        /* save to file */
        XLSX.writeFile(wb, 'Nimiciri.xlsx');

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
        const displayData: any [] = [];
        this.dataSource.filteredData.forEach(fd => {
            const row: any = {};

            row.agentEconomic = fd.ecAgentLongName != null ? fd.ecAgentLongName : '';
            row.medicamentName = fd.medicamentName != null ? fd.medicamentName : '';
            row.quantity = fd.quantity != null ? fd.quantity : '';
            row.seria = fd.seria != null ? fd.seria : '';
            row.uselessReason = fd.uselessReason != null ? fd.uselessReason : '';
            row.destructionMethod = fd.destructionMethod != null ? fd.destructionMethod : '';

            displayData.push(row);
        });
        return displayData;
    }


    createHeaderColumns(): any[] {
        return ['Agentul economic', 'Medicament', 'Cantitatea', 'Cauza inutilitatii', 'Seria medicament', 'Metoda de distrugere'];
    }

    populateDataForXLSXDocument(arr: any[][]): any[] {
        const displayData: any[] = this.getDisplayData();
        if (displayData) {
            for (let i = 0; i < displayData.length; i++) {
                const arrIntern: any[] = new Array<any>();
                arrIntern[0] = displayData[i].agentEconomic;
                arrIntern[1] = displayData[i].medicamentName;
                arrIntern[2] = displayData[i].quantity;
                arrIntern[3] = displayData[i].seria;
                arrIntern[4] = displayData[i].uselessReason;
                arrIntern[5] = displayData[i].destructionMethod;
                arr.push(arrIntern);
            }
        }

        return arr;
    }

    openDetails(annihilationId: number) {
        const dialogRef2 = this.dialogLicense.open(AnnihilationDetailsComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
                annihilationId: annihilationId,
            },
            hasBackdrop: true
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                //do nothing
            }
        });
    }


    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
