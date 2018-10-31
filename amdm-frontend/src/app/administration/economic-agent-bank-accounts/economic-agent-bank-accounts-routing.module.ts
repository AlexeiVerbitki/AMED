import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EconomicAgentBankAccountsComponent } from './economic-agent-bank-accounts.component';

const routes: Routes = [
  {path: '', component: EconomicAgentBankAccountsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EconomicAgentBankAccountsRoutingModule { }
