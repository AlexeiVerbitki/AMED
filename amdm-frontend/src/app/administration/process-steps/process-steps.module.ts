import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessStepsRoutingModule } from './process-steps-routing.module';
import { ProcessStepsComponent } from './process-steps.component';

@NgModule({
  imports: [
    CommonModule,
    ProcessStepsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ProcessStepsComponent]
})
export class ProcessStepsModule { }
