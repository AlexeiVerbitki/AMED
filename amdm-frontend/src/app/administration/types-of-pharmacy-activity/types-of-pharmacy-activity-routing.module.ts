import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypesOfPharmacyActivityComponent } from './types-of-pharmacy-activity.component';

const routes: Routes = [
  {path: '', component: TypesOfPharmacyActivityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesOfPharmacyActivityRoutingModule { }
