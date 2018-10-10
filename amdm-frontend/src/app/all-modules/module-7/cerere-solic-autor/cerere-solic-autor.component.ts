import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select} from '../../../models/select';

@Component({
  selector: 'app-cerere-solic-autor',
  templateUrl: './cerere-solic-autor.component.html',
  styleUrls: ['./cerere-solic-autor.component.css']
})
export class CerereSolicAutorComponent implements OnInit {

  zForm: FormGroup;
  public cerere: getCerere[] = [
    {denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
    {denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
    {denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
    {denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
  ];
  raion: Select[] = [
    {value: 'raion-1', viewValue: 'Raion 1'},
    {value: 'raion-2', viewValue: 'Raion 2'},
    {value: 'raion-3', viewValue: 'Raion 3'},
  ];
  localitate: Select[] = [
    {value: 'localitate-1', viewValue: 'Localitate 1'},
    {value: 'localitate-2', viewValue: 'Localitate 2'},
    {value: 'localitate-3', viewValue: 'Localitate 3'},
  ];
  strada: Select[] = [
    {value: 'strada-1', viewValue: 'Strada 1'},
    {value: 'strada-2', viewValue: 'Strada 2'},
    {value: 'strada-3', viewValue: 'Strada 3'},
  ];
  nr: Select[] = [
    {value: 'nr-1', viewValue: 'Nr 1'},
    {value: 'nr-2', viewValue: 'Nr 2'},
    {value: 'nr-3', viewValue: 'Nr 3'},
  ];
  bloc: Select[] = [
    {value: 'bloc-1', viewValue: 'Bloc 1'},
    {value: 'bloc-2', viewValue: 'Bloc 2'},
    {value: 'bloc-3', viewValue: 'Bloc 3'},
  ];
  tipMed: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'Precursor', viewValue: 'Precursor'},
    {value: 'Psihotrop', viewValue: 'Psihotrop'},
    {value: 'Stupefiant', viewValue: 'Stupefiant'},
  ];

  constructor(private fb: FormBuilder) {
    this.zForm = fb.group({
      'dataReg': [null, Validators.required],
      'nrReg': [null, Validators.required],
      'compSolicitant': [null, Validators.required],
      'name': [null, Validators.required],
      'surname': [null, Validators.required],
      'idnp': [null, Validators.required],
      'cellphone': [null, Validators.required],
      'email': [null, Validators.required],
      'tipMed': [null, Validators.required],
      'dataExp': [null, Validators.required],
    });
  }

  ngOnInit() {
  }

}
