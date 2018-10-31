import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EconomicAgentBankAccountsRoutingModule } from './economic-agent-bank-accounts-routing.module';
import { EconomicAgentBankAccountsComponent } from './economic-agent-bank-accounts.component';

@NgModule({
  imports: [
    CommonModule,
    EconomicAgentBankAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ EconomicAgentBankAccountsComponent ]
})
export class EconomicAgentBankAccountsModule { }
