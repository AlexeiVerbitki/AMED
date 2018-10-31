import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceTypesRoutingModule } from './price-types-routing.module';
import { PriceTypesComponent } from './price-types.component';

@NgModule({
  imports: [
    CommonModule,
    PriceTypesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [PriceTypesComponent]
})
export class PriceTypesModule { }
