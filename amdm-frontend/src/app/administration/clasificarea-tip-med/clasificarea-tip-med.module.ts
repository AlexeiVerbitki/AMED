
import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificareaTipMedRoutingModule } from './clasificarea-tip-med-routing.module';
import { ClasificareaTipMedComponent } from './clasificarea-tip-med.component';

@NgModule({
  imports: [
    CommonModule,
    ClasificareaTipMedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ClasificareaTipMedComponent]
})
export class ClasificareaTipMedModule { }
