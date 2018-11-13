import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AdministrationService} from "../../shared/service/administration.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConfirmationDialogComponent} from "../confirmation-dialog.component";
import {DocumentService} from "../../shared/service/document.service";
import {MedicamentService} from "../../shared/service/medicament.service";
import {AuthService} from "../../shared/service/authetication.service";
import {LoaderService} from "../../shared/service/loader.service";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-request-additional-data-dialog',
    templateUrl: './request-additional-data-dialog.component.html',
    styleUrls: ['./request-additional-data-dialog.component.css']
})
export class RequestAdditionalDataDialogComponent implements OnInit {
    reqForm: FormGroup;
    private subscriptions: Subscription[] = [];
    isRegisterDoc: boolean;
    docTypes: any[];
    title: string = 'Detalii scrisoare de solicitare date aditionale';

    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private documentService: DocumentService,
                private medicamentService: MedicamentService,
                private loadingService: LoaderService,
                private authService: AuthService,
                public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogConfirmation: MatDialog) {
        this.reqForm = this.fb.group({
            'data': {disabled: true, value: new Date()},
            'docNumber': [null],
            'title': [null, Validators.required],
            'content': [null, Validators.required],
            'email': [null, [Validators.required, Validators.email]]
        });
    }

    ngOnInit() {

        var datePipe = new DatePipe("en-US");
        this.reqForm.get('docNumber').setValue('SL-'+this.dataDialog.requestNumber+'-'+this.dataDialog.nrOrdDoc+'-'+datePipe.transform(new Date(), 'dd/MM/yyyy'));

        if (this.dataDialog.modalType == 'NOTIFICATION') {
            this.title = 'Detalii scrisoare de informare';
            this.reqForm.get('docNumber').setValue('NL-'+this.dataDialog.requestNumber+'-'+datePipe.transform(new Date(), 'dd/MM/yyyy'));
        } else if (this.dataDialog.modalType == 'LABORATORY_ANALYSIS') {
            this.title = 'Detalii scrisoare solicitare pentru desfasurarea analizei de laborator ';
            this.reqForm.get('docNumber').setValue('LA-'+this.dataDialog.requestNumber+'-'+this.dataDialog.nrOrdDoc+'-'+datePipe.transform(new Date(), 'dd/MM/yyyy'));
        }

        this.subscriptions.push(
            this.administrationService.getAllDocTypes().subscribe(data => {
                    this.docTypes = data;
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
            case  'LABORATORY_ANALYSIS' : {
                docName = 'Scrisoare de solicitare desfasurare analize de laborator Nr ' + this.reqForm.get('docNumber').value + '.pdf';
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
            case  'LABORATORY_ANALYSIS' : {
                docType = 'LA';
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                docType = 'SL';
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

    // generateDoc() {
    //     this.subscriptions.push(this.documentService.generateRequestAdditionalData(this.reqForm.get('docNumber').value,
    //         this.dataDialog.requestNumber,
    //         this.reqForm.get('content').value,
    //         this.reqForm.get('title').value,
    //         this.dataDialog.modalType).subscribe(data => {
    //             //register in db
    //             this.subscriptions.push(this.medicamentService.saveRequest(this.getDocEntity(data), this.dataDialog.modalType).subscribe(data => {
    //                     //this.modal.hide();
    //                     //this.modalService.data.next({action: 'CLOSE_MODAL'});
    //                 }, error => console.log('Scrisoarea nu a putut fi salvata in baza de date.'))
    //             );
    //         }, error => console.log('Scrisoarea nu a putut fi generata.'))
    //     );
    // }

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
            case  'LABORATORY_ANALYSIS' : {
                docType = 'LA';
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                docType = 'SL';
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

    ok() {
        this.isRegisterDoc = true;
        if (this.reqForm.get('title').invalid || this.reqForm.get('content').invalid) {
            return;
        }
        this.isRegisterDoc = false;

        var response = {};
        switch (this.dataDialog.modalType) {
            case  'NOTIFICATION' : {
                response = {
                    success: true,
                    name: 'Scrisoare de informare',
                    docType: this.docTypes.find(r => r.category == 'NL'),
                    status: 'Nu este atasat',
                    number: this.reqForm.get('docNumber').value,
                    title: this.reqForm.get('title').value,
                    content: this.reqForm.get('content').value,
                    date: new Date(),
                    responseReceived : false
                };
                break;
            }
            case  'LABORATORY_ANALYSIS' : {
                response = {
                    success: true,
                    name: 'Scrisoare de solicitare desfasurare analize de laborator',
                    docType: this.docTypes.find(r => r.category == 'LA'),
                    status: 'Nu este atasat',
                    number: this.reqForm.get('docNumber').value,
                    title: this.reqForm.get('title').value,
                    content: this.reqForm.get('content').value,
                    date: new Date(),
                    responseReceived : false
                };
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                response = {
                    success: true,
                    name: 'Scrisoare de solicitare date aditionale',
                    docType: this.docTypes.find(r => r.category == 'SL'),
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
            case  'LABORATORY_ANALYSIS' : {
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

}
