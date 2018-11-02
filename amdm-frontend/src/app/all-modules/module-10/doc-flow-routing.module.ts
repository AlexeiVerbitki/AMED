import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegDocComponent} from "./reg-doc/reg-doc.component";

const routes: Routes = [
    { path: 'register', component: RegDocComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocFlowRoutingModule { }
