import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Subscription} from "rxjs";
import {RequestService} from "../../../shared/service/request.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {UploadFileService} from "../../../shared/service/upload/upload-file.service";
import {DocumentService} from "../../../shared/service/document.service";
import {SelectIssueDateDialogComponent} from "../../../dialog/select-issue-date-dialog/select-issue-date-dialog.component";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'app-lmpc-list',
    templateUrl: './lmpc-list.component.html',
    styleUrls: ['./lmpc-list.component.css']
})
export class LmpcListComponent implements OnInit, OnDestroy {

    displayedColumns: any[] = ['date','dateOfIssue', 'status', 'actions'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('incarcaFisier')
    incarcaFisierVariable: ElementRef;
    private subscriptions: Subscription[] = [];
    @Output() anihListModified = new EventEmitter();

    constructor(private requestService: RequestService,
                private loadingService: LoaderService,
                public dialogConfirmation: MatDialog,
                private dialog: MatDialog,
                private uploadService: UploadFileService,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.loadAnnihMeds();
    }

    loadAnnihMeds() {
        this.subscriptions.push(
            this.requestService.getAnihs().subscribe(data => {
                    this.dataSource.data = data;
                }
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

        dialogConfig2.data = {document : element,type : 'LN'};

        let dialogRef = this.dialog.open(SelectIssueDateDialogComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            this.anihListModified.emit(true);
            this.loadAnnihMeds();
        });
    }

    removeMed(element: any) {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                this.subscriptions.push(this.documentService.removeAnih(element).subscribe(event => {
                        if (event instanceof HttpResponse) {
                            this.anihListModified.emit(true);
                            this.loadAnnihMeds();
                            this.loadingService.hide();
                        }
                    },
                    error => {
                        this.loadingService.hide();
                    }
                    )
                );
            }
        });
    }

    viewMed(element: any) {
        this.subscriptions.push(this.uploadService.loadFile(element.path).subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }
            )
        );
    }



    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
