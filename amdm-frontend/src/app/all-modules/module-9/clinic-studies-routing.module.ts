import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegStudCliniceComponent} from "./reg-stud-clinice/reg-stud-clinice.component";
import {RegCerereComponent} from "./reg-cerere/reg-cerere.component";
import {AEvaluareaPrimaraComponent} from "./a-evaluarea-primara/a-evaluarea-primara.component";
import {AAnalizaComponent} from "./a-analiza/a-analiza.component";

const routes: Routes = [
    { path: 'register', component: RegCerereComponent},
    { path: 'evaluate/:id', component: AEvaluareaPrimaraComponent},
    { path: 'analiza/:id', component: AAnalizaComponent},
    { path: 'register1', component: RegStudCliniceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicStudiesRoutingModule { }
