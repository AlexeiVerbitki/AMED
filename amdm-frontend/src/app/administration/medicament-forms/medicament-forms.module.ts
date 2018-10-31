import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicamentFormsRoutingModule } from './medicament-forms-routing.module';
import { MedicamentFormsComponent } from './medicament-forms.component';

@NgModule({
  imports: [
    CommonModule,
    MedicamentFormsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [MedicamentFormsComponent]
})
export class MedicamentFormsModule { }
