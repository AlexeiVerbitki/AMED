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
}


const ELEMENT_DATA: PriceCatalog[] = [
  { id: 1, codMedicament: 'CM112345', codVamal: 'CV112345', denumireComerciala: 'DM112345', formaFarmaceutica: 'FM123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr112345', dataDeInregistrare: new Date(), codulATC: 'CATC112345', denumireaComunaInternationala: 'DCI1', termenulDeValabilitate: '24 luni', codulDeBare: 'CB112345' },
  { id: 2, codMedicament: 'CM212345', codVamal: 'CV212345', denumireComerciala: 'DM212345', formaFarmaceutica: 'FM2123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr212345', dataDeInregistrare: new Date(), codulATC: 'CATC212345', denumireaComunaInternationala: 'DCI2', termenulDeValabilitate: '24 luni', codulDeBare: 'CB212345' },
  { id: 1, codMedicament: 'CM312345', codVamal: 'CV312345', denumireComerciala: 'DM312345', formaFarmaceutica: 'FM3123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr312345', dataDeInregistrare: new Date(), codulATC: 'CATC312345', denumireaComunaInternationala: 'DCI3', termenulDeValabilitate: '24 luni', codulDeBare: 'CB312345' },
  { id: 1, codMedicament: 'CM412345', codVamal: 'CV412345', denumireComerciala: 'DM412345', formaFarmaceutica: 'FM4123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr412345', dataDeInregistrare: new Date(), codulATC: 'CATC412345', denumireaComunaInternationala: 'DCI4', termenulDeValabilitate: '24 luni', codulDeBare: 'CB412345' },
  { id: 1, codMedicament: 'CM512345', codVamal: 'CV512345', denumireComerciala: 'DM512345', formaFarmaceutica: 'FM5123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr512345', dataDeInregistrare: new Date(), codulATC: 'CATC512345', denumireaComunaInternationala: 'DCI5', termenulDeValabilitate: '24 luni', codulDeBare: 'CB512345' },
  { id: 1, codMedicament: 'CM612345', codVamal: 'CV612345', denumireComerciala: 'DM612345', formaFarmaceutica: 'FM6123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr612345', dataDeInregistrare: new Date(), codulATC: 'CATC612345', denumireaComunaInternationala: 'DCI6', termenulDeValabilitate: '24 luni', codulDeBare: 'CB612345' },
  { id: 1, codMedicament: 'CM712345', codVamal: 'CV712345', denumireComerciala: 'DM712345', formaFarmaceutica: 'FM7123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr712345', dataDeInregistrare: new Date(), codulATC: 'CATC712345', denumireaComunaInternationala: 'DCI7', termenulDeValabilitate: '24 luni', codulDeBare: 'CB712345' },
  { id: 1, codMedicament: 'CM812345', codVamal: 'CV812345', denumireComerciala: 'DM812345', formaFarmaceutica: 'FM8123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr812345', dataDeInregistrare: new Date(), codulATC: 'CATC812345', denumireaComunaInternationala: 'DCI8', termenulDeValabilitate: '24 luni', codulDeBare: 'CB812345' },
  { id: 1, codMedicament: 'CM912345', codVamal: 'CV912345', denumireComerciala: 'DM912345', formaFarmaceutica: 'FM9123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr912345', dataDeInregistrare: new Date(), codulATC: 'CATC912345', denumireaComunaInternationala: 'DCI1', termenulDeValabilitate: '24 luni', codulDeBare: 'CB912345' },
  { id: 1, codMedicament: 'CM1012345', codVamal: 'CV12345', denumireComerciala: 'DM1012345', formaFarmaceutica: 'FM10123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr1012345', dataDeInregistrare: new Date(), codulATC: 'CATC1012345', denumireaComunaInternationala: 'DCI1', termenulDeValabilitate: '24 luni', codulDeBare: 'CB1012345' },
];

@Component({
  selector: 'app-clasify-drugs',
  templateUrl: './clasify-drugs.component.html',
  styleUrls: ['./clasify-drugs.component.css']
})

export class ClasifyDrugsComponent implements OnInit {

  displayedColumns: any[] = ['id', 'codMedicament', 'codVamal', 'denumireComerciala', 'formaFarmaceutica', 'dozaConcentratia', 'volum', 'divizarea', 'tara', 'firmaProducatoare', 'nrDeInregistrare', 'dataDeInregistrare', 'codulATC', 'denumireaComunaInternationala', 'termenulDeValabilitate', 'codulDeBare'];
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
