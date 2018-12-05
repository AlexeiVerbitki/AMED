import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskService} from "../../../shared/service/task.service";
import {PriceService} from "../../../shared/service/prices.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {Document} from "../../../models/document";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
@Component({
    selector: 'app-prices-revaluation-generics',
    templateUrl: './revaluation-generics.component.html',
    styleUrls: ['./revaluation-generics.component.css'],
})

export class RevaluationGenericsComponent implements OnInit, AfterViewInit, OnDestroy {
    documents: Document[] = [];
    priceId: string ;
    requestNumber: number;
    containInvalidPrices: boolean = false;
    formSubmitted: boolean = false;
    savePrices: boolean = false;
    medicaments: any[] = [];

    outputDocuments: any[] = [{
        description: 'Anexa 2:Lista medicamentelor generice cu prețuri reevaluate',
        number: undefined,
        status: "Nu este atasat"
    }];

    displayedColumns: any[] = ['medicamentCode', 'commercialName', 'pharmaceuticalForm', 'dose', 'volume', 'division', 'registrationDate', 'price', 'priceMdl', 'priceMdlNew', 'priceMdlDifferencePercents', 'ignore'];

    dataSource = new MatTableDataSource<any>();
    row: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private taskService: TaskService,
                private priceService: PriceService,
                private navbarTitleService: NavbarTitleService,
                public dialog: MatDialog,
                private errorHandlerService: ErrorHandlerService,
                public dialogConfirmation: MatDialog,
                private loadingService: LoaderService) {

        this.subscriptions.push(
            this.route.params.subscribe(params => {
                if (params['id']) {
                    this.priceId = params.id;
                } else {
                    this.errorHandlerService.showError('ID-ul medicamentului original nu a fost indicat în URL');
                }
            }));
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
        this.navbarTitleService.showTitleMsg('Reevaluarea prețului medicamentelor generice bazate pe medicamentul original evaluat');

        this.getGenericMedsPrices();
        this.getOriginalMedDetails();

        this.subscriptions.push(
            this.priceService.generateDocNumber().subscribe(generatedNumber => {
                    this.requestNumber = generatedNumber;
                },
                error => {console.log(error);}
            )
        );
        // this.taskForm.get('requestNumber').valueChanges.subscribe(val => {
        //     this.disabledElements(val);
        // });
    }

    currencyChanged($event){
        console.log('currencyChanged', $event);
    }

    deleteRelatedMed(index: number) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
    }

    getOriginalMedDetails() {
        this.subscriptions.push(
            this.priceService.getPriceById(this.priceId).subscribe(p => {
                    p.medicament.mdlValue = p.mdlValue;
                    p.medicament.value = p.value;
                    p.medicament.currency = p.currency;
                    this.medicaments.push(p.medicament);
                    console.log('getOriginalMedDetails', this.medicaments);
                },
                error => console.log(error)
            ));
    }

    getGenericMedsPrices() {
        this.subscriptions.push(
            this.priceService.getGenericsPricesForRevaluation(this.priceId).subscribe(prices => {
                    this.dataSource.data = prices;
                    console.log('getGenericMedsPrices', prices);
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

        let uploadedOrder = this.documents.find(d => d.docType.description == 'Anexa 2:Lista medicamentelor generice cu prețuri reevaluate');

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

    newPriceModified(i: number, newValue: any) {
        console.log('newPriceModified', newValue);
        this.dataSource.data[i].priceMdlNew = newValue;
        this.containInvalidPrices = this.dataSource.data.some(p => p.priceMdlNew == undefined || p.priceMdlNew <= 0 )
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }



}
