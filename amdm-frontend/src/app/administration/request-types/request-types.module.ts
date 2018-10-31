import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestTypesRoutingModule } from './request-types-routing.module';
import { RequestTypesComponent } from './request-types.component';

@NgModule({
  imports: [
    CommonModule,
    RequestTypesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [RequestTypesComponent]
})
export class RequestTypesModule { }
