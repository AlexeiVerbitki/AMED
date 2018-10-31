import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicamentGroupComponent } from './medicament-group.component';

const routes: Routes = [
  {path: '', component: MedicamentGroupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentGroupRoutingModule { }
