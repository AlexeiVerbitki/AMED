import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceExpirationReasonsComponent } from './price-expiration-reasons.component';

const routes: Routes = [
  {path: '', component: PriceExpirationReasonsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceExpirationReasonsRoutingModule { }
