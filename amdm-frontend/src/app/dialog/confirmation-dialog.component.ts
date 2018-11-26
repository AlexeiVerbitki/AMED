import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-confirmation-dialog',
    template: `<h4 mat-dialog-title class="text-center bg-header">Confirmare</h4>
	<hr>
	<div mat-dialog-content>
		<label class="w450">
			<h5>{{data.message}}</h5>
		</label>
	</div>
	<div class="text-center">
		<div mat-dialog-actions>
            <div class="w-100">
			<button class="btn btn-danger btn-sm-bl btn-sm" (click)="cancel()">Nu</button>
			<button class="btn btn-dark-green-color btn-sm-bl btn-sm" (click)="confirm()">Da</button>
            </div>
		</div>
	</div>`,
    styles: [`.w450 {
        width : 450px;
    }

    .bg-header {
        font-weight : bold;
        font-size   : 24px;
    }`]
})
export class ConfirmationDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

    cancel(): void {
        this.dialogRef.close();
    }

    confirm(): void {
        this.data.confirm = true;
        this.dialogRef.close(true);
    }

}
