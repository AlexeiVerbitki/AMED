import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {Subscription} from 'rxjs';
import {RequestService} from '../../shared/service/request.service';
import {MedicamentModificationsDialogComponent} from '../medicament-modifications-dialog/medicament-modifications-dialog.component';
import {saveAs} from 'file-saver';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {MedicamentService} from '../../shared/service/medicament.service';

@Component({
    selector: 'app-medicament-history-dialog',
    templateUrl: './medicament-history-dialog.component.html',
    styleUrls: ['./medicament-history-dialog.component.css']
})
export class MedicamentHistoryDialogComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    orders: any[] = [];
    prices: any[] = [];
    initialData: any;
    medicamentHystory: any[] = [];

    constructor(public dialogRef: MatDialogRef<MedicamentHistoryDialogComponent>,
                private dialog: MatDialog,
                private medicamentService: MedicamentService,
                private uploadService: UploadFileService,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private requestService: RequestService) {
    }

    ngOnInit() {
        this.subscriptions.push(this.requestService.getRequestsByRegNumber(this.dataDialog.value[0].registrationNumber).subscribe(data => {
            this.initialData = Object.assign([], data.body);
            for (const d of data.body) {
                const ar = d.documents.filter(r => r.docType.category == 'OM');
                if (ar && ar.length != 0) {
                    this.orders.push(ar[0]);
                }
            }
        }));

        this.subscriptions.push(this.requestService.getMedPricesHistory(this.dataDialog.id).subscribe(data => {
            this.prices = data;
            this.prices.sort((a, b) => {
                if (a.orderApprovDate > b.orderApprovDate) {
                    return -1;
                } else if (a.orderApprovDate < b.orderApprovDate) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }));

        this.loadMedicamentHistory(this.dataDialog.value);
    }

    loadMedicamentHistory(medicaments: any[]) {
        this.medicamentHystory = [];
        const codes: any[] = [];
        medicaments.forEach(m => codes.push(m.code));
        this.subscriptions.push(this.medicamentService.getMedicamentHistory(codes).subscribe(data => {
            this.medicamentHystory = data.body;
        }));
    }


    showOrderDetails(order: any) {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '1100px';

        dialogConfig2.data = {
            order: order,
            historyDetails: this.initialData,
          //  medicamentDetails: this.dataDialog.value
        };

        this.dialog.open(MedicamentModificationsDialogComponent, dialogConfig2);
    }

    confirm(): void {
        this.dialogRef.close(true);
    }

    loadFile(path: string) {
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(data => {
                this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
            },

            error => {
                console.log(error);
            }
            )
        );
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }
}
