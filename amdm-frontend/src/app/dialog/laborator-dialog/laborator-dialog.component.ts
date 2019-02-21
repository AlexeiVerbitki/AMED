import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-laborator-dialog',
  templateUrl: './laborator-dialog.component.html',
  styleUrls: ['./laborator-dialog.component.css']
})
export class LaboratorDialogComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  lForm: FormGroup;
  title = 'Adaugare laborator sub contract';
  formSubmitted: boolean;

  constructor(
              private fb: FormBuilder,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<LaboratorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    this.lForm = fb.group({
      'name': [null, Validators.required],
      'address':  [null, Validators.required],
      'postalCode': [null],
      'contactName': [null, Validators.required],
        'typeOfAnalysis': [null, Validators.required],
      'phoneNumber': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
      'fax': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
      'mobilePhone': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
      'email': [null, Validators.email],
      'response': [null],
    });
  }

  ngOnInit() {

    if (this.dataDialog) {
      this.title = 'Editare laborator sub contract';
      this.lForm.get('name').setValue(this.dataDialog.name);
      this.lForm.get('address').setValue(this.dataDialog.address);
      this.lForm.get('postalCode').setValue(this.dataDialog.postalCode);
      this.lForm.get('contactName').setValue(this.dataDialog.contactName);
      this.lForm.get('phoneNumber').setValue(this.dataDialog.phoneNumber);
      this.lForm.get('fax').setValue(this.dataDialog.fax);
      this.lForm.get('mobilePhone').setValue(this.dataDialog.mobilePhone);
        this.lForm.get('typeOfAnalysis').setValue(this.dataDialog.typeOfAnalysis);
      this.lForm.get('email').setValue(this.dataDialog.email);
    }

  }

  add() {
    this.formSubmitted = true;


    if (this.lForm.invalid) {
      return;
    }

    this.formSubmitted = false;

    this.lForm.get('response').setValue(true);
    this.dialogRef.close(this.lForm.value);
  }

  cancel() {
    this.lForm.get('response').setValue(false);
    this.dialogRef.close(this.lForm.value);
  }

}
