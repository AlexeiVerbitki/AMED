import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AdministrationService} from "../shared/service/administration.service";
import {Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {AddPaymentOrderComponent} from "../dialog/add-payment-order/add-payment-order.component";
import {LoaderService} from "../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../dialog/confirmation-dialog.component";
import {DocumentService} from "../shared/service/document.service";
import {ErrorHandlerService} from "../shared/service/error-handler.service";

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    //Bon de plata
    private subscriptions: Subscription[] = [];
    bonDePlataList: any[] = [];
    bonDePlataTotal: number = 0;

    //Incasari
    receiptsList: any[] = [];
    receiptsTotal: number = 0;
    total: number = 0;

    disabled: boolean = false;
    bonSuplimentarNotRender: boolean = false;
    requestIdP: any;

    constructor(private administrationService: AdministrationService,
                private dialog: MatDialog,
                private documentService: DocumentService,
                private errorHandlerService: ErrorHandlerService,
                private loadingService: LoaderService) {

    }

    ngOnInit() {
    }

    loadPaymentOrders() {
        if (!this.requestIdP) {
            this.requestIdP = 0;
        }

        this.subscriptions.push(
            this.administrationService.getPaymentOrders(this.requestIdP).subscribe(data => {
                    this.bonDePlataList = data;
                    if (this.bonDePlataList.length != 0) {
                        this.checkReceipts();
                    }
                    this.recalculateTotalTaxes();
                },
                error => {
                    console.log(error);
                    this.loadingService.hide();
                }
            )
        );
    }

    @Output() totalValueChanged = new EventEmitter();

    get isDisabled(): boolean {
        return this.disabled;
    }

    @Input()
    set isDisabled(disabled: boolean) {
        this.disabled = disabled;
    }

    addTaxes() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';
        dialogConfig2.data = {bonSuplimentarNotRender: this.isBonSuplimentarNotRender};

        let dialogRef = this.dialog.open(AddPaymentOrderComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                result.registrationRequestId = this.requestIdP;
                this.loadingService.show();
                this.subscriptions.push(
                    this.administrationService.addPaymentOrder(result).subscribe(request => {
                            this.loadPaymentOrders();
                            this.loadingService.hide();
                        },
                        error => {
                            console.log(error);
                            this.loadingService.hide();
                        }
                    ));
            }
        });
    }

    isDisableDeleteBonDePlata(bonDePlata: any): boolean {
        return this.receiptsList.find(r => r.paymentOrderNumber == bonDePlata.number);
    }

    deleteBonDePlata(bonDePlata: any, i: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta taxa?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                this.subscriptions.push(this.administrationService.removePaymentOrder(bonDePlata.id).subscribe(data => {
                        this.bonDePlataList.splice(i, 1);
                        this.recalculateTotalTaxes();
                        this.loadingService.hide();
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    private recalculateTotalTaxes() {
        this.bonDePlataTotal = 0;
        this.bonDePlataList.filter(bon => bon.serviceCharge.category != 'BS').forEach(bon => {
            this.bonDePlataTotal += bon.amount;
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
        this.totalValueChanged.emit(this.total);
    }

    checkReceipts() {
        let ar: any[] = [];
        for (let bon of this.bonDePlataList) {
            ar.push(bon.number);
        }

        this.loadingService.show();
        this.subscriptions.push(this.administrationService.getReceiptsByPaymentOrderNumbers(ar).subscribe(data => {
                this.receiptsList = data.body;
                this.recalculateTotalReceipts();
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    get isBonSuplimentarNotRender(): boolean {
        return this.bonSuplimentarNotRender;
    }

    @Input()
    set isBonSuplimentarNotRender(bonSuplimentarNotRender: boolean) {
        this.bonSuplimentarNotRender = bonSuplimentarNotRender;
    }

    get requestId(): any {
        return this.requestIdP;
    }

    @Input()
    set requestId(requestId: any) {
        this.requestIdP = requestId;
        if (requestId) {
            this.loadPaymentOrders();
        }
    }

    generateBonDePlataForAll() {
        if (this.bonDePlataList.length != 0) {
            this.loadingService.show();
            this.subscriptions.push(this.documentService.viewBonDePlata(this.requestIdP).subscribe(data => {
                    let file = new Blob([data.body], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.loadPaymentOrders();
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                }
                )
            );
        } else {
            this.errorHandlerService.showError('Nu a fost introdusa nici o taxa spre achitare');
        }
    }

    generateSingleBonDePlata(bonDePlata: any) {
        this.loadingService.show();
        this.subscriptions.push(this.documentService.viewBonDePlataForOne(bonDePlata.id).subscribe(data => {
                let file = new Blob([data.body], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadPaymentOrders();
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

}
