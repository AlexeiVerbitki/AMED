import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-drugs-pack',
  templateUrl: './drugs-pack.component.html',
  styleUrls: ['./drugs-pack.component.css']
})
export class DrugsPackComponent implements OnInit {

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
