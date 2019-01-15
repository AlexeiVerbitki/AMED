import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-add-license-farmacist',
    templateUrl: './add-license-farmacist.component.html',
    styleUrls: ['./add-license-farmacist.component.css']
})
export class AddLicenseFarmacistComponent implements OnInit, OnDestroy {

    rFormSubbmitted = false;
    rForm: FormGroup;

    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<AddLicenseFarmacistComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    }

    ngOnInit() {
        this.initFormData();
    }

    ok() {
        this.rFormSubbmitted = true;

        if (!this.rForm.valid) {
            return;
        }

        this.rFormSubbmitted = false;

        const response = {
                success : true,
                farmacist : {
                        fullName: this.rForm.get('farm').value,
                        selectionDate: new Date(),
                        insertionDate: new Date()
                },
            };

        this.dialogRef.close(response);
    }

    cancel() {
        const response = {
            success : false
        };

        this.dialogRef.close(response);
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'farm': null
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
