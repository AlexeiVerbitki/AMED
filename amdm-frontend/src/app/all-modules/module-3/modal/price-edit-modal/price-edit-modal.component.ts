import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PriceReferenceType} from '../../price-constants';
import {Country} from '../../../../models/country';
import {Currency} from '../../../../models/currency';
import {Subscription} from 'rxjs';
import {PriceService} from '../../../../shared/service/prices.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-price-edit-modal',
  templateUrl: './price-edit-modal.component.html',
  styleUrls: ['./price-edit-modal.component.css']
})
export class PriceEditModalComponent implements OnInit,OnDestroy {
  title = '';
  countries: Country[] = [];
  currencies: Currency[];
  priceEntity: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<PriceEditModalComponent>,
              private priceService: PriceService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data.type.id == PriceReferenceType.ReferenceCountry) {
         this.title = 'Editați prețul țării de referință';
      } else if (data.type.id == PriceReferenceType.OtherCountriesCatalog) {
          this.title = 'Editați prețul țării în care medicamentul este plasat pe piaţă';
      }

      this.priceEntity = fb.group({
          price:              [data.value, Validators.required],
          country:            [data.country, Validators.required],
          currency:           [data.currency, Validators.required],
          division:           [data.division, Validators.required],
          totalQuantity:      [data.totalQuantity, Validators.required],
      });
  }

  ngOnInit() {
      this.subscriptions.push(
          this.priceService.getCountries().subscribe(countriesData => {
                  this.countries = countriesData;
              },
          ));

      this.subscriptions.push(
          this.priceService.getCurrenciesShort().subscribe(currenciesData => {
                  this.currencies = currenciesData;
              },
          ));
  }


    save() {
        this.dialogRef.close(this.priceEntity.value);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());
    }
}
