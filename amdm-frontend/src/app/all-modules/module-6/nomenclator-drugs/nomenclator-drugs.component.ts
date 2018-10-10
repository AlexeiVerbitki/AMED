import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface PriceCatalog {
  id: number;
  denumireComerciala: string;
  formaFarmaceutica: string;
  doza: string;
  volum: string;
  divizarea: string;
  dci: string;
  atc: string;
  termenDeValabilitate: string;
  nrDeInregistrare: string;
  dataInregistrarii: Date;
  detinatorulCertificatuluiDeIntreg: string;
  taraDetinatorului: string;
  statutDeEliberare: string;
  original: string;
  informatiaDespreProducator: string;
  instructiunea: string;
  machetaAmbalajului: string;
}

const ELEMENT_DATA: PriceCatalog[] = [
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
  { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },

];

@Component({
  selector: 'app-nomenclator-drugs',
  templateUrl: './nomenclator-drugs.component.html',
  styleUrls: ['./nomenclator-drugs.component.css']
})
export class NomenclatorDrugsComponent implements OnInit {

  displayedColumns: any[] = ['id', 'denumireComerciala', 'formaFarmaceutica', 'doza', 'volum', 'divizarea', 'dci', 'atc', 'termenDeValabilitate', 'nrDeInregistrare', 'dataInregistrarii', 'detinatorulCertificatuluiDeIntreg', 'taraDetinatorului', 'statutDeEliberare', 'original', 'informatiaDespreProducator', 'instructiunea', 'machetaAmbalajului'];
  dataSource = new MatTableDataSource<PriceCatalog>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
