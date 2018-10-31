import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceExpirationComponent } from './price-expiration.component';

const routes: Routes = [
  {path: '', component: PriceExpirationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceExpirationRoutingModule { }
