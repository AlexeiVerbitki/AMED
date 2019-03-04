import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {AdministrationService} from '../../shared/service/administration.service';
import {GDPService} from '../../shared/service/gdp.service';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {saveAs} from 'file-saver';
import {AddDescriptionComponent} from '../../dialog/add-description/add-description.component';
import {ViewCauseGmpComponent} from '../../dialog/view-cause-gmp/view-cause-gmp.component';

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
    // displayedColumns: any[] = ['company', 'authorizationNumber', 'authorizationIssuedDate', 'authorizationExpirationDate', 'statusAuthorization', 'certifictionNumber',
    //   'certifictionIssuedDate', 'certificationExpiredDate', 'statusCertificate', 'authorizationPath', 'certificatePath'];
    displayedColumns: any[] = ['company', 'docType', 'docNumber', 'docIssuedDate', 'docExpirationDate', 'status', 'path'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService,
                private navbarTitleService: NavbarTitleService,
                private uploadService: UploadFileService,
                private dialog: MatDialog,
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
            'checkCertificate': [null],
            'checkAutorizare': [null],
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

        this.mForm.get('authorizationNumber').disable();
        this.mForm.get('authorizationStartDateFrom').disable();
        this.mForm.get('authorizationStartDateTo').disable();
        this.mForm.get('certificateNumber').disable();
        this.mForm.get('certificateStartDateFrom').disable();
        this.mForm.get('certificateEndDateTo').disable();
    }

    showGMPAuthorization() {
    }

    clear() {
        this.mForm.reset();
    }

    getAuthorisations() {
        const dto = this.mForm.value;
        dto.searchAuthorizations = this.mForm.get('checkAutorizare').value;
        dto.searchCertificates = this.mForm.get('checkCertificate').value;
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

    checkCertificate(elem) {
        this.mForm.get('checkAutorizare').setValue(false);
        this.mForm.get('checkCertificate').setValue(elem.checked);
        this.mForm.get('authorizationNumber').disable();
        this.mForm.get('authorizationStartDateFrom').disable();
        this.mForm.get('authorizationStartDateTo').disable();
        this.mForm.get('authorizationNumber').setValue(null);
        this.mForm.get('authorizationStartDateFrom').setValue(null);
        this.mForm.get('authorizationStartDateTo').setValue(null);
        if (elem.checked) {
            this.mForm.get('certificateNumber').enable();
            this.mForm.get('certificateStartDateFrom').enable();
            this.mForm.get('certificateEndDateTo').enable();
        } else {
            this.mForm.get('certificateNumber').disable();
            this.mForm.get('certificateStartDateFrom').disable();
            this.mForm.get('certificateEndDateTo').disable();
            this.mForm.get('certificateNumber').setValue(null);
            this.mForm.get('certificateStartDateFrom').setValue(null);
            this.mForm.get('certificateEndDateTo').setValue(null);
        }
    }

    checkAutorizare(elem) {
        this.mForm.get('checkCertificate').setValue(false);
        this.mForm.get('checkAutorizare').setValue(elem.checked);
        this.mForm.get('certificateNumber').disable();
        this.mForm.get('certificateStartDateFrom').disable();
        this.mForm.get('certificateEndDateTo').disable();
        this.mForm.get('certificateNumber').setValue(null);
        this.mForm.get('certificateStartDateFrom').setValue(null);
        this.mForm.get('certificateEndDateTo').setValue(null);
        if (elem.checked) {
            this.mForm.get('authorizationNumber').enable();
            this.mForm.get('authorizationStartDateFrom').enable();
            this.mForm.get('authorizationStartDateTo').enable();
        } else {
            this.mForm.get('authorizationNumber').setValue(null);
            this.mForm.get('authorizationStartDateFrom').setValue(null);
            this.mForm.get('authorizationStartDateTo').setValue(null);
            this.mForm.get('authorizationNumber').disable();
            this.mForm.get('authorizationStartDateFrom').disable();
            this.mForm.get('authorizationStartDateTo').disable();
        }
    }

    showCause(cause) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
           cause : cause
        };

        this.dialog.open(ViewCauseGmpComponent, dialogConfig2);
    }
}


