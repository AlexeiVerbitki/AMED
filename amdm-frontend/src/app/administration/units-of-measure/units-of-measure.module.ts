import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitsOfMeasureRoutingModule } from './units-of-measure-routing.module';
import { UnitsOfMeasureComponent } from './units-of-measure.component';

@NgModule({
  imports: [
    CommonModule,
    UnitsOfMeasureRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [UnitsOfMeasureComponent]
})
export class UnitsOfMeasureModule { }
