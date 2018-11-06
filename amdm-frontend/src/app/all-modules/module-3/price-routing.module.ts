import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PriceRegMedComponent} from './price-reg-med/price-reg-med.component';
import {PriceEvaluateMedComponent} from './price-evaluate-med/price-evaluate-med.component';

const routes: Routes = [
    { path: 'register', component: PriceRegMedComponent},
    { path: 'register/:id', component: PriceRegMedComponent},
    { path: 'evaluate/:id', component: PriceEvaluateMedComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceRoutingModule { }
