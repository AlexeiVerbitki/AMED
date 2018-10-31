import { MaterialSharedModule } from '../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CessationReasonsRoutingModule } from './cessation-reasons-routing.module';
import { CessationReasonsComponent } from './cessation-reasons.component';

@NgModule({
  imports: [
    CommonModule,
    CessationReasonsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [CessationReasonsComponent]
})
export class CessationReasonsModule { }
