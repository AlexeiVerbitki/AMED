import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomGroupsComponent } from './custom-groups.component';

const routes: Routes = [
  {path: '', component: CustomGroupsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomGroupsRoutingModule { }
