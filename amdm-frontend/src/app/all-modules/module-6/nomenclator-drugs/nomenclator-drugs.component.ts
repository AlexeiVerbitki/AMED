import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {NomenclatorService} from '../../../shared/service/nomenclator.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {NomenclatorModalComponent} from "../nomenclator-modal/nomenclator-modal.component";
import {DatePipe} from "@angular/common";


@Component({
    selector: 'app-nomenclator-drugs',
    templateUrl: './nomenclator-drugs.component.html',
    styleUrls: ['../nomenclator.component.css']
})
export class NomenclatorDrugsComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource();
    datePipe = new DatePipe('en-US');

    columnsToDisplay = ['btnDetalii','codulMed', 'denumireComerciala', 'formaFarmaceutica', 'doza', 'volum', 'divizare', 'dci','atc', 'termenValabilitate', 'nrDeInregistrare',
        'detinatorulCertificatuluiDeIntreg'];


    row = {
        codulMed: '',
        denumireComerciala: '',
        formaFarmaceutica: '',
        doza: '',
        volum: '',
        divizare: '',
        dci: '',
        atc: '',
        termenValabilitate: '',
        nrDeInregistrare: '',
        detinatorulCertificatuluiDeIntreg: ''
    };

    private subscriptions: Subscription[] = [];

    constructor(private navbarTitleService: NavbarTitleService, private nomenclatorService: NomenclatorService, private loadingService: LoaderService, public dialog: MatDialog) {
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Nomenclator');
        this.loadingService.show();

        this.subscriptions.push(this.nomenclatorService.getMedicamentNomenclature().subscribe(data => {
            this.loadingService.hide();
            this.dataSource.data = data;
            console.log(data)

        }, error => {
            console.log('error => ', error);
            this.loadingService.hide();
        }));
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data: any, filter: any) => {
            const f = JSON.parse(filter);
            return data.codulMed.toLowerCase().startsWith(f.codulMed)
                && data.denumireComerciala.toLowerCase().startsWith(f.denumireComerciala)
                && data.formaFarmaceutica.toLowerCase().startsWith(f.formaFarmaceutica)
                && data.doza.toLowerCase().startsWith(f.doza)
                && data.volum.toLowerCase().startsWith(f.volum)
                && data.divizare.toLowerCase().startsWith(f.divizare)
                && data.dci.toLowerCase().startsWith(f.dci)
                && data.atc.toLowerCase().startsWith(f.atc)
                && data.termenValabilitate.toString().toLowerCase().startsWith(f.termenValabilitate)
                && (data.nrDeInregistrare.toString().toLowerCase().startsWith(f.nrDeInregistrare) || this.datePipe.transform(data.dataInregistrarii, 'dd/MM/yyyy').startsWith(f.nrDeInregistrare))
                && (data.detinatorulCertificatuluiDeIntreg.toLowerCase().startsWith(f.detinatorulCertificatuluiDeIntreg) || data.taraDetinatorului.toLowerCase().startsWith(f.detinatorulCertificatuluiDeIntreg))
        };
    }


    filterColumn(column, $event) {
        this.row[column] = $event.target.value;
        this.dataSource.filter = JSON.stringify(this.row);
    }

    showDetails(row: any) {
        const dialogRef = this.dialog.open(NomenclatorModalComponent, {
            data: row,
            width: '650px',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}
