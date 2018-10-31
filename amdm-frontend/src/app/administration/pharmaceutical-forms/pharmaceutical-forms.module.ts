import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PharmaceuticalFormsRoutingModule } from './pharmaceutical-forms-routing.module';
import { PharmaceuticalFormsComponent } from './pharmaceutical-forms.component';

@NgModule({
  imports: [
    CommonModule,
    PharmaceuticalFormsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [PharmaceuticalFormsComponent]
})
export class PharmaceuticalFormsModule { }
