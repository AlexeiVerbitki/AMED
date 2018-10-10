import {Component} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-drugs-cause-futility',
  templateUrl: './drugs-cause-futility.component.html',
  styleUrls: ['./drugs-cause-futility.component.css']
})
export class DrugsCauseFutilityComponent {

  aForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.aForm = fb.group({
      'cod': [null, Validators.required],
      'denumireaCauzei': [null, Validators.required],
      'descriere': [null, Validators.required],
    });
  }

  addForm() {
    console.log(this.aForm.value);
    this.aForm.reset();
  }

  cancel() {
    this.aForm.reset();
  }

}
