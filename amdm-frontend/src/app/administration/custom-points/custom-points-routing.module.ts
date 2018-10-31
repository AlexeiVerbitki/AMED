import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomPointsComponent } from './custom-points.component';

const routes: Routes = [
  { path: '', component: CustomPointsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPointsRoutingModule { }
