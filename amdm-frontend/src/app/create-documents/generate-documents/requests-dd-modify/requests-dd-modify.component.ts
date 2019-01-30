import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LoaderService} from '../../../shared/service/loader.service';
import {RequestService} from '../../../shared/service/request.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DocumentService} from '../../../shared/service/document.service';
import {SelectDocumentNumberComponent} from "../../../dialog/select-document-number/select-document-number.component";
import {
    SelectVariationTypeComponent,
    TodoItemFlatNode
} from "../../../dialog/select-variation-type/select-variation-type.component";
import {AdministrationService} from "../../../shared/service/administration.service";
import {SelectionModel} from "@angular/cdk/collections";

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
    displayedColumns: any[] = ['number', 'startDate', 'company', 'medicament', 'variationType', 'included'];
    @Output() loadDDMs = new EventEmitter();
    variationTypesIds: string;
    variationTypesIdsTemp: string;

    constructor(private loadingService: LoaderService,
                private requestService: RequestService,
                private dialog: MatDialog,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private administrationService: AdministrationService,
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

    viewVariationType(variations: any[]) {
        this.loadingService.show();
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        // dialogConfig2.panelClass = 'overflow-ys';

        dialogConfig2.width = '1000px';
        dialogConfig2.height = '800px';

        var checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

        console.log(variations);

        this.subscriptions.push(this.administrationService.variatonTypesJSON().subscribe(data2 => {
                this.variationTypesIds = JSON.stringify(data2.val2);
                if (variations) {
                    this.variationTypesIdsTemp = this.variationTypesIds.substr(1);
                    for (let v of variations) {
                        var t = new TodoItemFlatNode();
                        t.item = this.getVariationCodeById(v.variation.id, v.value);
                        checklistSelection.selected.push(t);
                    }
                    dialogConfig2.data = {values: checklistSelection, disabled: true};
                    this.loadingService.hide();
                    let dialogRef = this.dialog.open(SelectVariationTypeComponent, dialogConfig2);
                }
            }, error => this.loadingService.hide())
        );
    }

    getVariationCodeById(id: string, value: string): string {
        var i = this.variationTypesIdsTemp.indexOf(value + '":"' + id + '"') + value.length - 1;
        var tempStr = this.variationTypesIdsTemp.substr(1, i);
        var j = tempStr.lastIndexOf('"') + 1;
        var finalStr = tempStr.substr(j, i);
        this.variationTypesIdsTemp = this.variationTypesIdsTemp.replace('"' + finalStr + '":"' + id + '"', '');
        return finalStr;
    }

}
