import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {DocumentService} from '../../../shared/service/document.service';
import {RequestService} from '../../../shared/service/request.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {Observable, Subscription} from 'rxjs/index';
import {SelectDocumentNumberComponent} from '../../../dialog/select-document-number/select-document-number.component';

@Component({
    selector: 'app-request-dd-ct-amend',
    templateUrl: './request-dd-ct-amend.component.html',
    styleUrls: ['./request-dd-ct-amend.component.css']
})
export class RequestDdCtAmendComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    dataSource = new MatTableDataSource<any>();
    displayedColumns: any[] = ['number', 'startDate', 'type', 'company', 'clinicTrail', 'included'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Output() loadDDAmendCts = new EventEmitter();

    constructor(private requestService: RequestService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private dialog: MatDialog,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.loadRequestForDDA();
    }

    loadRequestForDDA() {
        console.log('loadRequestForDDA()');
        this.subscriptions.push(
            this.requestService.getRequestsForDDACt().subscribe(data => {

                    this.dataSource.data = data;
                    this.dataSource.data.forEach(t => t.included = true);
                },
                error => console.log(error)
            )
        );
    }

    generateDocument() {
        // console.log('this.dataSource', this.dataSource);
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

        const dialogRef = this.dialog.open(SelectDocumentNumberComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                // this.loadingService.show();
                const ctList: any[] = [];
                for (const x of this.dataSource.data.filter(t => t.included == true)) {
                    x.ddNumber = result.docNr;
                    ctList.push(x);
                }
                // console.log('ctList', ctList);
                const observable: Observable<any> = this.documentService.generateDDACt(ctList);

                this.subscriptions.push(observable.subscribe(data => {
                        const file = new Blob([data], {type: 'application/pdf'});
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                        this.loadRequestForDDA();
                        this.loadDDAmendCts.emit(true);
                        // console.log(data);
                    }, error => console.log(error))
                );

            }
        });
    }

    checkIncluded(element: any, value: any) {
        element.included = value.checked;
    }

}
