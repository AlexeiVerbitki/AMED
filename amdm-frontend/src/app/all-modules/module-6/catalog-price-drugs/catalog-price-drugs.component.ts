import {Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {NomenclatorService} from '../../../shared/service/nomenclator.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {DatePipe} from "@angular/common";
import {CatalogPriceModalComponent} from "../catalog-price-modal/catalog-price-modal.component";

@Component({
    selector: 'app-catalog-price-drugs', templateUrl: './catalog-price-drugs.component.html', styleUrls: ['../nomenclator.component.css']
})
export class CatalogPriceDrugsComponent implements OnInit, OnDestroy {


    @ViewChild(MatPaginator) paginator: MatPaginator;

    dataSource = new MatTableDataSource<any>();

    datePipe = new DatePipe('en-US');

    columnsToDisplay = ['btnDetalii' ,'codMedicament', 'codVamal', 'denumireComerciala', 'formaFarmaceutica', 'dozaConcentratia', 'volum', 'divizarea', 'denumireaComunaInternationala', 'codulATC', 'pretDeProducatorMDL', 'pretDeProducatorValuta', 'nrOrdinuluiDeAprobareAPretului'];


    row = {
        id: '',
        medCode: '',
        customsCode: '',
        comercialName: '',
        farmaceuticalForm: '',
        dose: '',
        volume: '',
        division: '',
        country: '',
        manufacture: '',
        regNr: '',
        regDate: '',
        atc: '',
        internationalName: '',
        termsOfValidity: '',
        bareCode: '',
        priceMdl: '',
        price: '',
        currency: '',
        orderNr: '',
        orderApprovDate: '',
    };

    private subscriptions: Subscription[] = [];

    constructor(private navbarTitleService: NavbarTitleService, private nomenclatorService: NomenclatorService, private loadingService: LoaderService, public dialog: MatDialog) {}

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Nomenclator');

        this.subscriptions.push(this.nomenclatorService.getPricesClassifier().subscribe(data => {
            this.loadingService.hide();
            this.dataSource.data = data;
            this.dataSource.data.forEach((r: any) => {
                r.id = r.id ? r.id : '';
                r.medCode = r.medCode ? r.medCode : '';
                r.customsCode = r.customsCode ? r.customsCode : '';
                r.comercialName = r.comercialName ? r.comercialName : '';
                r.farmaceuticalForm = r.farmaceuticalForm ? r.farmaceuticalForm : '';
                r.dose = r.dose ? r.dose : '';
                r.volume = r.volume ? r.volume : '';
                r.division = r.division ? r.division : '';
                r.country = r.country ? r.country : '';
                r.manufacture = r.manufacture ? r.manufacture : '';
                r.regNr = r.regNr ? r.regNr : '';
                r.regDate = r.regDate ? r.regDate : '';
                r.atc = r.atc ? r.atc : '';
                r.internationalName = r.internationalName ? r.internationalName : '';
                r.termsOfValidity = r.termsOfValidity ? r.termsOfValidity : '';
                r.bareCode = r.bareCode ? r.bareCode : '';
                r.priceMdl = r.priceMdl ? r.priceMdl : '';
                r.price = r.price ? r.price : '';
                r.currency = r.currency ? r.currency : '';
                r.orderNr = r.orderNr ? r.orderNr : '';
                r.orderApprovDate = r.orderApprovDate ? r.orderApprovDate : ''; 
            });

            console.log(data);

        }, error => {
            console.log('error => ', error);
            this.loadingService.hide();
        }));
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data: any, filter: any) => {
            const f = JSON.parse(filter);
            return data.medCode.toLowerCase().startsWith(f.medCode)
                && data.customsCode.toLowerCase().startsWith(f.customsCode)
                && data.comercialName.toLowerCase().startsWith(f.comercialName)
                && data.farmaceuticalForm.toLowerCase().startsWith(f.farmaceuticalForm)
                && data.dose.toLowerCase().startsWith(f.dose)
                && data.volume.toLowerCase().startsWith(f.volume)
                && data.division.toLowerCase().startsWith(f.division)
                && data.country.toLowerCase().startsWith(f.country)
                && data.manufacture.toLowerCase().startsWith(f.manufacture)
                && data.regNr.toLowerCase().startsWith(f.regNr)
                && (data.regDate == '' || this.datePipe.transform(data.regDate, 'dd/MM/yyyy').startsWith(f.regDate))
                && data.atc.toLowerCase().startsWith(f.atc)
                && data.internationalName.toLowerCase().startsWith(f.internationalName)
                && data.termsOfValidity.toString().toLowerCase().startsWith(f.termsOfValidity)
                && data.bareCode.toLowerCase().startsWith(f.bareCode)
                && data.priceMdl.toString().toLowerCase().startsWith(f.priceMdl)
                && data.price.toString().toLowerCase().startsWith(f.price)
                && data.currency.toLowerCase().startsWith(f.currency)
                && data.orderNr.toLowerCase().startsWith(f.orderNr)
                && (data.orderApprovDate == '' || this.datePipe.transform(data.orderApprovDate, 'dd/MM/yyyy').startsWith(f.orderApprovDate))
        };
    }

    filterColumn(column, $event) {
        this.row[column] = $event.target.value;
        this.dataSource.filter = JSON.stringify(this.row);
    }


    showDetails(row: any) {
        const dialogRef = this.dialog.open(CatalogPriceModalComponent, {
            data: row,
            width: '650px',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}
