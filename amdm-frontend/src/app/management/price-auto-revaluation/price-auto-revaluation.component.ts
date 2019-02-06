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
    selector: 'app-prices-auto-revaluation',
    templateUrl: './price-auto-revaluation.component.html',
    styleUrls: ['./price-auto-revaluation.component.css'],
})
export class PriceAutoRevaluationComponent implements OnInit, AfterViewInit, OnDestroy {
    public static INCREASE_PERCENT_LIMIT = 3;
    public static DECREASE_PERCENT_LIMIT = 5;

    documents: Document[] = [];
    avgCurrencies: any[] = [];
    requestNumber: number;
    containInvalidPrices = true;
    formSubmitted = false;
    savePrices = false;
    outputDocuments: any[] = [{
        docType: {category: 'LR'},
        description: 'Anexa 3:Lista medicamentelor cu prețul revizuit după modificarea valutei',
        number: undefined,
        status: 'Nu este atasat'
    }];

    displayedColumns: any[] = [
        'medicamentCode',
        'commercialName',
        'pharmaceuticalForm',
        'dose',
        'volume',
        'division',
        'registrationDate',
        'price',
        'priceMdl',
        'priceMdlNew',
        'priceNew',
        'priceMdlDifferencePercents'];

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
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Medicamente pe pagina: ';
        this.dataSource.sort = this.sort;
    }

    savePricesCheck($event) {
        this.savePrices = $event.checked;
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Procesul automatizat de reevaluare a prețurilor');

        this.getPrices();
        this.subscriptions.push(
            this.priceService.generateDocNumber().subscribe(generatedNumber => {
                    this.requestNumber = generatedNumber[0];
                },
                error => {console.log(error); alert(error); }
            )
        );
        // this.taskForm.get('requestNumber').valueChanges.subscribe(val => {
        //     this.disabledElements(val);
        // });
    }

    currencyChanged($event) {
        console.log('currencyChanged', $event);
        this.avgCurrencies = $event;
    }


    getPrices() {
        this.subscriptions.push(
            this.priceService.getPricesForRevaluation().subscribe(prices => {
                    this.dataSource.data = prices;

                    if (this.dataSource.data.length == 0) {
                        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                message: 'Nu exista prețuri necesare a fi reevaluate. Mergeți la pagina principală?',
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
                    }
                    console.log('prices', prices);
                },
                error => console.log(error)
            ));
    }

    documentAdded($event) {

        this.outputDocuments.forEach(outDoc => {
            outDoc.number = undefined;
            outDoc.status = 'Nu este atasat';

            for (const doc of this.documents) {
                if (doc.docType.description == outDoc.description) {
                    outDoc.number = doc.number;
                    outDoc.status = 'Atasat';
                    break;
                }
            }

        });
    }

    save() {
        this.loadingService.show();
        this.formSubmitted = true;

        const prices: any[] = [];

        const uploadedDoc = this.documents.find(d => d.docType.description == 'Anexa 3:Lista medicamentelor cu prețul revizuit după modificarea valutei');

        if (this.containInvalidPrices || this.documents.length == 0) {
            this.loadingService.hide();
            return;
        }

        this.formSubmitted = false;

        this.dataSource.data.forEach(p => {
            prices.push({
                value: p.priceNew,
                mdlValue: p.priceMdlNew,
                currency: {id: p.currencyId},
                medicament: {id: p.medicamentId},
                type: {id: 11}, //Propus dupa modificarea valutei
                documents: this.documents
            });
        });

        this.subscriptions.push(this.priceService.modifyPrices(prices).subscribe(data => {
                this.loadingService.hide();
                // this.route.navigate(['dashboard/homepage']);
            },
            error1 => {
                console.log(error1);
                this.loadingService.hide();
            })
        );
    }

    newPriceModified(i: number, newValue: any) {
        console.log('newPriceModified', newValue);
        this.dataSource.data[i].priceMdlNew = +newValue;
        this.containInvalidPrices = this.dataSource.data.some(p => p.priceMdlNew == undefined || p.priceMdlNew <= 0 );

        const avgCur = this.avgCurrencies.find(cur => cur.currency.shortDescription == this.dataSource.data[i].currency);

        this.dataSource.data[i].priceNew = +newValue / avgCur.value;
        const increasePercentDifference = this.calculateIncreaseRate(newValue, this.dataSource.data[i].priceMdl);
        const decreasePercentDifference = this.calculateIncreaseRate(this.dataSource.data[i].priceMdl, newValue);

        let afterLimit = false;
        if (increasePercentDifference > PriceAutoRevaluationComponent.INCREASE_PERCENT_LIMIT ) {
            this.dataSource.data[i].priceMdlDifferencePercents = '↑' + increasePercentDifference.toFixed(1).toString() + '%';
            afterLimit = true;
        } else if (decreasePercentDifference > PriceAutoRevaluationComponent.DECREASE_PERCENT_LIMIT) {
            this.dataSource.data[i].priceMdlDifferencePercents = '↓' + decreasePercentDifference.toFixed(1).toString() + '%';
            afterLimit = true;
        } else {
            this.dataSource.data[i].priceMdlDifferencePercents = decreasePercentDifference < 0 ? '↑' + increasePercentDifference.toFixed(1).toString() + '%' : '↓' + decreasePercentDifference.toFixed(1).toString() + '%';
        }

        this.containInvalidPrices = this.dataSource.data.some(p => p.priceMdlNew == undefined || p.priceMdlNew <= 0 || afterLimit);
    }

    calculateIncreaseRate(initialValue: number, modifiedValue: number) {
        return ((initialValue - modifiedValue) / modifiedValue) * 100;
    }

    createAnexa3DTO(): any {
        const anexa3ListDTO: any[] = [];

        this.dataSource.data.forEach(m => {
            anexa3ListDTO.push({
                medicineInfo: {
                    medicineCode: m.medicamentCode,
                    commercialName: m.commercialName,
                    pharmaceuticalForm: m.pharmaceuticalForm,
                    dose: m.dose,
                    division: m.division
                },
                country: m.country,
                producerCompany: m.manufacture,
                previousPrice: m.priceMdl,
                reviewedPrice: m.priceMdlNew,
                producerPrice: m.price,
                currency: m.currency
            });
        });

        return anexa3ListDTO;
    }

    viewDoc(document: any) {
        if (document.docType.category != 'LR') { //  Anexa 3:Lista medicamentelor cu prețul revizuit după modificarea valutei
            return;
        }
        this.loadingService.show();

        this.subscriptions.push(this.priceService.viewAnexa3(this.createAnexa3DTO()).subscribe(data => {
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
