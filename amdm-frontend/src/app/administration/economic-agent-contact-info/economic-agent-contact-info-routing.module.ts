import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EconomicAgentContactInfoComponent } from './economic-agent-contact-info.component';

const routes: Routes = [
  {path: '', component: EconomicAgentContactInfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EconomicAgentContactInfoRoutingModule { }
