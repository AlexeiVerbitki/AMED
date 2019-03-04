import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {RequestService} from '../../../shared/service/request.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {UploadFileService} from '../../../shared/service/upload/upload-file.service';
import {DocumentService} from '../../../shared/service/document.service';
import {HttpResponse} from '@angular/common/http';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';

@Component({
  selector: 'app-documents-lab',
  templateUrl: './documents-lab.component.html',
  styleUrls: ['./documents-lab.component.css']
})
export class DocumentsLabComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['number', 'date', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private subscriptions: Subscription[] = [];
  @Output() labListModified = new EventEmitter();

  constructor(private requestService: RequestService,
              private loadingService: LoaderService,
              public dialogConfirmation: MatDialog,
              private uploadService: UploadFileService,
              private documentService: DocumentService) {
  }

  ngOnInit() {
    this.loadLab();
  }

  loadLab() {
    this.subscriptions.push(
        this.requestService.getLabs().subscribe(data => {
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

  // addDocument(element: any, event) {
  //   this.loadingService.show();
  //   this.subscriptions.push(this.documentService.addOI(element, event.srcElement.files[0]).subscribe(event => {
  //         if (event instanceof HttpResponse) {
  //           this.oiListModified.emit(true);
  //           this.loadOIs();
  //           this.loadingService.hide();
  //         }
  //       },
  //       error => {
  //         this.loadingService.hide();
  //         console.log(error);
  //       }
  //       )
  //   );
  // }

  removeAct(element: any) {
    const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
      data: {
        message: 'Sunteti sigur(a)?',
        confirm: false
      }
    });

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.show();
        this.subscriptions.push(this.documentService.removeAct(element).subscribe(event => {
              if (event instanceof HttpResponse) {
                this.labListModified.emit(true);
                this.loadLab();
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

  viewAct(element: any) {
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
