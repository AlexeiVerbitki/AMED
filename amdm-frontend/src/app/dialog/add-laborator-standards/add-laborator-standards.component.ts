import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-add-laborator-standards',
    templateUrl: './add-laborator-standards.component.html',
    styleUrls: ['./add-laborator-standards.component.css']
})
export class AddLaboratorStandardsComponent implements OnInit {

    fForm: FormGroup;
    standards: any[] = [];
    formSubmitted = false;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<AddLaboratorStandardsComponent>, ) {
        this.fForm = fb.group({
            'standard': [null, Validators.required],
            'standards': [[]],
            'response': [null]
        });
    }

    ngOnInit() {
    }

    cancel() {
        this.fForm.get('response').setValue(false);
        this.dialogRef.close(this.fForm.value);
    }

    save() {
        this.standards.forEach(t => this.fForm.get('standards').value.push(t));
        this.fForm.get('response').setValue(true);
        this.dialogRef.close(this.fForm.value);
    }

    addStandard() {
        this.formSubmitted = true;
        if (this.fForm.invalid) {
            return;
        }
        this.formSubmitted = false;
        this.standards.push({description: this.fForm.get('standard').value});
        this.fForm.get('standard').setValue(null);
    }

    removeStandard(index) {
        this.standards.splice(index, 1);
    }

}
