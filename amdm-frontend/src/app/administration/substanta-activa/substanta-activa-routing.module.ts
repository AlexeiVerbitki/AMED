import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubstantaActivaComponent } from './substanta-activa.component';

const routes: Routes = [
  {path: '', component: SubstantaActivaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubstantaActivaRoutingModule { }
