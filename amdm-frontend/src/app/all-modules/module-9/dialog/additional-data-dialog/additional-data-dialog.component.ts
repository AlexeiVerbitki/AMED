import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AdministrationService} from '../../../../shared/service/administration.service';
import {DocumentService} from '../../../../shared/service/document.service';
import {AuthService} from '../../../../shared/service/authetication.service';
import {ConfirmationDialogComponent} from '../../../../dialog/confirmation-dialog.component';
import {LoaderService} from '../../../../shared/service/loader.service';
import {Observable} from "rxjs/internal/Observable";

@Component({
    selector: 'app-additional-data-dialog',
    templateUrl: './additional-data-dialog.component.html',
    styleUrls: ['./additional-data-dialog.component.css']
})
export class AdditionalDataDialogComponent implements OnInit {
    reqForm: FormGroup;
    private subscriptions: Subscription[] = [];
    isRegisterDoc: boolean;
    docTypes: any[];
    docTypeRA: any[];
    title = 'Detalii scrisoare de solicitare date aditionale';
    functions: any[];

    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService,
                private documentService: DocumentService,
                private authService: AuthService,
                public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogConfirmation: MatDialog,
                private loadingService: LoaderService, ) {
    }



    ngOnInit() {
        this.reqForm = this.fb.group({
            'data': {disabled: true, value: new Date()},
            'docNumber': {disabled: true, value: this.dataDialog.requestNumber},
            // 'title': [null, Validators.required],
            'content': [null, Validators.required],
            'email': [null, [Validators.required, Validators.email]],
            'function': [null, Validators.required]
        });

        console.log('dataDialog', this.dataDialog);

        this.subscriptions.push(
            this.administrationService.getAllDocTypes().subscribe(data => {
                    this.docTypes = data;
                    this.docTypeRA = this.docTypes.filter(r => r.category == 'RA');
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllSysParams().subscribe(data => {
                    this.functions = data;
                    this.functions = this.functions.filter(t=> t.code.startsWith('FN'));
                },
                error => console.log(error)
            )
        );
    }

    getDocEntity(path: string): any {
        let docName = '';
        switch (this.dataDialog.modalType) {
            case  'NOTIFICATION' : {
                docName = 'Scrisoare de informare Nr ' + this.reqForm.get('docNumber').value + '.pdf';
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                docName = 'Scrisoare de solicitare date aditionale Nr ' + this.reqForm.get('docNumber').value + '.pdf';
                break;
            }
        }
        let docType = '';
        switch (this.dataDialog.modalType) {
            case  'NOTIFICATION' : {
                docType = 'NL';
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                docType = 'RA';
                break;
            }
        }
        const docEntity = {
            date: new Date(),
            name: docName,
            path: path,
            email: this.reqForm.get('email').value,
            docType: docType,
            requestId: this.dataDialog.requestId,
            startDate: this.dataDialog.startDate,
            username: this.authService.getUserName()
        };

        return docEntity;
    }

    ok() {
        this.isRegisterDoc = true;
        if (this.reqForm.get('content').invalid || this.reqForm.get('function').invalid) {
            return;
        }
        this.isRegisterDoc = false;

        let response = {};
        switch (this.dataDialog.modalType) {
            case  'NOTIFICATION' : {
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                response = {
                    success: true,
                    name: 'Scrisoare de solicitare date aditionale',
                    docType: this.docTypeRA[0],
                    status: 'Nu este atasat',
                    number: this.reqForm.get('docNumber').value,
                    content: this.reqForm.get('content').value,
                    date: new Date(),
                    responseReceived : false,
                    signer: this.reqForm.get('function').value
                };
                break;
            }
        }

        this.dialogRef.close(response);
    }

    cancel(): void {

        let message = '';
        switch (this.dataDialog.modalType) {
            case  'NOTIFICATION' : {
                message = 'Sunteti sigur(a)?';
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                message = 'Sunteti sigur(a)?';
                break;
            }
        }

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: message,
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.dialogRef.close();
            }
        });
    }

    view() {
        this.isRegisterDoc = true;
        if (this.reqForm.get('content').invalid || this.reqForm.get('function').invalid) {
            return;
        }
        this.isRegisterDoc = false;

        this.loadingService.show();
        let docType = '';
        switch (this.dataDialog.modalType) {
            case  'NOTIFICATION' : {
                docType = 'NL';
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                docType = 'RA';
                break;
            }
        }
        console.log('this.dataDialog', this.dataDialog);

        let modelToSubmit = {
            nrDoc : this.reqForm.get('docNumber').value,
            responsiblePerson : this.dataDialog.registrationRequestMandatedContacts.mandatedLastname+' '+this.dataDialog.registrationRequestMandatedContacts.mandatedFirstname,
            companyName : this.dataDialog.company.name,
            requestDate: new Date(),country : 'Moldova',
            address : this.dataDialog.company.legalAddress,
            phoneNumber : this.dataDialog.registrationRequestMandatedContacts.phoneNumber,
            email : this.dataDialog.registrationRequestMandatedContacts.email,
            message : this.reqForm.get('content').value,
            function : this.reqForm.get('function').value.description,
            signerName : this.reqForm.get('function').value.value
        };
        
        console.log('modelToSubmit', modelToSubmit);

        let observable : Observable<any> = null;
        observable = this.documentService.viewRequestNew(modelToSubmit);

        this.subscriptions.push(observable.subscribe(data => {
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

}
