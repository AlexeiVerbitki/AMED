import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LoaderService} from '../../../shared/service/loader.service';
import {RequestService} from '../../../shared/service/request.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DocumentService} from '../../../shared/service/document.service';

@Component({
  selector: 'app-requests-oi-modify',
  templateUrl: './requests-oi-modify.component.html',
  styleUrls: ['./requests-oi-modify.component.css']
})
export class RequestsOiModifyComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: any[] = ['number', 'startDate', 'company', 'medicament', 'included'];
  @Output() loadOIMs = new EventEmitter();

  constructor(private loadingService: LoaderService,
              private requestService: RequestService,
              private errorHandlerService: SuccessOrErrorHandlerService,
              private documentService: DocumentService) {
  }

  ngOnInit() {
      this.loadRequestForOI();
  }

  generateDocument() {

    if (this.dataSource.data.length == 0) {
      this.errorHandlerService.showError('Nu a fost selectata nici o cerere.');
      return;
    }

    if (!this.dataSource.data.find(t => t.included == 1)) {
      this.errorHandlerService.showError('Nu a fost selectata nici o cerere.');
      return;
    }

    this.loadingService.show();
    let observable: Observable<any> = null;
    const y: any[] = [];
    for (const x of this.dataSource.data.filter(t => t.included == true)) {
      y.push(x);
    }
    observable = this.documentService.generateOIM(y);

    this.subscriptions.push(observable.subscribe(data => {
          const file = new Blob([data], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.loadingService.hide();
          this.loadRequestForOI();
          this.loadOIMs.emit(true);
        }, error => {
          this.loadingService.hide();
        }
        )
    );
  }

  loadRequestForOI() {
    this.subscriptions.push(
        this.requestService.getRequestsForOIM().subscribe(data => {
              this.dataSource.data = data;
              this.dataSource.data.forEach(t => t.included = true);
            },
            error => console.log(error)
        )
    );
  }

  checkIncluded(element: any, value: any) {
    element.included = value.checked;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator._intl.itemsPerPageLabel = 'Rinduri pe pagina: ';
    }
    this.dataSource.sort = this.sort;
  }

}
