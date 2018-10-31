import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmaceuticalFormsComponent } from './pharmaceutical-forms.component';

const routes: Routes = [
  {path: '', component: PharmaceuticalFormsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmaceuticalFormsRoutingModule { }
