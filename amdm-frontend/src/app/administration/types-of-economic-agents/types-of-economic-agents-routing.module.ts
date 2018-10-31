import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypesOfEconomicAgentsComponent } from './types-of-economic-agents.component';

const routes: Routes = [
  {path: '', component: TypesOfEconomicAgentsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesOfEconomicAgentsRoutingModule { }
