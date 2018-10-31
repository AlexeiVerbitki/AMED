import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceExpirationReasonsRoutingModule } from './price-expiration-reasons-routing.module';
import { PriceExpirationReasonsComponent } from './price-expiration-reasons.component';

@NgModule({
  imports: [
    CommonModule,
    PriceExpirationReasonsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ PriceExpirationReasonsComponent]
})
export class PriceExpirationReasonsModule { }
