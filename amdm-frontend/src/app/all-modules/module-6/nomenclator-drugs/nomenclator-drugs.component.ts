import {FormControl} from '@angular/forms';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {NomenclatorService} from '../../../shared/service/nomenclator.service';
import {LoaderService} from '../../../shared/service/loader.service';


@Component({
    selector: 'app-nomenclator-drugs',
    templateUrl: './nomenclator-drugs.component.html',
    styleUrls: ['../nomenclator.component.css']
})
export class NomenclatorDrugsComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    codulMedFilter = new FormControl('');
    codVamalFilter = new FormControl('');
    denumireComercialaFilter = new FormControl('');
    formaFarmaceuticaFilter = new FormControl('');
    dozaFilter = new FormControl('');
    volumFilter = new FormControl('');
    divizareFilter = new FormControl('');
    atcFilter = new FormControl('');
    firmaProducatoareFilter = new FormControl('');
    nrDeInregistrareFilter = new FormControl('');
    dataInregistrariiFilter = new FormControl('');
    detinatorulCertificatuluiDeIntregFilter = new FormControl('');
    taraDetinatoruluiFilter = new FormControl('');
    statutDeEliberareFilter = new FormControl('');
    originalFilter = new FormControl('');
    instructiuneaFilter = new FormControl('');
    machetaAmbalajuluiFilter = new FormControl('');
    dciFilter = new FormControl('');
    dataSource = new MatTableDataSource();
    columnsToDisplay = ['codulMed', 'codVamal', 'denumireComerciala', 'formaFarmaceutica', 'doza', 'volum', 'divizare', 'atc', 'firmaProducatoare', 'nrDeInregistrare',
        'dataInregistrarii', 'detinatorulCertificatuluiDeIntreg', 'taraDetinatorului', 'statutDeEliberare', 'original', 'instructiunea',
        'machetaAmbalajului', 'dci'];

    private subscriptions: Subscription[] = [];

    constructor(private navbarTitleService: NavbarTitleService,
                private nomenclatorService: NomenclatorService,
                private loadingService: LoaderService) {

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;

        this.dataSource.filterPredicate = (value: string, filter: string) => JSON.stringify(value).toLowerCase().trim().includes(
            filter.toString().toLowerCase().trim());
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    ngOnInit() {

        this.navbarTitleService.showTitleMsg('Nomenclator');
        this.loadingService.show();

        this.subscriptions.push(this.nomenclatorService.getAllMedicaments().subscribe(data => {
                this.loadingService.hide();
                this.dataSource.data = data;
            },
            error => {
                console.log('error => ', error);
                this.loadingService.hide();
            }
        ));


        // this.dataSource.data = this.clasifyDrugsTable;

        this.subscriptions.push(this.codulMedFilter.valueChanges
            .subscribe(
                codulMed => {
                    this.filterTable(codulMed);
                }
            ));
        this.subscriptions.push(this.codVamalFilter.valueChanges
            .subscribe(
                codVamal => {
                    this.filterTable(codVamal);
                }
            ));
        this.subscriptions.push(this.denumireComercialaFilter.valueChanges
            .subscribe(
                denumireComerciala => {
                    this.filterTable(denumireComerciala);
                }
            ));
        this.subscriptions.push(this.formaFarmaceuticaFilter.valueChanges
            .subscribe(
                formaFarmaceutica => {
                    this.filterTable(formaFarmaceutica);
                }
            ));
        this.subscriptions.push(this.dozaFilter.valueChanges
            .subscribe(
                doza => {
                    this.filterTable(doza);
                }
            ));
        this.subscriptions.push(this.volumFilter.valueChanges
            .subscribe(
                volum => {
                    this.filterTable(volum);
                }
            ));
        this.subscriptions.push(this.divizareFilter.valueChanges
            .subscribe(
                divizare => {
                    this.filterTable(divizare);
                }
            ));
        this.subscriptions.push(this.atcFilter.valueChanges
            .subscribe(
                atc => {
                    this.filterTable(atc);
                }
            ));
        this.subscriptions.push(this.firmaProducatoareFilter.valueChanges
            .subscribe(
                firmaProducatoare => {
                    this.filterTable(firmaProducatoare);
                }
            ));
        this.subscriptions.push(this.nrDeInregistrareFilter.valueChanges
            .subscribe(
                nrDeInregistrare => {
                    this.filterTable(nrDeInregistrare);
                }
            ));
        this.subscriptions.push(this.dataInregistrariiFilter.valueChanges
            .subscribe(
                dataInregistrarii => {
                    this.filterTable(dataInregistrarii);
                }
            ));
        this.subscriptions.push(this.detinatorulCertificatuluiDeIntregFilter.valueChanges
            .subscribe(
                detinatorulCertificatuluiDeIntreg => {
                    this.filterTable(detinatorulCertificatuluiDeIntreg);
                }
            ));
        this.subscriptions.push(this.taraDetinatoruluiFilter.valueChanges
            .subscribe(
                taraDetinatorului => {
                    this.filterTable(taraDetinatorului);
                }
            ));
        this.subscriptions.push(this.statutDeEliberareFilter.valueChanges
            .subscribe(
                statutDeEliberare => {
                    this.filterTable(statutDeEliberare);
                }
            ));
        this.subscriptions.push(this.originalFilter.valueChanges
            .subscribe(
                original => {
                    this.filterTable(original);
                }
            ));
        this.subscriptions.push(this.instructiuneaFilter.valueChanges
            .subscribe(
                instructiunea => {
                    this.filterTable(instructiunea);

                }
            ));
        this.subscriptions.push(this.machetaAmbalajuluiFilter.valueChanges
            .subscribe(
                machetaAmbalajului => {
                    this.filterTable(machetaAmbalajului);

                }
            ));
        this.subscriptions.push(this.dciFilter.valueChanges
            .subscribe(
                dci => {
                    this.filterTable(dci);
                }
            ));
    }

    filterTable(element: string) {
        if (element.toLocaleString().length >= 3) {
            this.dataSource.filter = element;
        } else {
            this.dataSource.filter = '';
        }
    }
}
