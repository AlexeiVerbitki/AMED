import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrafficArchiveComponent } from './traffic-archive.component';

const routes: Routes = [
  {path: '', component: TrafficArchiveComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrafficArchiveRoutingModule { }
