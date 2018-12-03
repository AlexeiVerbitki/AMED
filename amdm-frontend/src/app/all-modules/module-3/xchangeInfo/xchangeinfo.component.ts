import { Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {Subscription} from "rxjs";
import {PriceService} from "../../../shared/service/prices.service";

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
            console.log('currencies', this.currencies);
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
