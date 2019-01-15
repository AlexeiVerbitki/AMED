import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../shared/service/administration.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-payment-order',
  templateUrl: './add-payment-order.component.html',
  styleUrls: ['./add-payment-order.component.css']
})
export class AddPaymentOrderComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    aForm: FormGroup;
    formSubmitted: boolean;
    serviceCharges: any[] = [];
    bonSuplimentarNotRender: boolean;

    constructor(private administrationService: AdministrationService,
                private fb: FormBuilder,
                public dialogRef: MatDialogRef<AddPaymentOrderComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
        this.aForm = fb.group({
            'serviceCharge': [null, Validators.required],
            'amount': [null, Validators.required],
            'quantity' : [1, [Validators.required, Validators.min(1)]],
            'response' : [null]
        });
    }

    ngOnInit() {
        this.bonSuplimentarNotRender = this.dataDialog.bonSuplimentarNotRender;
        this.subscriptions.push(
            this.administrationService.getAllServiceCharges().subscribe(data => {
                    this.serviceCharges = data;
                    if (this.dataDialog.bonSuplimentarNotRender) {
                        this.serviceCharges = this.serviceCharges.filter(r => r.category != 'BS');
                    }
                },
                error => console.log(error)
            )
        );
    }

    add() {
        this.formSubmitted = true;

        if (this.aForm.invalid) {
            return;
        }

        this.formSubmitted = false;
        this.aForm.get('amount').enable();
        this.aForm.get('quantity').enable();
        this.aForm.get('response').setValue(true);
        this.dialogRef.close(this.aForm.value);
    }

    cancel() {
        this.aForm.get('response').setValue(false);
        this.dialogRef.close(this.aForm.value);
    }

    checkAmount() {
        this.aForm.get('amount').disable();
        this.aForm.get('quantity').enable();
        if (this.aForm.get('serviceCharge').value) {
            this.aForm.get('amount').setValue(this.aForm.get('serviceCharge').value.amount);
        } else {
            this.aForm.get('amount').setValue(null);
        }
        if (this.aForm.get('serviceCharge').value && this.aForm.get('serviceCharge').value.category == 'BS') {
            this.aForm.get('amount').enable();
            this.aForm.get('quantity').setValue(1);
            this.aForm.get('quantity').disable();
        }
    }

}
