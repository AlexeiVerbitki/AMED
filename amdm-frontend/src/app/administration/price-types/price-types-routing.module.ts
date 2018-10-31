import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceTypesComponent } from './price-types.component';

const routes: Routes = [
  {path: '', component: PriceTypesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceTypesRoutingModule { }
