import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmaceuticalFormTypesComponent } from './pharmaceutical-form-types.component';

const routes: Routes = [
  {path: '', component: PharmaceuticalFormTypesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmaceuticalFormTypesRoutingModule { }
