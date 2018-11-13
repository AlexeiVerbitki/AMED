import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {LoaderService} from "../../../shared/service/loader.service";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
    selector: 'app-evaluare-cerere-lic',
    templateUrl: './evaluare-cerere-lic.component.html',
    styleUrls: ['./evaluare-cerere-lic.component.css']
})
export class EvaluareCerereLicComponent implements OnInit, OnDestroy {

    docs: Document [] = [];
    tipCerere: string;
    requestId: string;
    states: any[];
    localities: any[];
    objAddresses: any[] = [];
    announces: any[];
    oldData: any;
    activities: any[];

    farmacisti: any[] = [];

    outDocuments: any[] = [];

    CPCDId: string;
    ASPId: string;

    rFormSubbmitted: boolean = false;
    oFormSubbmitted: boolean = false;

    nextSubmit: boolean = false;

    private subscriptions: Subscription[] = [];

    //count time
    startDate: Date;
    endDate: Date;


    paymentTotal: number;
    paymentOrdersList: PaymentOrder[] = [];
    receiptsList: Receipt[] = [];

    //Validations
    mForm: FormGroup;
    rForm: FormGroup;
    backupForm: FormGroup;
    oForm: FormGroup;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                private licenseService: LicenseService,
                public dialog: MatDialog,
                private  authService: AuthService,
                private loadingService: LoaderService,
                private documentService: DocumentService) {

    }

    ngOnInit() {
        this.startDate = new Date();
        this.initFormData();

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];

                this.subscriptions.push(
                    this.licenseService.retrieveLicenseByRequestId(this.requestId).subscribe(data => {
                            this.oldData = data;
                            this.patchData(data);

                            this.subscriptions.push(
                                this.administrationService.getAllStates().subscribe(data => {
                                        this.states = data;
                                    }
                                )
                            );

                            this.subscriptions.push(
                                this.licenseService.loadActivities().subscribe(data => {
                                        this.activities = data;
                                    }
                                )
                            );


                        }
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

        if (data.license.resolution) {
            this.rForm.get('decizieLuata').patchValue(data.license.resolution.resolution);
            this.rForm.get('decisionDate').patchValue(data.license.resolution.date);
            this.rForm.get('argumentDec').patchValue(data.license.resolution.reason);
        }


        this.rForm.get('seriaLic').patchValue(data.license.serialNr);
        this.rForm.get('nrLic').patchValue(data.license.nr);

        this.objAddresses = data.license.addresses;
        this.tipCerere = data.type.code;
        this.docs = data.license.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.rForm.get('licenseActivities').patchValue(data.license.activities);

        this.rForm.get('farmDir').patchValue(data.license.selectedPharmaceutist);

        this.farmacisti  =  data.license.agentPharmaceutist;

        if (data.license.commisionResponses && data.license.commisionResponses.length > 0) {
            data.license.commisionResponses.forEach(csr => {
                if (csr.organization === 'CPCD') {
                    this.CPCDId = csr.id;
                    this.rForm.get('CPCDNrdeintrare').patchValue(csr.entryRspNumber);
                    this.rForm.get('CPCDDate').patchValue(csr.date);
                    this.rForm.get('CPCDMethod').patchValue(csr.announcedMethods);
                    if (csr.announcedMethods.code === 'email') {
                        this.rForm.get('CPCDEmail').patchValue(csr.extraData);
                    }
                    else {
                        this.rForm.get('CPCDPhone').patchValue(csr.extraData);
                    }
                }
                if (csr.organization === 'ASP') {
                    this.ASPId = csr.id;
                    this.rForm.get('ASPNrdeintrare').patchValue(csr.entryRspNumber);
                    this.rForm.get('ASPDate').patchValue(csr.date);
                    this.rForm.get('ASPMethod').patchValue(csr.announcedMethods);
                    if (csr.announcedMethods.code === 'email') {
                        this.rForm.get('ASPEmail').patchValue(csr.extraData);
                    }
                    else {
                        this.rForm.get('ASPPhone').patchValue(csr.extraData);
                    }
                }
            })
        }

        if (this.tipCerere === 'LICD') {
            this.rForm.disable();
            this.oForm.disable();
        }

        if (this.tipCerere === 'LICM') {
            this.rForm.get('seriaLic').disable();
            this.rForm.get('nrLic').disable();
        }

        this.receiptsList = data.license.receipts;
        this.paymentOrdersList = data.license.paymentOrders;

        let xs2 = this.receiptsList;
        xs2 = xs2.map(x => {
            x.isOld = true;
            return x;
        });
        let xs3 = this.paymentOrdersList;
        xs3 = xs3.map(x => {
            x.isOld = true;
            return x;
        });


        this.refreshOutputDocuments();

        this.backupForm = this.rForm;
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'farmDir': [null, Validators.required],
            'decizieLuata': [null, Validators.required],
            'decisionDate': [null, Validators.required],
            'seriaLic': [null, Validators.required],
            'nrLic': [null, Validators.required],
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
            'licenseActivities': [null, Validators.required],

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
                console.log('region', this.oForm.get('region'));
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

        this.rForm.get('farmDir').valueChanges.subscribe(val => {
            if (val)
            {
                val.selectionDate = new Date();
                if (!this.farmacisti.includes(val))
                {
                    this.farmacisti.push(val);
                }
            }
        });
    }

    addNewObjAddres() {
        this.oFormSubbmitted = true;
        if (this.objAddresses == null) {
            this.objAddresses = [];
        }

        if (!this.oForm.valid) {
            return;
        }

        this.oFormSubbmitted = false;

        this.objAddresses.push(
            {
                companyType: this.oForm.get('tipIntreprindere').value,
                locality: this.oForm.get('locality').value,
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
                this.objAddresses.splice(index, 1);
            }
        });
    }


    submit() {
        this.rFormSubbmitted = true;
        this.nextSubmit = true;
        if (this.tipCerere !== 'LICD' && (!this.rForm.valid || this.docs.length == 0 || this.objAddresses.length == 0)) {
            return;
        }

        if (!this.checkAllDocumentsWasAttached())
        {
            return;
        }


        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('E');

        this.subscriptions.push(
            this.licenseService.saveEvaluateLicense(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
                }
            )
        );

    }

    submitNextStep() {
        this.rFormSubbmitted = true;
        this.nextSubmit = true;
        if (this.tipCerere !== 'LICD' && (!this.rForm.valid || this.docs.length == 0 || this.objAddresses.length == 0)) {
            return;
        }

        if (this.paymentTotal < 0) {
            return;
        }

        if (!this.checkAllDocumentsWasAttached())
        {
            return;
        }

        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('I');

        this.subscriptions.push(
            this.licenseService.evaluateNextLicense(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module/license/issue', this.requestId]);
                }
            )
        );

    }


    private composeModel(currentStep: string) {
        this.endDate = new Date();
        let modelToSubmit: any = {};
        let licenseModel: any = {};
        let resolution: any = {};
        let commisionResponses: any[] = [];

        modelToSubmit.id = this.requestId;

        licenseModel.documents = this.docs;

        resolution.resolution = this.rForm.get('decizieLuata').value;
        resolution.date = this.rForm.get('decisionDate').value;
        resolution.reason = this.rForm.get('argumentDec').value;
        // resolution.pharmacyMaster = this.rForm.get('farmDir').value;

        console.log('dfgd', this.farmacisti);

        licenseModel.agentPharmaceutist = this.farmacisti;


        licenseModel.resolution = resolution;
        licenseModel.serialNr = this.rForm.get('seriaLic').value;
        licenseModel.nr = this.rForm.get('nrLic').value;

        licenseModel.addresses = this.objAddresses;
        licenseModel.activities = this.rForm.get('licenseActivities').value;

        licenseModel.paymentOrders = this.paymentOrdersList;
        licenseModel.receipts = this.receiptsList;


        if (this.rForm.get('CPCDNrdeintrare').value) {
            let extraData: any;
            if (this.rForm.get('CPCDMethod').value.code === 'email') {
                extraData = this.rForm.get('CPCDEmail').value;
            }
            else {
                extraData = this.rForm.get('CPCDPhone').value;
            }
            commisionResponses.push({
                id: this.CPCDId,
                date: this.rForm.get('CPCDDate').value,
                entryRspNumber: this.rForm.get('CPCDNrdeintrare').value,
                organization: 'CPCD',
                announcedMethods: this.rForm.get('CPCDMethod').value,
                extraData: extraData
            });
        }
        if (this.rForm.get('ASPNrdeintrare').value) {
            let extraData: any;
            if (this.rForm.get('ASPMethod').value.code === 'email') {
                extraData = this.rForm.get('ASPEmail').value;
            }
            else {
                extraData = this.rForm.get('ASPPhone').value;
            }
            commisionResponses.push({
                id: this.ASPId,
                date: this.rForm.get('ASPDate').value,
                entryRspNumber: this.rForm.get('ASPNrdeintrare').value,
                organization: 'ASP',
                announcedMethods: this.rForm.get('ASPMethod').value,
                extraData: extraData
            });
        }

        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'E'
        }];

        modelToSubmit.currentStep = currentStep;

        modelToSubmit.assignedUser = this.authService.getUserName();

        licenseModel.commisionResponses = commisionResponses;


        modelToSubmit.license = licenseModel;

        return modelToSubmit;
    }

    closePage() {
        this.router.navigate(['/dashboard/module']);
    }

    cancelRequest() {
        this.endDate = new Date();
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa anulati aceasta cerere?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let modelToSubmit: any = {};
                modelToSubmit = this.oldData;
                modelToSubmit.requestHistories = [{
                    startDate: this.startDate,
                    endDate: this.endDate,
                    username: this.authService.getUserName(),
                    step: 'C'
                }];

                modelToSubmit.assignedUser = this.authService.getUserName();

                this.subscriptions.push(
                    this.licenseService.stopLicense(modelToSubmit).subscribe(data => {
                            this.router.navigate(['/dashboard/module']);
                        }
                    )
                );
            }
        });

    }

    addTagPromise(term: string) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ fullName: term, selectionDate: new Date(), insertionDate : new Date() });
            }, 500);


        });
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    private refreshOutputDocuments() {
        this.outDocuments = [];

        let outDocument = {
            name: 'Scrisoare de informare',
            number: 'NL-' + this.oldData.requestNumber,
            status: this.getOutputDocStatus()
        };

        this.outDocuments.push(outDocument);
    }


    documentAdded(event) {
        this.refreshOutputDocuments();
    }

    viewDoc(document: any) {
        this.loadingService.show();
        this.subscriptions.push(this.documentService.viewDD(document.number).subscribe(data => {
                let file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    checkAllDocumentsWasAttached(): boolean
    {
        return !this.outDocuments.find(od => od.status.mode === 'N');
    }

    getOutputDocStatus(): any
    {
        let result;
        result = this.docs.find( doc =>
        {
            if (doc.docType.category === 'NL' && doc.number === 'NL-' + this.oldData.requestNumber)
            {
                return true;
            }
        });
        if (result)
        {
            return {
                mode : 'A',
                description : 'Atasat'
            };
        }

        return {
            mode : 'N',
            description : 'Nu este atasat'
        };
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
