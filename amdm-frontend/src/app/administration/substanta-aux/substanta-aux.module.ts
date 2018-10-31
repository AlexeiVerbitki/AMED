import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubstantaAuxRoutingModule } from './substanta-aux-routing.module';
import { SubstantaAuxComponent } from './substanta-aux.component';

@NgModule({
  imports: [
    CommonModule,
    SubstantaAuxRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [SubstantaAuxComponent]
})
export class SubstantaAuxModule { }
