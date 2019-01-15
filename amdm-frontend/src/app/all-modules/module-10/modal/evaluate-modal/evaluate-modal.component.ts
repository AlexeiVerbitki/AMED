import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-evaluate-modal',
    templateUrl: './evaluate-modal.component.html',
    styleUrls: ['./evaluate-modal.component.css']
})
export class EvaluateModalComponent implements OnInit {

    problemDescription: string;
    constructor(@Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogConfirmation: MatDialogRef<EvaluateModalComponent>) {
    }

    ngOnInit() {
       this.problemDescription =  this.dataDialog.problemDescription.comment;
    }
    cancel(): void {
        this.dialogConfirmation.close();
    }
    addComment(): void {
        this.dataDialog.problemDescription.comment = this.problemDescription;
        this.dialogConfirmation.close();
    }
}
