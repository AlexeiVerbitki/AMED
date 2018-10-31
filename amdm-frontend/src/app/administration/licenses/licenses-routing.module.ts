import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LicensesComponent } from './licenses.component';

const routes: Routes = [
  {path: '', component: LicensesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicensesRoutingModule { }
