import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternationalMedicamentNameComponent } from './international-medicament-name.component';

const routes: Routes = [
  {path: '', component: InternationalMedicamentNameComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternationalMedicamentNameRoutingModule { }
