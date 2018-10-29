import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {FormControl} from '@angular/forms';
import {Select} from '../../../models/select';

@Component({
selector: 'app-import-authorization-evaluate',
templateUrl: './import-authorization-evaluate.component.html',
styleUrls: ['./import-authorization-evaluate.component.css']
})
export class ImportAuthorizationEvaluateComponent implements OnInit {
  date: any = new FormControl({value: new Date(), disabled: true});
  public cerere: getCerere[] = [
    {denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
    {denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
    {denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
    {denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
  ];
  public compSolicitant: Select[] = [
    {value: 'comp-1', viewValue: 'Comp 1'},
    {value: 'comp-2', viewValue: 'Comp 2'},
    {value: 'comp-3', viewValue: 'Comp 3'},
    {value: 'comp-4', viewValue: 'Comp 4'},
  ];
  public taraProd: Select[] = [
    {value: 'tara-1', viewValue: 'Tara 1'},
    {value: 'tara-2', viewValue: 'Tara 2'},
    {value: 'tara-3', viewValue: 'Tara 3'},
    {value: 'tara-4', viewValue: 'Tara 4'},
  ];
  public taraVinz: Select[] = [
    {value: 'tara-1', viewValue: 'Tara 1'},
    {value: 'tara-2', viewValue: 'Tara 2'},
    {value: 'tara-3', viewValue: 'Tara 3'},
    {value: 'tara-4', viewValue: 'Tara 4'},
  ];
  public valuta: Select[] = [
    {value: 'eur', viewValue: 'EUR: Euro'},
    {value: 'usd', viewValue: 'USD: Dolar American'},
    {value: 'RUR', viewValue: 'RUR: Rubla Ruseasca'},
  ];
  medReg = false;
  medUnreg = false;
  MatPrima = false;
  AmbalajProd = false;
  Prelevare = false;

  constructor() {
  }

  ngOnInit() {
  }

}
