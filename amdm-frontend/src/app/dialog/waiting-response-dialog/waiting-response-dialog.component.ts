import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material";
import {ModalDirective} from "angular-bootstrap-md";
import {ModalService} from "../../shared/service/modal.service";
import {Router} from "@angular/router";
import {MedicamentService} from "../../shared/service/medicament.service";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";
import {DocumentService} from "../../shared/service/document.service";
import {AdministrationService} from "../../shared/service/administration.service";
import {AuthService} from "../../shared/service/authetication.service";

@Component({
    selector: 'app-waiting-response-dialog',
    templateUrl: './waiting-response-dialog.component.html',
    styleUrls: ['./waiting-response-dialog.component.css']
})
export class WaitingResponseDialogComponent implements OnInit, AfterViewInit {
    waitingForm: FormGroup;
    private subscriptions: Subscription[] = [];
    formSubmitted: boolean;
    requestId: string;
    requestNumber: string;
    generatedDocNrSeq: string;
    @ViewChild('basicModal') modal: ModalDirective;

    constructor(private fb: FormBuilder,
                public dialogConfirmation: MatDialog,
                private router: Router,
                private medicamentService: MedicamentService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private documentService: DocumentService,
                private modalService: ModalService) {
        this.waitingForm = fb.group({
            'code': [null, Validators.required]
        });
    }

    ngOnInit() {
        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                },
                error => console.log(error)
            )
        );
    }

    ngAfterViewInit(): void {
        this.modalService.data.asObservable().subscribe(value => {
            if (value.modalType == 'WAITING') {
                this.requestId = value.requestId;
                this.requestNumber = value.requestNumber;
                this.waitingForm.reset();
                this.modal.show();
            }
        })
    }

    nextStep() {
        this.formSubmitted = true;

        if (this.waitingForm.get('code').invalid) {
            return;
        }

        this.formSubmitted = false;

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur(a)?', confirm: false}
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                if (this.waitingForm.get('code').value == '1') {
                    var docEntity = {
                        requestId: this.requestId
                    };
                    this.subscriptions.push(this.medicamentService.answerReceivedRequestAdditionalData(docEntity).subscribe(data => {
                            this.modal.hide();
                            this.modalService.data.next({action: 'CLOSE_MODAL'});
                        }, error => console.log('Raspuns primit nu a fost inregistrat in baza de date'))
                    );
                } else {
                    //this.generateOrderAndSaveInDB();
                    //navigate dsfsdf
                }
            }
        });

    }

    // generateOrderAndSaveInDB() {
    //     this.subscriptions.push(this.documentService.generateOrdinDeInrerupereAInregistrariiMedicamentului(this.generatedDocNrSeq, this.requestNumber).subscribe(data => {
    //             //register in db
    //             var docEntity = {
    //                 date: new Date(),
    //                 name: 'Ordin de întrerupere a procedurii de înregistrare a medicamentului Nr ' + this.generatedDocNrSeq + '.pdf',
    //                 path: data,
    //                 docType: 'OI',
    //                 requestId: this.requestId,
    //                 username:this.authService.getUserName()
    //             };
    //
    //             this.subscriptions.push(this.medicamentService.saveOrderInterrupt(docEntity).subscribe(data => {
    //                     this.modal.hide();
    //                     this.modalService.data.next({action: 'CLOSE_WAITING_MODAL'});
    //                 }, error => console.log('Ordinul de inrerurpere nu a putut fi salvat in baza de date.'))
    //             );
    //
    //         }, error => console.log('Ordinul de inrerurpere nu a putut fi generat.'))
    //     );
    // }

    leaveProcess() {
        this.router.navigate(['dashboard/module']);
    }

    // viewOrdin() {
    //     this.subscriptions.push(this.documentService.viewOrdinDeInrerupereAInregistrariiMedicamentului(this.generatedDocNrSeq).subscribe(data => {
    //             let file = new Blob([data], {type: 'application/pdf'});
    //             var fileURL = URL.createObjectURL(file);
    //             window.open(fileURL);
    //         }, error => {
    //             console.log('error ', error);
    //         }
    //         )
    //     );
    // }

}
