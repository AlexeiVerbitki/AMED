import { Component, OnInit } from '@angular/core';
import {Country} from "../../../models/country";
import {Currency} from "../../../models/currency";

@Component({
  selector: 'app-reference-price',
  templateUrl: './reference-price.component.html',
  styleUrls: ['./reference-price.component.css']
})
export class ReferencePriceComponent implements OnInit {

    refPrice: number;
    currency: string;
    country: string;

    formSubmitted: boolean = false;

    countries: Country[] = [];
    currencies: Currency[] = [];

    onPriceChange($event) {
        alert($event.target.value);
    }

    constructor() {
    }

    ngOnInit() {

    }

}
