import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomsCodesRoutingModule } from './customs-codes-routing.module';
import { CustomCodesComponent } from './custom-codes.component';

@NgModule({
  imports: [
    CommonModule,
    CustomsCodesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ CustomCodesComponent ]
})
export class CustomsCodesModule { }
