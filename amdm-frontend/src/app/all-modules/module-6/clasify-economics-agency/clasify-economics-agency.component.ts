import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NavbarTitleService } from '../../../shared/service/navbar-title.service';
import { NomenclatorService } from '../../../shared/service/nomenclator.service';
import { LoaderService } from '../../../shared/service/loader.service';

@Component({
  selector: 'app-clasify-economics-agency',
  templateUrl: './clasify-economics-agency.component.html',
  styleUrls: ['../nomenclator.component.css']
})
export class ClasifyEconomicsAgencyComponent implements OnInit, OnDestroy {


  ngOnDestroy(): void {
    this.navbarTitleService.showTitleMsg('');
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
    denumireFilter  = new FormControl('');
    adresaFilter = new FormControl('');
    seriaFilter = new FormControl('');
    idnoFilter = new FormControl('');

  dataSource = new MatTableDataSource();

  columnsToDisplay = ['denumire', 'adresa', 'seria', 'idno'];
  private subscriptions: Subscription[] = [];

  constructor(private navbarTitleService: NavbarTitleService,
    private nomenclatorService: NomenclatorService,
    private loadingService: LoaderService) {

  }
  ngOnInit() {

    this.navbarTitleService.showTitleMsg('Clasificatorul agenților economici cu activitate farmaceutică');
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

    this.subscriptions.push(this.denumireFilter.valueChanges
      .subscribe(
        denumire => {
          this.filterTable(denumire);
        }
      ));
    this.subscriptions.push(this.adresaFilter.valueChanges
      .subscribe(
        adresa => {
          this.filterTable(adresa);
        }
      ));
    this.subscriptions.push(this.seriaFilter.valueChanges
      .subscribe(
        seria => {
          this.filterTable(seria);
        }
      ));
    this.subscriptions.push(this.idnoFilter.valueChanges
      .subscribe(
        idno => {
          this.filterTable(idno);
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
