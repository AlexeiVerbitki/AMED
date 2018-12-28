import {FormControl} from '@angular/forms';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
    selector: 'app-clasify-drugs',
    templateUrl: './clasify-drugs.component.html',
    styleUrls: ['../nomenclator.component.css']
})

export class ClasifyDrugsComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    clasifyDrugsTable = [
        {
            codMedicament: 'Cl1231',
            codVamal: 'CV112345',
            denumireComerciala: 'DM112345',
            formaFarmaceutica: 'FM123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr112345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC112345',
            denumireaComunaInternationala: 'DCI1',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB112345'
        },
        {
            codMedicament: 'Cl1231',
            codVamal: 'CV112345',
            denumireComerciala: 'DM112345',
            formaFarmaceutica: 'FM123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr112345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC112345',
            denumireaComunaInternationala: 'DCI1',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB112345'
        },
        {
            codMedicament: 'Cl1231',
            codVamal: 'CV112345',
            denumireComerciala: 'DM112345',
            formaFarmaceutica: 'FM123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr112345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC112345',
            denumireaComunaInternationala: 'DCI1',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB112345'
        },
        {
            codMedicament: 'Cl1231',
            codVamal: 'CV112345',
            denumireComerciala: 'DM112345',
            formaFarmaceutica: 'FM123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr112345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC112345',
            denumireaComunaInternationala: 'DCI1',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB112345'
        },
        {
            codMedicament: 'Cl1231',
            codVamal: 'CV112345',
            denumireComerciala: 'DM112345',
            formaFarmaceutica: 'FM123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr112345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC112345',
            denumireaComunaInternationala: 'DCI1',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB112345'
        },
        {
            codMedicament: 'Cl1231',
            codVamal: 'CV112345',
            denumireComerciala: 'DM112345',
            formaFarmaceutica: 'FM123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr112345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC112345',
            denumireaComunaInternationala: 'DCI1',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB112345'
        },
        {
            codMedicament: 'Cl1231',
            codVamal: 'CV112345',
            denumireComerciala: 'DM112345',
            formaFarmaceutica: 'FM123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr112345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC112345',
            denumireaComunaInternationala: 'DCI1',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB112345'
        },
        {
            codMedicament: 'Cl1231',
            codVamal: 'CV112345',
            denumireComerciala: 'DM112345',
            formaFarmaceutica: 'FM123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr112345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC112345',
            denumireaComunaInternationala: 'DCI1',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB112345'
        },
        {
            codMedicament: 'CM212345',
            codVamal: 'CV212345',
            denumireComerciala: 'DM212345',
            formaFarmaceutica: 'FM223445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr212345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC212345',
            denumireaComunaInternationala: 'DCI2',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB212345'
        },
        {
            codMedicament: 'CM312345',
            codVamal: 'CV312345',
            denumireComerciala: 'DM312345',
            formaFarmaceutica: 'F3123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr312345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC312345',
            denumireaComunaInternationala: 'DCI3',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB312345'
        },
        {
            codMedicament: 'CM412345',
            codVamal: 'CV412345',
            denumireComerciala: 'DM412345',
            formaFarmaceutica: 'F4123445',
            dozaConcentratia: '100ml',
            volum: '5g',
            divizarea: 'Divizare',
            tara: 'MD',
            firmaProducatoare: 'Zaporojie pikinez',
            nrDeInregistrare: 'Nr412345',
            dataDeInregistrare: new Date(),
            codulATC: 'CATC412345',
            denumireaComunaInternationala: 'DCI4',
            termenulDeValabilitate: '24 luni',
            codulDeBare: 'CB412345'
        }
    ];
    codMedicamentFilter = new FormControl('');
    codVamalFilter = new FormControl('');
    denumireComercialaFilter = new FormControl('');
    formaFarmaceuticaFilter = new FormControl('');
    dozaConcentratiaFilter = new FormControl('');
    volumFilter = new FormControl('');
    divizareaFilter = new FormControl('');
    taraFilter = new FormControl('');
    firmaProducatoareFilter = new FormControl('');
    nrDeInregistrareFilter = new FormControl('');
    dataDeInregistrareFilter = new FormControl('');
    codulATCFilter = new FormControl('');
    denumireaComunaInternationalaFilter = new FormControl('');
    termenulDeValabilitateFilter = new FormControl('');
    codulDeBareFilter = new FormControl('');
    dataSource = new MatTableDataSource();
    columnsToDisplay = ['codMedicament', 'codVamal', 'denumireComerciala', 'formaFarmaceutica', 'dozaConcentratia', 'volum', 'divizarea', 'tara',
        'firmaProducatoare', 'nrDeInregistrare', 'dataDeInregistrare', 'codulATC', 'denumireaComunaInternationala', 'termenulDeValabilitate',
        'codulDeBare'];
    filterValues = {
        codMedicament: '',
        codVamal: '',
        denumireComerciala: '',
        formaFarmaceutica: '',
        dozaConcentratia: '',
        volum: '',
        divizarea: '',
        tara: '',
        firmaProducatoare: '',
        nrDeInregistrare: '',
        dataDeInregistrare: '',
        codulATC: '',
        denumireaComunaInternationala: '',
        termenulDeValabilitate: '',
        codulDeBare: ''
    };

    constructor() {
        this.dataSource.data = this.clasifyDrugsTable;
        this.dataSource.filterPredicate = this.createFilter();
    }

    ngOnDestroy(): void {
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;

        this.codMedicamentFilter.valueChanges
            .subscribe(
                codMedicament => {
                    this.filterValues.codMedicament = codMedicament;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.codVamalFilter.valueChanges
            .subscribe(
                codVamal => {
                    this.filterValues.codVamal = codVamal;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.denumireComercialaFilter.valueChanges
            .subscribe(
                denumireComerciala => {
                    this.filterValues.denumireComerciala = denumireComerciala;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.formaFarmaceuticaFilter.valueChanges
            .subscribe(
                formaFarmaceutica => {
                    this.filterValues.formaFarmaceutica = formaFarmaceutica;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.dozaConcentratiaFilter.valueChanges
            .subscribe(
                dozaConcentratia => {
                    this.filterValues.dozaConcentratia = dozaConcentratia;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.volumFilter.valueChanges
            .subscribe(
                volum => {
                    this.filterValues.volum = volum;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.divizareaFilter.valueChanges
            .subscribe(
                divizarea => {
                    this.filterValues.divizarea = divizarea;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.taraFilter.valueChanges
            .subscribe(
                tara => {
                    this.filterValues.tara = tara;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.firmaProducatoareFilter.valueChanges
            .subscribe(
                firmaProducatoare => {
                    this.filterValues.firmaProducatoare = firmaProducatoare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.nrDeInregistrareFilter.valueChanges
            .subscribe(
                nrDeInregistrare => {
                    this.filterValues.nrDeInregistrare = nrDeInregistrare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.dataDeInregistrareFilter.valueChanges
            .subscribe(
                dataDeInregistrare => {
                    this.filterValues.dataDeInregistrare = dataDeInregistrare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.codulATCFilter.valueChanges
            .subscribe(
                codulATC => {
                    this.filterValues.codulATC = codulATC;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.denumireaComunaInternationalaFilter.valueChanges
            .subscribe(
                denumireaComunaInternationala => {
                    this.filterValues.denumireaComunaInternationala = denumireaComunaInternationala;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.termenulDeValabilitateFilter.valueChanges
            .subscribe(
                termenulDeValabilitate => {
                    this.filterValues.termenulDeValabilitate = termenulDeValabilitate;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
        this.codulDeBareFilter.valueChanges
            .subscribe(
                codulDeBare => {
                    this.filterValues.codulDeBare = codulDeBare;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            )
    }

    createFilter(): (data: any, filter: string) => boolean {
        const filterFunction = function (data, filter): boolean {
            const searchTerms = JSON.parse(filter);
            return data.codMedicament.toString().toLowerCase().indexOf(searchTerms.codMedicament) !== -1
                && data.codVamal.toLowerCase().indexOf(searchTerms.codVamal) !== -1
                && data.denumireComerciala.toLowerCase().indexOf(searchTerms.denumireComerciala) !== -1
                && data.formaFarmaceutica.toLowerCase().indexOf(searchTerms.formaFarmaceutica) !== -1
                && data.dozaConcentratia.toLowerCase().indexOf(searchTerms.dozaConcentratia) !== -1
                && data.volum.toLowerCase().indexOf(searchTerms.volum) !== -1
                && data.divizarea.toLowerCase().indexOf(searchTerms.divizarea) !== -1
                && data.tara.toLowerCase().indexOf(searchTerms.tara) !== -1
                && data.firmaProducatoare.toLowerCase().indexOf(searchTerms.firmaProducatoare) !== -1
                && data.nrDeInregistrare.toLowerCase().indexOf(searchTerms.nrDeInregistrare) !== -1
                // && data.dataDeInregistrare.toLowerCase().indexOf(searchTerms.dataDeInregistrare) !== -1
                && data.codulATC.toLowerCase().indexOf(searchTerms.codulATC) !== -1
                && data.denumireaComunaInternationala.toLowerCase().indexOf(searchTerms.denumireaComunaInternationala) !== -1
                && data.termenulDeValabilitate.toLowerCase().indexOf(searchTerms.termenulDeValabilitate) !== -1
                && data.codulDeBare.toLowerCase().indexOf(searchTerms.codulDeBare) !== -1;
        }
        return filterFunction;
    }

}
