import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {DocumentService} from '../../../shared/service/document.service';
import {RequestService} from '../../../shared/service/request.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UploadFileService} from '../../../shared/service/upload/upload-file.service';
import {HttpResponse} from '@angular/common/http';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {SelectIssueDateDialogComponent} from '../../../dialog/select-issue-date-dialog/select-issue-date-dialog.component';

@Component({
    selector: 'app-dd-ct-amend-list',
    templateUrl: './dd-ct-amend-list.component.html',
    styleUrls: ['./dd-ct-amend-list.component.css']
})
export class DdCtAmendListComponent implements OnInit {

    private subscriptions: Subscription[] = [];

    displayedColumns: any[] = ['number', 'date', 'dateOfIssue', 'name', 'status', 'actions'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Output() ddListCtAmendModified = new EventEmitter();

    constructor(private requestService: RequestService,
                private dialog: MatDialog,
                private uploadService: UploadFileService,
                public dialogConfirmation: MatDialog,
                private loadingService: LoaderService,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.loadDDAs();
    }

    loadDDAs() {
        this.subscriptions.push(
            this.requestService.getDDACs().subscribe(data => {
                    console.log('data', data);
                    this.dataSource.data = data;
                },
                error => console.log(error)
            )
        );
    }

    addDocument(element: any, event) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '400px';

        dialogConfig2.data = {document : element, type : 'DDA'};

        const dialogRef = this.dialog.open(SelectIssueDateDialogComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            this.ddListCtAmendModified.emit(true);
            this.loadDDAs();
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
                this.subscriptions.push(this.documentService.removeDDC(element).subscribe(event => {
                        console.log('removeDDC', event);
                        if (event instanceof HttpResponse) {
                            this.ddListCtAmendModified.emit(true);
                            this.loadDDAs();
                            this.loadingService.hide();
                        }
                    },
                    error => {
                        this.loadingService.hide();
                        console.log(error);
                    })
                );
            }
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        if (this.dataSource.paginator) {
            this.dataSource.paginator._intl.itemsPerPageLabel = 'Rinduri pe pagina: ';
        }
        this.dataSource.sort = this.sort;
    }

}
