import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubstantaAuxComponent } from './substanta-aux.component';

const routes: Routes = [
  {path: '', component: SubstantaAuxComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubstantaAuxRoutingModule { }
