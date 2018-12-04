import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {TaskService} from "../../../shared/service/task.service";
import {PriceService} from "../../../shared/service/prices.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {Document} from "../../../models/document";
@Component({
    selector: 'app-prices-auto-revaluation',
    templateUrl: './price-auto-revaluation.component.html',
    styleUrls: ['./price-auto-revaluation.component.css'],
})
export class PriceAutoRevaluationComponent implements OnInit, AfterViewInit, OnDestroy {
    taskForm: FormGroup;
    documents: Document[] = [];
    requestNumber: number;
    containInvalidPrices: boolean = false;
    formSubmitted: boolean = false;
    savePrices: boolean = false;
    outputDocuments: any[] = [{
        description: 'Anexa 3:Lista medicamentelor cu prețul revizuit după modificarea valutei',
        number: undefined,
        status: "Nu este atasat"
    }];

    displayedColumns: any[] = ['medicamentCode', 'commercialName', 'pharmaceuticalForm', 'dose', 'volume', 'division', 'registrationDate', 'price', 'priceMdl', 'priceMdlNew', 'priceMdlDifferencePercents'];

    dataSource = new MatTableDataSource<any>();
    row: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private route: Router,
                private taskService: TaskService,
                private priceService: PriceService,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog,
                private loadingService: LoaderService) {

        this.taskForm = fb.group({
            'medicamentCode': [null],
            'commercialName': [null],
            'pharmaceuticalForm': [null],
            'dose': [null],
            'volume': [null],
            'division': [null],
            'registrationDate': [null],
            'priceMdl': [null],
            'priceMdlNew': [null],
            'price': [null],
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Medicamente pe pagina: ";
        this.dataSource.sort = this.sort;
    }

    savePricesCheck($event){
        this.savePrices = $event.checked;
    }

    ngOnInit() {
        this.getPrices();
        this.subscriptions.push(
            this.priceService.generateDocNumber().subscribe(generatedNumber => {
                    this.requestNumber = generatedNumber;
                },
                error => {console.log(error); alert(error);}
            )
        );
        // this.taskForm.get('requestNumber').valueChanges.subscribe(val => {
        //     this.disabledElements(val);
        // });
    }

    currencyChanged($event){
        console.log('currencyChanged', $event); }


    getPrices() {
        this.taskForm.reset();
        this.subscriptions.push(
            this.priceService.getPricesForRevaluation().subscribe(prices => {
                    this.dataSource.data = prices;
                    // let item = this.dataSource.data[0];
                    // for(let i = 0; i < 12; i++){
                    //     this.dataSource.data.push(item);
                    // }
                    // this.dataSource._updateChangeSubscription();
                    console.log('prices', prices);
                },
                error => console.log(error)
            ));
    }

    documentAdded($event) {

        this.outputDocuments.forEach(outDoc => {
            outDoc.number = undefined;
            outDoc.status = "Nu este atasat";

            for(let doc of this.documents){
                if (doc.docType.description == outDoc.description) {
                    outDoc.number = doc.number;
                    outDoc.status = "Atasat";
                    break;
                }
            }

        });
    }

    save(){
        this.loadingService.show();
        this.formSubmitted = true;

        let canSave = this.documents.length > 0 && !this.containInvalidPrices;

        if (!canSave && this.savePrices) {
            this.loadingService.hide();
            return;
        }

        this.formSubmitted = false;

        let prices: any[] = [];

      //  let uploadedOrder = this.documents.find(d => d.docType.description == 'Ordinul de înregistrare a prețului de producător');
        let uploadedOrder = this.documents.find(d => d.docType.description == 'Anexa 3:Lista medicamentelor cu prețul revizuit după modificarea valutei');

        this.dataSource.data.forEach(p => {
            prices.push({
                id: p.id,
                revisionDate: new Date(),
                priceMdl: p.priceMdlNew,
                status: this.savePrices ? 'V' : 'N',
                orderNr: uploadedOrder ? uploadedOrder.number : p.orderNr,
                orderApprovDate: uploadedOrder ? new Date() : p.priceApprovDate,
            })
        });

        this.subscriptions.push(this.priceService.saveReevaluation(prices).subscribe(data => {
                // this.router.navigate(['dashboard/homepage']);
                console.log('saved', data.body);
                if (data.body && this.documents && this.documents.length > 0) {
                    this.subscriptions.push(this.priceService.saveDocuments(this.documents).subscribe(docDate => {
                        this.loadingService.hide();
                    }));
                } else {
                    this.loadingService.hide();
                }
            },
            error1 => {
                console.log(error1);
                this.loadingService.hide();
            })
        );

    }

    newPriceModified(i: number, newValue: any){
        console.log('newPriceModified', newValue);
        this.dataSource.data[i].priceMdlNew = newValue;
        this.containInvalidPrices = this.dataSource.data.some(p => p.priceMdlNew == undefined || p.priceMdlNew <= 0 )
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
