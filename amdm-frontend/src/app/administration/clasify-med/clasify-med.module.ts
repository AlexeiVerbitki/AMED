import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasifyMedRoutingModule } from './clasify-med-routing.module';
import { ClasifyMedComponent } from './clasify-med.component';

@NgModule({
  imports: [
    CommonModule,
    ClasifyMedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ClasifyMedComponent]
})
export class ClasifyMedModule { }
