import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';

@Component({
  selector: 'app-drugs-destroy-register',
  templateUrl: './drugs-destroy-register.component.html',
  styleUrls: ['./drugs-destroy-register.component.css']
})
export class DrugsDestroyRegisterComponent implements OnInit {

  model3: string;

  constructor() {
  }

  public cerere: getCerere[] = [
    {denumirea: 'Cerere de nimicire a medicamentelor 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
    {denumirea: 'Cerere de nimicire a medicamentelor 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
    {denumirea: 'Cerere de nimicire a medicamentelor 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
    {denumirea: 'Cerere de nimicire a medicamentelor 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumirea: 'Cerere de nimicire a medicamentelor 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
  ];

  ngOnInit() {
    this.model3 = 'B2';
  }


}
