import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConfirmationDialogComponent} from "../confirmation-dialog.component";

@Component({
    selector: 'app-license-decision-dialog',
    templateUrl: './license-decision-dialog.component.html',
    styleUrls: ['./license-decision-dialog.component.css']
})
export class LicenseDecisionDialogComponent implements OnInit, OnDestroy {

    rFormSubbmitted: boolean = false;
    rForm: FormGroup;

    maxDate = new Date();

    type : any;
    activities : any [];
    title : string;

    private subscriptions: Subscription[] = [];

    constructor( private fb: FormBuilder,
                 public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                 @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                 public dialogConfirmation: MatDialog) {
    }

    ngOnInit() {
        this.type = this.dataDialog.type;
        if (this.type === 'D')
        {
            this.title = 'Decizia';
        }
        else if(this.type === 'A')
        {
            this.title = 'Activitati';
        }
        this.initFormData();
    }


    private initFormData() {
        if (this.type === 'D')
        {
            let currentResolution = this.dataDialog.currentResolution;
            this.rForm = this.fb.group({
                'decizieLuata': [currentResolution ? currentResolution.resolution : null, Validators.required],
                'decisionDate': [{value : currentResolution ? new Date(currentResolution.date) : null, disabled:true}, Validators.required],
                'argumentDec': currentResolution ? currentResolution.reason : null,
            });
        }
        else if (this.type === 'A')
        {
            this.activities = this.dataDialog.activities;
            this.rForm = this.fb.group({
                'licenseActivities': [this.dataDialog.selectedActivities, Validators.required],
            });
        }

    }

    ok()
    {
        this.rFormSubbmitted = true;

        if (!this.rForm.valid)
        {
            return;
        }

        this.rFormSubbmitted = false;

        let response;
        if (this.type === 'D')
        {
            response = {
                success : true,
                type : this.type,
                currentResolution : {
                    resolution : this.rForm.get('decizieLuata').value,
                    date : this.rForm.get('decisionDate').value,
                    reason : this.rForm.get('argumentDec').value,
                }
            };
        }

        else if (this.type === 'A') {
            response = {
                success : true,
                type : this.type,
                selectedActivities : this.rForm.get('licenseActivities').value
            };
        }

        this.dialogRef.close(response);
    }

    cancel()
    {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.dialogRef.close({success: false});
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
