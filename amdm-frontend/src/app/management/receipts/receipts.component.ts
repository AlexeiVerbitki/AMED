import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {AdministrationService} from '../../shared/service/administration.service';
import {AddReceiptDialogComponent} from '../../dialog/add-receipt-dialog/add-receipt-dialog.component';
import {LoaderService} from '../../shared/service/loader.service';
import {ConfirmationDialogComponent} from '../../dialog/confirmation-dialog.component';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {ReceiptManagementService} from '../../shared/service/receipt-management.service';
import {TaskService} from '../../shared/service/task.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs/index';

@Component({
    selector: 'app-receipts',
    templateUrl: './receipts.component.html',
    styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit, OnDestroy, AfterViewInit {
    rForm: FormGroup;
    private subscriptions: Subscription[] = [];
    displayedColumns: string[] = ['nrCerere', 'agentEconomic', 'select1', 'datorii'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    registerCodes: any[];
    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private loadingService: LoaderService,
                private taskService: TaskService,
                private navbarTitleService: NavbarTitleService,
                private administrationService: AdministrationService,
                private receiptManagemetService: ReceiptManagementService) {
        this.rForm = fb.group({
            'receiptDateFrom': [null],
            'receiptDateTo': [null],
            'insertDateFrom': [null],
            'insertDateTo': [null],
            'number': [null],
            'paymentOrderNumber': [null],


            'requestCode': [null],
            'requestNumber': ['', Validators.pattern('^[0-9]{0,6}$')],
            'company': [null],
        });
    }

    ngOnInit(): void {
        this.navbarTitleService.showTitleMsg('Plăți');

        this.subscriptions.push(this.taskService.getRegisterCatalogCodes().subscribe(codes => {
            this.registerCodes = codes;
        }));

        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>
                    this.administrationService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Procese pe pagina: ';
        this.dataSource.sort = this.sort;
    }

    addReceipts(payOrder: any, request: any) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            paymentOrderNumber: payOrder.payOrderNr
        };
        const dialogRef = this.dialog.open(AddReceiptDialogComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            // console.log('result', result);
            // console.log('payOrder', payOrder);
            if (result && result.response) {
                // this.loadingService.show();
                this.subscriptions.push(
                    this.administrationService.addReceipt(result).subscribe(addResult => {
                            payOrder.receipDetailsMap.push({
                                    payedAmmount: addResult.body.amount,
                                    payedDate: addResult.body.paymentDate,
                                    payedId: addResult.body.id,
                                    receiptNumber: addResult.body.number
                                }
                            );
                            request.calculatedDepth = request.calculatedDepth - addResult.body.amount;
                            // console.log('addedReceipt', request);
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

    // editReceipt(receipt: any) {
    //     const dialogConfig2 = new MatDialogConfig();
    //
    //     dialogConfig2.disableClose = false;
    //     dialogConfig2.autoFocus = true;
    //     dialogConfig2.hasBackdrop = true;
    //
    //     dialogConfig2.width = '600px';
    //     dialogConfig2.data = receipt;
    //
    //     const dialogRef = this.dialog.open(AddReceiptDialogComponent, dialogConfig2);
    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result && result.response) {
    //             this.loadingService.show();
    //             this.subscriptions.push(
    //                 this.administrationService.editReceipt(result).subscribe(request => {
    //                         this.dataSource.data = [];
    //                         this.dataSource.data = [...this.dataSource.data, request.body];
    //                         this.loadingService.hide();
    //                     },
    //                     error => {
    //                         console.log(error);
    //                         this.loadingService.hide();
    //                     }
    //                 ));
    //         }
    //     });
    // }

    removeReceipt(receiptIndex: number, payOrder: any, request: any) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta incasare?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                // console.log('request', request);
                // console.log('payOrder', payOrder);
                // console.log('receiptIndex', receiptIndex);
                const receipt = payOrder.receipDetailsMap[receiptIndex];
                this.subscriptions.push(
                    this.administrationService.removeReceipt(receipt.payedId).subscribe(remResult => {
                            this.loadingService.hide();
                            request.calculatedDepth = request.calculatedDepth + receipt.payedAmmount;
                            payOrder.receipDetailsMap.splice(receiptIndex, 1);
                        },
                        error => {
                            console.log(error);
                            this.loadingService.hide();
                        }
                    ));
            }
        });
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    testBakend() {
        const receiptFormValue = this.rForm.value;
        // console.log('taskFormValue', receiptFormValue);
        const searchCriteria = {
            requestCode: receiptFormValue.requestCode ? receiptFormValue.requestCode.registerCode : '',
            requestNumber: receiptFormValue.requestNumber ? receiptFormValue.requestNumber : '',
            comanyId: receiptFormValue.company ? receiptFormValue.company.id : ''
        };
        // console.log('searchCriteria', searchCriteria);
        this.subscriptions.push(
            this.receiptManagemetService.getUnfinishedTasks(searchCriteria).subscribe(request => {
                    // console.log('request', request);
                    this.dataSource.data = request.body;
                },
                error => console.log(error)
            ));
    }

    allowOnlyNumbers(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

}
