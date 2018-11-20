import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nomenclator-root',
  templateUrl: './nomenclator-root.component.html',
  styleUrls: ['./nomenclator-root.component.css']
})
export class NomenclatorRootComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      console.log('init root');
  }

}
