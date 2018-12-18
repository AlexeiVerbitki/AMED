import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PriceRegMedComponent} from './price-reg-med/price-reg-med.component';
import {PriceEvaluateMedComponent} from './price-evaluate-med/price-evaluate-med.component';
import {RevaluationGenericsComponent} from "./revaluation-generics/revaluation-generics.component";
import {PriceRegCerereComponent} from "./price-reg-cerere/price-reg-cerere.component";

const routes: Routes = [
    { path: 'reg-cerere', component: PriceRegCerereComponent},
    { path: 'register', component: PriceRegMedComponent},
    // { path: 'auto-revaluation', component: PriceAutoRevaluationComponent},
    // { path: 'register/:id', component: PriceRegMedComponent},
    { path: 'evaluate/:id', component: PriceEvaluateMedComponent},
    { path: 'revaluation-generics/:id', component: RevaluationGenericsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceRoutingModule { }
