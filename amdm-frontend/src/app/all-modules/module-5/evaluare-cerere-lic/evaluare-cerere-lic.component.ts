import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {Document} from '../../../models/document';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {LicenseService} from '../../../shared/service/license/license.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {DocumentService} from '../../../shared/service/document.service';
import {LocalityService} from '../../../shared/service/locality.service';
import {LicenseDecisionDialogComponent} from '../../../dialog/license-decision-dialog/license-decision-dialog.component';
import {catchError, debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {ErrorHandlerService} from '../../../shared/service/error-handler.service';
import {AddLicenseFarmacistComponent} from '../add-license-farmacist/add-license-farmacist.component';
import {AddEcAgentComponent} from '../../../administration/economic-agent/add-ec-agent/add-ec-agent.component';

@Component({
    selector: 'app-evaluare-cerere-lic',
    templateUrl: './evaluare-cerere-lic.component.html',
    styleUrls: ['./evaluare-cerere-lic.component.css']
})
export class EvaluareCerereLicComponent implements OnInit, OnDestroy {

    docs: Document [] = [];
    tipCerere: string;
    requestId: string;
    // objAddresses: any[] = [];
    announces: any[];
    oldData: any;
    activities: any[];
    ecAgentTypes: any[];

    farmacistiPerAddress: any[] = [];

    // outDocuments: any[] = [];

    companiiPerIdnoNotSelected: any[] = [];
    companiiPerIdnoSelected: any[] = [];

    pharmacyRepresentantProf: any;

    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();

    CPCDId: string;
    ASPId: string;

    maxDate = new Date();

    rFormSubbmitted = false;
    oFormSubbmitted = false;

    nextSubmit = false;

    docTypeIdentifier: any;

    private subscriptions: Subscription[] = [];

    //count time
    startDate: Date;
    endDate: Date;


    paymentTotal: number;

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
                private documentService: DocumentService,
                private localityService: LocalityService,
                public dialogDecision: MatDialog,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: ErrorHandlerService) {

    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Evaluarea cererii de licentiere');
        this.startDate = new Date();
        this.initFormData();

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];
                console.log('13');
                this.subscriptions.push(
                    this.licenseService.retrieveLicenseByRequestId(this.requestId).subscribe(data => {
                            this.oldData = data;
                            this.patchData(data);

                            if (this.tipCerere !== 'LICC') {
                                this.retrieveNotSelectedFilials(this.oldData.license.idno);
                            }


                            this.subscriptions.push(
                                this.licenseService.loadActivities().subscribe(data => {
                                        this.activities = data;
                                    }
                                )
                            );


                        }
                    )
                );

                console.log('23');

                this.subscriptions.push(
                    this.licenseService.loadAnnounces().subscribe(data => this.announces = data  ));

                this.subscriptions.push(
                    this.licenseService.loadEcAgentTypes().subscribe(data => this.ecAgentTypes = data));

            } else {
                return;
            }
        }));
        this.onChanges();
    }


    private retrieveNotSelectedFilials(idno: string ) {
        this.subscriptions.push(
            this.licenseService.retrieveAgentsByIdnoWithoutLicense(idno).subscribe(data => {
                    this.companiiPerIdnoNotSelected = data;
                    this.companiiPerIdnoNotSelected.forEach(co => {
                        if (co.locality) {
                            this.subscriptions.push(
                                this.localityService.loadLocalityDetails(co.locality.id).subscribe(data => {
                                        co.address = data.stateName + ', ' + data.description + ', ' + co.street;
                                    }
                                )
                            );
                        }
                    });

                }
            )
        );
    }

    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataEliberarii').patchValue(new Date(data.startDate));

        this.mForm.get('company').patchValue(data.license.companyName);

        // this.rForm.get('seriaLic').patchValue(data.license.serialNr);
        // this.rForm.get('nrLic').patchValue(data.license.nr);

        this.tipCerere = data.type.code;
        this.docTypeIdentifier = {code: this.tipCerere, step: 'E'};

        this.docs = data.documents;
        if (this.docs) {
            this.docs.forEach(doc => doc.isOld = true);
        }


        // this.rForm.get('licenseActivities').patchValue(data.license.addresses.activities);

        // this.oForm.get('farmDir').patchValue(data.license.addresses.selectedPharmaceutist);

        // this.farmacistiPerAddress  =  data.license.addresses.agentPharmaceutist;

        if (data.license.detail.commisionResponses && data.license.detail.commisionResponses.length > 0) {
            data.license.detail.commisionResponses.forEach(csr => {
                if (csr.organization === 'CPCD') {
                    this.CPCDId = csr.id;
                    this.rForm.get('CPCDNrdeintrare').patchValue(csr.entryRspNumber);
                    this.rForm.get('CPCDDate').patchValue(csr.date);
                    this.rForm.get('CPCDMethod').patchValue(csr.announcedMethods);
                    if (csr.announcedMethods.code === 'email') {
                        this.rForm.get('CPCDEmail').patchValue(csr.extraData);
                    } else {
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
                    } else {
                        this.rForm.get('ASPPhone').patchValue(csr.extraData);
                    }
                }
            });
        }

        if (this.tipCerere === 'LICD' || this.tipCerere === 'LICP' || this.tipCerere === 'LICA' || this.tipCerere === 'LICS' || this.tipCerere === 'LICRL' ) {
            this.rForm.disable();
            this.oForm.disable();
        }

        if (this.tipCerere === 'LICM') {
            // this.rForm.get('seriaLic').disable();
            // this.rForm.get('nrLic').disable();
        }

        // this.refreshOutputDocuments();


        this.companiiPerIdnoSelected = data.license.economicAgents;

        this.companiiPerIdnoSelected.forEach(cis => {
            cis.companyType = cis.type.description;
            if (cis.locality)
            {
                cis.address = cis.locality.stateName + ', ' + cis.locality.description + ', ' + cis.street;
            }

            let activitiesStr;
            cis.activities.forEach(r => {
                if (activitiesStr) {
                    activitiesStr += ', ' + r.description;
                } else {
                    activitiesStr = r.description;
                }

            });
            cis.activitiesStr = activitiesStr;
        });

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
                        tap(() => this.loadingCompany = false),
                        catchError(() => {
                            this.loadingCompany = false;
                            return of([]);

                        })
                    )
                )
            );

        this.backupForm = this.rForm;
    }

    private initFormData() {
        this.rForm = this.fb.group({

            // 'seriaLic': [null, Validators.required],
            // 'nrLic': [null, Validators.required],
            'releaseDate': '',
            'dataSistarii': '',
            'motivulSistarii': '',
            'CPCDDate': [{value: null, disabled: true}],
            'CPCDMethod': '',
            'CPCDEmail': [null, Validators.email],
            'CPCDPhone': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'ASPDate': [{value: null, disabled: true}],
            'ASPMethod': '',
            'ASPEmail': [null, Validators.email],
            'ASPPhone': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'CPCDNrdeintrare': '',
            'ASPNrdeintrare': '',
            'MandatedReleaseName': '',
            'MandatedReleaseNr': '',
            'MandatedReleaseDate': '',


        });


        this.mForm = this.fb.group({
            'tipCerere': [{value: null}],
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataEliberarii': [{value: null, disabled: true}],
            'company': [{value: null, disabled: true}]


        });


        this.oForm = this.fb.group({
            'tipIntreprindere': [null, Validators.required],
            'region': [{value: null, disabled: true}],
            'locality': [{value: null, disabled: true}],
            'street': [{value: null, disabled: true}],
            'farmDir': [null, Validators.required],
            'licenseActivities': [null, Validators.required],
            'filiala': [null, Validators.required],
            'compGet': null
        });
    }

    onChanges(): void {
        this.oForm.get('farmDir').valueChanges.subscribe(val => {
            if (val) {
                val.selectionDate = new Date();
                // if (!this.farmacistiPerAddress.includes(val)) {
                //     this.farmacistiPerAddress.push(val);
                // }
            }
        });


        this.oForm.get('filiala').valueChanges.subscribe(val => {
            if (val ) {
                this.farmacistiPerAddress = val.agentPharmaceutist;
                if (val.locality) {
                    this.subscriptions.push(
                        this.localityService.loadLocalityDetails(val.locality.id).subscribe(data => {
                                this.pharmacyRepresentantProf = val.type.representant;
                                this.oForm.get('tipIntreprindere').setValue(val.type);
                                this.oForm.get('region').setValue(data.stateName);
                                this.oForm.get('locality').setValue(data.description);
                                this.oForm.get('street').setValue(val.street);
                                this.oForm.get('farmDir').setValue(val.selectedPharmaceutist);
                            }
                        )
                    );
                }
            } else {
                this.pharmacyRepresentantProf = null;
                this.oForm.get('tipIntreprindere').setValue(null);
                this.oForm.get('region').setValue(null);
                this.oForm.get('locality').setValue(null);
                this.oForm.get('street').setValue(null);
            }
        });


        this.oForm.get('tipIntreprindere').valueChanges.subscribe(val => {
            if (val ) {
                this.pharmacyRepresentantProf = val.representant;
            } else {
                this.pharmacyRepresentantProf = null;
            }
        });




        this.oForm.get('compGet').valueChanges.subscribe(val => {
            if (val) {
                this.retrieveNotSelectedFilials(val.idno);
            } else {
                this.companiiPerIdnoNotSelected = [];
                this.oForm.get('filiala').setValue(null);
            }

        });
    }

    addNewObjAddres() {
        this.oFormSubbmitted = true;
        if (this.companiiPerIdnoSelected == null) {
            this.companiiPerIdnoSelected = [];
        }


        if (!this.oForm.valid) {
            return;
        }

        this.oFormSubbmitted = false;

        const activities: any[] = this.oForm.get('licenseActivities').value;
        let activitiesStr;
        activities.forEach(r => {
            if (activitiesStr) {
                activitiesStr += ', ' + r.description;
            } else {
                activitiesStr = r.description;
            }

        });

        const filiala = this.oForm.get('filiala').value;

        filiala.companyType = this.oForm.get('tipIntreprindere').value.description;
        filiala.address = this.oForm.get('region').value + ', ' + this.oForm.get('locality').value + ', ' + this.oForm.get('street').value;
        filiala.agentPharmaceutist = this.farmacistiPerAddress;
        filiala.selectedPharmaceutist = this.oForm.get('farmDir').value;
        filiala.activities = this.oForm.get('licenseActivities').value;
        filiala.activitiesStr = activitiesStr;
        filiala.type = this.oForm.get('tipIntreprindere').value;

        this.companiiPerIdnoSelected.push(
            filiala
            // filiala: filiala,
            // companyType: this.oForm.get('tipIntreprindere').value,
            // address: this.oForm.get('region').value + ', ' + this.oForm.get('locality').value + ', ' + this.oForm.get('street').value,
            // agentPharmaceutist: this.farmacistiPerAddress,
            // activities: this.oForm.get('licenseActivities').value,
            // activitiesStr: activitiesStr,

        );


        this.farmacistiPerAddress = [];
        this.oForm.get('filiala').setValue(null);
        this.oForm.get('tipIntreprindere').setValue(null);
        this.oForm.get('locality').setValue(null);
        this.oForm.get('region').setValue(null);
        this.oForm.get('street').setValue(null);
        this.oForm.get('licenseActivities').setValue(null);
        this.oForm.get('farmDir').setValue(null);

        this.companiiPerIdnoNotSelected = this.companiiPerIdnoNotSelected.filter(c => c.id !== filiala.id);
    }


    removeDocument(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta inregistrare?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // console.log('result' , );
                const anies = this.companiiPerIdnoSelected.slice(index, index + 1)[0];

                this.companiiPerIdnoNotSelected = [...this.companiiPerIdnoNotSelected, anies];

                this.companiiPerIdnoSelected.splice(index, 1);
            }
        });
    }


    submit() {
        this.rFormSubbmitted = true;
        this.nextSubmit = true;
        if ((this.tipCerere !== 'LICD' && this.tipCerere !== 'LICP' && this.tipCerere !== 'LICA' && this.tipCerere !== 'LICS' && this.tipCerere !== 'LICRL') && (!this.rForm.valid || this.companiiPerIdnoSelected.length == 0)) {
            return;
        }

        this.rFormSubbmitted = false;
        const modelToSubmit = this.composeModel('E');

        this.subscriptions.push(
            this.licenseService.saveEvaluateLicense(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/homepage']);
                }
            )
        );

    }

    submitNextStep() {
        this.rFormSubbmitted = true;
        this.nextSubmit = true;
        if (this.tipCerere !== 'LICD' && this.tipCerere !== 'LICP' && this.tipCerere !== 'LICA' && this.tipCerere !== 'LICS' && this.tipCerere !== 'LICRL' && (!this.rForm.valid || this.companiiPerIdnoSelected.length == 0)) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        if (this.paymentTotal < 0) {
            this.errorHandlerService.showError('Nu s-a efectuat plata.');
            return;
        }

        // if (!this.checkAllDocumentsWasAttached()) {
        //     return;
        // }

        this.rFormSubbmitted = false;
        const modelToSubmit = this.composeModel('I');


        this.subscriptions.push(
            this.licenseService.evaluateNextLicense(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module/license/issue', this.requestId]);
                }
            )
        );

    }


    private composeModel(currentStep: string) {
        this.endDate = new Date();
        const modelToSubmit: any = this.oldData;
        const licenseModel: any = modelToSubmit.license;
        // let detail: any = {};
        // let resolution: any = {};
        const commisionResponses: any[] = [];

        modelToSubmit.id = this.requestId;

        licenseModel.economicAgents = this.companiiPerIdnoSelected;

        if (this.rForm.get('CPCDNrdeintrare').value) {
            let extraData: any;
            if (this.rForm.get('CPCDMethod').value.code === 'email') {
                extraData = this.rForm.get('CPCDEmail').value;
            } else {
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
            } else {
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

        licenseModel.detail.commisionResponses = commisionResponses;

        modelToSubmit.documents = this.docs;
        modelToSubmit.license = licenseModel;

        return modelToSubmit;
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
                            this.router.navigate(['/dashboard/homepage']);
                        }
                    )
                );
            }
        });

    }

    addTagPromise(term: string) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({fullName: term, selectionDate: new Date(), insertionDate: new Date()});
            }, 500);


        });
    }

    newFarmacist() {
        const dialogRef2 = this.dialogDecision.open(AddLicenseFarmacistComponent, {
            data: {
                //NoData
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.farmacistiPerAddress = [...this.farmacistiPerAddress, result.farmacist];
                this.oForm.get('farmDir').setValue(result.farmacist);
            }
        });
    }

    newFilial() {
        const dialogRef2 = this.dialog.open(AddEcAgentComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
                idno : this.oldData.license.idno,
                onlyNewFilial : true
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result && result.success) {
                //Reload list
                this.subscriptions.push(
                    this.licenseService.retrieveAgentsByIdnoWithoutLicense(this.oldData.license.idno).subscribe(data => {
                           /* let incData : any[] = data;
                            if (result.onlyAddedFilialCodes)
                            {
                                let sd : any [] = result.onlyAddedFilialCodes
                                incData.filter( inn => sd.includes(inn.code));
                            }*/

                        this.companiiPerIdnoNotSelected = data;

                        const cSelectedIds: any[] = this.companiiPerIdnoSelected.map(cps => cps.id);

                        this.companiiPerIdnoNotSelected = this.companiiPerIdnoNotSelected.filter(cpns => !cSelectedIds.includes(cpns.id));

                        this.companiiPerIdnoNotSelected.forEach(co => {
                                if (co.locality) {
                                    this.subscriptions.push(
                                        this.localityService.loadLocalityDetails(co.locality.id).subscribe(data => {
                                                co.address = data.stateName + ', ' + data.description + ', ' + co.street;
                                            }
                                        )
                                    );
                                }
                            });

                        }
                    )
                );
            }
        });
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    // private refreshOutputDocuments() {
    //     this.outDocuments = [];
    //
    //     let outDocument = {
    //         name: 'Scrisoare de informare',
    //         number: 'NL-' + this.oldData.requestNumber,
    //         status: this.getOutputDocStatus()
    //     };
    //
    //     this.outDocuments.push(outDocument);
    // }


    // documentAdded(event) {
    //     this.refreshOutputDocuments();
    // }

    viewDoc(document: any) {
        this.loadingService.show();
        this.subscriptions.push(this.documentService.viewDD(document.number).subscribe(data => {
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

    // checkAllDocumentsWasAttached(): boolean {
    //     return !this.outDocuments.find(od => od.status.mode === 'N');
    // }

    // getOutputDocStatus(): any {
    //     let result;
    //     result = this.docs.find(doc => {
    //         if (doc.docType.category === 'NL' && doc.number === 'NL-' + this.oldData.requestNumber) {
    //             return true;
    //         }
    //     });
    //     if (result) {
    //         return {
    //             mode: 'A',
    //             description: 'Atasat'
    //         };
    //     }
    //
    //     return {
    //         mode: 'N',
    //         description: 'Nu este atasat'
    //     };
    // }

    addDecision(selectedFilial: any) {
        const dialogRef2 = this.dialogDecision.open(LicenseDecisionDialogComponent, {
            data: {
                type: 'D',
                currentResolution: selectedFilial.currentResolution,
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                selectedFilial.currentResolution = result.currentResolution;
            }
        });
    }

    setActivities(selectedFilial: any) {
        const dialogRef2 = this.dialogDecision.open(LicenseDecisionDialogComponent, {
            width: '550px',
            height: '550px',
            data: {
                type: 'A',
                activities: this.activities,
                selectedActivities: selectedFilial.activities
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                selectedFilial.activities = result.selectedActivities;

                let activitiesStr;
                selectedFilial.activities.forEach(r => {
                    if (activitiesStr) {
                        activitiesStr += ', ' + r.description;
                    } else {
                        activitiesStr = r.description;
                    }

                });
                selectedFilial.activitiesStr = activitiesStr;
            }
        });
    }


    editFilial(selectedFilial: any) {
        const dialogRef2 = this.dialogDecision.open(LicenseDecisionDialogComponent, {
            width: '550px',
            height: '550px',
            data: {
                type: 'A',
                activities: this.activities,
                selectedActivities: selectedFilial.activities,
                ecAgentTypes: this.ecAgentTypes,
                ecAgentType : selectedFilial.type,
                farmacistiPerAddress : selectedFilial.agentPharmaceutist,
                selectedPharmaceutist : selectedFilial.selectedPharmaceutist,
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                selectedFilial.activities = result.selectedActivities;

                let activitiesStr;
                selectedFilial.activities.forEach(r => {
                    if (activitiesStr) {
                        activitiesStr += ', ' + r.description;
                    } else {
                        activitiesStr = r.description;
                    }

                });
                selectedFilial.activitiesStr = activitiesStr;

                selectedFilial.type = result.ecAgentType;
                selectedFilial.companyType = selectedFilial.type.description;
                selectedFilial.agentPharmaceutist = result.farmacistiPerAddress;
                selectedFilial.selectedPharmaceutist = result.selectedPharmaceutist;
            }
        });
    }


    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
