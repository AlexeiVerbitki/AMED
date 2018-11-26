import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdministrationService} from "../shared/service/administration.service";
import {Receipt} from "../models/receipt";
import {PaymentOrder} from "../models/paymentOrder";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    //Receipt controls
    private subscriptions: Subscription[] = [];
    addReceiptForm: FormGroup;
    receiptsList: Receipt[] = [];
    receiptTotal: number = 0;

    //Payment Order controls
    addPaymentOrderForm: FormGroup;
    paymentOrdersList: PaymentOrder[] = [];
    paymentOrdersTotal: number = 0;

    bonSuplimentarNotRender: boolean = false;

    total: number = 0;

    disabled: boolean = false;

    serviceCharges: any[] = [];

    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService) {
        this.addReceiptForm = this.fb.group({
            'receiptNumber': [''],
            'date': [''],
            'serviceCharge': [null, Validators.required],
            'amount': [, Validators.required],
            'sP': [{value:false, disabled : this.disabled} ]
        });

        this.addPaymentOrderForm = this.fb.group({
            'nr': ['', Validators.required],
            'data': [null, Validators.required],
            'basis': ['', Validators.required],
            'amount': [null, Validators.required]
        })
    }

    ngOnInit() {
        this.recalculateTotalReceipt();
        this.recalculateTotalPaymentOrders();

        this.subscriptions.push(
            this.administrationService.getAllServiceCharges().subscribe(data => {
                    this.serviceCharges = data;
                    this.serviceCharges.push({description : "Bon suplimentar", amount : 0});
                },
                error => console.log(error)
            )
        );
    }

    get receipts(): Receipt [] {
        return this.receiptsList;
    }

    @Input()
    set receipts(receiptList: Receipt []) {
        this.receiptsList = receiptList;
        this.recalculateTotalReceipt();
        this.recalculateTotalPaymentOrders();
    }

    get paymentOrders(): PaymentOrder [] {
        return this.paymentOrdersList;
    }

    @Input()
    set paymentOrders(paymentOrdersList: PaymentOrder []) {
        this.paymentOrdersList = paymentOrdersList;
        this.recalculateTotalReceipt();
        this.recalculateTotalPaymentOrders();
    }

    @Output() totalValueChanged = new EventEmitter();

    get isDisabled(): boolean {
        return this.disabled;
    }

    @Input()
    set isDisabled(disabled: boolean) {
        for(var control in this.addReceiptForm.controls){
            disabled ? this.addReceiptForm.controls[control].disable() : this.addReceiptForm.controls[control].enable();
        }

        for(var control in this.addPaymentOrderForm.controls){
            disabled ? this.addPaymentOrderForm.controls[control].disable() : this.addPaymentOrderForm.controls[control].enable();
        }
        this.disabled = disabled;
    }

    get isBonSuplimentarNotRender(): boolean {
        return this.bonSuplimentarNotRender;
    }

    @Input()
    set isBonSuplimentarNotRender(bonSuplimentarNotRender: boolean) {
        this.bonSuplimentarNotRender = bonSuplimentarNotRender;
    }

    addReceipt() {
        if (this.addReceiptForm.invalid) {
            return;
        }

        this.administrationService.generateReceiptNr().subscribe(data => {
                this.addReceiptForm.get('receiptNumber').setValue(data);
                this.addReceiptForm.get('date').setValue(new Date());
                this.receiptsList.push(this.addReceiptForm.value);
                this.recalculateTotalReceipt();
                this.addReceiptForm.reset();
                this.addReceiptForm.get('sP').setValue(false);
            },
            error => console.log(error)
        );
    }

    deleteReceipt(receipt: any) {
        var intdexToDelete = this.receiptsList.indexOf(receipt);
        // console.log(intdexToDelete);
        this.receiptsList.splice(intdexToDelete, 1);
        this.recalculateTotalReceipt();
    }

    private recalculateTotalReceipt() {
        this.receiptTotal = 0;
        this.receiptsList.forEach(receipt => {
            if (!receipt.sP) {
                this.receiptTotal += receipt.amount;
            }
        });
        this.recalculateTotal();
    }

    addPaymentOrder() {
        if (this.addPaymentOrderForm.invalid) {
            return;
        }
        this.paymentOrdersList.push(this.addPaymentOrderForm.value);
        this.addPaymentOrderForm.reset();
        this.recalculateTotalPaymentOrders();
    }

    deletePaymentOrder(payOrder: any) {
        var intdexToDelete = this.paymentOrdersList.indexOf(payOrder);
        // console.log(intdexToDelete);
        this.paymentOrdersList.splice(intdexToDelete, 1);
        this.recalculateTotalPaymentOrders();
    }

    private recalculateTotalPaymentOrders() {
        this.paymentOrdersTotal = 0;
        this.paymentOrdersList.forEach(receipt => {
            this.paymentOrdersTotal += receipt.amount;
        });
        this.recalculateTotal();
    }

    private recalculateTotal(){
        this.total = this.paymentOrdersTotal - this.receiptTotal;
        this.totalValueChanged.emit(this.total);
    }

    checkAmount()
    {
        if(this.addReceiptForm.get('serviceCharge').value) {
            this.addReceiptForm.get('amount').setValue(this.addReceiptForm.get('serviceCharge').value.amount);
        }
    }

}
