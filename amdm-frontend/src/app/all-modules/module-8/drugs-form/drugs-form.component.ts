import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-drugs-form',
  templateUrl: './drugs-form.component.html',
  styleUrls: ['./drugs-form.component.css']
})
export class DrugsFormComponent implements OnInit {

  qForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.qForm = fb.group({
      'cod': [null, Validators.required],
      'denumireaForma': [null, Validators.required],
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
