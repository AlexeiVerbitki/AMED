import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PriceRegMedComponent} from './price-reg-med/price-reg-med.component';
import {PriceEvaluateMedComponent} from './price-evaluate-med/price-evaluate-med.component';

const routes: Routes = [
    { path: 'register', component: PriceRegMedComponent},
    { path: 'evaluate', component: PriceEvaluateMedComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceRoutingModule { }
