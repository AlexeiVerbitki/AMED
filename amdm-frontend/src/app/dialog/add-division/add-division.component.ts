import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdministrationService} from '../../shared/service/administration.service';

@Component({
  selector: 'app-add-division',
  templateUrl: './add-division.component.html',
  styleUrls: ['./add-division.component.css']
})
export class AddDivisionComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  dForm: FormGroup;
  volumeUnitsOfMeasurement: any[];
  formSubmitted: boolean;
  wasDivisionAdded: boolean;
  wasVolumeAdded: boolean;
  maxDate = new Date();

  constructor(    private fb: FormBuilder,
                  public dialogRef: MatDialogRef<AddDivisionComponent>,
                  @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                  private administrationService: AdministrationService) {
    this.dForm = fb.group({
      'volumeQuantityMeasurement': [null],
      'volume': [null],
      'division': [null],
      'samplesNumber' : [null],
      'serialNr' : [null],
      'samplesExpirationDate' : [null],
      'response' : [null]
    });

    this.dForm.get('division').valueChanges.subscribe(
        r => {
         this.wasDivisionAdded = false;
        }
    );
    this.dForm.get('volume').valueChanges.subscribe(
        r => {
          this.wasVolumeAdded = false;
        }
    );
    this.dForm.get('volumeQuantityMeasurement').valueChanges.subscribe(
        r => {
          this.wasVolumeAdded = false;
        }
    );
  }

  ngOnInit() {
    this.subscriptions.push(
        this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
              this.volumeUnitsOfMeasurement = data;
              if (!this.dataDialog.divisions) {
                this.dForm.get('volumeQuantityMeasurement').setValue(this.dataDialog.division.volumeQuantityMeasurement);
                this.dForm.get('volume').setValue(this.dataDialog.division.volume);
                this.dForm.get('division').setValue(this.dataDialog.division.description);
                this.dForm.get('samplesNumber').setValue(this.dataDialog.division.samplesNumber);
                this.dForm.get('serialNr').setValue(this.dataDialog.division.serialNr);
                this.dForm.get('samplesExpirationDate').setValue(this.dataDialog.division.samplesExpirationDate);
                if(this.dataDialog.disabledMainFields) {
                    this.dForm.get('volumeQuantityMeasurement').disable();
                    this.dForm.get('volume').disable();
                    this.dForm.get('division').disable();
                }
              }
            },
            error => console.log(error)
        )
    );
  }

  add() {
    this.formSubmitted = true;

    if (this.dataDialog.divisions && this.dForm.get('division').value && this.dataDialog.divisions.find(t => t.division == this.dForm.get('division').value)) {
      this.wasDivisionAdded = true;
      return;
    }

    if (this.dataDialog.divisions && this.dForm.get('volume').value && this.dForm.get('volumeQuantityMeasurement').value &&
        this.dataDialog.divisions.find(t => t.volume == this.dForm.get('volume').value && t.volumeQuantityMeasurement == this.dForm.get('volumeQuantityMeasurement').value)) {
      this.wasVolumeAdded = true;
      return;
    }

    if (!this.dForm.get('volume').value && !this.dForm.get('volumeQuantityMeasurement').value && !this.dForm.get('division').value) {
      return;
    }

    if ((this.dForm.get('volume').value && !this.dForm.get('volumeQuantityMeasurement').value)
        || (!this.dForm.get('volume').value && this.dForm.get('volumeQuantityMeasurement').value)) {
      return;
    }

    this.formSubmitted = false;
    this.dForm.get('response').setValue(true);
    this.dialogRef.close(this.dForm.value);
  }

  cancel() {
    this.dForm.get('response').setValue(false);
    this.dialogRef.close(this.dForm.value);
  }


}
