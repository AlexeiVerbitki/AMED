import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {AdministrationService} from "../../../../shared/service/administration.service";
import {DocumentService} from "../../../../shared/service/document.service";
import {AuthService} from "../../../../shared/service/authetication.service";
import {ConfirmationDialogComponent} from "../../../../confirmation-dialog/confirmation-dialog.component";
import {LoaderService} from "../../../../shared/service/loader.service";

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
    title: string = 'Detalii scrisoare de solicitare date aditionale';

    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private documentService: DocumentService,
                private authService: AuthService,
                public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogConfirmation: MatDialog,
                private loadingService: LoaderService,) {
    }

    ngOnInit() {
        this.reqForm = this.fb.group({
            'data': {disabled: true, value: new Date()},
            'docNumber': [null],
            'title': [null, Validators.required],
            'content': [null, Validators.required],
            'email': [null, [Validators.required, Validators.email]]
        });

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.reqForm.get('docNumber').setValue(data);
                },
                error => console.log(error)
            )
        );

        console.log('modalType',this.dataDialog.modalType);
        if (this.dataDialog.modalType == 'NOTIFICATION') {
            this.title = 'Detalii scrisoare de informare';
        } else if (this.dataDialog.modalType == 'LABORATORY_ANALYSIS') {
            this.title = 'Detalii scrisoare solicitare pentru desfasurarea analizei de laborator ';
        }

        this.subscriptions.push(
            this.administrationService.getAllDocTypes().subscribe(data => {
                    this.docTypes = data;
                    this.docTypeRA = this.docTypes.filter(r => r.category == 'RA');
                },
                error => console.log(error)
            )
        );
    }

    getDocEntity(path: string): any {
        var docName = '';
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
        var docType = '';
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
        var docEntity = {
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
        if (this.reqForm.get('title').invalid || this.reqForm.get('content').invalid) {
            return;
        }
        this.isRegisterDoc = false;

        var response = {};
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
                    title: this.reqForm.get('title').value,
                    content: this.reqForm.get('content').value,
                    date: new Date(),
                    responseReceived : false
                };
                break;
            }
        }

        this.dialogRef.close(response);
    }

    cancel(): void {

        var message = '';
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
                this.dialogRef.close({success: false});
            }
        });
    }

    view() {
        this.isRegisterDoc = true;
        if (this.reqForm.get('title').invalid || this.reqForm.get('content').invalid) {
            return;
        }
        this.isRegisterDoc = false;

        this.loadingService.show();
        var docType = '';
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
        this.subscriptions.push(this.documentService.viewRequest(this.reqForm.get('docNumber').value,
            this.reqForm.get('content').value,
            this.reqForm.get('title').value,
            docType).subscribe(data => {
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
