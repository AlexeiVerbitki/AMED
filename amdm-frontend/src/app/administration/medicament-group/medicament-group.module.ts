import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicamentGroupRoutingModule } from './medicament-group-routing.module';
import { MedicamentGroupComponent } from './medicament-group.component';

@NgModule({
  imports: [
    CommonModule,
    MedicamentGroupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [MedicamentGroupComponent]
})
export class MedicamentGroupModule { }
