import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PharmaceuticalFormTypesRoutingModule } from './pharmaceutical-form-types-routing.module';
import { PharmaceuticalFormTypesComponent } from './pharmaceutical-form-types.component';

@NgModule({
  imports: [
    CommonModule,
    PharmaceuticalFormTypesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [PharmaceuticalFormTypesComponent]
})
export class PharmaceuticalFormTypesModule { }
