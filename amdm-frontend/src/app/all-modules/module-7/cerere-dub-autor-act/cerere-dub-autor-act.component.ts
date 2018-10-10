import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cerere-dub-autor-act',
  templateUrl: './cerere-dub-autor-act.component.html',
  styleUrls: ['./cerere-dub-autor-act.component.css']
})
export class CerereDubAutorActComponent implements OnInit {

  zForm: FormGroup;
  public cerere: getCerere[] = [
    {denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
    {denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
    {denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
    {denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
  ];

  constructor(private fb: FormBuilder) {
    this.zForm = fb.group({
      'data': [null, Validators.required],
      'nrReg': [null, Validators.required],
      'compSolicitant': [null, Validators.required]
    });
  }

  ngOnInit() {
  }
}
