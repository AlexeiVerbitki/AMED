import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {RequestService} from '../../../shared/service/request.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {UploadFileService} from '../../../shared/service/upload/upload-file.service';
import {DocumentService} from '../../../shared/service/document.service';
import {HttpResponse} from '@angular/common/http';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';

@Component({
  selector: 'app-oi-modify-list',
  templateUrl: './oi-modify-list.component.html',
  styleUrls: ['./oi-modify-list.component.css']
})
export class OiModifyListComponent implements OnInit {
    displayedColumns: any[] = ['number', 'date', 'name', 'status', 'actions'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('incarcaFisier')
    incarcaFisierVariable: ElementRef;
    private subscriptions: Subscription[] = [];
    @Output() oimListModified = new EventEmitter();

    constructor(private requestService: RequestService,
                private loadingService: LoaderService,
                public dialogConfirmation: MatDialog,
                private uploadService: UploadFileService,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.loadOIs();
    }

    loadOIs() {
        this.subscriptions.push(
            this.requestService.getOIMs().subscribe(data => {
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
        this.loadingService.show();
        this.subscriptions.push(this.documentService.addOIM(element, event.srcElement.files[0]).subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.oimListModified.emit(true);
                    this.loadOIs();
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

    removeOI(element: any) {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                this.subscriptions.push(this.documentService.removeOIM(element).subscribe(event => {
                        if (event instanceof HttpResponse) {
                            this.oimListModified.emit(true);
                            this.loadOIs();
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

    viewOI(element: any) {
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
