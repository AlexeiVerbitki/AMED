import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrafficArchiveRoutingModule } from './traffic-archive-routing.module';
import { TrafficArchiveComponent } from './traffic-archive.component';

@NgModule({
  imports: [
    CommonModule,
    TrafficArchiveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [TrafficArchiveComponent]
})
export class TrafficArchiveModule { }
