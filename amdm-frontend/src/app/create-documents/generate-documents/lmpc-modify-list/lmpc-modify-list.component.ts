import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {LoaderService} from "../../../shared/service/loader.service";
import {RequestService} from "../../../shared/service/request.service";
import {SuccessOrErrorHandlerService} from "../../../shared/service/success-or-error-handler.service";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
    selector: 'app-lmpc-modify-list',
    templateUrl: './lmpc-modify-list.component.html',
    styleUrls: ['./lmpc-modify-list.component.css']
})
export class LmpcModifyListComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: any[] = ['number', 'startDate', 'company', 'included'];
    @Output() loadAnih = new EventEmitter();


    constructor(private loadingService: LoaderService,
                private requestService: RequestService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.loadRequestForAnih();
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
        observable = this.documentService.generateAnihMedM(y);

        this.subscriptions.push(observable.subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
                this.loadRequestForAnih();
                this.loadAnih.emit(true);
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    loadRequestForAnih() {
        this.subscriptions.push(
            this.requestService.getRequestsForAnih().subscribe(data => {
                    this.dataSource.data = data;
                    this.dataSource.data.forEach(t => t.included = true);
                }
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

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
