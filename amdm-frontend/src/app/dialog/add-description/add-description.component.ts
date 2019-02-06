import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-add-description',
    templateUrl: './add-description.component.html',
    styleUrls: ['./add-description.component.css']
})
export class AddDescriptionComponent implements OnInit {

    eForm: FormGroup;
    formSubmitted = false;
    name: string;
    errMsg: string;
    title: string;

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogRef: MatDialogRef<AddDescriptionComponent>) {
        this.eForm = fb.group({
            'description': [null, Validators.required],
            'response': [null]
        });
    }

    ngOnInit() {
        this.name = this.dataDialog.name;
        this.errMsg = this.dataDialog.errMsg;
        this.title = this.dataDialog.title;
    }

    cancel() {
        this.dialogRef.close(this.eForm.value);
    }

    ok() {
        this.formSubmitted = true;
        if (this.eForm.invalid) {
            return;
        }
        this.formSubmitted = false;
        this.eForm.get('response').setValue(true);
        this.dialogRef.close(this.eForm.value);
    }

}
