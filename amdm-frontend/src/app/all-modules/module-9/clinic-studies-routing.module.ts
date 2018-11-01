import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegStudCliniceComponent} from "./reg-stud-clinice/reg-stud-clinice.component";
import {RegCerereComponent} from "./reg-cerere/reg-cerere.component";
import {AEvaluareaPrimaraComponent} from "./a-evaluarea-primara/a-evaluarea-primara.component";
import {AAnalizaComponent} from "./a-analiza/a-analiza.component";
import {AIntrerupereComponent} from "./a-intrerupere/a-intrerupere.component";
import {AAprobareComponent} from "./a-aprobare/a-aprobare.component";

const routes: Routes = [
    { path: 'register', component: RegCerereComponent},
    { path: 'evaluate/:id', component: AEvaluareaPrimaraComponent},
    { path: 'analize/:id', component: AAnalizaComponent},
    { path: 'interrupt/:id', component: AIntrerupereComponent},
    { path: 'approval/:id', component: AAprobareComponent},
    { path: 'register1', component: RegStudCliniceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicStudiesRoutingModule { }
