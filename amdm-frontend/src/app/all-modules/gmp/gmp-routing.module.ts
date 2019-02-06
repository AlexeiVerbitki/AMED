import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EvaluarePrimaraGmpComponent} from './evaluare-primara-gmp/evaluare-primara-gmp.component';
import {RegCerereGmpComponent} from './reg-cerere-gmp/reg-cerere-gmp.component';
import {ProcessInterruptionComponent} from './process-interruption/process-interruption.component';
import {CanDeactivateGuard} from '../../shared/auth-guard/can-deactivate-guard.service';

const routes: Routes = [
    { path: 'register', component: RegCerereGmpComponent,  canDeactivate: [CanDeactivateGuard]},
    { path: 'evaluate/:id', component: EvaluarePrimaraGmpComponent,  canDeactivate: [CanDeactivateGuard]},
    { path: 'interrupt/:id', component: ProcessInterruptionComponent,  canDeactivate: [CanDeactivateGuard]}
] ;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GmpRoutingModule { }
