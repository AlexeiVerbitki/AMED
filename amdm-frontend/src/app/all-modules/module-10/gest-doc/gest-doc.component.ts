import {Component} from '@angular/core';

import {getDoc} from '../../../models/getDoc';

@Component({
  selector: 'app-gest-doc',
  templateUrl: './gest-doc.component.html',
  styleUrls: ['./gest-doc.component.css']
})
export class GestDocComponent {

  constructor() {
  }

  public docs: getDoc[] = [
    {
      nrDoc: 1,
      data: '20.04.2018',
      expeditor: 'Test',
      destinatar: 'Test 2',
      problematica: 'Test',
      termenDeExecutare: '30 zile',
      dataPrimirii: '05.05.2018',
      tipDoc: 'PDF',
      fisier: 'Doc'
    },
    {
      nrDoc: 1,
      data: '20.04.2018',
      expeditor: 'Test',
      destinatar: 'Test 2',
      problematica: 'Test',
      termenDeExecutare: '30 zile',
      dataPrimirii: '05.05.2018',
      tipDoc: 'PDF',
      fisier: 'Doc'
    },
    {
      nrDoc: 1,
      data: '20.04.2018',
      expeditor: 'Test',
      destinatar: 'Test 2',
      problematica: 'Test',
      termenDeExecutare: '30 zile',
      dataPrimirii: '05.05.2018',
      tipDoc: 'PDF',
      fisier: 'Doc'
    },
    {
      nrDoc: 1,
      data: '20.04.2018',
      expeditor: 'Test',
      destinatar: 'Test 2',
      problematica: 'Test',
      termenDeExecutare: '30 zile',
      dataPrimirii: '05.05.2018',
      tipDoc: 'PDF',
      fisier: 'Doc'
    },
    {
      nrDoc: 1,
      data: '20.04.2018',
      expeditor: 'Test',
      destinatar: 'Test 2',
      problematica: 'Test',
      termenDeExecutare: '30 zile',
      dataPrimirii: '05.05.2018',
      tipDoc: 'PDF',
      fisier: 'Doc'
    },
    {
      nrDoc: 1,
      data: '20.04.2018',
      expeditor: 'Test',
      destinatar: 'Test 2',
      problematica: 'Test',
      termenDeExecutare: '30 zile',
      dataPrimirii: '05.05.2018',
      tipDoc: 'PDF',
      fisier: 'Doc'
    },
    {
      nrDoc: 1,
      data: '20.04.2018',
      expeditor: 'Test',
      destinatar: 'Test 2',
      problematica: 'Test',
      termenDeExecutare: '30 zile',
      dataPrimirii: '05.05.2018',
      tipDoc: 'PDF',
      fisier: 'Doc'
    },
    {
      nrDoc: 1,
      data: '20.04.2018',
      expeditor: 'Test',
      destinatar: 'Test 2',
      problematica: 'Test',
      termenDeExecutare: '30 zile',
      dataPrimirii: '05.05.2018',
      tipDoc: 'PDF',
      fisier: 'Doc'
    },
  ];
}
