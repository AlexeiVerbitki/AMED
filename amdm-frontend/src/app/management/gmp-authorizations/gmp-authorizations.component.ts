import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {AdministrationService} from '../../shared/service/administration.service';
import {GDPService} from '../../shared/service/gdp.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-gmp-authorizations',
    templateUrl: './gmp-authorizations.component.html',
    styleUrls: ['./gmp-authorizations.component.css']
})
export class GmpAuthorizationsComponent implements OnInit, AfterViewInit, OnDestroy {

    mForm: FormGroup;
    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();
    private subscriptions: Subscription[] = [];
    displayedColumns: any[] = ['company', 'authorizationNumber', 'authorizationIssuedDate', 'authorizationExpirationDate', 'statusAuthorization', 'certifictionNumber',
        'certifictionIssuedDate', 'certificationExpiredDate', 'statusCertificate', 'authorizationPath', 'certificatePath'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService,
                private navbarTitleService: NavbarTitleService,
                private uploadService: UploadFileService,
                private gmpService: GDPService) {
        this.mForm = fb.group({
            'requestNumber': [null],
            'authorizationNumber': [null],
            'authorizationStartDateFrom': [null],
            'authorizationStartDateTo': [null],
            'company': [null],
            'certificateNumber': [null],
            'certificateStartDateFrom': [null],
            'certificateEndDateTo': [null],
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Autorizatii pe pagina: ';
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Cautare autorizatii/certificate GMP');

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

    showGMPAuthorization() {
    }

    clear() {
        this.mForm.reset();
    }

    getAuthorisations() {
        const dto = this.mForm.value;
        this.subscriptions.push(
            this.gmpService.getAuthorisationsByFilter(dto
            ).subscribe(request => {
                    this.dataSource.data = request.body;
                },
                error => console.log(error)
            ));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    loadFile(path: string) {
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(data => {
                this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
            },

            error => {
                console.log(error);
            }
            )
        );
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }

    getStatusAuthorization(status, date) {
        if (new Date(date) < new Date()) {
            return 'Expirata';
        } else if (status == 'A') {
            return 'Activa';
        } else if (status == 'S') {
            return 'Suspendata';
        } else if (status == 'R') {
            return 'Retrasa';
        }
    }

    getStatusCertificate(status, date) {
        if (new Date(date) < new Date()) {
            return 'Expirat';
        } else if (status == 'A') {
            return 'Activ';
        } else if (status == 'S') {
            return 'Suspendat';
        } else if (status == 'R') {
            return 'Retras';
        }
    }
}


