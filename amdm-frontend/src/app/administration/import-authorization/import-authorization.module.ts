import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportAuthorizationRoutingModule } from './import-authorization-routing.module';
import { ImportAuthorizationComponent } from './import-authorization.component';

@NgModule({
  imports: [
    CommonModule,
    ImportAuthorizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ ImportAuthorizationComponent ]
})
export class ImportAuthorizationModule { }
