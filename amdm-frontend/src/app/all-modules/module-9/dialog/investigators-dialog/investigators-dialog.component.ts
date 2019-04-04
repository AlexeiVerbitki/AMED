import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmationDialogComponent} from '../../../../dialog/confirmation-dialog.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/index';

@Component({
    selector: 'app-investigators-dialog',
    templateUrl: './investigators-dialog.component.html',
    styleUrls: ['./investigators-dialog.component.css']
})
export class InvestigatorsDialogComponent implements OnInit, OnDestroy {
    investigForm: FormGroup;
    investigatorsList: any[] = [];
    isDisabledAddInvestigator = true;
    collectedDataList: any[] = [];
    subscriptions: Subscription[] = [];
    isMainSelected = true;

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialog: MatDialog,
                public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
    }

    ngOnInit() {
        console.log(this.dataDialog);
        this.investigatorsList = this.dataDialog.investigatorsList;
        this.investigForm = this.fb.group({
            'subdivision': {disabled: true, value: this.dataDialog.subdivision.name},
            'investigator': this.fb.group({
                'id': [null],
                'nmInvestigator': [null],
                'isMain': [false]
            })
        });

        this.subscriptions.push(
            this.investigForm.get('investigator').valueChanges.subscribe(value => {
                value.nmInvestigator ? this.isDisabledAddInvestigator = false : this.isDisabledAddInvestigator = true;
            })
        );
    }

    addInvestigator(): void {
        const value = this.investigForm.get('investigator').value;
        this.collectedDataList.push(value);
        const indexToDelete = this.investigatorsList.indexOf(value.nmInvestigator);
        this.investigatorsList.splice(indexToDelete, 1);
        this.investigatorsList = this.investigatorsList.splice(0);
        this.investigForm.get('investigator').reset();
    }

    removeInvestigator(index: number, investigator: any) {
        // console.log('investigator', investigator);
        investigator.isMain = false;
        this.investigatorsList.push(investigator.nmInvestigator);
        this.investigatorsList = this.investigatorsList.splice(0);
        this.collectedDataList.splice(index, 1);
        this.isMainSelected = true;
    }

    setTrue(i) {
        for (let x = 0; x < this.collectedDataList.length; x++) {
            this.collectedDataList[x].isMain = x === i;
        }
        this.isMainSelected = true;
    }

    submit() {
        // console.log('this.collectedDataList', this.collectedDataList);
        this.isMainSelected = true;
        const temp = this.collectedDataList.find(inv =>
            inv.isMain === true);
        if (temp === undefined) {
            this.isMainSelected = false;
            return;
        }

        const response = {
            success: true,
            subdivision: {
                nmSubdivision: this.dataDialog.subdivision,
                investigatorsList: this.collectedDataList
            }
        };
        // console.log(this.dataDialog);
        console.log(response);
        // console.log('this.investigPerSubdivision', investigPerSubdivision);
        this.dialogRef.close(response);
    }

    cancel(): void {
        const message = 'Sunteti sigur(a)?';
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: message,
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.dialogRef.close({success: false});
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
