import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicamentTypeRoutingModule } from './medicament-type-routing.module';
import { MedicamentTypeComponent } from './medicament-type.component';

@NgModule({
  imports: [
    CommonModule,
    MedicamentTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [MedicamentTypeComponent]
})
export class MedicamentTypeModule { }
