import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Country} from "../../../models/country";
import {Currency} from "../../../models/currency";
import {Price} from "../../../models/price";

@Component({
  selector: 'app-reference-price',
  templateUrl: './reference-price.component.html',
  styleUrls: ['./reference-price.component.css']
})
export class ReferencePriceComponent implements OnInit {

    @ViewChild ('changeProp') elemRef: ElementRef;

    formNr: number;
    forEvaluation: boolean = false;
    refPrice: Price = new Price();

    @Input()
    canRemove: boolean = true;

    @Output()
    public remove: EventEmitter<number> = new EventEmitter();

    @Output()
    public change: EventEmitter<any> = new EventEmitter();

    @Input()
    formSubmitted: boolean = false;

    @Input()
    countries: Country[] = [];
    @Input()
    currencies: Currency[] = [];
    @Input()
    types: any[] = [];

    onPriceChange($event) {
        this.change.emit('price');
       // alert($event.target.value);
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
    }

}
