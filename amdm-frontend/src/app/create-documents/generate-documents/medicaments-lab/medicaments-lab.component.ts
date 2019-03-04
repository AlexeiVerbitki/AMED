import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Observable, Subscription} from 'rxjs';
import {LoaderService} from '../../../shared/service/loader.service';
import {RequestService} from '../../../shared/service/request.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DocumentService} from '../../../shared/service/document.service';

@Component({
    selector: 'app-medicaments-lab',
    templateUrl: './medicaments-lab.component.html',
    styleUrls: ['./medicaments-lab.component.css']
})
export class MedicamentsLabComponent implements OnInit, AfterViewInit {

    dataSource = new MatTableDataSource<any>();
    @ViewChild('pag2') paginator2: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: any[] = ['name', 'dose', 'pharmaceuticalForm', 'division', 'volume', 'volumeQuantityMeasurement', 'samplesNumber', 'serialNr', 'samplesExpirationDate',
        'authorizationHolder', 'manufacture', 'includedLab'];
    @Output() loadLab = new EventEmitter();
    labs: any[] = [];
    private subscriptions: Subscription[] = [];

    constructor(private loadingService: LoaderService,
                private requestService: RequestService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.loadMedicamentsForLab();
    }

    generateLab() {

        if (this.dataSource.data.length == 0) {
            this.errorHandlerService.showError('Nu a fost selectat nici un medicament.');
            return;
        }

        if (!this.dataSource.data.find(t => t.included == 1)) {
            this.errorHandlerService.showError('Nu a fost selectat nici un medicament.');
            return;
        }

        this.loadingService.show();
        let observable: Observable<any> = null;
        const y: any[] = [];
        for (const x of this.dataSource.data.filter(t => t.included == true)) {
            y.push(x);
        }
        observable = this.documentService.generateLab(y);

        this.subscriptions.push(observable.subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
                this.loadMedicamentsForLab();
                this.loadLab.emit(true);
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    loadLabMethod() {
        this.subscriptions.push(
            this.requestService.getLabs().subscribe(data => {
                    this.labs = data;
                },
                error => console.log(error)
            )
        );
    }

    loadMedicamentsForLab() {
        this.subscriptions.push(
            this.requestService.getMedicamentsForLab().subscribe(data => {
                    this.dataSource.data = data;
                    this.dataSource.data.forEach(t => t.manufacture = t.manufactures.find(x => x.producatorProdusFinit == true));
                    this.dataSource.data.forEach(t => {
                        t.included = true;
                    });
                },
                error => console.log(error)
            )
        );
    }

    checkIncludedLab(element: any, value: any) {
        element.included = value.checked;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator2;
        if (this.dataSource.paginator) {
            this.dataSource.paginator._intl.itemsPerPageLabel = 'Rinduri pe pagina: ';
        }
        this.dataSource.sort = this.sort;
    }

}
