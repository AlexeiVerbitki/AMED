import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegCerereComponent} from './reg-cerere/reg-cerere.component';
import {AEvaluareaPrimaraComponent} from './a-evaluarea-primara/a-evaluarea-primara.component';
import {AAnalizaComponent} from './a-analiza/a-analiza.component';
import {AIntrerupereComponent} from './a-intrerupere/a-intrerupere.component';
import {AAprobareComponent} from './a-aprobare/a-aprobare.component';
import {BEvaluarePrimaraComponent} from './b-evaluare-primara/b-evaluare-primara.component';
import {BAprobareComponent} from './b-aprobare/b-aprobare.component';
import {BIntrerupereComponent} from './b-intrerupere/b-intrerupere.component';
import {CNotificareComponent} from './c-notificare/c-notificare.component';

const routes: Routes = [
    { path: 'register', component: RegCerereComponent},
    { path: 'evaluate/:id', component: AEvaluareaPrimaraComponent},
    { path: 'analyze/:id', component: AAnalizaComponent},
    { path: 'interrupt/:id', component: AIntrerupereComponent},
    { path: 'approval/:id', component: AAprobareComponent},
    { path: 'evaluate-amendment/:id', component: BEvaluarePrimaraComponent},
    { path: 'analyze-amendment/:id', component: BEvaluarePrimaraComponent},
    { path: 'interrupt-amendment/:id', component: BIntrerupereComponent},
    { path: 'approval-amendment/:id', component: BAprobareComponent},
    { path: 'notify/:id', component: CNotificareComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicStudiesRoutingModule { }
