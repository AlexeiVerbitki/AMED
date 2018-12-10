import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConfirmationDialogComponent} from "../../../../dialog/confirmation-dialog.component";
import {promise} from "selenium-webdriver";
import filter = promise.filter;
import {Subscription} from "rxjs/index";
import {AdministrationService} from "../../../../shared/service/administration.service";

@Component({
    selector: 'app-med-inst-investigators-dialog',
    templateUrl: './med-inst-investigators-dialog.component.html',
    styleUrls: ['./med-inst-investigators-dialog.component.css']
})
export class MedInstInvestigatorsDialogComponent implements OnInit {
    medInvForm: FormGroup;
    investigatorsList: any[];
    collectedInvestigators: any[];

    test: any = '';

    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogConfirmation: MatDialog,
                public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                private administrationService: AdministrationService,) {
    }

    ngOnInit() {
        console.log(this.dataDialog);
        this.medInvForm = this.fb.group({
            'instMed': {disabled: true, value: this.dataDialog.medicalInstitution},
        });

        this.investigatorsList = JSON.parse(JSON.stringify(this.dataDialog.investigatorsList));

        if (this.dataDialog.collectedInvestigators !== undefined && this.dataDialog.collectedInvestigators !== null && this.dataDialog.collectedInvestigators !== 0){
            this.collectedInvestigators = JSON.parse(JSON.stringify(this.dataDialog.collectedInvestigators));
        }else{
            this.collectedInvestigators = [Object.assign({}, this.investigatorsList[0])];
        }
    }

    addInvestigators() {

        this.collectedInvestigators.push(Object.assign({}, this.investigatorsList[0]));

        let missing = this.collectedInvestigators.filter(colected => this.investigatorsList.indexOf(colected.investigator));
    }

    removeInvestigator(i) {
        this.collectedInvestigators.splice(i, 1);
    }

    setTrue(i) {
        for (var x = 0; x < this.collectedInvestigators.length; x++) {
            this.collectedInvestigators[x].main = x === i;
        }
    }

    submit() {
        let temp = this.collectedInvestigators.find(inv =>
            inv.main === true);
        if (temp === undefined) {
            alert("Investigator principal nu a fost ales");
            return;
        }

        var response = {
            success: true,
            investigators: this.collectedInvestigators
        };
        this.dialogRef.close(response);
    }


    cancel(): void {
        var message = 'Sunteti sigur(a)?';
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
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
}
