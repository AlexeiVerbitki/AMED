import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {AdministrationService} from '../shared/service/administration.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddCtPayOrderComponent} from '../dialog/add-ct-pay-order/add-ct-pay-order.component';
import {PaymentService} from '../shared/service/payment.service';
import {LoaderService} from '../shared/service/loader.service';
import {ConfirmationDialogComponent} from '../dialog/confirmation-dialog.component';
import {SuccessOrErrorHandlerService} from '../shared/service/success-or-error-handler.service';
import {SelectCurrencyBonPlataDialogComponent} from '../dialog/select-currency-bon-plata-dialog/select-currency-bon-plata-dialog.component';

@Component({
    selector: 'app-payment-clinical-trial',
    templateUrl: './payment-clinical-trial.component.html',
    styleUrls: ['./payment-clinical-trial.component.css']
})
export class PaymentClinicalTrialComponent implements OnInit, OnDestroy {

    //Bon de plata
    bonDePlataList: any[] = [];
    bonDePlataTotal = 0;
    // private regReqId: number = -1;
    //Incasari
    receiptsList: any[] = [];
    receiptsTotal = 0;
    total = 0;
    private subscriptions: Subscription[] = [];
    private regRequest: any;

    constructor(private paymentService: PaymentService,
                private dialog: MatDialog,
                private loadingService: LoaderService,
                private administrationService: AdministrationService,
                private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    get registrationRequest(): any {
        return this.regRequest;
    }

    @Input()
    set registrationRequest(regRequest: any) {
        if (regRequest) {
            this.regRequest = regRequest;
            this.loadPaymentOrders();
        }
    }

    ngOnInit() {
        // console.log('this.bonDePlataList', this.bonDePlataList);
    }

    checkReceipts() {
        const ar: any[] = [];
        for (const bon of this.bonDePlataList) {
            ar.push(bon.number);
        }
        this.loadReceipts(ar);
    }

    public addTaxes() {
        // console.log('adding taxes');
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.data = {
            newTax: true,
            specificBon: [],
            payOrderId: null,
            regReqId: this.regRequest.id
        };

        dialogConfig2.width = '800px';
        const dialogRef = this.dialog.open(AddCtPayOrderComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result) {
                this.bonDePlataList.push(result);
                this.recalculateTotalTaxes();
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    protected editTaxes(bon: any) {
        // console.log('bon', bon);

        const arr: any[] = [];
        for (const eachBon of this.bonDePlataList) {
            arr.push(eachBon.number);
        }

        this.loadingService.show();
        this.subscriptions.push(this.administrationService.getReceiptsByPaymentOrderNumbers(arr).subscribe(data => {
                if (data.body) {
                    this.receiptsList = data.body;
                    this.recalculateTotalReceipts();
                }
                const receiptExist = this.receiptsList.filter(receipt => receipt.paymentOrderNumber == bon.number);
                if (receiptExist.length != 0) {
                    this.loadingService.hide();
                    this.errorHandlerService.showError('Exista plati pe bonul nr: ' + bon.number);
                    return;
                }
                this.loadingService.hide();

                const dialogConfig2 = new MatDialogConfig();

                dialogConfig2.disableClose = false;
                dialogConfig2.autoFocus = true;
                dialogConfig2.hasBackdrop = true;

                dialogConfig2.data = {
                    newTax: false,
                    //Deep cloning of bon
                    specificBon: JSON.parse(JSON.stringify(bon)),
                    payOrderId: bon.id,
                    regReqId: this.regRequest.id
                };

                dialogConfig2.width = '800px';
                const dialogRef = this.dialog.open(AddCtPayOrderComponent, dialogConfig2);
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const findBon = this.bonDePlataList.find(filterBon => filterBon.id == result.id);
                        findBon.ctPayOrderServices = result.ctPayOrderServices;
                        this.recalculateTotalTaxes();
                    }
                });
            }, error => this.loadingService.hide())
        );

    }

    protected deleteTaxes(bon: any, index: number) {
        const arr: any[] = [];
        for (const eachBon of this.bonDePlataList) {
            arr.push(eachBon.number);
        }

        this.loadingService.show();
        this.subscriptions.push(this.administrationService.getReceiptsByPaymentOrderNumbers(arr).subscribe(data => {
                // console.log('data', data.body);
                if (data.body) {
                    this.receiptsList = data.body;
                    this.recalculateTotalReceipts();
                }
                const receiptExist = this.receiptsList.filter(receipt => receipt.paymentOrderNumber == bon.number);
                if (receiptExist.length != 0) {
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
                            this.paymentService.deleteCtPayOrder(bon.id).subscribe(data2 => {
                                this.bonDePlataList.splice(index, 1);
                                this.recalculateTotalTaxes();
                            }, error => {
                                console.log(error);
                            })
                        );
                    }
                });
            }, error => this.loadingService.hide())
        );
    }

    protected generatePaymantNote(bon: any) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(SelectCurrencyBonPlataDialogComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            // console.log('currencyResult', result);
            if (result) {
                // console.log('this.regRequest', this.regRequest);
                const dataModel = {
                    // clinicalTrial: this.regRequest.clinicalTrails,
                    requestType: this.regRequest.type.id,
                    clinicalTrialId: this.regRequest.clinicalTrails.id,
                    economicAgent: this.regRequest.company,
                    payOrder: bon,
                    mandatedContactEntity: this.regRequest.registrationRequestMandatedContacts.length > 0 ? this.regRequest.registrationRequestMandatedContacts[0] : null,
                    currency: result.currency,
                };

                const observable = this.paymentService.generatePaymentNote(dataModel);

                this.subscriptions.push(observable.subscribe(data => {
                        const file = new Blob([data], {type: 'application/pdf'});
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    }, error => console.log(error))
                );
            }
            //this.generateSingleBonCommonParameters(bonDePlata, result.currency);
        });
    }

    private loadReceipts(arr: number[]) {
        this.loadingService.show();
        this.subscriptions.push(this.administrationService.getReceiptsByPaymentOrderNumbers(arr).subscribe(data => {
                // console.log('data', data.body);
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
            this.paymentService.getPaymentOrders(this.regRequest.id).subscribe(data => {
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

    private recalculateTotalTaxes() {
        this.bonDePlataTotal = 0;
        // console.log('this.bonDePlataList', this.bonDePlataList);
        this.bonDePlataList.forEach(bon => {
            bon.ctPayOrderServices.filter(serv => serv.serviceCharge.category != 'BS').forEach(charge => {
                this.bonDePlataTotal += (charge.quantity * charge.serviceCharge.amount);
                // console.log('charge', charge.quantity);
            });
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
}
