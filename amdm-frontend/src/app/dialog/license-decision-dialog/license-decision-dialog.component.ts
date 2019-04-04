import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog.component';
import {AddLicenseFarmacistComponent} from "../add-license-farmacist/add-license-farmacist.component";

@Component({
    selector: 'app-license-decision-dialog',
    templateUrl: './license-decision-dialog.component.html',
    styleUrls: ['./license-decision-dialog.component.css']
})
export class LicenseDecisionDialogComponent implements OnInit, OnDestroy {

    rFormSubbmitted = false;
    rForm: FormGroup;

    maxDate = new Date();

    type: any;
    activities: any [];
    title: string;
    ecAgentTypes: any[];

    pharmacyRepresentantProf: any;
    farmacistiPerAddress: any[] = [];


    private subscriptions: Subscription[] = [];

    constructor( private fb: FormBuilder,
                 public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                 @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                 public dialogConfirmation: MatDialog,
                 public dialogAddFarmacist: MatDialog) {
    }

    ngOnInit() {
        this.type = this.dataDialog.type;
        if (this.type === 'D') {
            this.title = 'Decizia';
        } else if (this.type === 'A') {
            this.title = 'Activitati';
        }
        this.initFormData();
        this.onChanges();
    }


    private initFormData() {
        if (this.type === 'D') {
            const currentResolution = this.dataDialog.currentResolution;
            this.rForm = this.fb.group({
                'decizieLuata': [currentResolution ? currentResolution.resolution : null, Validators.required],
                'decisionDate': [{value : currentResolution ? new Date(currentResolution.date) : null, disabled: true}, Validators.required],
                'argumentDec': currentResolution ? currentResolution.reason : null,
            });
        } else if (this.type === 'A') {
            this.activities = this.dataDialog.activities;
            this.ecAgentTypes = this.dataDialog.ecAgentTypes;
            this.farmacistiPerAddress = this.dataDialog.farmacistiPerAddress;


            this.rForm = this.fb.group({
                'licenseActivities': [this.dataDialog.selectedActivities, Validators.required],
                'tipIntreprindere': [this.dataDialog.ecAgentType, Validators.required],
                'farmDir': [this.dataDialog.selectedPharmaceutist, Validators.required],
            });

            this.pharmacyRepresentantProf = this.dataDialog.ecAgentType.representant;
        }

    }

    onChanges(): void {
        if (this.type === 'A') {
            this.rForm.get('farmDir').valueChanges.subscribe(val => {
                if (val) {
                    val.selectionDate = new Date();
                }
            });


            this.rForm.get('tipIntreprindere').valueChanges.subscribe(val => {
                if (val ) {
                    console.log('sfsdf', val);
                    this.pharmacyRepresentantProf = val.representant;

                } else {
                    this.pharmacyRepresentantProf = null;
                }
            });
        }
    }


    ok() {
        this.rFormSubbmitted = true;

        if (!this.rForm.valid) {
            return;
        }

        this.rFormSubbmitted = false;

        let response;
        if (this.type === 'D') {
            response = {
                success : true,
                type : this.type,
                currentResolution : {
                    resolution : this.rForm.get('decizieLuata').value,
                    date : this.rForm.get('decisionDate').value,
                    reason : this.rForm.get('argumentDec').value,
                }
            };
        } else if (this.type === 'A') {
            response = {
                success : true,
                type : this.type,
                selectedActivities : this.rForm.get('licenseActivities').value,
                ecAgentType : this.rForm.get('tipIntreprindere').value,
                farmacistiPerAddress : this.farmacistiPerAddress,
                selectedPharmaceutist : this.rForm.get('farmDir').value
            };
        }

        this.dialogRef.close(response);
    }

    cancel() {
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


    newFarmacist() {
        const dialogRef2 = this.dialogAddFarmacist.open(AddLicenseFarmacistComponent, {
            data: {
                //NoData
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.farmacistiPerAddress = [...this.farmacistiPerAddress, result.farmacist];
                this.rForm.get('farmDir').setValue(result.farmacist);
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
