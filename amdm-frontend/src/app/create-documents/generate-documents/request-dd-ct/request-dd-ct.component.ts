import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Observable, Subscription} from "rxjs/index";
import {RequestService} from "../../../shared/service/request.service";
import {SuccessOrErrorHandlerService} from "../../../shared/service/success-or-error-handler.service";
import {SelectDocumentNumberComponent} from "../../../dialog/select-document-number/select-document-number.component";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
    selector: 'app-request-dd-ct',
    templateUrl: './request-dd-ct.component.html',
    styleUrls: ['./request-dd-ct.component.css']
})
export class RequestDdCtComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    dataSource = new MatTableDataSource<any>();
    displayedColumns: any[] = ['number', 'startDate', 'type', 'company', 'clinicTrail', 'included'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Output() loadDDCts = new EventEmitter();

    constructor(private requestService: RequestService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private dialog: MatDialog,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.loadRequestForDD();
    }

    loadRequestForDD() {
        this.subscriptions.push(
            this.requestService.getRequestsForDDCt().subscribe(data => {
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

        let dialogRef = this.dialog.open(SelectDocumentNumberComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                // this.loadingService.show();
                const ctList: any[] = [];
                for (const x of this.dataSource.data.filter(t => t.included == true)) {
                    x.ddNumber = result.docNr;
                    ctList.push(x);
                }
                // console.log('ctList', ctList);
                let observable: Observable<any> = this.documentService.generateDDCt(ctList);

                this.subscriptions.push(observable.subscribe(data => {
                        const file = new Blob([data], {type: 'application/pdf'});
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                        this.loadRequestForDD();
                        this.loadDDCts.emit(true);
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
