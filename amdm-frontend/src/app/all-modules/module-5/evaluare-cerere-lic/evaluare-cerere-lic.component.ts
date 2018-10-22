import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
    selector: 'app-evaluare-cerere-lic',
    templateUrl: './evaluare-cerere-lic.component.html',
    styleUrls: ['./evaluare-cerere-lic.component.css']
})
export class EvaluareCerereLicComponent implements OnInit, OnDestroy {

    modelToSubmit: any = {};
    docs: Document [] = [];
    tipCerere: string;
    requestId: string;
    states: any[];
    localities: any[];
    objAddresses: any[] = [];
    announces: any[];

    CPCDId: string;
    ASPId: string;

    mFormSubbmitted : boolean = false;
    rFormSubbmitted : boolean = false;
    oFormSubbmitted : boolean = false;

    private subscriptions: Subscription[] = [];

    //Validations
    mForm: FormGroup;
    rForm: FormGroup;
    oForm: FormGroup;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                private licenseService: LicenseService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.initFormData();

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];

                this.subscriptions.push(
                    this.licenseService.retrieveLicenseByRequestId(this.requestId).subscribe(data => {
                            console.log('inome', data);
                            this.patchData(data);

                            this.subscriptions.push(
                                this.administrationService.getAllStates().subscribe(data => {
                                        console.log('all states', data);
                                        this.states = data;
                                    },
                                    error => console.log(error)
                                )
                            );
                        },
                        error => console.log(error)
                    )
                );

                this.subscriptions.push(
                    this.licenseService.loadAnnounces().subscribe(data => {
                            this.announces = data;
                        },
                        error => console.log(error)
                    )
                );

            }
            else {
                return;
            }
        }));
        this.onChanges();
    }


    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataEliberarii').patchValue(new Date(data.startDate));

        this.rForm.get('farmDir').patchValue(data.license.resolution.pharmacyMaster);

        this.rForm.get('decizieLuata').patchValue(data.license.resolution.resolution);
        this.rForm.get('decisionDate').patchValue(data.license.resolution.date);
        this.rForm.get('argumentDec').patchValue(data.license.resolution.reason);

        this.rForm.get('seriaLic').patchValue(data.license.serialNr);
        this.rForm.get('nrLic').patchValue(data.license.nr);
        this.rForm.get('tax').patchValue(data.license.tax);
        this.rForm.get('taxPaid').patchValue(data.license.taxPaid);

        this.objAddresses = data.license.addresses;
        this.tipCerere = data.type.code;
        this.docs = data.license.documents;
        this.docs.forEach(doc => doc.isOld = true);


        if (data.license.commisionResponses.length > 0)
        {
            data.license.commisionResponses.forEach(csr => {
                if (csr.organization === 'CPCD')
                {
                    this.CPCDId = csr.id;
                    this.rForm.get('CPCDNrdeintrare').patchValue(csr.entryRspNumber);
                    this.rForm.get('CPCDDate').patchValue(csr.date);
                    this.rForm.get('CPCDMethod').patchValue(csr.announcedMethods);
                    if (csr.announcedMethods.code === 'email')
                    {
                        this.rForm.get('CPCDEmail').patchValue(csr.extraData);
                    }
                    else {
                        this.rForm.get('CPCDPhone').patchValue(csr.extraData);
                    }
                }
                if (csr.organization === 'ASP')
                {
                    this.ASPId = csr.id;
                    this.rForm.get('ASPNrdeintrare').patchValue(csr.entryRspNumber);
                    this.rForm.get('ASPDate').patchValue(csr.date);
                    this.rForm.get('ASPMethod').patchValue(csr.announcedMethods);
                    if (csr.announcedMethods.code === 'email')
                    {
                        this.rForm.get('ASPEmail').patchValue(csr.extraData);
                    }
                    else {
                        this.rForm.get('ASPPhone').patchValue(csr.extraData);
                    }
                }
            })
        }
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'farmDir': [null, Validators.required],
            'decizieLuata': [null, Validators.required],
            'decisionDate': [null, Validators.required],
            'seriaLic': [null, Validators.required],
            'nrLic': [null, Validators.required],
            'tax': [null, Validators.required],
            'taxPaid': '',
            'argumentDec': '',
            'releaseDate': '',
            'dataSistarii': '',
            'motivulSistarii': '',
            'CPCDDate': '',
            'CPCDMethod': '',
            'CPCDEmail': '',
            'CPCDPhone': '',
            'ASPDate': '',
            'ASPMethod': '',
            'ASPEmail': '',
            'ASPPhone': '',
            'CPCDNrdeintrare': '',
            'ASPNrdeintrare': '',
            'MandatedReleaseName': '',
            'MandatedReleaseNr': '',
            'MandatedReleaseDate': '',

        });


        this.mForm = this.fb.group({
            'tipCerere': [{value: null}],
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataEliberarii': [{value: null, disabled: true}]


        });


        this.oForm = this.fb.group({
            'tipIntreprindere': ['', Validators.required],
            'region': [null, Validators.required],
            'locality': [null, Validators.required],
            'street': '',
            'blocul': ''
        });
    }

    onChanges(): void {
        this.oForm.get('region').valueChanges.subscribe(val => {
            if (this.oForm.get('region') && this.oForm.get('region').value) {
                console.log('region',this.oForm.get('region'));
                this.subscriptions.push(
                    this.administrationService.getLocalitiesByState(this.oForm.get('region').value.id).subscribe(data => {
                            this.localities = data;
                            // this.rForm.get('locality').setValue(data);
                        },
                        error => console.log(error)
                    )
                );
            }
        });
    }

    addNewObjAddres() {
        this.oFormSubbmitted = true;
        if (this.objAddresses == null) {
            this.objAddresses = [];
        }

        if (!this.oForm.valid)
        {
            return;
        }

        this.oFormSubbmitted = false;

        this.objAddresses.push(
            {
                companyType: this.oForm.get('tipIntreprindere').value,
                locality : this.oForm.get('locality').value,
                state: this.oForm.get('region').value,
                street: this.oForm.get('street').value,
                building: this.oForm.get('blocul').value
            }
        );

        this.oForm.get('tipIntreprindere').setValue(null);
        this.oForm.get('locality').setValue(null);
        this.oForm.get('region').setValue(null);
        this.oForm.get('street').setValue(null);
        this.oForm.get('blocul').setValue(null);

    }


    removeDocument(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta inregistrare?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.objAddresses.splice(index,1);
            }
        });
    }


    submit()
    {
        this.rFormSubbmitted = true;
        if (!this.rForm.valid || this.docs.length==0 || this.objAddresses.length == 0)
        {
            return;
        }

        this.rFormSubbmitted = false;


        let modelToSubmit : any = {};
        let licenseModel : any = {};
        let resolution : any = {};
        let commisionResponses : any[] = [];

        modelToSubmit.id = this.requestId;

        licenseModel.documents = this.docs;

        resolution.resolution = this.rForm.get('decizieLuata').value;
        resolution.date = this.rForm.get('decisionDate').value;
        resolution.reason = this.rForm.get('argumentDec').value;
        resolution.pharmacyMaster = this.rForm.get('farmDir').value;

        licenseModel.resolution = resolution;
        licenseModel.serialNr = this.rForm.get('seriaLic').value;
        licenseModel.nr = this.rForm.get('nrLic').value;
        licenseModel.tax = this.rForm.get('tax').value;
        if (this.rForm.get('taxPaid').value === true)
        {
            licenseModel.taxPaid = 1;
        }

        licenseModel.addresses = this.objAddresses;


        if (this.rForm.get('CPCDNrdeintrare').value)
        {
            let extraData : any;
            if (this.rForm.get('CPCDMethod').value.code === 'email')
            {
                extraData =  this.rForm.get('CPCDEmail').value;
            }
            else{
                extraData =  this.rForm.get('CPCDPhone').value;
            }
            commisionResponses.push({
                id: this.CPCDId,
                date: this.rForm.get('CPCDDate').value,
                entryRspNumber: this.rForm.get('CPCDNrdeintrare').value,
                organization : 'CPCD',
                announcedMethods : this.rForm.get('CPCDMethod').value,
                extraData : extraData
            });
        }
        if (this.rForm.get('ASPNrdeintrare').value)
        {
            let extraData : any;
            if (this.rForm.get('ASPMethod').value.code === 'email')
            {
                extraData =  this.rForm.get('ASPEmail').value;
            }
            else{
                extraData =  this.rForm.get('ASPPhone').value;
            }
            commisionResponses.push({
                id: this.ASPId,
                date: this.rForm.get('ASPDate').value,
                entryRspNumber: this.rForm.get('ASPNrdeintrare').value,
                organization : 'ASP',
                announcedMethods : this.rForm.get('ASPMethod').value,
                extraData : extraData
            });
        }


        licenseModel.commisionResponses = commisionResponses;

        modelToSubmit.license = licenseModel;
        console.log( licenseModel);


        this.subscriptions.push(
            this.licenseService.saveEvaluateLicense(modelToSubmit).subscribe(data => {
                    // console.log('succes');
                    // let result = data.body;
                    this.router.navigate(['/dashboard/module']);
                },
                error => console.log(error)
            )
        );

    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
