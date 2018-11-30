import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {TaskService} from "../../../shared/service/task.service";
import {PriceService} from "../../../shared/service/prices.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {Document} from "../../../models/document";

@Component({
    selector: 'app-xchangeinfo',
    templateUrl: './xchangeinfo.component.html',
    styleUrls: ['./xchangeinfo.component.css']
})
export class XchangeInfoComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    @Output()
    public changed: EventEmitter<any> = new EventEmitter();


    currencies: any[] = [];


    constructor(private fb: FormBuilder,
                private priceService: PriceService,
                public dialog: MatDialog,) {
    }

    ngOnInit() {
        this.getPrevMonthAVGCurrencies();
    }


    getPrevMonthAVGCurrencies(){
        this.subscriptions.push(this.priceService.getPrevMonthAVGCurrencies().subscribe(data =>{
            this.currencies = data;
            this.changed.emit(this.currencies);
        }));
    }

    exchangeRateModified(index: number, newVal: string) {
        this.currencies[index].value = newVal;
        this.changed.emit(this.currencies);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
