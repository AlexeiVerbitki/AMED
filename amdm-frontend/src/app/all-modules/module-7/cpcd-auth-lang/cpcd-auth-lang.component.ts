import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {LoaderService} from "../../../shared/service/loader.service";
import {DrugDocumentsService} from "../../../shared/service/drugs/drugdocuments.service";

@Component({
    selector: 'app-cpcd-auth-lang',
    templateUrl: './cpcd-auth-lang.component.html',
    styleUrls: ['./cpcd-auth-lang.component.css']
})
export class CpcdAuthLangComponent implements OnInit, OnDestroy {

    rFormSubbmitted = false;
    rForm: FormGroup;

    private subscriptions: Subscription[] = [];


    constructor(public dialogRef: MatDialogRef<CpcdAuthLangComponent>,
                public dialogConfirmation: MatDialog,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private fb: FormBuilder,
                private loadingService: LoaderService,
                private drugDocumentsService: DrugDocumentsService) {
    }

    ngOnInit() {
        this.initFormData();
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'language': [ '0', Validators.required],
        });
    }


    ok() {
        this.rFormSubbmitted = true;

        if (!this.rForm.valid) {
            return;
        }

        this.rFormSubbmitted = false;

        this.loadingService.show();

        this.dataDialog.details.language = this.rForm.get('language').value;

        this.subscriptions.push(this.drugDocumentsService.viewImportExportAuthorization(this.dataDialog.details).subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                this.dataDialog.parentWindow.open(fileURL);
                this.loadingService.hide();
                this.dialogRef.close({success: true});
            }, error => {
                this.loadingService.hide();
                this.dialogRef.close({success: true});
            }
            )
        );

        // this.dialogRef.close({success: true});
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

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
