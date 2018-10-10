import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {Select} from '../../../models/select';

@Component({
  selector: 'app-reg-stud-clinice',
  templateUrl: './reg-stud-clinice.component.html',
  styleUrls: ['./reg-stud-clinice.component.css']
})
export class RegStudCliniceComponent implements OnInit {
  model: string;
  model1: string;
  model2: string;

  constructor() {
  }

  public cerere: getCerere[] = [
    {denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
    {denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
    {denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
    {denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
  ];

  public forma: Select[] = [
    {value: 'forma-1', viewValue: 'Forma 1'},
    {value: 'forma-2', viewValue: 'Forma 2'},
    {value: 'forma-3', viewValue: 'Forma 3'},
    {value: 'forma-4', viewValue: 'Forma 4'}
  ];

  public compSolicit: Select[] = [
    {value: 'comp-1', viewValue: 'Compania 1'},
    {value: 'comp-2', viewValue: 'Compania 2'},
    {value: 'comp-3', viewValue: 'Compania 3'},
    {value: 'comp-4', viewValue: 'Compania 4'},
    {value: 'comp-5', viewValue: 'Compania 5'},
  ];

  public medInvest: Select[] = [
    {value: 'doza', viewValue: 'Doza'},
    {value: 'forma', viewValue: 'Forma farmaceutică'},
    {value: 'calea', viewValue: 'Calea de administrare'},
  ];
  public placeBo: Select[] = [
    {value: 'doza', viewValue: 'Doza'},
    {value: 'forma', viewValue: 'Forma farmaceutică'},
    {value: 'calea', viewValue: 'Calea de administrare'},
  ];
  public prodRef: Select[] = [
    {value: 'doza', viewValue: 'Doza'},
    {value: 'forma', viewValue: 'Forma farmaceutică'},
    {value: 'calea', viewValue: 'Calea de administrare'},
  ];
  public finalFC: Select[] = [
    {value: 'declaratieLocala', viewValue: 'Declarația de închidere locală'},
    {value: 'declaratieGlobala', viewValue: 'Declarația de închidere globală'},
    {value: 'raport', viewValue: 'Raport final al studiului clinic'}
  ];

  ngOnInit() {
    this.model = 'A';
    this.model1 = 'B1';
    this.model2 = 'A2';
  }


}
