import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-drugs-destroy',
  templateUrl: './drugs-destroy.component.html',
  styleUrls: ['./drugs-destroy.component.css']
})
export class DrugsDestroyComponent implements OnInit {

  qForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.qForm = fb.group({
      'cod': [null, Validators.required],
      'denumireaMetodei': [null, Validators.required],
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
