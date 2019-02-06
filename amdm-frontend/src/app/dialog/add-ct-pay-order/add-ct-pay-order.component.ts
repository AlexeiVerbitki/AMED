import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../shared/service/administration.service';
import {PaymentService} from '../../shared/service/payment.service';

@Component({
    selector: 'app-add-ct-pay-order',
    templateUrl: './add-ct-pay-order.component.html',
    styleUrls: ['./add-ct-pay-order.component.css']
})

export class AddCtPayOrderComponent implements OnInit, OnDestroy {
    addBonForm: FormGroup;
    addChargeForm: FormGroup;
    paymentOrder: any;
    ctPayOrderServices: any[] = [];
    pageName = 'Adaugare';
    ngOn;
    //Copy Of Charges
    serviceCharges: any[] = [];
    //Working Copy Of Charges
    serviceChargesList: any[] = [];
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogRef: MatDialogRef<AddCtPayOrderComponent>,
                private administrationService: AdministrationService,
                private paymentService: PaymentService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        // console.log('dataDialog', this.dataDialog);
        this.addBonForm = this.fb.group({
            'bonNr': {value: null, disabled: true},
            'date': {value: null, disabled: true},
            'quantity': [1, [Validators.required, Validators.min(1)]],
            'serviceCharge': [null, Validators.required],
            'amount': [null, Validators.required],
            'response': [null]
        });

        this.addChargeForm = this.fb.group({
            'serviceCharge': [],
            'quantity': {value: 0, disabled: true},
            'total': {value: 0, disabled: true}
        });


        this.initPage();
        this.loadServiceChares();
        this.controlChargesFormEvents();

        // console.log('this.paymentOrder', this.paymentOrder);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    addService() {
        // console.log('this.addChargeForm', this.addChargeForm);
        // console.log('this.addBonForm', this.addBonForm);
        const serviceCharge = this.addChargeForm.get('serviceCharge').value;
        if (serviceCharge.category != 'BS') {
            this.ctPayOrderServices.push({
                id: null,
                payOrderId: this.dataDialog.payOrderId,
                quantity: this.addChargeForm.get('quantity').value,
                serviceCharge: serviceCharge,
                additionalPayment: 0
            });
            this.serviceChargesList = this.serviceChargesList.filter(servCharge => servCharge.category != 'BS');
            // console.log('indexOfServiceCharge', this.serviceChargesList.indexOf(serviceCharge));
            // console.log('this.serviceChargesList', this.serviceChargesList);
            this.addChargeForm.reset();
        } else if (serviceCharge.category == 'BS') {
            this.ctPayOrderServices.push({
                id: null,
                payOrderId: this.dataDialog.payOrderId,
                quantity: this.addChargeForm.get('quantity').value,
                serviceCharge: this.addChargeForm.get('serviceCharge').value,
                additionalPayment: this.addChargeForm.get('total').value
            });
            this.addChargeForm.reset();
            this.addChargeForm.disable();
        }


        // console.log('this.ctPayOrderServices', this.ctPayOrderServices);
    }

    recalc() {
        // console.log('recalculating');
        this.addChargeForm.get('total').setValue(this.addChargeForm.get('serviceCharge').value.amount * this.addChargeForm.get('quantity').value);
    }

    close() {
        this.dialogRef.close();
    }

    add() {
        if (this.dataDialog.newTax) {
            this.paymentOrder.date = new Date();
        }

        this.subscriptions.push(
            this.paymentService.saveCtPayOrder(this.paymentOrder).subscribe(data => {
                    //console.log('saveCtPayOrder()', data.body);
                    this.dialogRef.close(data.body);
                },
                error => console.log(error)
            )
        );
    }

    protected initPage() {
        if (this.dataDialog.newTax) {
            this.paymentOrder = {
                id: null,
                date: null,
                number: null,
                registrationRequestId: this.dataDialog.regReqId,
                ctPayOrderServices: []
            };
            // this.ctPayOrderServices = [];
            this.addBonForm.get('bonNr').setValue('---');
            this.addBonForm.get('date').setValue(new Date().toLocaleDateString());
        } else {
            this.pageName = 'Editare';
            this.paymentOrder = this.dataDialog.specificBon;
            this.addBonForm.get('bonNr').setValue(this.paymentOrder.number);
            this.addBonForm.get('date').setValue(new Date(this.paymentOrder.date).toLocaleDateString());

            if (this.paymentOrder.ctPayOrderServices.length == 1 && this.paymentOrder.ctPayOrderServices[0].serviceCharge.category == 'BS') {
                console.log('este bon supl');
                this.addChargeForm.disable();
            } else {
                console.log('nu este bon supl');
            }
        }
        this.ctPayOrderServices = this.paymentOrder.ctPayOrderServices;
    }

    protected controlChargesFormEvents() {
        this.subscriptions.push(
            this.addChargeForm.get('serviceCharge').valueChanges.subscribe(data => {
                    this.addChargeForm.get('quantity').disable();
                    this.addChargeForm.get('total').disable();
                    // console.log('serviceCharge', data);
                    this.addChargeForm.get('quantity').setValue(1);
                    if (data && data.category != 'BS') {
                        this.addChargeForm.get('quantity').enable();
                        this.addChargeForm.get('total').setValue(data.amount * this.addChargeForm.get('quantity').value);
                    } else if (data && data.category == 'BS') {
                        this.addChargeForm.get('total').enable();
                        this.addChargeForm.get('total').setValue(0);
                    }
                },
                error => console.log(error)
            )
        );
    }

    protected loadServiceChares() {
        this.subscriptions.push(
            this.administrationService.getAllServiceCharges().subscribe(data => {
                    // console.log('getAllServiceCharges()', data);
                    this.serviceCharges = data;
                    this.serviceChargesList = this.serviceCharges.slice();
                    if (!this.dataDialog.newTax) {
                        console.log('this.serviceChargesList', this.serviceChargesList);
                        this.serviceChargesList = this.serviceChargesList.filter(servCharge => servCharge.category != 'BS');
                        console.log('this.serviceChargesList2', this.serviceChargesList);
                    }
                },
                error => console.log(error)
            )
        );
    }

    protected deleteSerevice(index: number) {
        this.ctPayOrderServices.splice(index, 1);

        console.log('this.ctPayOrderServices', this.ctPayOrderServices);
        if (this.ctPayOrderServices.length == 0) {
            console.log('this.serviceCharges', this.serviceCharges);
            this.serviceChargesList = this.serviceCharges.splice(0);
        }
        console.log('this.serviceCharges', this.serviceCharges);
        console.log('this.serviceChargesList', this.serviceChargesList);

        this.addChargeForm.reset();
        this.addChargeForm.enable();
        this.addChargeForm.get('quantity').disable();
        this.addChargeForm.get('total').disable();
    }

}
