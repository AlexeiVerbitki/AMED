
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClasificareaTipMedComponent } from './clasificarea-tip-med.component';

const routes: Routes = [
  { path: '', component: ClasificareaTipMedComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasificareaTipMedRoutingModule { }
