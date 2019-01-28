import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {PriceService} from '../../shared/service/prices.service';
import {LoaderService} from '../../shared/service/loader.service';
import {Document} from '../../models/document';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {ConfirmationDialogComponent} from '../../dialog/confirmation-dialog.component';

@Component({
    selector: 'app-prices-approval',
    templateUrl: './price-approval.component.html',
    styleUrls: ['./price-approval.component.css'],
})
export class PriceApprovalComponent implements OnInit, AfterViewInit, OnDestroy {

    documents: Document[] = [];
    avgCurrencies: any[] = [];
    requestNumber: number;
    uploadedAllNeeded = false;
    formSubmitted = false;
    savePrices = false;
    outputDocuments: any[] = [{
        docType: {category: 'OP'},
        description: 'Ordinul de înregistrare a prețului de producător',
        number: undefined,
        status: 'Nu este atasat'
    }, {
        docType: {category: 'LP'},
        description: 'Anexa 1:Lista medicamentelor cu prețul de producător aprobat pentru înregistrare',
        number: undefined,
        status: 'Nu este atasat'
    }, {
        docType: {category: 'LG'},
        description: 'Anexa 2:Lista medicamentelor generice cu prețuri reevaluate',
        number: undefined,
        status: 'Nu este atasat'
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
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Preturi pe pagina: ';
        this.dataSource.sort = this.sort;
    }


    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Procesul de aprobare a prețurilor');
        this.getPrices();
    }

    currencyChanged($event) {
        console.log('currencyChanged', $event);
        this.avgCurrencies = $event;
    }


    getPrices() {
        this.subscriptions.push(
            this.priceService.getPricesForApproval().subscribe(prices => {
                    this.dataSource.data = prices;

                    if (this.dataSource.data.length == 0) {
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

                        const anex1Prices = this.dataSource.data.find(p => p.priceRequestType == 2);
                        const anex2Prices = this.dataSource.data.find(p => p.priceRequestType == 9);
                        if (!anex1Prices) {
                            this.outputDocuments.splice(1, 1);
                        }
                        if (!anex2Prices) {
                            this.outputDocuments.splice(2, 1);
                        }

                        const pIds: any[] = [], priceIds: any[] = [];

                        this.dataSource.data.forEach(p => {
                            if (p.priceRequestType) {
                                if (p.priceRequestType != 2) {
                                    pIds.push(p.id);
                                }
                            }
                        });

                        if (pIds.length > 0) {
                            this.subscriptions.push(this.priceService.getPricesDocuments(pIds).subscribe(docs => {
                                const tempArray: any[] = [];
                                tempArray.push(...this.documents, ...docs.body);
                                this.documents = tempArray ;
                                this.documentAdded(null);
                            }, error1 => console.log('getDocumentsByIds', error1)));
                        }

                        // if(priceIds.length > 0) {
                        //     this.subscriptions.push(this.priceService.documentsByPricesIds(priceIds).subscribe(docs => {
                        //         let tempArray: any[] = [];
                        //         tempArray.push(...this.documents, ...docs.body);
                        //         this.documents = tempArray ;
                        //         this.documentAdded(null);
                        //     }, error1 => console.log('getDocumentsByIds',error1)));
                        // }
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
            outDoc.status = 'Nu este atasat';

            for (const doc of this.documents) {
                if (doc.docType.category == outDoc.docType.category) {
                    this.dataSource.data.forEach(p => p.orderNr = doc.number);
                    outDoc.number = doc.number;
                    outDoc.status = 'Atasat';
                    break;
                }
            }

        });

        this.uploadedAllNeeded = !this.outputDocuments.find(d =>  d.status == 'Nu este atasat');
    }

    save() {
        this.loadingService.show();
        this.formSubmitted = true;

        const prices: any[] = [];

        const uploadedOrder = this.documents.find(d => d.docType.category == 'OP');
        const uploadedAnexa1 = this.documents.find(d => d.docType.category == 'LP');
        const uploadedAnexa2 = this.documents.find(d => d.docType.category == 'LG');

        if (this.documents.length == 0 || !this.uploadedAllNeeded || this.dataSource.data.length == 0) {
            this.loadingService.hide();
            return;
        }

        let priceNewType = 0;

        this.dataSource.data.forEach(p => {
            switch (p.priceRequestType) {
                case 2: priceNewType = 13 ; break; //Preț nou aprobat
                case 9: priceNewType = 10 ; break; //Aprobat după modificarea originalului
                case 11: priceNewType = 12 ; break; //Acceptat după modificarea valutei
            }

            const newDocs: any[] = [];

            newDocs.push(uploadedOrder);

            if (p.priceRequestType == 2) {
                newDocs.push(uploadedAnexa1);
            } else if (p.priceRequestType == 9) {
                newDocs.push(uploadedAnexa2);
            }

            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);

            prices.push({
                id: p.id,
                value: p.priceNew,
                folderNr: p.folderNr,
                mdlValue: p.priceMdlNew,
                currency: {id: p.currencyId},
                medicament: {id: p.medicamentId},
                type: {id: priceNewType},
                documents: newDocs,
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
                this.loadingService.hide();
                // this.route.navigate(['dashboard/homepage']);

            },
            error1 => {
                console.log(error1);
                this.loadingService.hide();
            })
        );
    }


    viewDoc(document: any) {
        if (document.docType.category != 'OP' && document.docType.category != 'LP' && document.docType.category != 'LG') { //  Fișa de evaluare a dosarului pentru aprobarea prețului de producător
            return;
        }
        this.loadingService.show();

        let observable;

        if (document.docType.category == 'OP') {
            observable = this.priceService.viewApprovalOrder();
        } else if (document.docType.category == 'LP') {
            observable = this.priceService.viewAnexa1();
        } else if (document.docType.category == 'LG') {
            observable = this.priceService.viewAnexa2(this.createAnexa2DTO());
        }

        this.subscriptions.push(observable.subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }


    createAnexa2DTO(): any {
        const anexa2ListDTO: any[] = [];

        this.dataSource.data.forEach(m => {
            if (m.priceRequestType == 9) {
                anexa2ListDTO.push({
                    medicineInfo: {
                        medicineCode: m.medicamentCode,
                        commercialName: m.commercialName,
                        pharmaceuticalForm: m.pharmaceuticalForm,
                        dose: m.dose,
                        division: m.division,
                    },
                    country: m.country,
                    producerCompany: m.manufacture,
                    internationalName: m.internationalName,
                    producerPrice: m.priceMdlNew,
                    priceInCurrency: m.priceNew,
                    currency: m.currency
                });
            }
        });
        console.log('anexa2ListDTO', anexa2ListDTO);
        return anexa2ListDTO;
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
