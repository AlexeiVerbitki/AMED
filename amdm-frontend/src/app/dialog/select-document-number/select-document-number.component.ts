import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";

@Component({
    selector: 'app-select-document-number',
    templateUrl: './select-document-number.component.html',
    styleUrls: ['./select-document-number.component.css']
})
export class SelectDocumentNumberComponent implements OnInit {

    eForm: FormGroup;
    formSubmitted: boolean = false;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<SelectDocumentNumberComponent>) {
        this.eForm = fb.group({
            'docNr': [null, Validators.required],
            'response': [null]
        });
    }

    ngOnInit() {
    }

    cancel() {
        this.dialogRef.close(this.eForm.value);
    }

    ok() {
        this.eForm.get('response').setValue(true);
        this.dialogRef.close(this.eForm.value);
    }

}
