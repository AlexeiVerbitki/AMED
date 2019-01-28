import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdministrationService} from '../../shared/service/administration.service';

@Component({
  selector: 'app-add-expert',
  templateUrl: './add-expert.component.html',
  styleUrls: ['./add-expert.component.css']
})
export class AddExpertComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  eForm: FormGroup;
  experts: any[];
  formSubmitted: boolean;
  type: any;

  constructor(    private fb: FormBuilder,
                  public dialogRef: MatDialogRef<AddExpertComponent>,
                  @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                  private administrationService: AdministrationService) {
    this.eForm = fb.group({
      'intern': [0],
      'expert': [null],
      'expertName': [null],
      'decision' :  [null],
      'date' : [new Date()],
      'response' : [null]
    });
  }

  ngOnInit() {
    this.subscriptions.push(
        this.administrationService.getAllEmployees().subscribe(data => {
              this.experts = data;
            },
            error => console.log(error)
        )
    );
    this.type = this.dataDialog.type;

    if (this.type == 'edit') {
        this.eForm.get('intern').setValue(this.dataDialog.expert.intern);
        this.eForm.get('expert').setValue(this.dataDialog.expert.expert);
        this.eForm.get('expertName').setValue(this.dataDialog.expert.expertName);
        this.eForm.get('decision').setValue(this.dataDialog.expert.decision);
        this.eForm.get('date').setValue(this.dataDialog.expert.date);
    }
  }

  add() {
    this.formSubmitted = true;

    if (this.eForm.invalid) {
      return;
    }

    if (this.eForm.get('intern').value && !this.eForm.get('expert').value) {
      return;
    }

    if (!this.eForm.get('intern').value && !this.eForm.get('expertName').value) {
      return;
    }

    this.formSubmitted = false;
    this.eForm.get('response').setValue(true);
    this.dialogRef.close(this.eForm.value);
  }

  cancel() {
    this.eForm.get('response').setValue(false);
    this.dialogRef.close(this.eForm.value);
  }

  checkIntern(value: any) {
    this.eForm.get('intern').setValue(value.checked);
  }


}
