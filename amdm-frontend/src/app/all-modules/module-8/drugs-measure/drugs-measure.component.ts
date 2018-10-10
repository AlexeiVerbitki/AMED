import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-drugs-measure',
  templateUrl: './drugs-measure.component.html',
  styleUrls: ['./drugs-measure.component.css']
})
export class DrugsMeasureComponent implements OnInit {

  qForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.qForm = fb.group({
      'cod': [null, Validators.required],
      'denumirea': [null, Validators.required],
      'descriere': [null, Validators.required],
    });
  }

  addForm() {
    console.log(this.qForm.value);
    this.qForm.reset();
   }

   cancel() {
    this.qForm.reset();
   }

  ngOnInit() {
  }

}
