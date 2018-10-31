import { CountryGroupComponent } from './country-group.component';
import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CountryGroupRoutingModule } from './country-group-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CountryGroupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ CountryGroupComponent ]
})
export class CountryGroupModule { }
