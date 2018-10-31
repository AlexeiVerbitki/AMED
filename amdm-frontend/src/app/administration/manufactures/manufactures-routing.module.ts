import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManufacturesComponent } from './manufactures.component';

const routes: Routes = [
  {path: '', component: ManufacturesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManufacturesRoutingModule { }
