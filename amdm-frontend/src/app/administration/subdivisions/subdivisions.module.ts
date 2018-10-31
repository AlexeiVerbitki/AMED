import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubdivisionsRoutingModule } from './subdivisions-routing.module';
import { SubdivisionsComponent } from './subdivisions.component';

@NgModule({
  imports: [
    CommonModule,
    SubdivisionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [SubdivisionsComponent]
})
export class SubdivisionsModule { }
