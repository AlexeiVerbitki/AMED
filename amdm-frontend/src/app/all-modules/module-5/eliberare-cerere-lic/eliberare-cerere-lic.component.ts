import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
    selector: 'app-eliberare-cerere-lic',
    templateUrl: './eliberare-cerere-lic.component.html',
    styleUrls: ['./eliberare-cerere-lic.component.css']
})
export class EliberareCerereLicComponent implements OnInit, OnDestroy {

    docs: Document [] = [];
    tipCerere: string;
    requestId: string;
    oldData : any;

    private subscriptions: Subscription[] = [];
    startDate : Date;
    endDate : Date;


    outDocuments: any[] = [];

    rFormSubbmitted: boolean = false;

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
                        }
                    )
                );
            }
        }));


        this.onChanges();


    }


    private initFormData() {
        this.rForm = this.fb.group({
            'telefonContact': [{value: null, disabled: true}],
            'emailContact': [{value: null, disabled: true}],
            'persResDepCereriiFirstname': [{value: null, disabled: true}],
            'persResDepCereriiLastname': [{value: null, disabled: true}],
            'nrProcurii1': [{value: null, disabled: true}],
            'dataProcurii1': [{value: null, disabled: true}],

            'telefonContactRec': [{value: null, disabled: true}, Validators.required],
            'emailContactRec': [{value: null, disabled: true}],
            'persResDepCereriiFirstnameRec': [{value: null, disabled: true}, Validators.required],
            'persResDepCereriiLastnameRec': [{value: null, disabled: true}, Validators.required],
            'nrProcurii1Rec': [{value: null, disabled: true}, Validators.required],
            'dataProcurii1Rec': [{value: null, disabled: true}, Validators.required],

            'otherPerson': ''
        });


        this.mForm = this.fb.group({
            'tipCerere': [{value: null}],
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataEliberarii': [{value: null, disabled: true}]
        });
    }

    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataEliberarii').patchValue(new Date(data.startDate));
        let mandatedContact : any;
        let mandatedContacts : any [] = data.license.licenseMandatedContacts;

        console.log('gdf', mandatedContacts);

        mandatedContact = mandatedContacts.find(mc => mc.registrationRequestId === data.id);

        console.log('gdf', mandatedContact);


        this.rForm.get('telefonContact').patchValue(mandatedContact.phoneNumber);
        this.rForm.get('emailContact').patchValue(mandatedContact.email);
        this.rForm.get('persResDepCereriiFirstname').patchValue(mandatedContact.requestPersonFirstname);
        this.rForm.get('persResDepCereriiLastname').patchValue(mandatedContact.requestPersonLastname);
        this.rForm.get('nrProcurii1').patchValue(mandatedContact.requestMandateNr);
        this.rForm.get('dataProcurii1').patchValue(mandatedContact.requestMandateDate);

        if (mandatedContact.newMandatedLastname !== null)
        {
            this.rForm.get('telefonContactRec').patchValue(mandatedContact.newPhoneNumber);
            this.rForm.get('emailContactRec').patchValue(mandatedContact.newEmail);
            this.rForm.get('persResDepCereriiFirstnameRec').patchValue(mandatedContact.newMandatedFirstname);
            this.rForm.get('persResDepCereriiLastnameRec').patchValue(mandatedContact.newMandatedLastname);
            this.rForm.get('nrProcurii1Rec').patchValue(mandatedContact.newMandatedNr);
            this.rForm.get('dataProcurii1Rec').patchValue(mandatedContact.newMandatedDate);

            this.rForm.get('otherPerson').patchValue(true);
        }
        else {
            this.rForm.get('telefonContactRec').patchValue(mandatedContact.phoneNumber);
            this.rForm.get('emailContactRec').patchValue(mandatedContact.email);
            this.rForm.get('persResDepCereriiFirstnameRec').patchValue(mandatedContact.requestPersonFirstname);
            this.rForm.get('persResDepCereriiLastnameRec').patchValue(mandatedContact.requestPersonLastname);
            this.rForm.get('nrProcurii1Rec').patchValue(mandatedContact.requestMandateNr);
            this.rForm.get('dataProcurii1Rec').patchValue(mandatedContact.requestMandateDate);

            this.rForm.get('otherPerson').patchValue(false);
        }


        this.tipCerere = data.type.code;

        this.docs = data.license.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.refreshOutputDocuments();

    }


    save() {
        this.rFormSubbmitted = true;
        if (!this.rForm.valid || this.docs.length==0 )
        {
            return;
        }

        if (!this.checkAllDocumentsWasAttached())
        {
            return;
        }

        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('A');

        console.log('modelToSubmit', modelToSubmit);


        this.subscriptions.push(
            this.licenseService.confirmIssueLicense(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
                }
            )
        );

    }

    private composeModel(status : string) {
        this.endDate = new Date();
        let modelToSubmit: any = {};
        let mandatedContact: any = {};
        let mandatedContacts: any[];

        modelToSubmit = this.oldData;

        //Selected another person to receive license
        if (this.rForm.get('otherPerson') && this.rForm.get('otherPerson').value === true) {
            mandatedContacts = this.oldData.license.licenseMandatedContacts;
            mandatedContact = mandatedContacts.find(mc => mc.registrationRequestId === this.oldData.id);

            mandatedContact.newMandatedFirstname = this.rForm.get('persResDepCereriiFirstnameRec').value;
            mandatedContact.newMandatedLastname = this.rForm.get('persResDepCereriiLastnameRec').value;
            mandatedContact.newPhoneNumber = this.rForm.get('telefonContactRec').value;
            mandatedContact.newEmail = this.rForm.get('emailContactRec').value;
            mandatedContact.newMandatedNr = this.rForm.get('nrProcurii1Rec').value;
            mandatedContact.newMandatedDate = this.rForm.get('dataProcurii1Rec').value;

            mandatedContacts.push(mandatedContact);
            modelToSubmit.license.licenseMandatedContacts = mandatedContacts;
        }

        modelToSubmit.license.documents = this.docs;

        modelToSubmit.license.status = status;

        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'I'
        }];


        modelToSubmit.assignedUser = this.authService.getUserName();

        return modelToSubmit;
    }

    onChanges(): void {
        this.rForm.get('otherPerson').valueChanges.subscribe(val => {
            let mandatedContact : any;
            let mandatedContacts : any [] = this.oldData.license.licenseMandatedContacts;

            mandatedContact = mandatedContacts.find(mc => mc.registrationRequestId === this.oldData.id);

            if (this.rForm.get('otherPerson').value === true) {
                this.rForm.get('telefonContactRec').setValue(mandatedContact.newPhoneNumber);
                this.rForm.get('emailContactRec').setValue(mandatedContact.newEmail);
                this.rForm.get('persResDepCereriiFirstnameRec').setValue(mandatedContact.newMandatedFirstname);
                this.rForm.get('persResDepCereriiLastnameRec').setValue(mandatedContact.newMandatedLastname);
                this.rForm.get('nrProcurii1Rec').setValue(mandatedContact.newMandatedNr);
                this.rForm.get('dataProcurii1Rec').setValue(mandatedContact.newMandatedDate);

                this.rForm.get('telefonContactRec').enable();
                this.rForm.get('emailContactRec').enable();
                this.rForm.get('persResDepCereriiFirstnameRec').enable();
                this.rForm.get('persResDepCereriiLastnameRec').enable();
                this.rForm.get('nrProcurii1Rec').enable();
                this.rForm.get('dataProcurii1Rec').enable();
            }
            else
            {
                this.rForm.get('telefonContactRec').patchValue(mandatedContact.phoneNumber);
                this.rForm.get('emailContactRec').patchValue(mandatedContact.email);
                this.rForm.get('persResDepCereriiFirstnameRec').patchValue(mandatedContact.requestPersonFirstname);
                this.rForm.get('persResDepCereriiLastnameRec').patchValue(mandatedContact.requestPersonLastname);
                this.rForm.get('nrProcurii1Rec').patchValue(mandatedContact.requestMandateNr);
                this.rForm.get('dataProcurii1Rec').patchValue(mandatedContact.requestMandateDate);

                this.rForm.get('telefonContactRec').disable();
                this.rForm.get('emailContactRec').disable();
                this.rForm.get('persResDepCereriiFirstnameRec').disable();
                this.rForm.get('persResDepCereriiLastnameRec').disable();
                this.rForm.get('nrProcurii1Rec').disable();
                this.rForm.get('dataProcurii1Rec').disable();
            }
        });


    }

    closePage()
    {
        this.router.navigate(['/dashboard/module']);
    }

    submitFinish()
    {
        this.rFormSubbmitted = true;
        if (!this.rForm.valid || this.docs.length==0 )
        {
            return;
        }

        if (!this.checkAllDocumentsWasAttached())
        {
            return;
        }

        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('F');

        this.subscriptions.push(
            this.licenseService.finishLicense(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
                }
            )
        );

    }



    private refreshOutputDocuments() {
        this.outDocuments = [];

        let outDocument = {
            name: 'Licenta',
            number: '',
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
            if (doc.docType.category === 'LI')
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
