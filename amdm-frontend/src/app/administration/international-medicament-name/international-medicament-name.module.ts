import { MaterialSharedModule } from 'src/app/material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternationalMedicamentNameRoutingModule } from './international-medicament-name-routing.module';
import { InternationalMedicamentNameComponent } from './international-medicament-name.component';


@NgModule({
  imports: [
    CommonModule,
    InternationalMedicamentNameRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [InternationalMedicamentNameComponent]
})
export class InternationalMedicamentNameModule { }
