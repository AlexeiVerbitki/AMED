import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EvaluarePrimaraComponent} from "./evaluare-primara/evaluare-primara.component";
import {RegCerereComponent} from "./reg-cerere/reg-cerere.component";
import {ProcessInterruptionComponent} from "./process-interruption/process-interruption.component";
import {ExpertiComponent} from "./experti/experti.component";

const routes: Routes = [
    { path: 'register', component: RegCerereComponent},
    { path: 'evaluate/:id', component: EvaluarePrimaraComponent},
    { path: 'interrupt/:id', component: ProcessInterruptionComponent},
    { path: 'expert/:id', component: ExpertiComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentRegistrationRoutingModule { }
