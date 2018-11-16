import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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

@Component({
    selector: 'app-reg-med-cerere-lic',
    templateUrl: './reg-med-cerere-lic.component.html',
    styleUrls: ['./reg-med-cerere-lic.component.css']
})
export class RegMedCerereLicComponent implements OnInit, OnDestroy {

    companii: Observable<any[]>;
    loadingCompany : boolean = false;
    companyInputs = new Subject<string>();

    docs: Document [] = [];
    tipCerere: string;

    private subscriptions: Subscription[] = [];
    rFormSubbmitted: boolean = false;
    companyLicenseNotFound = false;
    oldLicense: any;

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
                private errorHandlerService: ErrorHandlerService) {

    }

    ngOnInit() {
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

                    this.administrationService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false),
                        catchError( () => {
                            this.loadingCompany = false;
                            return of([]);;
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
            'telefonContact': [null, [Validators.required, Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'emailContact': [null, Validators.email],
            'persResDepCereriiFirstname': [null, Validators.required],
            'persResDepCereriiLastname': [null, Validators.required],
            'nrProcurii1': [null, Validators.required],
            'dataProcurii1': [null, Validators.required],
            'seria': [{value: null, disabled: true}],
            'nrLic': [{value: null, disabled: true}],
            'dataEliberariiLic': [{value: null, disabled: true}],

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
            return;
        }

        if (this.tipCerere === 'LICEL' && this.oldLicense) {
            return;
        }
        else if ((this.tipCerere === 'LICM' || this.tipCerere === 'LICD') && this.companyLicenseNotFound) {
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

        if (this.tipCerere === 'LICM' || this.tipCerere === 'LICD') {
            licenseModel.id = this.oldLicense.id;
        }

        licenseModel.detail = licenseDetail;
        modelToSubmit.license = licenseModel;
        modelToSubmit.requestNumber = this.mForm.get('nrCererii').value;
        modelToSubmit.company = {id: this.rForm.get('compGet').value.id};


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

        console.log('mdl', modelToSubmit);

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
                        this.subscriptions.push(
                            this.administrationService.generateDocNr().subscribe(data => {
                                    this.mForm.get('nrCererii').setValue(data);
                                    this.rForm.reset();
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
                this.subscriptions.push(
                    this.administrationService.generateDocNr().subscribe(data => {
                            this.mForm.get('nrCererii').setValue(data);
                        }
                    )
                );
            }
        });

        this.rForm.get('compGet').valueChanges.subscribe(val => {
            this.oldLicense = null;
            if (val) {
                this.rForm.get('idno').setValue(val.idno);
                if (val.locality)
                {
                    this.subscriptions.push(this.localityService.loadLocalityDetails(val.locality.id).subscribe(data =>
                        {
                            console.log('sfsd', data);
                            let addres = data.stateName + ' ,' + data.description + ' ,' + val.street;
                            this.rForm.get('adresa').setValue(addres);

                        }
                    ));
                }

                this.companyLicenseNotFound = false;
                this.subscriptions.push(
                    this.licenseService.retrieveLicenseByEconomicAgentId(val.id).subscribe(data => {
                            if (data) {
                                console.log('sdfs', data);
                                this.oldLicense = data;
                                this.rForm.get('seria').setValue(data.serialNr);
                                this.rForm.get('nrLic').setValue(data.nr);
                                this.rForm.get('dataEliberariiLic').setValue(new Date(data.releaseDate));
                            }
                            else {
                                this.companyLicenseNotFound = true;
                                this.rForm.get('seria').setValue(null);
                                this.rForm.get('nrLic').setValue(null);
                                this.rForm.get('dataEliberariiLic').setValue(null);
                            }
                        }
                    )
                );


            }
            else {
                this.rForm.get('adresa').setValue(null);
                this.rForm.get('idno').setValue(null);
                if (this.tipCerere === 'LICM' || this.tipCerere === 'LICD') {
                    this.rForm.get('seria').setValue(null);
                    this.rForm.get('nrLic').setValue(null);
                    this.rForm.get('dataEliberariiLic').setValue(null);
                }
            }

        });
    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
