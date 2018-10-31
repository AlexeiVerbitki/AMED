import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceExpirationRoutingModule } from './price-expiration-routing.module';
import { PriceExpirationComponent } from './price-expiration.component';

@NgModule({
  imports: [
    CommonModule,
    PriceExpirationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [PriceExpirationComponent]
})
export class PriceExpirationModule { }
