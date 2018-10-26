import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";

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
                private authService: AuthService) {
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

        this.rForm.get('telefonContact').patchValue(data.license.mandatedContact.phoneNumber);
        this.rForm.get('emailContact').patchValue(data.license.mandatedContact.email);
        this.rForm.get('persResDepCereriiFirstname').patchValue(data.license.mandatedContact.requestPersonFirstname);
        this.rForm.get('persResDepCereriiLastname').patchValue(data.license.mandatedContact.requestPersonLastname);
        this.rForm.get('nrProcurii1').patchValue(data.license.mandatedContact.requestMandateNr);
        this.rForm.get('dataProcurii1').patchValue(data.license.mandatedContact.requestMandateDate);

        if (data.license.mandatedContact.requestPersonLastname)
        {
            this.rForm.get('telefonContactRec').patchValue(data.license.mandatedContact.newPhoneNumber);
            this.rForm.get('emailContactRec').patchValue(data.license.mandatedContact.newEmail);
            this.rForm.get('persResDepCereriiFirstnameRec').patchValue(data.license.mandatedContact.newMandatedFirstname);
            this.rForm.get('persResDepCereriiLastnameRec').patchValue(data.license.mandatedContact.newMandatedLastname);
            this.rForm.get('nrProcurii1Rec').patchValue(data.license.mandatedContact.newMandatedNr);
            this.rForm.get('dataProcurii1Rec').patchValue(data.license.mandatedContact.newMandatedDate);

            this.rForm.get('otherPerson').patchValue(true);
        }
        else {
            this.rForm.get('telefonContactRec').patchValue(data.license.mandatedContact.phoneNumber);
            this.rForm.get('emailContactRec').patchValue(data.license.mandatedContact.email);
            this.rForm.get('persResDepCereriiFirstnameRec').patchValue(data.license.mandatedContact.requestPersonFirstname);
            this.rForm.get('persResDepCereriiLastnameRec').patchValue(data.license.mandatedContact.requestPersonLastname);
            this.rForm.get('nrProcurii1Rec').patchValue(data.license.mandatedContact.requestMandateNr);
            this.rForm.get('dataProcurii1Rec').patchValue(data.license.mandatedContact.requestMandateDate);
        }


        this.tipCerere = data.type.code;

        this.docs = data.license.documents;
        this.docs.forEach(doc => doc.isOld = true);

    }


    save() {
        this.rFormSubbmitted = true;
        if (!this.rForm.valid || this.docs.length==0 )
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

        //Selected another person to receive license
        if (this.rForm.get('otherPerson') && this.rForm.get('otherPerson').value === true) {
            mandatedContact = this.oldData.license.mandatedContact;

            mandatedContact.newMandatedFirstname = this.rForm.get('persResDepCereriiFirstnameRec').value;
            mandatedContact.newMandatedLastname = this.rForm.get('persResDepCereriiLastnameRec').value;
            mandatedContact.newPhoneNumber = this.rForm.get('telefonContactRec').value;
            mandatedContact.newEmail = this.rForm.get('emailContactRec').value;
            mandatedContact.newMandatedNr = this.rForm.get('nrProcurii1Rec').value;
            mandatedContact.newMandatedDate = this.rForm.get('dataProcurii1Rec').value;
        }



        modelToSubmit = this.oldData;
        modelToSubmit.license.mandatedContact = mandatedContact;
        modelToSubmit.license.documents = this.docs;

        modelToSubmit.license.status = status;

        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'I'
        }];

        return modelToSubmit;
    }

    onChanges(): void {
        this.rForm.get('otherPerson').valueChanges.subscribe(val => {
            if (this.rForm.get('otherPerson').value === true) {
                this.rForm.get('telefonContactRec').setValue(this.oldData.license.mandatedContact.newPhoneNumber);
                this.rForm.get('emailContactRec').setValue(this.oldData.license.mandatedContact.newEmail);
                this.rForm.get('persResDepCereriiFirstnameRec').setValue(this.oldData.license.mandatedContact.newMandatedFirstname);
                this.rForm.get('persResDepCereriiLastnameRec').setValue(this.oldData.license.mandatedContact.newMandatedLastname);
                this.rForm.get('nrProcurii1Rec').setValue(this.oldData.license.mandatedContact.newMandatedNr);
                this.rForm.get('dataProcurii1Rec').setValue(this.oldData.license.mandatedContact.newMandatedDate);

                this.rForm.get('telefonContactRec').enable();
                this.rForm.get('emailContactRec').enable();
                this.rForm.get('persResDepCereriiFirstnameRec').enable();
                this.rForm.get('persResDepCereriiLastnameRec').enable();
                this.rForm.get('nrProcurii1Rec').enable();
                this.rForm.get('dataProcurii1Rec').enable();
            }
            else
            {
                this.rForm.get('telefonContactRec').patchValue(this.oldData.license.mandatedContact.phoneNumber);
                this.rForm.get('emailContactRec').patchValue(this.oldData.license.mandatedContact.email);
                this.rForm.get('persResDepCereriiFirstnameRec').patchValue(this.oldData.license.mandatedContact.requestPersonFirstname);
                this.rForm.get('persResDepCereriiLastnameRec').patchValue(this.oldData.license.mandatedContact.requestPersonLastname);
                this.rForm.get('nrProcurii1Rec').patchValue(this.oldData.license.mandatedContact.requestMandateNr);
                this.rForm.get('dataProcurii1Rec').patchValue(this.oldData.license.mandatedContact.requestMandateDate);

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

        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('F');

        this.subscriptions.push(
            this.licenseService.finishLicense(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
                }
            )
        );

    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
