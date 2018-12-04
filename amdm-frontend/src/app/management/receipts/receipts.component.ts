import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Subscription} from "rxjs";
import {AdministrationService} from "../../shared/service/administration.service";
import {AddReceiptDialogComponent} from "../../dialog/add-receipt-dialog/add-receipt-dialog.component";
import {LoaderService} from "../../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../../dialog/confirmation-dialog.component";
import {NavbarTitleService} from "../../shared/service/navbar-title.service";

@Component({
    selector: 'app-receipts',
    templateUrl: './receipts.component.html',
    styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit {
    rForm: FormGroup;
    private subscriptions: Subscription[] = [];
    displayedColumns: any[] = ['number', 'paymentOrderNumber', 'paymentDate', 'amount', 'insertDate', 'actions'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private loadingService: LoaderService,
                private navbarTitleService: NavbarTitleService,
                private administrationService: AdministrationService) {
        this.rForm = fb.group({
            'receiptDateFrom': [null],
            'receiptDateTo': [null],
            'insertDateFrom': [null],
            'insertDateTo': [null],
            'number': [null],
            'paymentOrderNumber': [null],
        });
    }

    ngOnInit(): void {
        this.navbarTitleService.showTitleMsg('Incasari');
    }

    clear() {
        this.rForm.reset();
    }

    getReceipts() {
        this.subscriptions.push(
            this.administrationService.getReceiptsByFilter(this.rForm.value
            ).subscribe(request => {
                    this.dataSource.data = request.body;
                },
                error => console.log(error)
            ));
    }

    addReceipts() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        let dialogRef = this.dialog.open(AddReceiptDialogComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.loadingService.show();
                this.subscriptions.push(
                    this.administrationService.addReceipt(result).subscribe(request => {
                            this.dataSource.data = [];
                            this.dataSource.data = [...this.dataSource.data, request.body];
                            this.loadingService.hide();
                        },
                        error => {
                            console.log(error);
                            this.loadingService.hide();
                        }
                    ));
            }
        });

    }

    editReceipt(receipt : any)
    {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';
        dialogConfig2.data=receipt;

        let dialogRef = this.dialog.open(AddReceiptDialogComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.loadingService.show();
                this.subscriptions.push(
                    this.administrationService.editReceipt(result).subscribe(request => {
                            this.dataSource.data = [];
                            this.dataSource.data = [...this.dataSource.data, request.body];
                            this.loadingService.hide();
                        },
                        error => {
                            console.log(error);
                            this.loadingService.hide();
                        }
                    ));
            }
        });
    }

    removeReceipt(receipt:any)
    {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta incasare?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                this.subscriptions.push(
                    this.administrationService.removeReceipt(receipt.id).subscribe(request => {
                            this.loadingService.hide();
                            this.getReceipts();
                        },
                        error => {
                            console.log(error);
                            this.loadingService.hide();
                        }
                    ));
            }
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Prorcese pe pagina: ";
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }
}
