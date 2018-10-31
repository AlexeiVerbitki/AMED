import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManufacturesRoutingModule } from './manufactures-routing.module';
import { ManufacturesComponent } from './manufactures.component';

@NgModule({
  imports: [
    CommonModule,
    ManufacturesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ ManufacturesComponent]
})
export class ManufacturesModule { }
