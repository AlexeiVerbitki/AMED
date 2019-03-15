import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {ConfirmationDialogComponent} from '../../../../dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs/index';
import {AdministrationService} from '../../../../shared/service/administration.service';
import {InvestigatorsDialogComponent} from '../investigators-dialog/investigators-dialog.component';

@Component({
    selector: 'app-med-inst-investigators-dialog',
    templateUrl: './med-inst-investigators-dialog.component.html',
    styleUrls: ['./med-inst-investigators-dialog.component.css']
})
export class MedInstInvestigatorsDialogComponent implements OnInit, OnDestroy {
    medInvForm: FormGroup;
    investigatorsList: any[];
    subdivisionsList: any[];
    collectedInvestigators: any[];
    test: any = '';
    isDisabledAddSubdivision = true;
    collectedDataList: any[] = [];
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialog: MatDialog,
                public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                private administrationService: AdministrationService) {
    }

    ngOnInit() {
        console.log('this.dataDialog', this.dataDialog);
        this.medInvForm = this.fb.group({
            'instMed': {disabled: true, value: this.dataDialog.nmMedicalInstitution.name},
            'subdivision': {value: null}
        });

        this.subscriptions.push(
            this.administrationService.getMedInstSubdivisionsByMedInstId(this.dataDialog.nmMedicalInstitution.id).subscribe(subdivList => {
                // console.log('subdivList', subdivList);
                this.subdivisionsList = subdivList;
            }, error => console.log(error))
        );

        this.subscriptions.push(
            this.medInvForm.get('subdivision').valueChanges.subscribe(value => {
                value ? this.isDisabledAddSubdivision = false : this.isDisabledAddSubdivision = true;
                // console.log('value', value);
            })
        );
    }

    addSubdivision() {
        const dialogConfig1 = new MatDialogConfig();
        dialogConfig1.disableClose = true;
        dialogConfig1.autoFocus = true;
        dialogConfig1.hasBackdrop = true;

        dialogConfig1.width = '650px';

        // console.log('collectedInvestigators', this.dataDialog.investigatorsList);
        dialogConfig1.data = {
            subdivision: this.medInvForm.get('subdivision').value,
            investigatorsList: JSON.parse(JSON.stringify(this.dataDialog.investigatorsList))
        };

        const dialogRef = this.dialog.open(InvestigatorsDialogComponent, dialogConfig1);

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                // console.log('result', result);
                if (result == null || result == undefined || result.success === false) {
                    return;
                }

                const value = this.medInvForm.get('subdivision').value;
                this.collectedDataList.push(result.subdivision);
                const indexToDelete = this.subdivisionsList.indexOf(value);
                // console.log('indexToDelete', indexToDelete);
                this.subdivisionsList.splice(indexToDelete, 1);
                this.subdivisionsList = this.subdivisionsList.splice(0);
                this.medInvForm.get('subdivision').reset();
            })
        );
    }

    deleteSubdivision(index: number, subdiv: any): void {
        console.log('subdiv', subdiv);

        this.subdivisionsList.push(subdiv.nmSubdivision);
        this.subdivisionsList = this.subdivisionsList.splice(0);
        this.collectedDataList.splice(index, 1);
    }

    submit() {
        // console.log('this.collectedDataList', this.collectedDataList);
        // console.log('this.dataDialog', this.dataDialog);

        const response = {
            success: true,
            medicalInstitution: {
                nmMedicalInstitution: this.dataDialog.nmMedicalInstitution,
                subdivisionsList: this.collectedDataList
            }
        };
        // console.log('response', response);
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
