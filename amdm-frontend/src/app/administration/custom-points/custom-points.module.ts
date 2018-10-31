import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomPointsRoutingModule } from './custom-points-routing.module';
import { CustomPointsComponent } from './custom-points.component';

@NgModule({
  imports: [
    CommonModule,
    CustomPointsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ CustomPointsComponent ]
})
export class CustomPointsModule { }
