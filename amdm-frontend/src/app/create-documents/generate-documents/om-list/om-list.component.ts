import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {RequestService} from '../../../shared/service/request.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {UploadFileService} from '../../../shared/service/upload/upload-file.service';
import {DocumentService} from '../../../shared/service/document.service';
import {SelectIssueDateDialogComponent} from '../../../dialog/select-issue-date-dialog/select-issue-date-dialog.component';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-om-list',
  templateUrl: './om-list.component.html',
  styleUrls: ['./om-list.component.css']
})
export class OmListComponent implements OnInit {

  displayedColumns: any[] = ['number', 'date', 'dateOfIssue', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild('pag3') paginator3: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('incarcaFisier')
  incarcaFisierVariable: ElementRef;
  private subscriptions: Subscription[] = [];
  @Output() omListModified = new EventEmitter();

  constructor( private requestService: RequestService,
               private loadingService: LoaderService,
               public dialogConfirmation: MatDialog,
               private dialog: MatDialog,
               private uploadService: UploadFileService,
               private documentService: DocumentService) { }

  ngOnInit() {
    this.loadOAs();
  }

  loadOAs() {
    this.subscriptions.push(
        this.requestService.getOMs().subscribe(data => {
              this.dataSource.data = data;
            },
            error => console.log(error)
        )
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator3;
    if (this.dataSource.paginator) {
      this.dataSource.paginator._intl.itemsPerPageLabel = 'Rinduri pe pagina: ';
    }
    this.dataSource.sort = this.sort;
  }

  reset() {
    this.incarcaFisierVariable.nativeElement.value = '';
  }

  addDocument(element: any) {
    const dialogConfig2 = new MatDialogConfig();

    dialogConfig2.disableClose = false;
    dialogConfig2.autoFocus = true;
    dialogConfig2.hasBackdrop = true;

    dialogConfig2.width = '400px';

    dialogConfig2.data = {document : element, type : 'OM'};

    const dialogRef = this.dialog.open(SelectIssueDateDialogComponent, dialogConfig2);
    dialogRef.afterClosed().subscribe(result => {
      this.omListModified.emit(true);
      this.loadOAs();
    });
  }

  removeOA(element: any) {
    const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
      data: {
        message: 'Sunteti sigur(a)?',
        confirm: false
      }
    });

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.show();
        this.subscriptions.push(this.documentService.removeOM(element).subscribe(event => {
              if (event instanceof HttpResponse) {
                this.omListModified.emit(true);
                this.loadOAs();
                this.loadingService.hide();
              }
            },
            error => {
              this.loadingService.hide();
              console.log(error);
            }
            )
        );
      }
    });
  }

  viewOA(element: any) {
    this.subscriptions.push(this.uploadService.loadFile(element.path).subscribe(data => {
          const file = new Blob([data], {type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        },
        error => {
          console.log(error);
        }
        )
    );
  }

}
