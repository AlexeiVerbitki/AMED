import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NavbarTitleService } from '../../../shared/service/navbar-title.service';
import { NomenclatorService } from '../../../shared/service/nomenclator.service';
import { LoaderService } from '../../../shared/service/loader.service';

@Component({
  selector: 'app-catalog-price-drugs',
  templateUrl: './catalog-price-drugs.component.html',
  styleUrls: ['../nomenclator.component.css']
})
export class CatalogPriceDrugsComponent implements OnInit, OnDestroy {


  @ViewChild(MatPaginator) paginator: MatPaginator;

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
  pretDeProducatorMDLFilter = new FormControl('');
  pretDeProducatorValutaFilter = new FormControl('');
  valutaFilter = new FormControl('');
  nrOrdinuluiDeAprobareAPretuluiFilter = new FormControl('');
  dataOrdinuluiDeAprobareAPretuluiFilter = new FormControl('');

  dataSource = new MatTableDataSource();

  columnsToDisplay = ['codMedicament', 'codVamal', 'denumireComerciala', 'formaFarmaceutica', 'dozaConcentratia', 'volum', 'divizarea', 'tara', 'firmaProducatoare', 'nrDeInregistrare', 'dataDeInregistrare', 'codulATC', 'denumireaComunaInternationala', 'termenulDeValabilitate', 'codulDeBare', 'pretDeProducatorMDL', 'pretDeProducatorValuta', 'valuta', 'nrOrdinuluiDeAprobareAPretului', 'dataOrdinuluiDeAprobareAPretului'];

  private subscriptions: Subscription[] = [];

  constructor(private navbarTitleService: NavbarTitleService,
    private nomenclatorService: NomenclatorService,
    private loadingService: LoaderService) {

  }

  ngOnDestroy(): void {
    this.navbarTitleService.showTitleMsg('');
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {

    this.navbarTitleService.showTitleMsg('Catalogul național de prețuri de producător la medicamente');
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

    this.subscriptions.push(this.codMedicamentFilter.valueChanges
      .subscribe(
        codMedicament => {
          this.filterTable(codMedicament);
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
    this.subscriptions.push(this.dozaConcentratiaFilter.valueChanges
      .subscribe(
        dozaConcentratia => {
          this.filterTable(dozaConcentratia);
        }
      ));
    this.subscriptions.push(this.volumFilter.valueChanges
      .subscribe(
        volum => {
          this.filterTable(volum);
        }
      ));
    this.subscriptions.push(this.divizareaFilter.valueChanges
      .subscribe(
        divizarea => {
          this.filterTable(divizarea);
        }
      ));
    this.subscriptions.push(this.taraFilter.valueChanges
      .subscribe(
        tara => {
          this.filterTable(tara);
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
    this.subscriptions.push(this.dataDeInregistrareFilter.valueChanges
      .subscribe(
        dataDeInregistrare => {
          this.filterTable(dataDeInregistrare);
        }
      ));
    this.subscriptions.push(this.codulATCFilter.valueChanges
      .subscribe(
        codulATC => {
          this.filterTable(codulATC);
        }
      ));
    this.subscriptions.push(this.denumireaComunaInternationalaFilter.valueChanges
      .subscribe(
        denumireaComunaInternationala => {
          this.filterTable(denumireaComunaInternationala);
        }
      ));
    this.subscriptions.push(this.termenulDeValabilitateFilter.valueChanges
      .subscribe(
        termenulDeValabilitate => {
          this.filterTable(termenulDeValabilitate);
        }
      ));
    this.subscriptions.push(this.codulDeBareFilter.valueChanges
      .subscribe(
        codulDeBare => {
          this.filterTable(codulDeBare);
        }
      ));
    this.subscriptions.push(this.pretDeProducatorMDLFilter.valueChanges
      .subscribe(
        pretDeProducatorMDL => {
          this.filterTable(pretDeProducatorMDL);
        }
      ));
    this.subscriptions.push(this.pretDeProducatorValutaFilter.valueChanges
      .subscribe(
        pretDeProducatorValuta => {
          this.filterTable(pretDeProducatorValuta);
        }
      ));
    this.subscriptions.push(this.valutaFilter.valueChanges
      .subscribe(
        valuta => {
          this.filterTable(valuta);
        }
      ));
    this.subscriptions.push(this.nrOrdinuluiDeAprobareAPretuluiFilter.valueChanges
      .subscribe(
        nrOrdinuluiDeAprobareAPretului => {
          this.filterTable(nrOrdinuluiDeAprobareAPretului);
        }
      ));
    this.subscriptions.push(this.dataOrdinuluiDeAprobareAPretuluiFilter.valueChanges
      .subscribe(
        dataOrdinuluiDeAprobareAPretului => {
          this.filterTable(dataOrdinuluiDeAprobareAPretului);
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
