import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {Document} from "../../../models/document";

@Component({
    selector: 'app-view-completed-license',
    templateUrl: './view-completed-license.component.html',
    styleUrls: ['./view-completed-license.component.css']
})
export class ViewCompletedLicenseComponent implements OnInit, OnDestroy {

    docs: Document [] = [];
    tipCerere: string;

    private subscriptions: Subscription[] = [];
    companiiPerIdnoSelected: any[] = [];

    //Validations
    maxDate = new Date();
    mForm: FormGroup;
    requestId: string;

    activities: any[];
    ecAgentTypes: any[];

    farmacistiPerAddress: any[] = [];
    CPCDId: string;
    ASPId: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private licenseService: LicenseService,
        private navbarTitleService: NavbarTitleService,
    ) {

    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Vizualizare licenta');
        this.initFormData();

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];
                this.subscriptions.push(
                    this.licenseService.retrieveLicenseByRequestIdCompleted(this.requestId).subscribe(data => {
                            this.patchData(data);
                        }
                    )
                );
            } else {
                return;
            }
        }));

    }

    private patchData(data) {
        this.tipCerere = data.type.code;
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataCerere').patchValue(new Date(data.startDate));

        this.docs = data.documents;

        this.mForm.get('ecAgent').patchValue(data.license.economicAgents[0].longName);
        this.mForm.get('adresa').patchValue(data.license.economicAgents[0].legalAddress);
        this.mForm.get('idno').patchValue(data.license.economicAgents[0].idno);
        this.mForm.get('seria').patchValue(data.license.serialNr);
        this.mForm.get('nrLic').patchValue(data.license.nr);
        this.mForm.get('dataEliberariiLic').patchValue(new Date(data.license.releaseDate));
        this.mForm.get('dataExpirariiLic').patchValue(new Date(data.license.expirationDate));
        this.mForm.get('reasonSuspension').patchValue(data.reason);
        this.mForm.get('reasonCancel').patchValue(data.reason);
        this.mForm.get('persResDepCereriiFirstname').patchValue(data.license.detail.licenseMandatedContacts[0].requestPersonFirstname);
        this.mForm.get('persResDepCereriiLastname').patchValue(data.license.detail.licenseMandatedContacts[0].requestPersonLastname);
        this.mForm.get('telefonContact').patchValue(data.license.detail.licenseMandatedContacts[0].phoneNumber);
        this.mForm.get('emailContact').patchValue(data.license.detail.licenseMandatedContacts[0].email);
        this.mForm.get('nrProcurii1').patchValue(data.license.detail.licenseMandatedContacts[0].requestMandateNr);
        this.mForm.get('dataProcurii1').patchValue(new Date(data.license.detail.licenseMandatedContacts[0].requestMandateDate));


        this.companiiPerIdnoSelected = data.license.economicAgents;

        this.companiiPerIdnoSelected.forEach(cis => {
            cis.companyType = cis.type.description;
            if (cis.locality) {
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

        if (data.license.detail.commisionResponses && data.license.detail.commisionResponses.length > 0) {
            data.license.detail.commisionResponses.forEach(csr => {
                if (csr.organization === 'CPCD') {
                    this.CPCDId = csr.id;
                    this.mForm.get('CPCDNrdeintrare').patchValue(csr.entryRspNumber);
                    this.mForm.get('CPCDDate').patchValue(csr.date);
                    this.mForm.get('CPCDMethod').patchValue(csr.announcedMethods);
                    if (csr.announcedMethods.code === 'email') {
                        this.mForm.get('CPCDEmail').patchValue(csr.extraData);
                    } else {
                        this.mForm.get('CPCDPhone').patchValue(csr.extraData);
                    }
                }
                if (csr.organization === 'ASP') {
                    this.ASPId = csr.id;
                    this.mForm.get('ASPNrdeintrare').patchValue(csr.entryRspNumber);
                    this.mForm.get('ASPDate').patchValue(csr.date);
                    this.mForm.get('ASPMethod').patchValue(csr.announcedMethods);
                    if (csr.announcedMethods.code === 'email') {
                        this.mForm.get('ASPEmail').patchValue(csr.extraData);
                    } else {
                        this.mForm.get('ASPPhone').patchValue(csr.extraData);
                    }
                }
            });
        }

        let mandatedContact: any = data.license.detail.licenseMandatedContacts[0];

        if (mandatedContact.newMandatedLastname !== null) {
            this.mForm.get('telefonContactRec').patchValue(mandatedContact.newPhoneNumber);
            this.mForm.get('emailContactRec').patchValue(mandatedContact.newEmail);
            this.mForm.get('persResDepCereriiFirstnameRec').patchValue(mandatedContact.newMandatedFirstname);
            this.mForm.get('persResDepCereriiLastnameRec').patchValue(mandatedContact.newMandatedLastname);
            this.mForm.get('nrProcurii1Rec').patchValue(mandatedContact.newMandatedNr);
            this.mForm.get('dataProcurii1Rec').patchValue(mandatedContact.newMandatedDate);

            this.mForm.get('otherPerson').patchValue(true);
        } else {
            this.mForm.get('telefonContactRec').patchValue(mandatedContact.phoneNumber);
            this.mForm.get('emailContactRec').patchValue(mandatedContact.email);
            this.mForm.get('persResDepCereriiFirstnameRec').patchValue(mandatedContact.requestPersonFirstname);
            this.mForm.get('persResDepCereriiLastnameRec').patchValue(mandatedContact.requestPersonLastname);
            this.mForm.get('nrProcurii1Rec').patchValue(mandatedContact.requestMandateNr);
            this.mForm.get('dataProcurii1Rec').patchValue(mandatedContact.requestMandateDate);

            this.mForm.get('otherPerson').patchValue(false);
        }

    }

    private initFormData() {
        this.mForm = this.fb.group({
            'tipCerere': [{value: null}],
            'nrCererii': [{value: null, disabled: true}],
            'dataCerere': [{value: null, disabled: true}],
            'ecAgent': [{value: null, disabled: true}],
            'adresa': [{value: null, disabled: true}],
            'idno': [{value: null, disabled: true}],
            'seria': [{value: null, disabled: true}],
            'nrLic': [{value: null, disabled: true}],
            'dataEliberariiLic': [{value: null, disabled: true}],
            'dataExpirariiLic': [{value: null, disabled: true}],
            'reasonSuspension': [{value: null, disabled: true}],
            'reasonCancel': [{value: null, disabled: true}],
            'persResDepCereriiFirstname': [{value: null, disabled: true}],
            'persResDepCereriiLastname': [{value: null, disabled: true}],
            'telefonContact': [{value: null, disabled: true}],
            'emailContact': [{value: null, disabled: true}],
            'nrProcurii1': [{value: null, disabled: true}],
            'dataProcurii1': [{value: null, disabled: true}],
            'CPCDDate': [{value: null, disabled: true}],
            'CPCDMethod': [{value: null, disabled: true}],
            'CPCDEmail': [{value: null, disabled: true}],
            'CPCDPhone': [{value: null, disabled: true}],
            'CPCDNrdeintrare': [{value: null, disabled: true}],
            'ASPNrdeintrare': [{value: null, disabled: true}],
            'ASPDate': [{value: null, disabled: true}],
            'ASPMethod': [{value: null, disabled: true}],
            'ASPEmail': [{value: null, disabled: true}],
            'ASPPhone': [{value: null, disabled: true}],
            'otherPerson': [{value: null, disabled: true}],
            'dataProcurii1Rec': [{value: null, disabled: true}],
            'nrProcurii1Rec': [{value: null, disabled: true}],
            'emailContactRec': [{value: null, disabled: true}],
            'telefonContactRec': [{value: null, disabled: true}],
            'persResDepCereriiLastnameRec': [{value: null, disabled: true}],
            'persResDepCereriiFirstnameRec': [{value: null, disabled: true}],
        });

    }

    removeDocument(index) {
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
