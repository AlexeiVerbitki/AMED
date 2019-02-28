import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-select-inspection-date-for-af',
  templateUrl: './select-inspection-date-for-af.component.html',
  styleUrls: ['./select-inspection-date-for-af.component.css']
})
export class SelectInspectionDateForAfComponent implements OnInit {

  eForm: FormGroup;
  formSubmitted = false;
  type = '';

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              public dialogRef: MatDialogRef<SelectInspectionDateForAfComponent>) {
    this.eForm = fb.group({
      'docNr': [null, Validators.required],
      'inspectionDate': [new Date(), Validators.required],
      'aplicationDomainOfLastInspection': [null, Validators.required],
      'response': [null]
    });
  }

  ngOnInit() {
    this.type = this.dataDialog.type;
  }

  cancel() {
    this.dialogRef.close(this.eForm.value);
  }

  ok() {
    this.eForm.get('response').setValue(true);
    this.dialogRef.close(this.eForm.value);
  }


}
