import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalitiesRoutingModule } from './localities-routing.module';
import { LocalitiesComponent } from './localities.component';

@NgModule({
  imports: [
    CommonModule,
    LocalitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ LocalitiesComponent]
})
export class LocalitiesModule { }
