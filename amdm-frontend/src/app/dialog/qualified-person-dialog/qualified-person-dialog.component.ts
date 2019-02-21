import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-qualified-person-dialog',
  templateUrl: './qualified-person-dialog.component.html',
  styleUrls: ['./qualified-person-dialog.component.css']
})
export class QualifiedPersonDialogComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  qForm: FormGroup;
  title = 'Adaugare persoana calificata';
  formSubmitted: boolean;
  isStatutInvalid : boolean;
  isFunctionInvalid: boolean;

  constructor(
      private fb: FormBuilder,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<QualifiedPersonDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    this.qForm = fb.group({
      'lastName': [null, Validators.required],
      'firstName': [null, Validators.required],
      'address':  [null, Validators.required],
      'postalCode': [null],
      'phoneNumber': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
      'fax': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
      'mobilePhone': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
      'email':  [null, Validators.email],
      'statut': [null],
      'consultantDetails':  {disabled: true, value: null},
      'qualifications': [null],
      'experience': [null],
      'professionalAssociations': [null],
      'nameFunctionSubordinates': [null],
      'scopeResponsability': [null],
      'function': [null],
      'category': [null],
      'response': [null],
    });

    this.qForm.get('statut').valueChanges.subscribe(val => {
      this.isStatutInvalid = false;
      if (val!='C') {
        this.qForm.get('consultantDetails').setValue(null);
        this.qForm.get('consultantDetails').disable();
      } else {
        this.qForm.get('consultantDetails').enable();
      }
    });

    this.qForm.get('function').valueChanges.subscribe(val => {
      this.isFunctionInvalid = false;
    });
  }

  ngOnInit() {

    if (this.dataDialog.qualifiedPerson) {
      this.title = 'Editare detalii persoana calificata';
      this.qForm.get('lastName').setValue(this.dataDialog.qualifiedPerson.lastName);
      this.qForm.get('address').setValue(this.dataDialog.qualifiedPerson.address);
      this.qForm.get('postalCode').setValue(this.dataDialog.qualifiedPerson.postalCode);
      this.qForm.get('firstName').setValue(this.dataDialog.qualifiedPerson.firstName);
      this.qForm.get('phoneNumber').setValue(this.dataDialog.qualifiedPerson.phoneNumber);
      this.qForm.get('fax').setValue(this.dataDialog.qualifiedPerson.fax);
      this.qForm.get('mobilePhone').setValue(this.dataDialog.qualifiedPerson.mobilePhone);
      this.qForm.get('email').setValue(this.dataDialog.qualifiedPerson.email);
      this.qForm.get('statut').setValue(this.dataDialog.qualifiedPerson.statut);
      this.qForm.get('consultantDetails').setValue(this.dataDialog.qualifiedPerson.consultantDetails);
      this.qForm.get('qualifications').setValue(this.dataDialog.qualifiedPerson.qualifications);
      this.qForm.get('experience').setValue(this.dataDialog.qualifiedPerson.experience);
      this.qForm.get('professionalAssociations').setValue(this.dataDialog.qualifiedPerson.professionalAssociations);
      this.qForm.get('nameFunctionSubordinates').setValue(this.dataDialog.qualifiedPerson.nameFunctionSubordinates);
      this.qForm.get('scopeResponsability').setValue(this.dataDialog.qualifiedPerson.scopeResponsability);
      this.qForm.get('function').setValue(this.dataDialog.qualifiedPerson.function);
    }

  }

  add() {

    this.formSubmitted = true;


    if (this.qForm.invalid) {
      return;
    }

    this.formSubmitted = false;

    this.isStatutInvalid = false;
    if(this.dataDialog.type=='QP' && !this.qForm.get('statut').value)
    {
      this.isStatutInvalid = true;
      return;
    }

    this.isFunctionInvalid = false;
    if(this.dataDialog.type=='QPP' && !this.qForm.get('function').value)
    {
      this.isFunctionInvalid = true;
      return;
    }

    this.qForm.get('category').setValue(this.dataDialog.type);
    this.qForm.get('response').setValue(true);
    this.dialogRef.close(this.qForm.value);
  }

  cancel() {
    this.qForm.get('response').setValue(false);
    this.dialogRef.close(this.qForm.value);
  }


}
