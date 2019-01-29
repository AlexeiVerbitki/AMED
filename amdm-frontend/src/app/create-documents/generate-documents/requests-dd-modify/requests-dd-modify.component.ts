import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LoaderService} from '../../../shared/service/loader.service';
import {RequestService} from '../../../shared/service/request.service';
import {ErrorHandlerService} from '../../../shared/service/error-handler.service';
import {DocumentService} from '../../../shared/service/document.service';
import {SelectDocumentNumberComponent} from "../../../dialog/select-document-number/select-document-number.component";

@Component({
  selector: 'app-requests-dd-modify',
  templateUrl: './requests-dd-modify.component.html',
  styleUrls: ['./requests-dd-modify.component.css']
})
export class RequestsDdModifyComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: any[] = ['number', 'startDate', 'company', 'medicament','variationType','variationDescription', 'included'];
  @Output() loadDDMs = new EventEmitter();

  constructor(private loadingService: LoaderService,
              private requestService: RequestService,
                private dialog: MatDialog,
              private errorHandlerService: ErrorHandlerService,
              private documentService: DocumentService) {
  }

  ngOnInit() {
      this.loadRequestForDD();
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

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '400px';

        let dialogRef = this.dialog.open(SelectDocumentNumberComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.loadingService.show();
                let observable: Observable<any> = null;
                const y: any[] = [];
                for (const x of this.dataSource.data.filter(t => t.included == true)) {
                    x.ddNumber = result.docNr;
                    y.push(x);
                }
                observable = this.documentService.generateDDM(y);

    this.subscriptions.push(observable.subscribe(data => {
          const file = new Blob([data], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.loadingService.hide();
          this.loadRequestForDD();
          this.loadDDMs.emit(true);
        }, error => {
          this.loadingService.hide();
        }
        )
    );
  }
    });
    }

  loadRequestForDD() {
    this.subscriptions.push(
        this.requestService.getRequestsForDDM().subscribe(data => {
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