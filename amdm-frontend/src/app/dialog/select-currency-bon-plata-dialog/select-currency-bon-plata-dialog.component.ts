import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-select-currency-bon-plata-dialog',
  templateUrl: './select-currency-bon-plata-dialog.component.html',
  styleUrls: ['./select-currency-bon-plata-dialog.component.css']
})
export class SelectCurrencyBonPlataDialogComponent implements OnInit {

  aForm: FormGroup;

  constructor( private fb: FormBuilder,
               public dialogRef: MatDialogRef<SelectCurrencyBonPlataDialogComponent>) {
    this.aForm = fb.group({
      'currency': ['MDL', Validators.required],
      'response': [null]
    });
  }

  ngOnInit() {
  }

  generate() {
    this.aForm.get('response').setValue(true);
    this.dialogRef.close(this.aForm.value);
  }

}
