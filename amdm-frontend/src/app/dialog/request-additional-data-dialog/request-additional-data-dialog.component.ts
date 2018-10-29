import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AdministrationService} from "../../shared/service/administration.service";
import {MatDialog} from "@angular/material";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";
import {DocumentService} from "../../shared/service/document.service";
import {MedicamentService} from "../../shared/service/medicament.service";
import {AuthService} from "../../shared/service/authetication.service";
import {ModalDirective} from "angular-bootstrap-md";
import {ModalService} from "../../shared/service/modal.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-request-additional-data-dialog',
    templateUrl: './request-additional-data-dialog.component.html',
    styleUrls: ['./request-additional-data-dialog.component.css']
})
export class RequestAdditionalDataDialogComponent implements OnInit {
    reqForm: FormGroup;
    private subscriptions: Subscription[] = [];
    isSendEmail: boolean;
    isRegisterDoc: boolean;
    @ViewChild('basicModal') modal: ModalDirective;
    dataDialog: any;
    title: string = 'Detalii scrisoare de solicitare date aditionale';

    constructor(private fb: FormBuilder, private administrationService: AdministrationService,
                private documentService: DocumentService,
                private medicamentService: MedicamentService,
                private authService: AuthService,
                private modalService: ModalService,
                private router: Router,
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
    }

    ngAfterViewInit(): void {
        this.modalService.data.asObservable().subscribe(value => {
            if (value != '' && value.modalType == 'REQUEST_ADDITIONAL_DATA') {
                this.modalService.data.next('');
                this.openModal(value);
            } else if (value != '' && value.modalType == 'NOTIFICATION') {
                this.title = 'Detalii scrisoare de informare';
                this.openModal(value);
            } else if (value != '' && value.modalType == 'LABORATORY_ANALYSIS') {
                this.title = 'Detalii scrisoare solicitare pentru desfasurarea analizei de laborator ';
                this.openModal(value);
            }
        })
    }

    openModal(value: any) {
        this.dataDialog = value;
        this.reqForm.reset();
        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.reqForm.get('docNumber').setValue(data);
                },
                error => console.log(error)
            )
        );
        this.reqForm.get('data').setValue(new Date());
        this.modal.show();
    }

    sendMail() {
        this.isSendEmail = true;
        if (this.reqForm.get('title').invalid || this.reqForm.get('content').invalid || this.reqForm.get('email').invalid) {
            return;
        }
        this.isSendEmail = false;
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur(a)?', confirm: false}
        });
        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                //send email
                this.subscriptions.push(this.administrationService.sendEmail(this.reqForm.get('title').value, this.reqForm.get('content').value, this.reqForm.get('email').value).subscribe(data => {
                        //generate doc
                        this.generateDoc();
                    }, error => console.log('Scrisoarea nu a putut fi expediata.'))
                );
            }
        });
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

    generateDoc() {
        this.subscriptions.push(this.documentService.generateRequestAdditionalData(this.reqForm.get('docNumber').value,
            this.dataDialog.requestNumber,
            this.reqForm.get('content').value,
            this.reqForm.get('title').value,
            this.dataDialog.modalType).subscribe(data => {
                //register in db
                this.subscriptions.push(this.medicamentService.saveRequest(this.getDocEntity(data), this.dataDialog.modalType).subscribe(data => {
                        this.modal.hide();
                        this.modalService.data.next({action: 'CLOSE_MODAL'});
                    }, error => console.log('Scrisoarea nu a putut fi salvata in baza de date.'))
                );
            }, error => console.log('Scrisoarea nu a putut fi generata.'))
        );
    }

    view() {
        this.isRegisterDoc = true;
        if (this.reqForm.get('title').invalid || this.reqForm.get('content').invalid) {
            return;
        }
        this.isRegisterDoc = false;
        this.subscriptions.push(this.documentService.viewRequest(this.reqForm.get('docNumber').value,
            this.reqForm.get('content').value,
            this.reqForm.get('title').value,
            this.dataDialog.modalType).subscribe(data => {
                let file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }, error => {
                console.log('error ', error);
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
        this.generateDoc();
    }

    cancel(): void {

        var message = '';
        switch (this.dataDialog.modalType) {
            case  'NOTIFICATION' : {
                message = 'Scrisoarea de informare nu va fi inregistrata in sistem. Doriti sa inchideti aceasta pagina?';
                break;
            }
            case  'LABORATORY_ANALYSIS' : {
                message = 'Solicitarea nu va fi inregistrata in sistem. Doriti sa inchideti aceasta pagina?';
                break;
            }
            case  'REQUEST_ADDITIONAL_DATA' : {
                message = 'Scrisoarea de solicitare nu va fi inregistrata in sistem. Doriti sa inchideti aceasta pagina?';
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
                this.modal.hide();
            }
        });


    }

}
