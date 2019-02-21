import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../shared/service/administration.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-add-receipt-dialog',
    templateUrl: './add-receipt-dialog.component.html',
    styleUrls: ['./add-receipt-dialog.component.css']
})
export class AddReceiptDialogComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    aForm: FormGroup;
    title = 'Adaugare incasare';
    formSubmitted: boolean;

    constructor(private administrationService: AdministrationService,
                private fb: FormBuilder,
                public dialogRef: MatDialogRef<AddReceiptDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
        this.aForm = fb.group({
            'number': [null, Validators.required],
            'paymentDate': [null, Validators.required],
            'paymentOrderNumber': {value: null, disabled: true},
            'amount': [null, Validators.required],
            'insertDate': [null],
            'response': [null]
        });
    }

    ngOnInit() {
        // console.log('this.dataDialog', this.dataDialog);
        if (this.dataDialog) {
            this.title = 'Inregistrare incasari';
            this.aForm.get('number').setValue(this.dataDialog.number);
            this.aForm.get('paymentDate').setValue(new Date(this.dataDialog.paymentDate));
            this.aForm.get('paymentOrderNumber').setValue(this.dataDialog.paymentOrderNumber);
            this.aForm.get('amount').setValue(this.dataDialog.amount);
            this.aForm.get('insertDate').setValue(this.dataDialog.insertDate);
        }
    }

    add() {
        this.formSubmitted = true;

        if (this.aForm.invalid) {
            return;
        }

        this.formSubmitted = false;
        this.aForm.get('insertDate').setValue(new Date());

        this.aForm.get('response').setValue(true);
        this.dialogRef.close(this.aForm.getRawValue());
    }

    cancel() {
        this.aForm.get('response').setValue(false);
        this.dialogRef.close(this.aForm.value);
    }

}
