import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {Select} from '../../../models/select';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-samsa',
  templateUrl: './samsa.component.html',
  styleUrls: ['./samsa.component.css']
})
export class SamsaComponent implements OnInit {
  model: string;

  date: any = new FormControl({value: new Date(), disabled: true});

  constructor() {
  }

  public cerere: getCerere[] = [
    {denumirea: 'Cerere de inregistrare a medicamentului 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
    {denumirea: 'Cerere de inregistrare a medicamentului 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
    {denumirea: 'Cerere de inregistrare a medicamentului 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
    {denumirea: 'Cerere de inregistrare a medicamentului 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumirea: 'Cerere de inregistrare a medicamentului 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
  ];

  public experts: Select[] = [
    {value: 'expert-1', viewValue: 'Expert 1'},
    {value: 'expert-2', viewValue: 'Expert 2'},
    {value: 'expert-3', viewValue: 'Expert 3'},
  ];
  public domains: Select[] = [
    {value: 'domains-1', viewValue: 'Domeniu 1'},
    {value: 'domains-2', viewValue: 'Domeniu 2'},
    {value: 'domains-3', viewValue: 'Domeniu 3'},
  ];

  ngOnInit() {
    this.model = 'B2';
  }
}
