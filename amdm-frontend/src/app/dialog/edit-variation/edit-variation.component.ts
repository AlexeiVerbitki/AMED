import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdministrationService} from '../../shared/service/administration.service';

@Component({
    selector: 'app-add-division',
    templateUrl: './edit-variation.component.html',
    styleUrls: ['./edit-variation.component.css']
})
export class EditVariationComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    dForm: FormGroup;
    volumeUnitsOfMeasurement: any[];
    formSubmitted: boolean;
    wasDivisionAdded: boolean;
    wasVolumeAdded: boolean;
    maxDate = new Date();
    onlyMainFields = false;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<EditVariationComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private administrationService: AdministrationService) {
        this.dForm = fb.group({
            'code': [null],
            'value': [null],
            'quantity': [null, Validators.required],
            'comment': [null],
            'response': [null]
        });
    }

    ngOnInit() {
        this.dForm.get('code').setValue(this.dataDialog.variation.code);
        this.dForm.get('value').setValue(this.dataDialog.variation.value);
        this.dForm.get('quantity').setValue(this.dataDialog.variation.quantity);
        this.dForm.get('comment').setValue(this.dataDialog.variation.comment);
    }

    save() {
        this.formSubmitted = true;

        if (this.dForm.invalid) {
            return;
        }

        this.formSubmitted = false;
        this.dForm.get('response').setValue(true);
        this.dialogRef.close(this.dForm.value);
    }

    cancel() {
        this.dForm.get('response').setValue(false);
        this.dialogRef.close(this.dForm.value);
    }


}
