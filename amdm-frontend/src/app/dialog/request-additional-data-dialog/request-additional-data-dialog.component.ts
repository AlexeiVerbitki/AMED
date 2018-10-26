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
            }
        })
    }

    openModal(value: any) {
        console.log(value.requestId);
        console.log(value.id);
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

    generateDoc() {
        this.subscriptions.push(this.documentService.generateRequestAdditionalData(this.reqForm.get('docNumber').value,
            this.dataDialog.requestNumber,
            this.reqForm.get('content').value,
            this.reqForm.get('title').value,
            this.dataDialog.modalType).subscribe(data => {
                //register in db
            console.log('ID '+this.dataDialog.requestId);
                var docEntity = {
                    date: new Date(),
                    name: this.dataDialog.modalType != 'NOTIFICATION' ? 'Scrisoare de solicitare date aditionale Nr ' + this.reqForm.get('docNumber').value + '.pdf' :
                        'Scrisoare de informare Nr ' + this.reqForm.get('docNumber').value + '.pdf',
                    path: data,
                    email: this.reqForm.get('email').value,
                    docType: this.dataDialog.modalType != 'NOTIFICATION' ? 'RA' : 'NL',
                    requestId: this.dataDialog.requestId,
                    mainPageStartDate: this.dataDialog.mainPageStartDate,
                    solictiationStartDate: this.dataDialog.solictiationStartDate,
                    username: this.authService.getUserName()
                };
                this.subscriptions.push(this.medicamentService.saveRequest(docEntity, this.dataDialog.modalType).subscribe(data => {
                        this.modal.hide();
                        if (this.dataDialog.modalType == 'NOTIFICATION') {
                            this.router.navigate(['dashboard/module']);
                        } else {
                            this.modalService.data.next({action: 'CLOSE_MODAL'});
                        }
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

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Scrisoarea de solicitare nu va fi inregistrata in sistem. Doriti sa inchideti aceasta pagina?',
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
