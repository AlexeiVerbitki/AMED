import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicamentFormsComponent } from './medicament-forms.component';

const routes: Routes = [
  {path: '', component: MedicamentFormsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentFormsRoutingModule { }
