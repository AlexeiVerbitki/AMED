import {FormControl} from '@angular/forms';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


@Component({
    selector: 'app-nomenclator-drugs',
    templateUrl: './nomenclator-drugs.component.html',
    styleUrls: ['../nomenclator.component.css']
})
export class NomenclatorDrugsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    clasifyDrugsTable = [
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'JJ', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' }
    ];
    denumireComercialaFilter = new FormControl('');
    formaFarmaceuticaFilter = new FormControl('');
    dozaFilter = new FormControl('');
    volumFilter = new FormControl('');
    divizareaFilter = new FormControl('');
    dciFilter = new FormControl('');
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
    denumireaComunaInternationalaFilter = new FormControl('');
    dataSource = new MatTableDataSource();
    columnsToDisplay = ['denumireComerciala', 'formaFarmaceutica', 'doza', 'volum', 'divizarea', 'dci', 'atc', 'termenDeValabilitate', 'nrDeInregistrare', 'dataInregistrarii', 'detinatorulCertificatuluiDeIntreg', 'taraDetinatorului', 'statutDeEliberare', 'original', 'informatiaDespreProducator', 'instructiunea', 'machetaAmbalajului', 'denumireaComunaInternationala'];
    filterValues = {
        denumireComerciala: '',
        formaFarmaceutica: '',
        doza: '',
        volum: '',
        divizarea: '',
        dci: '',
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
        denumireaComunaInternationala: '',
    };

    constructor() {

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
    }

    ngOnDestroy(): void {
        console.log('moneclator drugs destroy');
    }

    ngOnInit() {
        console.log('init drugs');
        this.dataSource.data = this.clasifyDrugsTable;

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
        this.divizareaFilter.valueChanges
            .subscribe(
                divizarea => {
                    this.filterValues.divizarea = divizarea;
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
        this.atcFilter.valueChanges
            .subscribe(
                atc => {
                    this.filterValues.atc = atc;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.termenDeValabilitateFilter.valueChanges
            .subscribe(
                termenDeValabilitate => {
                    this.filterValues.termenDeValabilitate = termenDeValabilitate;
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
        this.informatiaDespreProducatorFilter.valueChanges
            .subscribe(
                informatiaDespreProducator => {
                    this.filterValues.informatiaDespreProducator = informatiaDespreProducator;
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
        this.denumireaComunaInternationalaFilter.valueChanges
            .subscribe(denumireaComunaInternationala => {
                this.filterValues.denumireaComunaInternationala = denumireaComunaInternationala;
                this.dataSource.filter = JSON.stringify(this.filterValues);
            });
    }

    createFilter(): (data: any, filter: string) => boolean {
        let filterFunction = function (data, filter): boolean {
            let searchTerms = JSON.parse(filter);
            return data.denumireComerciala.toLowerCase().indexOf(searchTerms.denumireComerciala) !== -1
                && data.formaFarmaceutica.toLowerCase().indexOf(searchTerms.formaFarmaceutica) !== -1
                && data.doza.toLowerCase().indexOf(searchTerms.doza) !== -1
                && data.volum.toLowerCase().indexOf(searchTerms.volum) !== -1
                && data.divizarea.toLowerCase().indexOf(searchTerms.divizarea) !== -1
                && data.dci.toLowerCase().indexOf(searchTerms.dci) !== -1
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
                && data.denumireaComunaInternationala.toLowerCase().indexOf(searchTerms.denumireaComunaInternationala) !== -1

        };
        return filterFunction;
    }

}
