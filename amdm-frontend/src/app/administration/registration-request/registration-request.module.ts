import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRequestRoutingModule } from './registration-request-routing.module';
import { RegistrationRequestComponent } from './registration-request.component';

@NgModule({
  imports: [
    CommonModule,
    RegistrationRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [RegistrationRequestComponent]
})
export class RegistrationRequestModule { }
