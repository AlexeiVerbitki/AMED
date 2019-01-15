import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {AdministrationService} from "../shared/service/administration.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {AddCtPayOrderComponent} from "../dialog/add-ct-pay-order/add-ct-pay-order.component";
import {PaymentService} from "../shared/service/payment.service";
import {LoaderService} from "../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../dialog/confirmation-dialog.component";
import {ErrorHandlerService} from "../shared/service/error-handler.service";

@Component({
    selector: 'app-payment-clinical-trial',
    templateUrl: './payment-clinical-trial.component.html',
    styleUrls: ['./payment-clinical-trial.component.css']
})
export class PaymentClinicalTrialComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    private regReqId: number = -1;

    //Bon de plata
    bonDePlataList: any[] = [];
    bonDePlataTotal: number = 0;

    //Incasari
    receiptsList: any[] = [];
    receiptsTotal: number = 0;

    total: number = 0;

    constructor(private paymentService: PaymentService,
                private dialog: MatDialog,
                private loadingService: LoaderService,
                private administrationService: AdministrationService,
                private errorHandlerService: ErrorHandlerService) {
    }

    ngOnInit() {


        // console.log('this.bonDePlataList', this.bonDePlataList);
    }

    @Input()
    set registrationReqestId(regRequestId: number) {
        // console.log('regRequestId', regRequestId);
        if (regRequestId) {
            this.regReqId = regRequestId;
            this.loadPaymentOrders();
        }
    }

    get registrationReqestId(): number {
        return this.regReqId;
    }

    protected checkReceipts() {
        const ar: any[] = [];
        for (const bon of this.bonDePlataList) {
            ar.push(bon.number);
        }
        this.loadReceipts(ar);
    }

    private loadReceipts(arr: number[]) {
        this.loadingService.show();
        this.subscriptions.push(this.administrationService.getReceiptsByPaymentOrderNumbers(arr).subscribe(data => {
                console.log('data', data.body);
                if (data.body) {
                    this.receiptsList = data.body;
                    this.recalculateTotalReceipts();
                }
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    private loadPaymentOrders() {
        this.loadingService.show();
        this.subscriptions.push(
            this.paymentService.getPaymentOrders(this.regReqId).subscribe(data => {
                    // console.log('data', data);
                    this.bonDePlataList = data;
                    if (this.bonDePlataList.length != 0) {
                        this.checkReceipts();
                    }
                    this.recalculateTotalTaxes();
                    this.loadingService.hide();
                },
                error => {
                    console.log(error);
                    this.loadingService.hide();
                })
        );
    }

    protected addTaxes() {
        // console.log('adding taxes');
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.data = {
            newTax: true,
            specificBon: [],
            payOrderId: null,
            regReqId: this.regReqId
        };

        dialogConfig2.width = '800px';
        let dialogRef = this.dialog.open(AddCtPayOrderComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result) {
                this.bonDePlataList.push(result);
                this.recalculateTotalTaxes();
            }
        });
    }

    protected editTaxes(bon: any) {
        console.log('bon', bon);

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.data = {
            newTax: false,
            //Deep cloning of bon
            specificBon: JSON.parse(JSON.stringify(bon)),
            payOrderId: bon.id,
            regReqId: this.regReqId
        };

        dialogConfig2.width = '800px';
        let dialogRef = this.dialog.open(AddCtPayOrderComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result) {
                // console.log('result', result);
                let findBon = this.bonDePlataList.find(filterBon => filterBon.id == result.id)
                findBon.ctPayOrderServices = result.ctPayOrderServices;
                // console.log('this.bonDePlataList', this.bonDePlataList);
                this.recalculateTotalTaxes();
            }
        });
    }

    protected delete(bon: any, index: number) {
        const arr: any[] = [];
        for (const bon of this.bonDePlataList) {
            arr.push(bon.number);
        }

        this.loadingService.show();
        this.subscriptions.push(this.administrationService.getReceiptsByPaymentOrderNumbers(arr).subscribe(data => {
                console.log('data', data.body);
                if (data.body) {
                    this.receiptsList = data.body;
                    this.recalculateTotalReceipts();
                }
                let receiptExist = this.receiptsList.filter(receipt => receipt.number == bon.number);
                if (receiptExist) {
                    this.loadingService.hide();
                    this.errorHandlerService.showError('Exista plati pe bonul nr: ' + bon.number);
                    return;
                }
                this.loadingService.hide();

                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta taxa?', confirm: false}
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        // console.log('result', result);
                        // console.log('delete bon', bon);
                        this.subscriptions.push(
                            this.paymentService.deleteCtPayOrder(bon.id).subscribe(data => {
                                this.bonDePlataList.splice(index, 1);
                                this.recalculateTotalTaxes();
                            }, error => {
                                console.log(error)
                            })
                        )
                    }
                });
            }, error => this.loadingService.hide())
        );
    }

    // private isValidPaymentOrderBeforeChanges(bonNr: number) {
    //     const arr: any[] = [];
    //     for (const bon of this.bonDePlataList) {
    //         arr.push(bon.number);
    //     }
    //
    //     this.loadingService.show();
    //     this.subscriptions.push(this.administrationService.getReceiptsByPaymentOrderNumbers(arr).subscribe(data => {
    //             console.log('data', data.body);
    //             if (data.body) {
    //                 this.receiptsList = data.body;
    //                 this.recalculateTotalReceipts();
    //             }
    //             let receiptExist = this.receiptsList.filter(receipt => receipt.number == bonNr);
    //             if (receiptExist) {
    //                 this.loadingService.hide();
    //                 return false;
    //                 // this.errorHandlerService.showError('Exista plati pe bonul nr: ' + bonNr);
    //             }
    //             this.loadingService.hide();
    //             return true;
    //         }, error => this.loadingService.hide())
    //     );
    // }

    private recalculateTotalTaxes() {
        this.bonDePlataTotal = 0;
        // console.log('this.bonDePlataList', this.bonDePlataList);
        this.bonDePlataList.forEach(bon => {
            bon.ctPayOrderServices.filter(serv => serv.serviceCharge.category != 'BS').forEach(charge => {
                this.bonDePlataTotal += (charge.quantity * charge.serviceCharge.amount);
                // console.log('charge', charge.quantity);
            })
        });
        this.recalculateTotal();
    }

    private recalculateTotalReceipts() {
        this.receiptsTotal = 0;
        this.receiptsList.forEach(receipt => {
            this.receiptsTotal += receipt.amount;
        });
        this.recalculateTotal();
    }

    private recalculateTotal() {
        this.total = this.receiptsTotal - this.bonDePlataTotal;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
