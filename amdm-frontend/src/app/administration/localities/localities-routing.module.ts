import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalitiesComponent } from './localities.component';

const routes: Routes = [
  {path: '', component: LocalitiesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalitiesRoutingModule { }
