import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {LicenseService} from "../../../shared/service/license/license.service";
import {LicenseDetailsComponent} from "../license-details/license-details.component";
import {NavbarTitleService} from 'src/app/shared/service/navbar-title.service';

@Component({
    selector: 'app-license-management',
    templateUrl: './license-management.component.html',
    styleUrls: ['./license-management.component.css']
})
export class LicenseManagementComponent implements OnInit, OnDestroy {

    companii: Observable<any[]>;
    loadingCompany: boolean = false;
    companyInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];
    visibility: boolean = false;


    //Datasource table
    displayedColumns: any[] = ['agentEconomic', 'numar', 'seria', 'releaseDate', 'expirationDate', 'status'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    rFormSubbmitted: boolean = false;
    rForm: FormGroup;


    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService,
                private licenseService: LicenseService,
		private navbarTitleService: NavbarTitleService,
                public dialogLicense: MatDialog)
    {
    }

    ngOnInit() {
	this.navbarTitleService.showTitleMsg('Gestionare Licente');


        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
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
        this.dataSource.paginator._intl.itemsPerPageLabel = "Licente per pagina: ";
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
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    findLicente()
    {
        let filter  = this.rForm.value;
        if (this.rForm.get('ecAgent').value)
        {
            filter.idno = this.rForm.get('ecAgent').value.idno;
        }

        console.log('filter', filter);
        this.subscriptions.push(this.licenseService.loadLicenseListByFilter(filter).subscribe(data => {
            console.log('sfsd', data);
            this.dataSource.data = data;
        }))
    }

    openLicenseDetails(licenseId: number)
    {
        console.log("sfsd", licenseId);
        const dialogRef2 = this.dialogLicense.open(LicenseDetailsComponent, {
            width: '1000px',
            data: {
                licenseId: licenseId,
            },
            hasBackdrop: false
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
