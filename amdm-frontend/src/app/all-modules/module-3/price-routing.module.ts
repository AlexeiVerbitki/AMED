import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PriceRegMedComponent} from './price-reg-med/price-reg-med.component';
import {PriceEvaluateMedComponent} from './price-evaluate-med/price-evaluate-med.component';
import {RevaluationGenericsComponent} from "./revaluation-generics/revaluation-generics.component";

const routes: Routes = [
    { path: 'register', component: PriceRegMedComponent},
    // { path: 'auto-revaluation', component: PriceAutoRevaluationComponent},
    { path: 'register/:id', component: PriceRegMedComponent},
    { path: 'evaluate/:id', component: PriceEvaluateMedComponent},
    { path: 'revaluation-generics/:id', component: RevaluationGenericsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceRoutingModule { }
