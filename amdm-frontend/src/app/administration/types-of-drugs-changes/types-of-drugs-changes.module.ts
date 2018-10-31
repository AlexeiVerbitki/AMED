import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypesOfDrugsChangesRoutingModule } from './types-of-drugs-changes-routing.module';
import { TypesOfDrugsChangesComponent } from './types-of-drugs-changes.component';

@NgModule({
  imports: [
    CommonModule,
    TypesOfDrugsChangesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [TypesOfDrugsChangesComponent]
})
export class TypesOfDrugsChangesModule { }
