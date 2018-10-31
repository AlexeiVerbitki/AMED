import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypesOfDrugsChangesComponent } from './types-of-drugs-changes.component';

const routes: Routes = [
  {path: '', component: TypesOfDrugsChangesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesOfDrugsChangesRoutingModule { }
