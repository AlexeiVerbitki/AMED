import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EvaluarePrimaraComponent} from './evaluare-primara/evaluare-primara.component';
import {RegCerereComponent} from './reg-cerere/reg-cerere.component';
import {ProcessInterruptionComponent} from './process-interruption/process-interruption.component';
import {ExpertiComponent} from './experti/experti.component';
import {CanDeactivateGuard} from '../../shared/auth-guard/can-deactivate-guard.service';

const routes: Routes = [
    { path: 'register', component: RegCerereComponent,  canDeactivate: [CanDeactivateGuard]},
    { path: 'evaluate/:id', component: EvaluarePrimaraComponent,  canDeactivate: [CanDeactivateGuard]},
    { path: 'interrupt/:id', component: ProcessInterruptionComponent,  canDeactivate: [CanDeactivateGuard]},
    { path: 'expert/:id', component: ExpertiComponent,  canDeactivate: [CanDeactivateGuard]}
] ;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentRegistrationRoutingModule { }
