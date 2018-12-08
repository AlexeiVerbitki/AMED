import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {TaskService} from "../../shared/service/task.service";
import {PriceService} from "../../shared/service/prices.service";
import {LoaderService} from "../../shared/service/loader.service";
import {Document} from "../../models/document";
import {NavbarTitleService} from "../../shared/service/navbar-title.service";
import {ConfirmationDialogComponent} from "../../dialog/confirmation-dialog.component";

@Component({
    selector: 'app-prices-approval',
    templateUrl: './price-approval.component.html',
    styleUrls: ['./price-approval.component.css'],
})
export class PriceApprovalComponent implements OnInit, AfterViewInit, OnDestroy {

    documents: Document[] = [];
    avgCurrencies: any[] = [];
    requestNumber: number;
    containInvalidPrices: boolean = false;
    formSubmitted: boolean = false;
    savePrices: boolean = false;
    outputDocuments: any[] = [{
        description: 'Ordinul de înregistrare a prețului de producător',
        number: undefined,
        status: "Nu este atasat"
    }];

    displayedColumns: any[] = [
        'priceRequestType',
        'medicamentCode',
        'commercialName',
        'pharmaceuticalForm',
        'dose',
        'volume',
        'division',
        'registrationDate',
        // 'price',
        'priceNew',
        // 'priceMdl',
        'priceMdlNew'];

    dataSource = new MatTableDataSource<any>();
    row: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private subscriptions: Subscription[] = [];

    constructor(private route: Router,
                private priceService: PriceService,
                private navbarTitleService: NavbarTitleService,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog,
                private loadingService: LoaderService) {

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Preturi pe pagina: ";
        this.dataSource.sort = this.sort;
    }


    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Procesul de aprobare a prețurilor');
        this.getPrices();
    }

    currencyChanged($event){
        console.log('currencyChanged', $event);
        this.avgCurrencies = $event;
    }


    getPrices() {
        this.subscriptions.push(
            this.priceService.getPricesForApproval().subscribe(prices => {
                    this.dataSource.data = prices;

                    if(this.dataSource.data.length == 0) {
                        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                message: 'Nu exista prețuri necesare a fi aprobate. Mergeți la pagina principală?',
                                confirm: false
                            }
                        });
                        dialogRef.afterClosed().subscribe(result => {
                            if (result) {
                                this.route.navigate(['dashboard/homepage']);
                            }
                        });
                    } else {
                        this.dataSource._updateChangeSubscription();
                        let docIds: any[] = [], priceIds: any[] = [];

                        this.dataSource.data.forEach(p => {
                            if(p.priceRequestType) {
                                if (p.priceRequestType == 2) {
                                    priceIds.push(p.id);
                                } else {
                                    docIds.push(p.docId);
                                }
                            }
                        });

                        this.subscriptions.push(this.priceService.getDocumentsByIds(docIds).subscribe(docs => {
                            let tempArray: any[] = [];
                            tempArray.push(...this.documents, ...docs.body);
                            this.documents = tempArray ;
                            this.documentAdded(null);
                        }, error1 => console.log('getDocumentsByIds',error1)));

                        this.subscriptions.push(this.priceService.documentsByPricesIds(priceIds).subscribe(docs => {
                            let tempArray: any[] = [];
                            tempArray.push(...this.documents, ...docs.body);
                            this.documents = tempArray ;
                            this.documentAdded(null);
                        }, error1 => console.log('getDocumentsByIds',error1)));
                    }
                    console.log('prices', prices);
                },
                error => console.log(error)
            ));
    }

    documentAdded($event) {
        console.log(this.documents);

        this.outputDocuments.forEach(outDoc => {
            outDoc.number = undefined;
            outDoc.status = "Nu este atasat";

            for(let doc of this.documents){
                if (doc.docType.description == outDoc.description) {
                    this.dataSource.data.forEach(p => p.orderNr = doc.number);
                    outDoc.number = doc.number;
                    outDoc.status = "Atasat";
                    break;
                }
            }

        });
    }

    save(){
        this.loadingService.show();
        this.formSubmitted = true;

        let prices: any[] = [];

        let uploadedOrder = this.documents.find(d => d.docType.description == 'Ordinul de înregistrare a prețului de producător');

        if (this.containInvalidPrices || this.documents.length == 0 || !uploadedOrder) {
            this.loadingService.hide();
            return;
        }

        this.formSubmitted = false;

        let priceNewType: number = 0;

        this.dataSource.data.forEach(p => {
            switch(p.priceRequestType){
                case 2: priceNewType = 13 ; break; //Preț nou aprobat
                case 9: priceNewType = 10 ; break; //Aprobat după modificarea originalului
                case 11: priceNewType = 12 ; break; //Acceptat după modificarea valutei
            }

            let expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);

            prices.push({
                id: p.id,
                value: p.priceNew,
                mdlValue: p.priceMdlNew,
                currency: {id: p.currencyId},
                medicament: {id: p.medicamentId},
                type: {id: priceNewType},
                document: uploadedOrder,
                nmPrice: {
                    orderNr: uploadedOrder.number,
                    expirationDate: expirationDate,
                    priceRequest: {id: p.id},
                    orderApprovDate: new Date,
                    medicament: {id: p.medicamentId},
                    revisionDate: new Date,
                    price: p.priceNew,
                    priceMdl: p.priceMdlNew,
                    status: 'V',
                    currency: {id: p.currencyId},
                }
            });
        });

        console.log(JSON.stringify(prices));

        this.subscriptions.push(this.priceService.approvePrices(prices).subscribe(data => {
                console.log('saved', data.body);
                this.loadingService.hide();
                this.route.navigate(['dashboard/homepage']);

            },
            error1 => {
                console.log(error1);
                this.loadingService.hide();
            })
        );
    }

    viewDoc(document: any) {
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
