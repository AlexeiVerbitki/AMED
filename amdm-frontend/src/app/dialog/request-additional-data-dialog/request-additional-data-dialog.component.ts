import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
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
    functions: any[];
    loadingFunctions : boolean =false;

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
            'content': [null, Validators.required],
            'function': [null, Validators.required]
        });
    }

    ngOnInit() {

        var datePipe = new DatePipe("en-US");
        this.reqForm.get('docNumber').setValue('SL-'+this.dataDialog.requestNumber+'-'+this.dataDialog.nrOrdDoc);

        if (this.dataDialog.modalType == 'REQUEST_ADDITIONAL_DATA') {
            let x = '\tPrin prezenta, Agenția Medicamentului și Dispozitivelor Medicale Vă informează, că în rezultatul expertizei specializate a dosarului produsului medicamentos '+this.dataDialog.medicamentStr+' depus pentru autorizare, s-a constatat că:';
            let z = '\r\n\t-  c......';
            let y = '\r\n\tMenţionăm, că în cazul în care obiecţiile expuse nu vor fi înlăturate în termenul stabilit, conform prevederilor pct. 46, sec. 1, capit.III al Regulamentului cu privire la autorizarea medicamentelor, aprobat prin ordinul Ministerului Sănătăţii nr.739 din 23.07.2012 „Cu privire la reglementarea autorizării produselor medicamentoase de uz uman şi introducerea modificărilor postautorizare” procedura de autorizare se va întrerupe.';
            this.reqForm.get('content').setValue(x+z+y);
        }
        if (this.dataDialog.modalType == 'NOTIFICATION') {
            this.title = 'Detalii scrisoare de informare';
            this.reqForm.get('docNumber').setValue('NL-'+this.dataDialog.requestNumber);
            let x = '\tPrin prezenta, Agenţia Medicamentului şi Dispozitivelor Medicale, Vă informeazăcă în baza ordinului „Cu privire la înregistrarea medicamentelor” Nr. _________';
            let y = ', a fost întreruptă procedura de înregistrare a medicamentului din motivul: '+this.dataDialog.motiv+', pentru produsul medicamentos:';
            let z = '\r\n\t - '+this.dataDialog.medicamentStr;
            let w = '\r\n\tÎntreruperea procedurii nu prejudiciază dreptul deținătorului de a redepune cererea conform pct. _____, capitolul ___ al Ordinului MSRM Nr. ___ din ________ "Cu privire la reglementarea înregistrării produselor medicamentoase", cu modificările şi completările ulterioare.'
            this.reqForm.get('content').setValue(x+y+z+w);
        }

        this.subscriptions.push(
            this.administrationService.getAllDocTypes().subscribe(data => {
                    this.docTypes = data;
                },
                error => console.log(error)
            )
        );

        this.loadingFunctions = true;
        this.subscriptions.push(
            this.administrationService.getAllSysParams().subscribe(data => {
                    this.functions = data;
                    this.functions = this.functions.filter(t=> t.code.startsWith('FN'));
                    this.loadingFunctions = false;
                },
                error => {console.log(error);  this.loadingFunctions = false;}
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

    view() {
        this.isRegisterDoc = true;
        if (this.reqForm.invalid) {
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
                docType = 'SL';
                break;
            }
        }
        let modelToSubmit = {nrDoc : this.reqForm.get('docNumber').value, responsiblePerson : this.dataDialog.registrationRequestMandatedContact.mandatedLastname+' '+this.dataDialog.registrationRequestMandatedContact.mandatedFirstname, companyName : this.dataDialog.companyName,
            requestDate: new Date(),country : 'Moldova',  address : this.dataDialog.address, phoneNumber : this.dataDialog.registrationRequestMandatedContact.phoneNumber, email : this.dataDialog.registrationRequestMandatedContact.email, message : this.reqForm.get('content').value,
            function : this.reqForm.get('function').value.description, signerName : this.reqForm.get('function').value.value };

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

   save() {
        this.isRegisterDoc = true;
       if (this.reqForm.invalid) {
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
                    content: this.reqForm.get('content').value,
                    date: new Date(),
                    responseReceived : false,
                    signerName :  this.reqForm.get('function').value.value,
                    signerFunction :  this.reqForm.get('function').value.description
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
                    content: this.reqForm.get('content').value,
                    date: new Date(),
                    responseReceived : false,
                    signerName :  this.reqForm.get('function').value.value,
                    signerFunction :  this.reqForm.get('function').value.description
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

}
