import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Country} from '../../../models/country';
import {Currency} from '../../../models/currency';
import {Price} from '../../../models/price';

@Component({
  selector: 'app-reference-price',
  templateUrl: './reference-price.component.html',
  styleUrls: ['./reference-price.component.css']
})
export class ReferencePriceComponent implements OnInit {

    @ViewChild ('changeProp') elemRef: ElementRef;

    formNr: number;
    forEvaluation = false;
    refPrice: Price = new Price();

    priceId: string;
    divisionId: string;
    currencyId: string;
    coutnrId: string;
    typeId: string;

    @Input()
    canRemove = true;

    @Output()
    public remove: EventEmitter<number> = new EventEmitter();

    @Output()
    public change: EventEmitter<any> = new EventEmitter();

    @Input()
    formSubmitted = false;

    @Input()
    countries: Country[] = [];
    @Input()
    currencies: Currency[] = [];
    @Input()
    types: any[] = [];

    onPriceChange($event) {
        this.change.emit('price');
    }

    onDivisionChange($event) {
        this.change.emit('division');
       // alert($event.target.value);
    }

    constructor() {
    }

    ngOnInit() {
        // (<any>this.elemRef).setDisabledState(true);
        // console.log(this.elemRef);
        const uniqueId = new Date().getMilliseconds();
        this.priceId = 'priceId' + uniqueId;
        this.divisionId = 'divisionId' + uniqueId;
        this.currencyId = 'currencyId' + uniqueId;
        this.coutnrId = 'coutnrId' + uniqueId;
        this.typeId = 'typeId' + uniqueId;
    }

}
