import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EconomicAgentContactInfoRoutingModule } from './economic-agent-contact-info-routing.module';
import { EconomicAgentContactInfoComponent } from './economic-agent-contact-info.component';

@NgModule({
  imports: [
    CommonModule,
    EconomicAgentContactInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ EconomicAgentContactInfoComponent ]
})
export class EconomicAgentContactInfoModule { }
