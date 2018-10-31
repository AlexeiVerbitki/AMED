import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryGroupComponent } from './country-group.component';

const routes: Routes = [
  { path: '', component: CountryGroupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryGroupRoutingModule { }
