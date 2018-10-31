
import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CountryRoutingModule } from './country-routing.module';
import { CountryComponent } from './country.component';

@NgModule({
  imports: [
    CommonModule,
    CountryRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [CountryComponent]
})
export class CountryModule { }
