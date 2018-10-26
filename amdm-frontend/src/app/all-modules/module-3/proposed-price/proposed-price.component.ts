import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Currency} from "../../../models/currency";
import {Price} from "../../../models/price";

@Component({
  selector: 'app-proposed-price',
  templateUrl: './proposed-price.component.html',
  styleUrls: ['./proposed-price.component.css']
})
export class ProposedPriceComponent implements OnInit {

    formNr: number;

    @Output()
    public remove: EventEmitter<number> = new EventEmitter();

    price: Price = new Price();

    formSubmitted: boolean = false;

    currencies: Currency[] = [];

    onPriceChange($event) {
       // alert($event.target.value);
    }

  constructor() { }

  ngOnInit() {
  }

}
