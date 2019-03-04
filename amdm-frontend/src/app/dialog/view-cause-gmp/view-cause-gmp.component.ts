import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-view-cause-gmp',
  templateUrl: './view-cause-gmp.component.html',
  styleUrls: ['./view-cause-gmp.component.css']
})
export class ViewCauseGmpComponent implements OnInit {

  eForm: FormGroup;
  formSubmitted = false;
  name: string;
  errMsg: string;
  title: string;

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              public dialogRef: MatDialogRef<ViewCauseGmpComponent>) {
    this.eForm = fb.group({
      'cause': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.eForm.get('cause').setValue(this.dataDialog.cause);
  }

  ok() {
    this.dialogRef.close();
  }

}
