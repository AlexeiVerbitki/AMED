import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from "../../../models/document";
import {Observable, of, Subject, Subscription} from "rxjs";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {Router} from "@angular/router";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {catchError, debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {LocalityService} from "../../../shared/service/locality.service";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {AddEcAgentComponent} from "../../../administration/economic-agent/add-ec-agent/add-ec-agent.component";

@Component({
    selector: 'app-reg-med-cerere-lic',
    templateUrl: './reg-med-cerere-lic.component.html',
    styleUrls: ['./reg-med-cerere-lic.component.css']
})
export class RegMedCerereLicComponent implements OnInit, OnDestroy {

    companii: Observable<any[]>;
    loadingCompany: boolean = false;
    companyInputs = new Subject<string>();

    docs: Document [] = [];
    tipCerere: string;

    private subscriptions: Subscription[] = [];
    rFormSubbmitted: boolean = false;
    companyLicenseNotFound = false;
    oldLicense: any;
    docTypeIdentifier: any;

    maxDate = new Date();

    //count time
    startDate: Date;
    endDate: Date;

    //Validations
    mForm: FormGroup;
    rForm: FormGroup;

    constructor(private router: Router,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                private licenseService: LicenseService,
                private localityService: LocalityService,
                public dialog: MatDialog,
                private authService: AuthService,
                private errorHandlerService: ErrorHandlerService,
                private navbarTitleService: NavbarTitleService) {

    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrare cerere');
        this.startDate = new Date();

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
                        tap(() => this.loadingCompany = false),
                        catchError(() => {
                            this.loadingCompany = false;
                            return of([]);
                            ;
                        })
                    )
                )
            );

        this.initFormData();

        this.onChanges();
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'compGet': [null, Validators.required],
            'adresa': [{value: null, disabled: true}],
            'idno': [{value: null, disabled: true}],
            'telefonContact': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'emailContact': [null, Validators.email],
            'persResDepCereriiFirstname': [null, Validators.required],
            'persResDepCereriiLastname': [null, Validators.required],
            'nrProcurii1': [null],
            'dataProcurii1': [{value: null, disabled: true}],
            'seria': [{value: null, disabled: true}],
            'nrLic': [{value: null, disabled: true}],
            'dataEliberariiLic': [{value: null, disabled: true}],
            'dataExpirariiLic': [{value: null, disabled: true}],
            'reasonSuspension': '',
            'reasonCancel': '',

        });


        this.mForm = this.fb.group({
            'tipCerere': [{value: null}],
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataCerere': [{value: null, disabled: true}]


        });

        this.mForm.get('dataCerere').setValue(new Date());
    }

    submitNew() {
        this.rFormSubbmitted = true;

        if (!this.mForm.valid || !this.rForm.valid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        if (this.tipCerere === 'LICEL' && this.oldLicense) {
            this.errorHandlerService.showError('Acest agent economic deja are o licenta activa.');
            return;
        }
        else if (this.tipCerere !== 'LICEL' && this.companyLicenseNotFound) {
            this.errorHandlerService.showError('Acest agent economic nu are o licenta activa.');
            return;
        }

        this.endDate = new Date();

        this.rFormSubbmitted = false;

        let modelToSubmit: any = {};
        let licenseModel: any = {};
        let licenseDetail: any = {};
        let mandatedContact: any = {};
        let licenseMandatedContacts: any[] = [];


        mandatedContact.requestPersonFirstname = this.rForm.get('persResDepCereriiFirstname').value;
        mandatedContact.requestPersonLastname = this.rForm.get('persResDepCereriiLastname').value;
        mandatedContact.requestMandateNr = this.rForm.get('nrProcurii1').value;
        mandatedContact.requestMandateDate = this.rForm.get('dataProcurii1').value;
        mandatedContact.phoneNumber = this.rForm.get('telefonContact').value;
        mandatedContact.email = this.rForm.get('emailContact').value;
        licenseMandatedContacts.push(mandatedContact);
        licenseDetail.licenseMandatedContacts = licenseMandatedContacts;

        licenseDetail.documents = this.docs;

        if (this.tipCerere !== 'LICEL') {
            licenseModel.id = this.oldLicense.id;
        }

        if (this.tipCerere === 'LICS') {
            licenseModel.reason = this.rForm.get('reasonSuspension').value;
        }
        if (this.tipCerere === 'LICA') {
            licenseModel.reason = this.rForm.get('reasonCancel').value;
        }

        licenseModel.detail = licenseDetail;
        licenseModel.idno = this.rForm.get('idno').value;
        modelToSubmit.license = licenseModel;
        modelToSubmit.requestNumber = this.mForm.get('nrCererii').value;
        // modelToSubmit.company = {id: this.rForm.get('compGet').value.id};


        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'R'
        }];

        modelToSubmit.currentStep = 'E';
        modelToSubmit.startDate = this.startDate;
        modelToSubmit.initiator = this.authService.getUserName();
        modelToSubmit.assignedUser = this.authService.getUserName();

        if (this.tipCerere === 'LICEL') {
            this.subscriptions.push(
                this.licenseService.confirmRegisterLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICM') {
            this.subscriptions.push(
                this.licenseService.confirmModifyLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICD') {
            this.subscriptions.push(
                this.licenseService.confirmDuplicateLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICP') {
            this.subscriptions.push(
                this.licenseService.confirmPrelungireLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICA') {
            this.subscriptions.push(
                this.licenseService.confirmAnulareLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICS') {
            this.subscriptions.push(
                this.licenseService.confirmSuspendareLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICRL') {
            this.subscriptions.push(
                this.licenseService.confirmReluareLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICC') {
            this.subscriptions.push(
                this.licenseService.confirmCesionareLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }

    }

    onChanges(): void {
        this.mForm.get('tipCerere').valueChanges.subscribe(val => {
            //Already set up
            if (this.tipCerere && this.tipCerere !== val) {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        message: 'Sunteti sigur ca doriti sa schimbati optiunea? Datele colectate vor fi pierdute.',
                        confirm: false
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.tipCerere = val;
                        this.updateReasonValidation(this.tipCerere);
                        this.subscriptions.push(
                            this.administrationService.generateDocNr().subscribe(data => {
                                    this.mForm.get('nrCererii').setValue(data);
                                    this.rForm.reset();
                                    this.docTypeIdentifier = {code: this.tipCerere, step: 'R'};
                                }
                            )
                        );
                    }
                    else {
                        this.mForm.get('tipCerere').setValue(this.tipCerere);
                    }
                });
            }
            else if (this.tipCerere !== val) {
                this.tipCerere = val;
                this.updateReasonValidation(this.tipCerere);
                this.subscriptions.push(
                    this.administrationService.generateDocNr().subscribe(data => {
                            this.mForm.get('nrCererii').setValue(data);
                            this.docTypeIdentifier = {code: this.tipCerere, step: 'R'};
                        }
                    )
                );
            }


        });

        this.rForm.get('compGet').valueChanges.subscribe(val => {
            this.oldLicense = null;
            if (val) {
                this.rForm.get('idno').setValue(val.idno);
                this.rForm.get('adresa').setValue(val.legal_Address);

                this.companyLicenseNotFound = false;
                if (this.tipCerere !== 'LICRL') {
                    this.subscriptions.push(
                        this.licenseService.retrieveLicenseByIdno(val.idno).subscribe(data => {
                                if (data) {
                                    this.oldLicense = data;
                                    this.rForm.get('seria').setValue(data.serialNr);
                                    this.rForm.get('nrLic').setValue(data.nr);
                                    this.rForm.get('dataEliberariiLic').setValue(new Date(data.releaseDate));
                                    this.rForm.get('dataExpirariiLic').setValue(new Date(data.expirationDate));
                                }
                                else {
                                    this.companyLicenseNotFound = true;
                                    this.resetAgentDetails();
                                }
                            }
                        )
                    );
                }
                else {
                    this.subscriptions.push(
                        this.licenseService.retrieveSuspendedLicenseByIdno(val.idno).subscribe(data => {
                                if (data) {
                                    this.oldLicense = data;
                                    this.rForm.get('seria').setValue(data.serialNr);
                                    this.rForm.get('nrLic').setValue(data.nr);
                                    this.rForm.get('dataEliberariiLic').setValue(new Date(data.releaseDate));
                                    this.rForm.get('dataExpirariiLic').setValue(new Date(data.expirationDate));
                                }
                                else {
                                    this.companyLicenseNotFound = true;
                                    this.resetAgentDetails();
                                }
                            }
                        )
                    );
                }


            }
            else {
                this.rForm.get('adresa').setValue(null);
                this.rForm.get('idno').setValue(null);
                if (this.tipCerere !== 'LICEL') {
                    this.resetAgentDetails();
                }
            }

        });
    }

    private updateReasonValidation(tipCerere : string) {
        if (tipCerere === 'LICS')
        {
            this.rForm.get('reasonSuspension').setValidators(Validators.required);
            this.rForm.get('reasonSuspension').updateValueAndValidity();
        }
        else if (tipCerere === 'LICA')
        {
            this.rForm.get('reasonCancel').setValidators(Validators.required);
            this.rForm.get('reasonCancel').updateValueAndValidity();
        }
        else {
            this.rForm.get('reasonSuspension').setValidators(null);
            this.rForm.get('reasonSuspension').updateValueAndValidity();
            this.rForm.get('reasonCancel').setValidators(null);
            this.rForm.get('reasonCancel').updateValueAndValidity();
        }

    }

    private resetAgentDetails() {
        this.rForm.get('seria').setValue(null);
        this.rForm.get('nrLic').setValue(null);
        this.rForm.get('dataEliberariiLic').setValue(null);
        this.rForm.get('dataExpirariiLic').setValue(null);
    }

    newAgent()
    {
        const dialogRef2 = this.dialog.open(AddEcAgentComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result && result.success) {
                //Do nothing
            }
        });
    }






    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
