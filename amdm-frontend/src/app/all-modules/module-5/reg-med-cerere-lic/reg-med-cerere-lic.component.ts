import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {Router} from "@angular/router";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";

@Component({
    selector: 'app-reg-med-cerere-lic',
    templateUrl: './reg-med-cerere-lic.component.html',
    styleUrls: ['./reg-med-cerere-lic.component.css']
})
export class RegMedCerereLicComponent implements OnInit, OnDestroy {

    companii: any[];
    docs: Document [] = [];
    tipCerere: string;

    private subscriptions: Subscription[] = [];
    rFormSubbmitted: boolean = false;
    companyLicenseNotFound = false;
    oldLicense : any;

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
                public dialog: MatDialog,
                private authService: AuthService) {

    }

    ngOnInit() {
        this.startDate = new Date();
        this.subscriptions.push(
            this.administrationService.getAllCompanies().subscribe(data => {
                    this.companii = data;
                }
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
            'telefonContact': [null, Validators.required],
            'emailContact': '',
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
            'dataEliberarii': [{value: null, disabled: true}]


        });

        this.mForm.get('dataEliberarii').setValue(new Date());
    }

    submitNew() {
        this.rFormSubbmitted = true;

        if (!this.mForm.valid || !this.rForm.valid || this.docs.length == 0) {
            return;
        }

        if ((this.tipCerere === 'LICM' || this.tipCerere === 'LICD') && this.companyLicenseNotFound === true)
        {
            return;
        }

        this.endDate = new Date();

        this.rFormSubbmitted = false;

        let modelToSubmit: any = {};
        let licenseModel: any = {};
        let mandatedContact: any = {};
        let licenseMandatedContacts: any[] = [];
        licenseModel.releaseDate = this.mForm.get('dataEliberarii').value;


        mandatedContact.requestPersonFirstname = this.rForm.get('persResDepCereriiFirstname').value;
        mandatedContact.requestPersonLastname = this.rForm.get('persResDepCereriiLastname').value;
        mandatedContact.requestMandateNr = this.rForm.get('nrProcurii1').value;
        mandatedContact.requestMandateDate = this.rForm.get('dataProcurii1').value;
        mandatedContact.phoneNumber = this.rForm.get('telefonContact').value;
        mandatedContact.email = this.rForm.get('emailContact').value;
        licenseMandatedContacts.push(mandatedContact);
        licenseModel.licenseMandatedContacts = licenseMandatedContacts;

        licenseModel.documents = this.docs;

        if (this.tipCerere === 'LICM' || this.tipCerere === 'LICD')
        {
            licenseModel.id = this.oldLicense.id;
        }

        modelToSubmit.license = licenseModel;
        modelToSubmit.requestNumber = this.mForm.get('nrCererii').value;
        modelToSubmit.company = {id : this.rForm.get('compGet').value.id};


        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'R'
        }];

        modelToSubmit.currentStep = 'E';
        modelToSubmit.startDate = this.startDate;

        console.log('mdl', modelToSubmit);

        if (this.tipCerere === 'LICEL')
        {
            this.subscriptions.push(
                this.licenseService.confirmRegisterLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICM')
        {
            this.subscriptions.push(
                this.licenseService.confirmModifyLicense(modelToSubmit).subscribe(data => {
                        let result = data.body;
                        this.router.navigate(['/dashboard/module/license/evaluate', result]);
                    }
                )
            );
        }
        else if (this.tipCerere === 'LICD')
        {
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
            if (val) {
                this.rForm.get('adresa').setValue(val.legalAddress);
                this.rForm.get('idno').setValue(val.idno);

                if (this.tipCerere === 'LICM' || this.tipCerere === 'LICD')
                {
                    this.companyLicenseNotFound = false;
                    this.subscriptions.push(
                        this.licenseService.retrieveLicenseByEconomicAgentId(val.id).subscribe(data => {
                                this.oldLicense = data;
                                this.rForm.get('seria').setValue(data.serialNr);
                                this.rForm.get('nrLic').setValue(data.nr);
                                this.rForm.get('dataEliberariiLic').setValue(data.releaseDate);
                            },
                            error => {
                                this.companyLicenseNotFound = true;
                                this.rForm.get('seria').setValue(null);
                                this.rForm.get('nrLic').setValue(null);
                                this.rForm.get('dataEliberariiLic').setValue(null);
                                this.docs = null;
                            }
                        )
                    );

                }
            }
            else {
                this.rForm.get('adresa').setValue(null);
                this.rForm.get('idno').setValue(null);
                if (this.tipCerere === 'LICM' || this.tipCerere === 'LICD')
                {
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
