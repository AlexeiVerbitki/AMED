import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable, Subject, Subscription} from 'rxjs';
import {AdministrationService} from '../../shared/service/administration.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-add-manufacture',
  templateUrl: './add-manufacture.component.html',
  styleUrls: ['./add-manufacture.component.css']
})
export class AddManufactureComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  aForm: FormGroup;
  //manufactures: any[];
  //loadingManufacture = false;
  formSubmitted: boolean;
  wasManufactureAdded = false;
  manufacturesAsync: Observable<any[]>;
  loadingManufactureAsync = false;
  manufacturesInputsAsync = new Subject<string>();

  constructor(    private fb: FormBuilder,
                  public dialogRef: MatDialogRef<AddManufactureComponent>,
                  @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                  private administrationService: AdministrationService) {
    this.aForm = fb.group({
      'manufacture': [null, Validators.required],
      'manufactureCountry': [null],
      'manufactureAddress': [null],
      'comment': [null],
      'response' : [null]
    });
  }

  ngOnInit() {
    this.manufacturesAsync =
        this.manufacturesInputsAsync.pipe(
            filter((result: string) => {
              if (result && result.length > 0) {
                return true;
              }
            }),
            debounceTime(400),
            distinctUntilChanged(),
            tap((val: string) => {
              this.loadingManufactureAsync = true;

            }),
            flatMap(term =>
                this.administrationService.getManufacturersByName(term).pipe(
                    tap(() => this.loadingManufactureAsync = false)
                )
            )
        );
  }

  checkActiveSubstanceManufacture() {
    if (this.aForm.get('manufacture').value == null) {
      return;
    }

    this.wasManufactureAdded = false;
    // const test = this.dataDialog.manufacturesTable.find(r => r.manufacture.id == this.aForm.get('manufacture').value.id);
    // if (test) {
    //    this.wasManufactureAdded = true;
    // }

    this.aForm.get('manufactureCountry').setValue(this.aForm.get('manufacture').value.country.description);
    this.aForm.get('manufactureAddress').setValue(this.aForm.get('manufacture').value.address);
  }

  add() {
    this.formSubmitted = true;

    if (this.aForm.invalid || this.wasManufactureAdded) {
      return;
    }

    this.formSubmitted = false;
    this.aForm.get('response').setValue(true);
    this.dialogRef.close(this.aForm.value);
  }

  cancel() {
    this.aForm.get('response').setValue(false);
    this.dialogRef.close(this.aForm.value);
  }

}
