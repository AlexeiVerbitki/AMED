import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material";
import {ModalDirective} from "angular-bootstrap-md";
import {ModalService} from "../../shared/service/modal.service";
import {Router} from "@angular/router";
import {MedicamentService} from "../../shared/service/medicament.service";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";

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
    modalType: string;
    title : string = 'Se asteapta raspuns la scrisoarea de solicitare date aditionale';
    @ViewChild('basicModal') modal: ModalDirective;

    constructor(private fb: FormBuilder,
                public dialogConfirmation: MatDialog,
                private router: Router,
                private medicamentService: MedicamentService,
                private modalService: ModalService) {
        this.waitingForm = fb.group({
            'code': [null, Validators.required],
            'check': [false, Validators.required]
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.modalService.data.asObservable().subscribe(value => {
            if (value.modalType == 'WAITING' || value.modalType == 'WAITING_ANALYSIS') {
                this.requestId = value.requestId;
                this.requestNumber = value.requestNumber;
                this.modalType = value.modalType;
                this.waitingForm.reset();
                this.modal.show();
            }
            if(value.modalType == 'WAITING_ANALYSIS')
            {
                this.title = 'Se asteapta rezultatul analizei de laborator';
            }
        })
    }

    nextStep() {
        this.formSubmitted = true;

        console.log(this.waitingForm.get('check').value);

        if (this.waitingForm.get('code').invalid && this.modalType=='WAITING') {
            return;
        }
        if (this.waitingForm.get('check').invalid && this.modalType=='WAITING_ANALYSIS') {
            return;
        }

        this.formSubmitted = false;

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur(a)?', confirm: false}
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                var docEntity = {
                    requestId: this.requestId
                };
                if(this.modalType=='WAITING') {
                    if (this.waitingForm.get('code').value == '1') {
                        this.subscriptions.push(this.medicamentService.answerReceivedRequestAdditionalData(docEntity).subscribe(data => {
                                this.modal.hide();
                                this.modalService.data.next({action: 'CLOSE_MODAL'});
                            }, error => console.log('Raspuns primit nu a fost inregistrat in baza de date'))
                        );
                    } else {
                        this.subscriptions.push(this.medicamentService.moveToInterrupt(docEntity).subscribe(data => {
                                this.modal.hide();
                                this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.requestId]);
                            }, error => console.log('Raspuns primit nu a fost inregistrat in baza de date'))
                        );
                    }
                }
                else if(this.modalType=='WAITING_ANALYSIS')
                {
                    var docEntity2 = {
                        requestId: this.requestId,
                        docType: 'LA'
                    };
                    this.subscriptions.push(this.medicamentService.answerReceivedRequestAdditionalData(docEntity2).subscribe(data => {
                            this.modal.hide();
                            this.modalService.data.next({action: 'CLOSE_MODAL'});
                        }, error => console.log('Raspuns primit nu a fost inregistrat in baza de date'))
                    );
                }
            }
        });

    }

    leaveProcess() {
        this.router.navigate(['dashboard/module']);
    }



}
