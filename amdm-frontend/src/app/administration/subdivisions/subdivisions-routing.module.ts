import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubdivisionsComponent } from './subdivisions.component';

const routes: Routes = [
  {path: '', component: SubdivisionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubdivisionsRoutingModule { }
