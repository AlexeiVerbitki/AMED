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
        'dataInregistrarii', 'detinatorulCertificatuluiDeIntreg', 'taraDetinatorului', 'statutDeEliberare', 'original', 'instructiunea', 'machetaAmbalajului', 'dci'];

    filterValues = {
        codulMed: '',
        codVamal: '',
        denumireComerciala: '',
        formaFarmaceutica: '',
        doza: '',
        volum: '',
        divizare: '',
        atc: '',
        firmaProducatoare: '',
        nrDeInregistrare: '',
        dataInregistrarii: '',
        detinatorulCertificatuluiDeIntreg: '',
        taraDetinatorului: '',
        statutDeEliberare: '',
        original: '',
        instructiunea: '',
        machetaAmbalajului: '',
        dci: ''
    };

    obj = [{
        'codulMed': 'test1',
        'codVamal': 'test1',
        'denumireComerciala': 'test1',
        'formaFarmaceutica': 'test1',
        'doza': 'test1',
        'volum': 'test1',
        'divizare': 'test1',
        'atc': 'test1',
        'firmaProducatoare': 'test1',
        'nrDeInregistrare': 'test1',
        'dataInregistrarii': new Date(),
        'detinatorulCertificatuluiDeIntreg': 'test1',
        'taraDetinatorului': 'test1',
        'statutDeEliberare': 'test1',
        'original': 'test1',
        'instructiunea': 'test1',
        'machetaAmbalajului': 'test1',
        'dci': 'test1'
    },
        {
            'codulMed': 'test2',
            'codVamal': 'test2',
            'denumireComerciala': 'test2',
            'formaFarmaceutica': 'test2',
            'doza': 'test2',
            'volum': 'test2',
            'divizare': 'test2',
            'atc': 'test2',
            'firmaProducatoare': 'test2',
            'nrDeInregistrare': 'test2',
            'dataInregistrarii': new Date(),
            'detinatorulCertificatuluiDeIntreg': 'test2',
            'taraDetinatorului': 'test2',
            'statutDeEliberare': 'test2',
            'original': 'test2',
            'instructiunea': 'test2',
            'machetaAmbalajului': 'test2',
            'dci': 'test2'
        }];
    private subscriptions: Subscription[] = [];

    constructor(private navbarTitleService: NavbarTitleService, private nomenclatorService: NomenclatorService, private loadingService: LoaderService) {
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
        this.loadingService.show();

        this.subscriptions.push(this.nomenclatorService.getMedicamentNomenclature().subscribe(data => {
            this.loadingService.hide();
            this.dataSource.data = data;

        }, error => {
            console.log('error => ', error);
            this.loadingService.hide();
        }));

        this.codulMedFilter.valueChanges
            .subscribe(
                codulMed => {
                    this.filterValues.codulMed = codulMed;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.codVamalFilter.valueChanges
            .subscribe(
                codVamal => {
                    this.filterValues.codVamal = codVamal;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.denumireComercialaFilter.valueChanges
            .subscribe(
                denumireComerciala => {
                    this.filterValues.denumireComerciala = denumireComerciala;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.formaFarmaceuticaFilter.valueChanges
            .subscribe(
                formaFarmaceutica => {
                    this.filterValues.formaFarmaceutica = formaFarmaceutica;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.dozaFilter.valueChanges
            .subscribe(
                doza => {
                    this.filterValues.doza = doza;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.volumFilter.valueChanges
            .subscribe(
                volum => {
                    this.filterValues.volum = volum;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.divizareFilter.valueChanges
            .subscribe(
                divizare => {
                    this.filterValues.divizare = divizare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.atcFilter.valueChanges
            .subscribe(
                atc => {
                    this.filterValues.atc = atc;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.firmaProducatoareFilter.valueChanges
            .subscribe(
                firmaProducatoare => {
                    this.filterValues.firmaProducatoare = firmaProducatoare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.nrDeInregistrareFilter.valueChanges
            .subscribe(
                nrDeInregistrare => {
                    this.filterValues.nrDeInregistrare = nrDeInregistrare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.dataInregistrariiFilter.valueChanges
            .subscribe(
                dataInregistrarii => {
                    this.filterValues.dataInregistrarii = dataInregistrarii;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.detinatorulCertificatuluiDeIntregFilter.valueChanges
            .subscribe(
                detinatorulCertificatuluiDeIntreg => {
                    this.filterValues.detinatorulCertificatuluiDeIntreg = detinatorulCertificatuluiDeIntreg;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.taraDetinatoruluiFilter.valueChanges
            .subscribe(
                taraDetinatorului => {
                    this.filterValues.taraDetinatorului = taraDetinatorului;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.statutDeEliberareFilter.valueChanges
            .subscribe(
                statutDeEliberare => {
                    this.filterValues.statutDeEliberare = statutDeEliberare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.originalFilter.valueChanges
            .subscribe(
                original => {
                    this.filterValues.original = original;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );

        this.instructiuneaFilter.valueChanges
            .subscribe(
                instructiunea => {
                    this.filterValues.instructiunea = instructiunea;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.machetaAmbalajuluiFilter.valueChanges
            .subscribe(
                machetaAmbalajului => {
                    this.filterValues.machetaAmbalajului = machetaAmbalajului;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.dciFilter.valueChanges
            .subscribe(
                dci => {
                    this.filterValues.dci = dci;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
    }

    createFilter(): (data: any, filter: string) => boolean {
        const filterFunction = function (data, filter): boolean {
            const searchTerms = JSON.parse(filter);
            return data.codMed.toLowerCase().trim()
                    .startsWith(searchTerms.denumireComerciala.toLowerCase().trim())
                && data.codVamal.toLowerCase().trim()
                    .startsWith(searchTerms.denumireComerciala.toLowerCase().trim())
                && data.denumireComerciala.toLowerCase().trim()
                    .startsWith(searchTerms.denumireComerciala.toLowerCase().trim())
                && data.formaFarmaceutica.toLowerCase().trim()
                    .startsWith(searchTerms.formaFarmaceutica.toLowerCase().trim())
                && data.doza.toLowerCase().trim()
                    .startsWith(searchTerms.doza.toLowerCase().trim())
                && data.volum.toLowerCase().trim()
                    .startsWith(searchTerms.volum.toLowerCase().trim())
                && data.divizare.toLowerCase().trim()
                    .startsWith(searchTerms.divizare.toLowerCase().trim())
                && data.atc.toLowerCase().trim()
                    .startsWith(searchTerms.atc.toLowerCase().trim())
                && data.firmaProducatoare.toLowerCase().trim()
                    .startsWith(searchTerms.firmaProducatoare.toLowerCase().trim())
                && data.nrDeInregistrare.toString().toLowerCase().trim()
                    .startsWith(searchTerms.nrDeInregistrare.toString().toLowerCase().trim())
                && data.dataInregistrarii.toLowerCase().trim()
                    .startsWith(searchTerms.dataInregistrarii.toLowerCase().trim())
                && data.detinatorulCertificatuluiDeIntreg.toLowerCase().trim()
                    .startsWith(searchTerms.detinatorulCertificatuluiDeIntreg.toLowerCase().trim())
                && data.taraDetinatorului.toLowerCase().trim()
                    .startsWith(searchTerms.taraDetinatorului.toLowerCase().trim())
                && data.statutDeEliberare.toLowerCase().trim()
                    .startsWith(searchTerms.statutDeEliberare.toLowerCase().trim())
                && data.original.toLowerCase().trim()
                    .startsWith(searchTerms.original.toLowerCase().trim())
                && data.instructiunea.toLowerCase().trim()
                    .startsWith(searchTerms.instructiunea.toLowerCase().trim())
                && data.machetaAmbalajului.toLowerCase().trim()
                    .startsWith(searchTerms.machetaAmbalajului.toLowerCase().trim())
                && data.dci.toLowerCase().trim()
                    .startsWith(searchTerms.dci.toLowerCase().trim());
        };
        return filterFunction;
    }
}
