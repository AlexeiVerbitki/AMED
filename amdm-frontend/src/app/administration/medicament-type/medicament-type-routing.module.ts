import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicamentTypeComponent } from './medicament-type.component';

const routes: Routes = [
  {path: '', component: MedicamentTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentTypeRoutingModule { }
