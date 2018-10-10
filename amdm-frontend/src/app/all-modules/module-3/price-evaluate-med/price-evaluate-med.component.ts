import {Component, OnInit} from '@angular/core';
import {Aprob} from '../../../models/aprob';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {DocIesire} from '../../../models/docIesire';
import {Select} from '../../../models/select';

@Component({
  selector: 'app-price-evaluate-med',
  templateUrl: './price-evaluate-med.component.html',
  styleUrls: ['./price-evaluate-med.component.css']
})
export class PriceEvaluateMedComponent implements OnInit {


  date = new FormControl({value: new Date(), disabled: true});
  zForm: FormGroup;
  aprob: Aprob[] = [
    {denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
  ];
  valutaAccept: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'MDL', viewValue: 'Lei MD'},
    {value: 'RON', viewValue: 'Lei RO'},
    {value: 'HRU', viewValue: 'Hrivne'},
    {value: 'RUR', viewValue: 'Ruble rusesti'},
    {value: 'EUR', viewValue: 'Euro'},
    {value: 'USD', viewValue: 'Dolari americani'},
  ];
  docIesire: DocIesire[] = [
    {denumire: 'Ordin de inregistrare a pretului', statut: 'Generat', status: true},
    {denumire: 'Anexa 1', statut: 'Lipsa', status: false},
    {denumire: 'Anexa 2', statut: 'Lipsa', status: false}
  ];
  motivulExp: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'exp', viewValue: 'Expirarea contractului pe termen fix'},
    {value: 'recalc', viewValue: 'Recalcularea preturilor'},
  ];

  constructor(private fb: FormBuilder) {
    this.zForm = fb.group({
      'priceRefProp': [null, Validators.required],
      'valutaFinishProp': [null, Validators.required],
      'eur': [null, Validators.required],
      'rur': [null, Validators.required],
      'usd': [null, Validators.required],
      'pretAccept': [null, Validators.required],
      'ordAprobPret': [null, Validators.required],
      'dataExp': [null, Validators.required],
      'motivulExp': [null, Validators.required],
      'note': [null, Validators.required],
    });
  }

  ngOnInit() {
  }

}
