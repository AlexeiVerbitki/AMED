import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-nomenclator-modal',
  templateUrl: './nomenclator-modal.component.html',
  styleUrls: ['./nomenclator-modal.component.css']
})
export class NomenclatorModalComponent implements OnInit {

  row: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
      this.row = data;
  }


  ngOnInit() {
  }

}
