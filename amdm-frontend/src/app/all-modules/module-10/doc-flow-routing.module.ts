import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegDocComponent} from "./reg-doc/reg-doc.component";
import {CanDeactivateGuard} from "../../shared/auth-guard/can-deactivate-guard.service";

const routes: Routes = [
    { path: 'register', component: RegDocComponent, canDeactivate: [CanDeactivateGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocFlowRoutingModule { }
