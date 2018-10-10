import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface PriceCatalog {
  id: number;
  codMedicament: string;
  codVamal: string;
  denumireComerciala: string;
  formaFarmaceutica: string;
  dozaConcentratia: string;
  volum: string;
  divizarea: string;
  tara: string;
  firmaProducatoare: string;
  nrDeInregistrare: string;
  dataDeInregistrare: Date;
  codulATC: string;
  denumireaComunaInternationala: string;
  termenulDeValabilitate: string;
  codulDeBare: string;
  pretDeProducatorMDL: number;
  pretDeProducatorValuta: string;
  valuta: string;
  nrSiDataOrdinuluiDeAprobareAPretului: string;
}

const ELEMENT_DATA: PriceCatalog[] = [
  { id: 1, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI1', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 2, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI2', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 3, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI3', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 4, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI4', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 5, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI5', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 6, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI6', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 7, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI7', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 8, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI8', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 9, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI9', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
  { id: 10, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI10', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },

];

@Component({
  selector: 'app-catalog-price-drugs',
  templateUrl: './catalog-price-drugs.component.html',
  styleUrls: ['./catalog-price-drugs.component.css']
})
export class CatalogPriceDrugsComponent implements OnInit {

  displayedColumns: any[] = ['id', 'codMedicament', 'codVamal', 'denumireComerciala', 'formaFarmaceutica','dozaConcentratia', 'volum', 'divizarea', 'tara', 'firmaProducatoare', 'nrDeInregistrare', 'dataDeInregistrare', 'codulATC', 'denumireaComunaInternationala', 'termenulDeValabilitate', 'codulDeBare', 'pretDeProducatorMDL', 'pretDeProducatorValuta', 'valuta', 'nrSiDataOrdinuluiDeAprobareAPretului'];
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
