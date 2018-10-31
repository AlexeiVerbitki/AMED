import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EconomicAgentsComponent } from './economic-agents.component';

const routes: Routes = [
  {path: '', component: EconomicAgentsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EconomicAgentsRoutingModule { }
