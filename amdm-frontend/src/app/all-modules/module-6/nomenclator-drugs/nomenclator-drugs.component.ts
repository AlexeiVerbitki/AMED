import {FormControl} from '@angular/forms';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Subscription} from "rxjs";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {NomenclatorService} from "../../../shared/service/nomenclator.service";
import {LoaderService} from "../../../shared/service/loader.service";


@Component({
    selector: 'app-nomenclator-drugs',
    templateUrl: './nomenclator-drugs.component.html',
    styleUrls: ['../nomenclator.component.css']
})
export class NomenclatorDrugsComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    clasifyDrugsTable = [];
    codulMedFilter = new FormControl('');
    codVamalFilter = new FormControl('');
    denumireComercialaFilter = new FormControl('');
    formaFarmaceuticaFilter = new FormControl('');
    dozaFilter = new FormControl('');
    volumFilter = new FormControl('');
    divizareFilter = new FormControl('');
    atcFilter = new FormControl('');
    termenDeValabilitateFilter = new FormControl('');
    nrDeInregistrareFilter = new FormControl('');
    dataInregistrariiFilter = new FormControl('');
    detinatorulCertificatuluiDeIntregFilter = new FormControl('');
    taraDetinatoruluiFilter = new FormControl('');
    statutDeEliberareFilter = new FormControl('');
    originalFilter = new FormControl('');
    informatiaDespreProducatorFilter = new FormControl('');
    instructiuneaFilter = new FormControl('');
    machetaAmbalajuluiFilter = new FormControl('');
    dciFilter = new FormControl('');
    dataSource = new MatTableDataSource();
    columnsToDisplay = ['codulMed', 'codVamal', 'denumireComerciala', 'formaFarmaceutica', 'doza', 'volum', 'divizare', 'atc', 'termenDeValabilitate', 'nrDeInregistrare',
        'dataInregistrarii', 'detinatorulCertificatuluiDeIntreg', 'taraDetinatorului', 'statutDeEliberare', 'original', 'informatiaDespreProducator', 'instructiunea',
        'machetaAmbalajului', 'dci'];
    filterValues = {
        codulMed: '',
        codVamal: '',
        denumireComerciala: '',
        formaFarmaceutica: '',
        doza: '',
        volum: '',
        divizare: '',
        atc: '',
        termenDeValabilitate: '',
        nrDeInregistrare: '',
        dataInregistrarii: '',
        detinatorulCertificatuluiDeIntreg: '',
        taraDetinatorului: '',
        statutDeEliberare: '',
        original: '',
        informatiaDespreProducator: '',
        instructiunea: '',
        machetaAmbalajului: '',
        dci: ''
    };
    private subscriptions: Subscription[] = [];

    constructor(private navbarTitleService: NavbarTitleService,
                private nomenclatorService: NomenclatorService,
                private loadingService: LoaderService,) {

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    ngOnInit() {

        this.navbarTitleService.showTitleMsg('Nomenclator');

        // this.loadingService.show();
        this.subscriptions.push(this.nomenclatorService.getAllMedicaments().subscribe(data => {
                this.loadingService.hide();
                console.log(' =====> ', data);
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
                    this.filterValues.codulMed = codulMed;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.codVamalFilter.valueChanges
            .subscribe(
                codVamal => {
                    this.filterValues.codVamal = codVamal;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.denumireComercialaFilter.valueChanges
            .subscribe(
                denumireComerciala => {
                    this.filterValues.denumireComerciala = denumireComerciala;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.formaFarmaceuticaFilter.valueChanges
            .subscribe(
                formaFarmaceutica => {
                    this.filterValues.formaFarmaceutica = formaFarmaceutica;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.dozaFilter.valueChanges
            .subscribe(
                doza => {
                    this.filterValues.doza = doza;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.volumFilter.valueChanges
            .subscribe(
                volum => {
                    this.filterValues.volum = volum;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.divizareFilter.valueChanges
            .subscribe(
                divizare => {
                    this.filterValues.divizare = divizare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.atcFilter.valueChanges
            .subscribe(
                atc => {
                    this.filterValues.atc = atc;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.termenDeValabilitateFilter.valueChanges
            .subscribe(
                termenDeValabilitate => {
                    this.filterValues.termenDeValabilitate = termenDeValabilitate;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.nrDeInregistrareFilter.valueChanges
            .subscribe(
                nrDeInregistrare => {
                    this.filterValues.nrDeInregistrare = nrDeInregistrare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.dataInregistrariiFilter.valueChanges
            .subscribe(
                dataInregistrarii => {
                    this.filterValues.dataInregistrarii = dataInregistrarii;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.detinatorulCertificatuluiDeIntregFilter.valueChanges
            .subscribe(
                detinatorulCertificatuluiDeIntreg => {
                    this.filterValues.detinatorulCertificatuluiDeIntreg = detinatorulCertificatuluiDeIntreg;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.taraDetinatoruluiFilter.valueChanges
            .subscribe(
                taraDetinatorului => {
                    this.filterValues.taraDetinatorului = taraDetinatorului;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.statutDeEliberareFilter.valueChanges
            .subscribe(
                statutDeEliberare => {
                    this.filterValues.statutDeEliberare = statutDeEliberare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.originalFilter.valueChanges
            .subscribe(
                original => {
                    this.filterValues.original = original;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.informatiaDespreProducatorFilter.valueChanges
            .subscribe(
                informatiaDespreProducator => {
                    this.filterValues.informatiaDespreProducator = informatiaDespreProducator;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.instructiuneaFilter.valueChanges
            .subscribe(
                instructiunea => {
                    this.filterValues.instructiunea = instructiunea;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.machetaAmbalajuluiFilter.valueChanges
            .subscribe(
                machetaAmbalajului => {
                    this.filterValues.machetaAmbalajului = machetaAmbalajului;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
        this.subscriptions.push(this.dciFilter.valueChanges
            .subscribe(
                dci => {
                    this.filterValues.dci = dci;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            ));
    }

    createFilter(): (data: any, filter: string) => boolean {
        let filterFunction = function (data, filter): boolean {
            let searchTerms = JSON.parse(filter);
            return data.denumireComerciala.toLowerCase().indexOf(searchTerms.denumireComerciala) !== -1
                && data.formaFarmaceutica.toLowerCase().indexOf(searchTerms.formaFarmaceutica) !== -1
                && data.doza.toLowerCase().indexOf(searchTerms.doza) !== -1
                && data.volum.toLowerCase().indexOf(searchTerms.volum) !== -1
                && data.divizare.toLowerCase().indexOf(searchTerms.divizare) !== -1
                && data.atc.toLowerCase().indexOf(searchTerms.atc) !== -1
                && data.termenDeValabilitate.toLowerCase().indexOf(searchTerms.termenDeValabilitate) !== -1
                && data.nrDeInregistrare.toLowerCase().indexOf(searchTerms.nrDeInregistrare) !== -1
                && data.dataInregistrarii.toLowerCase().indexOf(searchTerms.dataInregistrarii) !== -1
                && data.detinatorulCertificatuluiDeIntreg.toLowerCase().indexOf(searchTerms.detinatorulCertificatuluiDeIntreg) !== -1
                && data.taraDetinatorului.toLowerCase().indexOf(searchTerms.taraDetinatorului) !== -1
                && data.statutDeEliberare.toLowerCase().indexOf(searchTerms.statutDeEliberare) !== -1
                && data.original.toLowerCase().indexOf(searchTerms.original) !== -1
                && data.informatiaDespreProducator.toLowerCase().indexOf(searchTerms.informatiaDespreProducator) !== -1
                && data.instructiunea.toLowerCase().indexOf(searchTerms.instructiunea) !== -1
                && data.machetaAmbalajului.toLowerCase().indexOf(searchTerms.machetaAmbalajului) !== -1
                && data.dci.toLowerCase().indexOf(searchTerms.dci) !== -1

        };
        return filterFunction;
    }

}
