import {Component} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-doc',
  templateUrl: './add-doc.component.html',
  styleUrls: ['./add-doc.component.css']
})
export class AddDocComponent {
  rForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rForm = fb.group({
      'expeditor': [null, Validators.required],
      'destinatar': [null, Validators.required],
      'problematica': [null, Validators.required],
      'termenDeExecutare': [null, Validators.required],
      'dataPrimirii': [null, Validators.required],
      'tipulDocumentului': [null, Validators.required],
    });
  }

  addForm() {
    console.log(this.rForm.value);
    this.rForm.reset();
  }

  cancel() {
    this.rForm.reset();
  }

}
