import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {PriceService} from '../../../shared/service/prices.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';

@Component({
    selector: 'app-prices-revaluation-generics',
    templateUrl: './revaluation-generics.component.html',
    styleUrls: ['./revaluation-generics.component.css'],
})

export class RevaluationGenericsComponent implements OnInit, AfterViewInit, OnDestroy {
    priceId: string ;
    containInvalidPrices = true;
    formSubmitted = false;
    medicaments: any[] = [];
    avgCurrencies: any[] = [];
    saved = false;

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
        'priceMdlDifferencePercents',
        'ignore'];

    dataSource = new MatTableDataSource<any>();
    row: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private subscriptions: Subscription[] = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private priceService: PriceService,
                private navbarTitleService: NavbarTitleService,
                public dialog: MatDialog,
                private errorHandlerService: SuccessOrErrorHandlerService,
                public dialogConfirmation: MatDialog,
                private loadingService: LoaderService) {

        this.saved = false;

        const thisObject = this;
        window.onbeforeunload = function(e) {
            thisObject.onCloseWindow();
            return 'onbeforeunload';
        };

        this.subscriptions.push(
            this.route.params.subscribe(params => {
                if (params['id']) {
                    this.priceId = params.id;
                } else {
                    this.errorHandlerService.showError('ID-ul medicamentului original nu a fost indicat în URL');
                }
            }));
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Medicamente pe pagina: ';
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Reevaluarea prețului medicamentelor generice bazate pe medicamentul original evaluat');

        this.getGenericMedsPrices();
        this.getOriginalMedDetails();
    }


    currencyChanged($event) {
        this.avgCurrencies = $event;
    }

    deleteRelatedMed(index: number) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
    }

    getOriginalMedDetails() {
        this.subscriptions.push(
            this.priceService.getPriceById(this.priceId).subscribe(p => {
                    p.medicament.mdlValue = p.mdlValue;
                    p.medicament.value = p.value;
                    p.medicament.currency = p.currency;
                    this.medicaments.push(p.medicament);
                    console.log('getOriginalMedDetails', this.medicaments);
                },
                error => console.log(error)
            ));
    }

    getGenericMedsPrices() {
        this.subscriptions.push(
            this.priceService.getGenericsPricesForRevaluation(this.priceId).subscribe(prices => {
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
                                this.router.navigate(['dashboard/homepage']);
                            }
                        });
                    } else {
                        this.dataSource._updateChangeSubscription();
                    }
                    console.log('getGenericMedsPrices', prices);
                },
                error => console.log(error)
            ));
    }

    save() {
        this.loadingService.show();
        this.formSubmitted = true;

        const prices: any[] = [];

        if (this.containInvalidPrices) {
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
                type: {id: 9}, //Propus după modificarea originalului
            });
        });

        this.subscriptions.push(this.priceService.modifyPrices(prices).subscribe(data => {
                this.saved = true;
                console.log('saved', data.body);
                this.loadingService.hide();
                // this.router.navigate(['dashboard/homepage']);
            },
            error1 => {
                console.log(error1);
                this.loadingService.hide();
            })
        );

    }

    onCloseWindow() {
        if (!this.saved) {
            // this.priceService.makeAvailableAgain(this.dataSource.data);

            // let win = window.open('http://localhost:4200/dashboard/module/price/revaluation-generics/61', '_blank');
            // let win = window.open('about:blank', '_blank');
            // win.focus();
        }
    }

    newPriceModified(i: number, newValue: any) {
        console.log('newPriceModified', newValue);
        this.dataSource.data[i].priceMdlNew = +newValue;

        const avgCur = this.avgCurrencies.find(cur => cur.currency.shortDescription == this.dataSource.data[i].currency);
        this.dataSource.data[i].priceNew = (+newValue / avgCur.value);

        const percents = (+newValue * 100) / this.medicaments[0].mdlValue;

        this.dataSource.data[i].priceMdlDifferencePercents = percents.toFixed(1);

        this.containInvalidPrices = this.dataSource.data.some(p => p.priceMdlNew == undefined || p.priceMdlNew <= 0 || +p.priceMdlDifferencePercents > 75);
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
