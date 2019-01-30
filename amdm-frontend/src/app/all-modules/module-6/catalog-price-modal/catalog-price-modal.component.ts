import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-catalog-price-modal',
  templateUrl: './catalog-price-modal.component.html',
  styleUrls: ['./catalog-price-modal.component.css']
})
export class CatalogPriceModalComponent implements OnInit {

  row: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
      this.row = data;
  }

  
  ngOnInit() {
  }

}
