import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Document} from '../../../models/document';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {LicenseService} from '../../../shared/service/license/license.service';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {DocumentService} from '../../../shared/service/document.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-eliberare-cerere-lic',
    templateUrl: './eliberare-cerere-lic.component.html',
    styleUrls: ['./eliberare-cerere-lic.component.css']
})
export class EliberareCerereLicComponent implements OnInit, OnDestroy {

    docs: Document [] = [];
    tipCerere: string;
    requestId: string;
    oldData: any;

    private subscriptions: Subscription[] = [];
    startDate: Date;
    endDate: Date;

    maxDate = new Date();


    outDocuments: any[] = [];

    rFormSubbmitted = false;

    docTypeIdentifier: any;

    //Validations
    mForm: FormGroup;
    rForm: FormGroup;


    constructor(private router: Router,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                private licenseService: LicenseService,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService,
                private loadingService: LoaderService,
                private documentService: DocumentService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Eliberare licenta');
        this.startDate = new Date();
        this.initFormData();
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];
                this.subscriptions.push(
                    this.licenseService.retrieveLicenseByRequestId(this.requestId).subscribe(data => {
                            this.oldData = data;
                            this.patchData(data);
                        }
                    )
                );

            }
        }));


        this.onChanges();


    }


    private initFormData() {
        this.rForm = this.fb.group({
            'seriaLic': [null, Validators.required],
            'nrLic': [null, Validators.required],
            'telefonContact': [{value: null, disabled: true}],
            'emailContact': [{value: null, disabled: true}],
            'persResDepCereriiFirstname': [{value: null, disabled: true}],
            'persResDepCereriiLastname': [{value: null, disabled: true}],
            'nrProcurii1': [{value: null, disabled: true}],
            'dataProcurii1': [{value: null, disabled: true}],
            'idnp': [{value: null, disabled: true}],

            'telefonContactRec': [{value: null, disabled: true}],
            'emailContactRec': [{value: null, disabled: true}],
            'persResDepCereriiFirstnameRec': [{value: null, disabled: true}],
            'persResDepCereriiLastnameRec': [{value: null, disabled: true}],
            'nrProcurii1Rec': [{value: null, disabled: true}],
            'dataProcurii1Rec': [{value: null, disabled: true}],
            'idnpRec': [{value: null, disabled: true}],


            'otherPerson': ''
        });


        this.mForm = this.fb.group({
            'tipCerere': [{value: null}],
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataEliberarii': [{value: null, disabled: true}],
            'company': [{value: null, disabled: true}]
        });
    }

    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataEliberarii').patchValue(new Date(data.startDate));
        this.mForm.get('company').patchValue(data.license.companyName);
        let mandatedContact: any;
        const mandatedContacts: any [] = data.license.detail.licenseMandatedContacts;

        mandatedContact = mandatedContacts.find(mc => data.license.detail.id === mc.licenseDetailId);

        this.rForm.get('seriaLic').patchValue(data.license.serialNr);
        this.rForm.get('nrLic').patchValue(data.license.nr);




        this.rForm.get('telefonContact').patchValue(mandatedContact.phoneNumber);
        this.rForm.get('emailContact').patchValue(mandatedContact.email);
        this.rForm.get('persResDepCereriiFirstname').patchValue(mandatedContact.requestPersonFirstname);
        this.rForm.get('persResDepCereriiLastname').patchValue(mandatedContact.requestPersonLastname);
        this.rForm.get('nrProcurii1').patchValue(mandatedContact.requestMandateNr);
        this.rForm.get('dataProcurii1').patchValue(mandatedContact.requestMandateDate);
        this.rForm.get('idnp').patchValue(mandatedContact.idnp);

        if (mandatedContact.newMandatedLastname !== null) {
            this.rForm.get('telefonContactRec').patchValue(mandatedContact.newPhoneNumber);
            this.rForm.get('emailContactRec').patchValue(mandatedContact.newEmail);
            this.rForm.get('persResDepCereriiFirstnameRec').patchValue(mandatedContact.newMandatedFirstname);
            this.rForm.get('persResDepCereriiLastnameRec').patchValue(mandatedContact.newMandatedLastname);
            this.rForm.get('nrProcurii1Rec').patchValue(mandatedContact.newMandatedNr);
            this.rForm.get('dataProcurii1Rec').patchValue(mandatedContact.newMandatedDate);
            this.rForm.get('idnpRec').patchValue(mandatedContact.newIdnp);

            this.rForm.get('otherPerson').patchValue(true);
        } else {
            this.rForm.get('telefonContactRec').patchValue(mandatedContact.phoneNumber);
            this.rForm.get('emailContactRec').patchValue(mandatedContact.email);
            this.rForm.get('persResDepCereriiFirstnameRec').patchValue(mandatedContact.requestPersonFirstname);
            this.rForm.get('persResDepCereriiLastnameRec').patchValue(mandatedContact.requestPersonLastname);
            this.rForm.get('nrProcurii1Rec').patchValue(mandatedContact.requestMandateNr);
            this.rForm.get('dataProcurii1Rec').patchValue(mandatedContact.requestMandateDate);
            this.rForm.get('idnpRec').patchValue(mandatedContact.idnp);

            this.rForm.get('otherPerson').patchValue(false);
        }


        this.tipCerere = data.type.code;
        if (this.tipCerere === 'LICM' || this.tipCerere === 'LICD' || this.tipCerere === 'LICA' || this.tipCerere === 'LICS' || this.tipCerere === 'LICRL') {
            this.rForm.get('seriaLic').disable();
            this.rForm.get('nrLic').disable();
        }

        this.docTypeIdentifier = {code: this.tipCerere, step: 'I'};

        this.docs = data.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.refreshOutputDocuments();

    }


    save() {
        const modelToSubmit = this.composeModel('I', 'A');

        this.subscriptions.push(
            this.licenseService.confirmIssueLicense(modelToSubmit).subscribe(data => {
                    // this.router.navigate(['/dashboard/homepage']);
                    this.errorHandlerService.showSuccess('Datele au fost salvate');
                }
            )
        );

    }

    private composeModel(currentStep: string, status: string) {
        this.endDate = new Date();
        let modelToSubmit: any = {};
        let mandatedContact: any = {};
        let mandatedContacts: any[];

        modelToSubmit = this.oldData;

        //Selected another person to receive license
        if (this.rForm.get('otherPerson') && this.rForm.get('otherPerson').value === true) {
            mandatedContacts = this.oldData.license.detail.licenseMandatedContacts;
            mandatedContact = mandatedContacts.find(mc => mc.licenseDetailId === this.oldData.license.detail.id);

            mandatedContact.newMandatedFirstname = this.rForm.get('persResDepCereriiFirstnameRec').value;
            mandatedContact.newMandatedLastname = this.rForm.get('persResDepCereriiLastnameRec').value;
            mandatedContact.newPhoneNumber = this.rForm.get('telefonContactRec').value;
            mandatedContact.newEmail = this.rForm.get('emailContactRec').value;
            mandatedContact.newMandatedNr = this.rForm.get('nrProcurii1Rec').value;
            mandatedContact.newMandatedDate = this.rForm.get('dataProcurii1Rec').value;
            mandatedContact.newIdnp = this.rForm.get('idnpRec').value;

            mandatedContacts.push(mandatedContact);
            modelToSubmit.license.detail.licenseMandatedContacts = mandatedContacts;
        }

        modelToSubmit.license.serialNr = this.rForm.get('seriaLic').value;
        modelToSubmit.license.nr = this.rForm.get('nrLic').value;

        modelToSubmit.license.status = status;

        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'I'
        }];

        modelToSubmit.documents = this.docs;
        modelToSubmit.assignedUser = this.authService.getUserName();
        modelToSubmit.currentStep = currentStep;

        return modelToSubmit;
    }

    onChanges(): void {
        this.rForm.get('otherPerson').valueChanges.subscribe(val => {
            let mandatedContact: any;
            const mandatedContacts: any [] = this.oldData.license.detail.licenseMandatedContacts;

            mandatedContact = mandatedContacts.find(mc => mc.licenseDetailId === this.oldData.license.detail.id);

            if (this.rForm.get('otherPerson').value === true) {
                this.rForm.get('telefonContactRec').setValue(mandatedContact.newPhoneNumber);
                this.rForm.get('emailContactRec').setValue(mandatedContact.newEmail);
                this.rForm.get('persResDepCereriiFirstnameRec').setValue(mandatedContact.newMandatedFirstname);
                this.rForm.get('persResDepCereriiLastnameRec').setValue(mandatedContact.newMandatedLastname);
                this.rForm.get('nrProcurii1Rec').setValue(mandatedContact.newMandatedNr);
                this.rForm.get('dataProcurii1Rec').setValue(mandatedContact.newMandatedDate);
                this.rForm.get('idnpRec').setValue(mandatedContact.newIdnp);

                this.rForm.get('telefonContactRec').enable();
                this.rForm.get('emailContactRec').enable();
                this.rForm.get('persResDepCereriiFirstnameRec').enable();
                this.rForm.get('persResDepCereriiLastnameRec').enable();
                this.rForm.get('nrProcurii1Rec').enable();
                this.rForm.get('dataProcurii1Rec').enable();
                this.rForm.get('idnpRec').enable();


                this.rForm.get('telefonContactRec').setValidators([Validators.maxLength(9), Validators.pattern('[0-9]+')]);
                this.rForm.get('persResDepCereriiFirstnameRec').setValidators(Validators.required);
                this.rForm.get('persResDepCereriiLastnameRec').setValidators(Validators.required);

                this.rForm.get('telefonContactRec').updateValueAndValidity();
                this.rForm.get('persResDepCereriiFirstnameRec').updateValueAndValidity();
                this.rForm.get('persResDepCereriiLastnameRec').updateValueAndValidity();
            } else {
                this.rForm.get('telefonContactRec').patchValue(mandatedContact.phoneNumber);
                this.rForm.get('emailContactRec').patchValue(mandatedContact.email);
                this.rForm.get('persResDepCereriiFirstnameRec').patchValue(mandatedContact.requestPersonFirstname);
                this.rForm.get('persResDepCereriiLastnameRec').patchValue(mandatedContact.requestPersonLastname);
                this.rForm.get('nrProcurii1Rec').patchValue(mandatedContact.requestMandateNr);
                this.rForm.get('dataProcurii1Rec').patchValue(mandatedContact.requestMandateDate);
                this.rForm.get('idnpRec').patchValue(mandatedContact.idnp);

                this.rForm.get('telefonContactRec').disable();
                this.rForm.get('emailContactRec').disable();
                this.rForm.get('persResDepCereriiFirstnameRec').disable();
                this.rForm.get('persResDepCereriiLastnameRec').disable();
                this.rForm.get('nrProcurii1Rec').disable();
                this.rForm.get('dataProcurii1Rec').disable();
                this.rForm.get('idnpRec').disable();


                this.rForm.get('telefonContactRec').setValidators(null);
                this.rForm.get('persResDepCereriiFirstnameRec').setValidators(null);
                this.rForm.get('persResDepCereriiLastnameRec').setValidators(null);

                this.rForm.get('telefonContactRec').updateValueAndValidity();
                this.rForm.get('persResDepCereriiFirstnameRec').updateValueAndValidity();
                this.rForm.get('persResDepCereriiLastnameRec').updateValueAndValidity();
            }
        });


    }

    submitFinish() {
        this.rFormSubbmitted = true;
        if (!this.rForm.valid ) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        // if (!this.checkAllDocumentsWasAttached())
        // {
        //     return;
        // }

        this.rFormSubbmitted = false;
        const modelToSubmit = this.composeModel('F', 'F');

        this.subscriptions.push(
            this.licenseService.finishLicense(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/homepage']);
                }
            )
        );

    }



    private refreshOutputDocuments() {
        this.outDocuments = [];

        const outDocument = {
            name: 'Licenta',
            number: '',
            status: this.getOutputDocStatus(),
            category : 'LI'
        };

        const outDocumentAnexa = {
            name: 'Anexa Licenta',
            number: '',
            status: this.getOutputDocStatus(),
            category : 'AL'
        };

        this.outDocuments.push(outDocument);
        this.outDocuments.push(outDocumentAnexa);
    }


    documentAdded(event) {
        this.refreshOutputDocuments();
    }


    checkAllDocumentsWasAttached(): boolean {
        return !this.outDocuments.find(od => od.status.mode === 'N');
    }

    getOutputDocStatus(): any {
        let result;
        result = this.docs.find( doc => {
            if (doc.docType.category === 'LI') {
                return true;
            }
            if (doc.docType.category === 'AL') {
                return true;
            }
        });
        if (result) {
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

    viewDoc(document: any) {
        this.loadingService.show();

        let observable: Observable<any> = null;

        if (document.category === 'AL') {
            observable = this.licenseService.viewAnexaLicenta(this.composeModel('A', 'A'));
        } else if (document.category === 'LI') {
            observable = this.licenseService.viewLicenta(this.composeModel('A', 'A'));
        }

        this.subscriptions.push(observable.subscribe(data => {
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

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
