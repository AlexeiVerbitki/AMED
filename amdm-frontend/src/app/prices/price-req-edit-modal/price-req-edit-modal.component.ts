import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Observable, Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PriceService} from "../../shared/service/prices.service";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-price-edit-modal',
  templateUrl: './price-req-edit-modal.component.html',
  styleUrls: ['./price-req-edit-modal.component.css']
})
export class PriceReqEditModalComponent implements OnInit {

    steps: any[];
    priceTypes: any[];
    companyMedicaments: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;
    priceReqEntity: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<PriceReqEditModalComponent>,
              private priceService: PriceService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {

      this.steps = data.steps;
      this.priceTypes = data.priceTypes;

      this.priceReqEntity = fb.group(data.request);

      this.priceReqEntity.get('orderApprovDate').setValue(new Date(data.request.orderApprovDate));
      this.priceReqEntity.get('expirationDate').setValue(new Date(data.request.expirationDate));
      console.log('request', this.priceReqEntity.value);
  }

    medChanged(){
      let m = this.priceReqEntity.get('medicament').value;
        this.priceReqEntity.get('medicament').setValue(m.name);
        this.priceReqEntity.get('medicamentCode').setValue(m.code);
    }

  ngOnInit() {
      this.companyMedicaments =
          this.medInputs.pipe(
              filter((result: string) => {
                  if (result && result.length > 2) return true;
              }),
              debounceTime(400),
              distinctUntilChanged(),
              tap((val: string) => {
                  this.medLoading = true;
              }),
              flatMap(term =>
                  this.priceService.getMedicamentNamesAndCodeList(term).pipe(
                      tap(() => this.medLoading = false)
                  )
              )
          );
  }


    save() {
        this.dialogRef.close(this.priceReqEntity.value);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());
    }
}
