import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypesOfPharmacyActivityRoutingModule } from './types-of-pharmacy-activity-routing.module';
import { TypesOfPharmacyActivityComponent } from './types-of-pharmacy-activity.component';

@NgModule({
  imports: [
    CommonModule,
    TypesOfPharmacyActivityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [TypesOfPharmacyActivityComponent]
})
export class TypesOfPharmacyActivityModule { }
