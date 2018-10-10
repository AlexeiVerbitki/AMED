import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select} from '../../../models/select';

@Component({
  selector: 'app-cerere-import-export',
  templateUrl: './cerere-import-export.component.html',
  styleUrls: ['./cerere-import-export.component.css']
})
export class CerereImportExportComponent implements OnInit {

  zForm: FormGroup;
  public cerere: getCerere[] = [
    {denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
    {denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
    {denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
    {denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
  ];
  tipulAutorizarii: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'Import', viewValue: 'Import'},
    {value: 'Export', viewValue: 'Export'},
  ];
  tipMed: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'Precursor', viewValue: 'Precursor'},
    {value: 'Psihotrop', viewValue: 'Psihotrop'},
    {value: 'Stupefiant', viewValue: 'Stupefiant'},
  ];
  codMed: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'ANLGN', viewValue: 'ANLGN'},
    {value: 'CORVL', viewValue: 'CORVL'},
    {value: 'ASPIRIN', viewValue: 'ASPIRIN'},
    {value: 'VALIDOL', viewValue: 'VALIDOL'},
    {value: 'GRIPC', viewValue: 'GRIPC'},
  ];
  forma: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'Pulbere', viewValue: 'Pulbere'},
    {value: 'Drajeu', viewValue: 'Drajeu'},
  ];
  volum: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'mg', viewValue: 'mg'},
    {value: 'ui', viewValue: 'ui'},
  ];
  subsActiva: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'Mildonii', viewValue: 'Mildonii'},
    {value: 'Acid_acetilsalicilic', viewValue: 'Acid_acetilsalicilic'},
  ];

  constructor(private fb: FormBuilder) {
    this.zForm = fb.group({
      'dataReg': [null, Validators.required],
      'nrReg': [null, Validators.required],
      'compSolicitant': [null, Validators.required],
      'tipulAutorizarii': [null, Validators.required],
      'tipMed': [null, Validators.required],
      'codMed': [null, Validators.required],
      'denumire': [null, Validators.required],
      'cantitateMed': [null, Validators.required],
      'forma': [null, Validators.required],
      'doza': [null, Validators.required],
      'volum1': [null, Validators.required],
      'seria': [null, Validators.required],
      'subsActiva': [null, Validators.required],
      'cantSubsActive': [null, Validators.required],
      'volum2': [null, Validators.required],
    });
  }

  ngOnInit() {
  }

}
