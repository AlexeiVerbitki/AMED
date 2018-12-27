import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {LoaderService} from "../../../shared/service/loader.service";
import {RequestService} from "../../../shared/service/request.service";
import {DocumentService} from "../../../shared/service/document.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";

@Component({
    selector: 'app-medicaments-oa',
    templateUrl: './medicaments-oa.component.html',
    styleUrls: ['./medicaments-oa.component.css']
})
export class MedicamentsOaComponent implements OnInit {

    @Input() displayTable: boolean;
    private subscriptions: Subscription[] = [];
    dataSource = new MatTableDataSource<any>();
    @ViewChild('pag2') paginator2: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: any[] = ['name', 'dose', 'pharmaceuticalForm', 'division', 'authorizationHolder', 'manufacture', 'includedOA'];
    @Output() loadOAs = new EventEmitter();
    oas : any[] = [];

    constructor(private loadingService: LoaderService,
                private requestService: RequestService,
                private errorHandlerService: ErrorHandlerService,
                private documentService: DocumentService) {
    }

    ngOnInit() {

    }

    generateOA() {

        if (this.dataSource.data.length == 0) {
            this.errorHandlerService.showError('Nu a fost selectat nici un medicament.');
            return;
        }

        if (!this.dataSource.data.find(t=>t.included==1)) {
            this.errorHandlerService.showError('Nu a fost selectat nici un medicament.');
            return;
        }

        this.loadOAsMethod();
        if (this.oas.find(t => t.attached != 1)) {
            this.errorHandlerService.showError('Exista ordine care nu au fost semnate.');
            return;
        }

        this.loadingService.show();
        let observable: Observable<any> = null;
        let y: any[] = [];
        for (let x of this.dataSource.data.filter(t => t.included == true)) {
            y.push(x);
        }
        observable = this.documentService.generateOA(y);

        this.subscriptions.push(observable.subscribe(data => {
                let file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
                this.loadMedicamentsForOA();
                this.loadOAs.emit(true);
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    loadOAsMethod()
    {
        this.subscriptions.push(
            this.requestService.getOAs().subscribe(data => {
                   this.oas = data;
                   console.log(data);
                },
                error => console.log(error)
            )
        );
    }

    loadMedicamentsForOA() {
        this.subscriptions.push(
            this.requestService.getMedicamentsForOA().subscribe(data => {
                    this.dataSource.data = data;
                    this.dataSource.data.forEach(t => t.manufacture = t.manufactures.find(x => x.producatorProdusFinit == true));
                    this.dataSource.data.forEach(t => t.included = true);
                    console.log(this.dataSource.data);
                },
                error => console.log(error)
            )
        );
    }

    checkIncludedOA(element: any, value: any) {
        element.included = value.checked;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator2;
        if (this.dataSource.paginator) {
            this.dataSource.paginator._intl.itemsPerPageLabel = "Rinduri pe pagina: ";
        }
        this.dataSource.sort = this.sort;
    }

}
