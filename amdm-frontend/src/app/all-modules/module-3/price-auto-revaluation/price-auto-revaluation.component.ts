import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {TaskService} from "../../../shared/service/task.service";
import {PriceService} from "../../../shared/service/prices.service";
import {LoaderService} from "../../../shared/service/loader.service";

@Component({
    selector: 'app-prices-auto-revaluation',
    templateUrl: './price-auto-revaluation.component.html',
    styleUrls: ['./price-auto-revaluation.component.css']
})
export class PriceAutoRevaluationComponent implements OnInit, AfterViewInit, OnDestroy {
    taskForm: FormGroup;
    documents: Document[] = [];
    requestNumber: number;

    displayedColumns: any[] = ['medicamentCode', 'commercialName', 'pharmaceuticalForm', 'dose', 'volume', 'division', 'registrationDate', 'priceMdl', 'price'];
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
                private loaderService: LoaderService) {

        this.taskForm = fb.group({
            'medicamentCode': [null],
            'commercialName': [null],
            'pharmaceuticalForm': [null],
            'dose': [null],
            'volume': [null],
            'division': [null],
            'registrationDate': [null],
            'priceMdl': [null],
            'price': [null],
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Prorcese pe pagina: ";
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
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
        console.log('currencyChanged', $event);
    }


    getPrices() {
        this.taskForm.reset();
        this.subscriptions.push(
            this.priceService.getPricesForRevaluation().subscribe(prices => {
                    console.log('prices', prices);
                    this.dataSource.data = prices;
                },
                error => console.log(error)
            ));
    }

    documentAdded($event){

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

    navigateToUrl(index: number, rowDetails: any) {
         this.priceEditModalOpen(index, rowDetails);
        // this.route.navigate(['dashboard/module/price/evaluate/' + rowDetails.id]);

        // const urlToNavigate = rowDetails.navigationUrl + rowDetails.id;
        // if (urlToNavigate !== '') {
        //     this.route.navigate([urlToNavigate]);
        // }
    }

    priceEditModalOpen(index: number, rowDetails: any): void {
        // const dialogRef = this.dialog.open(PriceReqEditModalComponent, {
        //     data: {request: rowDetails, medTypes: this.medTypes, steps: this.steps, priceTypes: this.priceTypes},
        //     width: '1000px'
        // });
        //
        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed', result);
        //
        //     if(result) {
        //         this.dataSource.data[index] = result;
        //         this.dataSource._updateChangeSubscription();
        //     }
        // });
    };

    isLink(rowDetails: any): boolean {
        return rowDetails.navigationUrl !== '';
    }

}
