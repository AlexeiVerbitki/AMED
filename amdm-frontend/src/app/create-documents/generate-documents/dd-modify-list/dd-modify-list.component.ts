import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {RequestService} from '../../../shared/service/request.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {UploadFileService} from '../../../shared/service/upload/upload-file.service';
import {DocumentService} from '../../../shared/service/document.service';
import {HttpResponse} from '@angular/common/http';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {SelectIssueDateDialogComponent} from "../../../dialog/select-issue-date-dialog/select-issue-date-dialog.component";

@Component({
  selector: 'app-dd-modify-list',
  templateUrl: './dd-modify-list.component.html',
  styleUrls: ['./dd-modify-list.component.css']
})
export class DdModifyListComponent implements OnInit {

    displayedColumns: any[] = ['number', 'date','dateOfIssue', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('incarcaFisier')
  incarcaFisierVariable: ElementRef;
  private subscriptions: Subscription[] = [];
  @Output() ddmListModified = new EventEmitter();

  constructor(private requestService: RequestService,
              private loadingService: LoaderService,
              public dialogConfirmation: MatDialog,
                private dialog: MatDialog,
              private uploadService: UploadFileService,
              private documentService: DocumentService) {
  }

  ngOnInit() {
      this.loadDDs();
  }

  loadDDs() {
    this.subscriptions.push(
        this.requestService.getDDMs().subscribe(data => {
              this.dataSource.data = data;
            },
            error => console.log(error)
        )
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator._intl.itemsPerPageLabel = 'Rinduri pe pagina: ';
    }
    this.dataSource.sort = this.sort;
  }

  reset() {
    this.incarcaFisierVariable.nativeElement.value = '';
  }

    addDocument(element: any, event) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '400px';

        dialogConfig2.data = {document : element,type : 'DDM'};

        let dialogRef = this.dialog.open(SelectIssueDateDialogComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            this.ddmListModified.emit(true);
            this.loadDDs();
        });
    }

  removeDD(element: any) {
    const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
      data: {
        message: 'Sunteti sigur(a)?',
        confirm: false
      }
    });

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.show();
        this.subscriptions.push(this.documentService.removeDDM(element).subscribe(event => {
              if (event instanceof HttpResponse) {
                this.ddmListModified.emit(true);
                this.loadDDs();
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

  viewDD(element: any) {
    this.subscriptions.push(this.uploadService.loadFile(element.path).subscribe(data => {
          const file = new Blob([data], {type: 'application/pdf'});
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