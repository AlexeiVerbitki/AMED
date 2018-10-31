import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EconomicAgentsRoutingModule } from './economic-agents-routing.module';
import { EconomicAgentsComponent } from './economic-agents.component';

@NgModule({
  imports: [
    CommonModule,
    EconomicAgentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ EconomicAgentsComponent]
})
export class EconomicAgentsModule { }
