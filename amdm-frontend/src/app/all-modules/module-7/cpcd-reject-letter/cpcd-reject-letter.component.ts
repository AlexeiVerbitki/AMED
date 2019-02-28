import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {LoaderService} from '../../../shared/service/loader.service';
import {DrugDocumentsService} from '../../../shared/service/drugs/drugdocuments.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {AdministrationService} from '../../../shared/service/administration.service';

@Component({
    selector: 'app-cpcd-reject-letter',
    templateUrl: './cpcd-reject-letter.component.html',
    styleUrls: ['./cpcd-reject-letter.component.css']
})
export class CpcdRejectLetterComponent implements OnInit, OnDestroy {

    rFormSubbmitted = false;
    rForm: FormGroup;

    functions: any[];
    loadingFunctions = false;

    private subscriptions: Subscription[] = [];

    constructor(public dialogRef: MatDialogRef<CpcdRejectLetterComponent>,
                public dialogConfirmation: MatDialog,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private fb: FormBuilder,
                private loadingService: LoaderService,
                private drugDocumentsService: DrugDocumentsService,
                private administrationService: AdministrationService) {
    }

    ngOnInit() {
        this.initFormData();

        this.loadingFunctions = true;
        this.subscriptions.push(
            this.administrationService.getAllSysParams().subscribe(data => {
                    this.functions = data;
                    this.functions = this.functions.filter(t => t.code.startsWith('FN'));
                    this.loadingFunctions = false;
                },
                error => { this.loadingFunctions = false; }
            )
        );
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'function': [null, Validators.required],
        });
    }


    ok() {
        this.rFormSubbmitted = true;

        if (!this.rForm.valid) {
            return;
        }

        this.rFormSubbmitted = false;

        this.loadingService.show();

        this.dataDialog.details.signPerson = this.rForm.get('function').value.value;

        this.subscriptions.push(this.drugDocumentsService.viewScrisoareDeRefuz(this.dataDialog.details).subscribe(data => {
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
