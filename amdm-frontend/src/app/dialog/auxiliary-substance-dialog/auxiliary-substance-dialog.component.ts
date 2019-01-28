import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../shared/service/administration.service';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-active-substance-dialog',
  templateUrl: './auxiliary-substance-dialog.component.html',
  styleUrls: ['./auxiliary-substance-dialog.component.css']
})

export class AuxiliarySubstanceDialogComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    aForm: FormGroup;
    auxSubstances: any[];
    formSubmitted: boolean;
style;
    constructor(private administrationService: AdministrationService,
                private fb: FormBuilder,
                public dialogRef: MatDialogRef<AuxiliarySubstanceDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
        this.aForm = fb.group({
            'auxSubstance': [null, Validators.required],
            'response' : [null]
        });
    }

    ngOnInit() {

        this.subscriptions.push(
            this.administrationService.getAllAuxiliarySubstances().subscribe(data => {
                    this.auxSubstances = data;
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

        this.aForm.get('response').setValue(true);
        this.dialogRef.close(this.aForm.value);
    }

    cancel() {
        this.aForm.get('response').setValue(false);
        this.dialogRef.close(this.aForm.value);
    }
}


