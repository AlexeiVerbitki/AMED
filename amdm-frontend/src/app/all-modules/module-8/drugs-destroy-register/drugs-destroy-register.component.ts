import { Select } from './../../../models/select';
import { Component, OnInit } from '@angular/core';
import { getCerere } from '../../../models/getCerere';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-drugs-destroy-register',
  templateUrl: './drugs-destroy-register.component.html',
  styleUrls: ['./drugs-destroy-register.component.css']
})
export class DrugsDestroyRegisterComponent implements OnInit {
  dataForm: FormGroup;
  model3: string;

  constructor(private fb: FormBuilder) {
    this.dataForm = fb.group({
      'data': { disabled: true, value: null },
      'nrCererii': [null, Validators.required]
    });
  }

  public forma: Select[] = [
    {value: 'forma-1', viewValue: 'Forma 1'},
    {value: 'forma-2', viewValue: 'Forma 2'},
    {value: 'forma-3', viewValue: 'Forma 3'},
  ];

  public cerere: getCerere[] = [
    { denumirea: 'Cerere de nimicire a medicamentelor 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
    { denumirea: 'Cerere de nimicire a medicamentelor 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
    { denumirea: 'Cerere de nimicire a medicamentelor 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
    { denumirea: 'Cerere de nimicire a medicamentelor 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
    { denumirea: 'Cerere de nimicire a medicamentelor 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
  ];

  ngOnInit() {
    this.model3 = 'B2';
  }


}
