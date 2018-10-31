import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxeComponent } from './taxe.component';

const routes: Routes = [
  {path: '', component: TaxeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxeRoutingModule { }
