import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypesOfEconomicAgentsRoutingModule } from './types-of-economic-agents-routing.module';
import { TypesOfEconomicAgentsComponent } from './types-of-economic-agents.component';

@NgModule({
  imports: [
    CommonModule,
    TypesOfEconomicAgentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [TypesOfEconomicAgentsComponent]
})
export class TypesOfEconomicAgentsModule { }
