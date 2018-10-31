import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubstantaActivaRoutingModule } from './substanta-activa-routing.module';
import { SubstantaActivaComponent } from './substanta-activa.component';

@NgModule({
  imports: [
    CommonModule,
    SubstantaActivaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [SubstantaActivaComponent]
})
export class SubstantaActivaModule { }
