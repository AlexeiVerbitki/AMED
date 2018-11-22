import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from "rxjs";
import {TaskService} from "../shared/service/task.service";
import {Router} from "@angular/router";
import {LoaderService} from "../shared/service/loader.service";
import {debounceTime, distinctUntilChanged, filter, tap} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";
import {PriceService} from "../shared/service/prices.service";

@Component({
    selector: 'app-prices',
    templateUrl: './prices.component.html',
    styleUrls: ['./prices.component.css']
})
export class PricesComponent implements OnInit, AfterViewInit, OnDestroy {
    taskForm: FormGroup;
    requests: any[];
    medTypes: any[];
    priceTypes: any[];
    steps: any[] = [
        {short: 'R', description: 'Înregistrare'},
        {short: 'E', description: 'Evaluare'},
        {short: 'C', description: 'Întrerupt'},
        {short: 'F', description: 'Finisat'},
    ]




    companyMedicaments: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;

    displayedColumns: any[] = ['requestNumber', 'folderNr', 'medicament','medicamentType', 'assignedPerson', 'startDate', 'endDate', 'currentStep', 'priceType'];
    dataSource = new MatTableDataSource<any>();
    row: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private route: Router,
                private taskService: TaskService,
                private priceService: PriceService,
                private loaderService: LoaderService) {

        this.taskForm = fb.group({
            'requestNumber': [null],
            'folderNr': [null],
            'medicament': [null],
            'assignedPerson': [null],
            'startDate': [null],
            'endDate': [null],
            'currentStep': [null],
            'medicamentType': [null],
            'priceType': [null],
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Prorcese pe pagina: ";
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
        this.companyMedicaments =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.medLoading = true;

                }),
                flatMap(term =>

                    this.priceService.getMedicamentNamesAndCodeList(term).pipe(
                        tap(() => this.medLoading = false)
                    )
                )
            );

        this.subscriptions.push(
            this.priceService.getAllMedicamentTypes().subscribe(data => {
                    this.medTypes = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.priceService.getPriceTypes('1').subscribe(priceTypes => {
                    this.priceTypes = priceTypes;
                    console.log('getPriceTypes', this.priceTypes);
                },
                error => console.log(error)
            ));

        this.subscriptions.push(this.taskService.getRequestNames().subscribe(data => {
            this.requests = data;
        }));

        // this.taskForm.get('requestNumber').valueChanges.subscribe(val => {
        //     this.disabledElements(val);
        // });
    }

    getPrices() {
        let dto = this.taskForm.value;
        dto.medicamentCode = dto.medicament?dto.medicament.code:undefined;
        dto.medicament = undefined;
        dto.medicamentType = dto.medicamentType?dto.medicamentType.description:undefined;
        dto.currentStep = dto.currentStep?dto.currentStep.short:undefined;
        dto.priceType = dto.priceType?dto.priceType.description:undefined;

        this.taskForm.reset();
        this.subscriptions.push(
            this.priceService.getPricesByFilter(dto
            ).subscribe(pricesRequests => {
                    this.dataSource.data = pricesRequests.body;
                    console.log('pricesRequests', pricesRequests.body);
                },
                error => console.log(error)
            ));
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

    navigateToUrl(rowDetails: any) {
        const urlToNavigate = rowDetails.navigationUrl + rowDetails.id;
        if (urlToNavigate !== '') {
            this.route.navigate([urlToNavigate]);
        }
    }

    isLink(rowDetails: any): boolean {
        return rowDetails.navigationUrl !== '';
    }

}