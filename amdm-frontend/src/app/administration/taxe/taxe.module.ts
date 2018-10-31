import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxeRoutingModule } from './taxe-routing.module';
import { FormsModule } from '@angular/forms';
import { TaxeComponent } from './taxe.component';

@NgModule({
  imports: [
    CommonModule,
    TaxeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [TaxeComponent]
})
export class TaxeModule { }
