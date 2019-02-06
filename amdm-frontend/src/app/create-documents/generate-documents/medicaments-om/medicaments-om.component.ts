import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LoaderService} from '../../../shared/service/loader.service';
import {RequestService} from '../../../shared/service/request.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DocumentService} from '../../../shared/service/document.service';

@Component({
  selector: 'app-medicaments-om',
  templateUrl: './medicaments-om.component.html',
  styleUrls: ['./medicaments-om.component.css']
})
export class MedicamentsOmComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild('pag2') paginator2: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: any[] = ['name', 'dose', 'pharmaceuticalForm', 'division', 'authorizationHolder', 'manufacture', 'includedOA'];
  @Output() loadOMs = new EventEmitter();
  oas: any[] = [];

  constructor(private loadingService: LoaderService,
              private requestService: RequestService,
              private errorHandlerService: SuccessOrErrorHandlerService,
              private documentService: DocumentService) {
  }

  ngOnInit() {
      this.loadMedicamentsForOA();

  }

  generateOA() {

    if (this.dataSource.data.length == 0) {
      this.errorHandlerService.showError('Nu a fost selectat nici un medicament.');
      return;
    }

    if (!this.dataSource.data.find(t => t.included == 1)) {
      this.errorHandlerService.showError('Nu a fost selectat nici un medicament.');
      return;
    }

    this.loadOAsMethod();
    if (this.oas.find(t => t.attached != 1)) {
      this.errorHandlerService.showError('Exista ordine care nu au fost semnate.');
      return;
    }

    this.loadingService.show();
    let observable: Observable<any> = null;
    const y: any[] = [];
    for (const x of this.dataSource.data.filter(t => t.included == true)) {
      y.push(x);
    }
    observable = this.documentService.generateOM(y);

    this.subscriptions.push(observable.subscribe(data => {
          const file = new Blob([data], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.loadingService.hide();
          this.loadMedicamentsForOA();
          this.loadOMs.emit(true);
        }, error => {
          this.loadingService.hide();
        }
        )
    );
  }

  loadOAsMethod() {
    this.subscriptions.push(
        this.requestService.getOMs().subscribe(data => {
              this.oas = data;
            },
            error => console.log(error)
        )
    );
  }

  loadMedicamentsForOA() {
    this.subscriptions.push(
        this.requestService.getMedicamentsForOM().subscribe(data => {
              this.dataSource.data = data;
              let str = '';
              if (data[0]) {
                  str =  this.getConcatenatedDivision(data[0].divisionHistory);
              }
              this.dataSource.data.forEach(t => {t.included = true; t.division = str; });
              this.dataSource.data.forEach(t => t.manufacture = t.manufacturesHistory.find(x => x.producatorProdusFinitTo == true));
            },
            error => console.log(error)
        )
    );
  }

  checkIncludedOA(element: any, value: any) {
    element.included = value.checked;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator2;
    if (this.dataSource.paginator) {
      this.dataSource.paginator._intl.itemsPerPageLabel = 'Rinduri pe pagina: ';
    }
    this.dataSource.sort = this.sort;
  }

    getConcatenatedDivision(divisionHistory: any[]) {
        let concatenatedDivision = '';
        for (const entry of divisionHistory) {
            if (entry.description && entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.description + ' ' + entry.volume + ' ' + entry.volumeQuantityMeasurement.description + '; ';
            } else if (entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.volume + ' ' + entry.volumeQuantityMeasurement.description + '; ';
            } else {
                concatenatedDivision = concatenatedDivision + entry.description + '; ';
            }

        }
        return concatenatedDivision;
    }
}
