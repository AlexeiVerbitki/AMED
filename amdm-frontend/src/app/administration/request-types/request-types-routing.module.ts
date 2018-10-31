import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestTypesComponent } from './request-types.component';

const routes: Routes = [
  {path: '', component: RequestTypesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestTypesRoutingModule { }
