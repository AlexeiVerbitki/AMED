import {RouterModule, Routes} from '@angular/router';
import {ImportAuthorizationRequestComponent} from "./import-authorization-request/import-authorization-request.component";
import {MedRegComponent} from './med-reg/med-reg.component';
import {MedNeregComponent} from './med-nereg/med-nereg.component';
import {MateriaPrimaComponent} from './materia-prima/materia-prima.component';
import {AmbalajComponent} from './ambalaj/ambalaj.component';
import {NgModule} from "@angular/core";
import {MedRegApproveComponent} from "./med-reg-approve/med-reg-approve.component";

const routes: Routes = [
    {path: 'register', component: ImportAuthorizationRequestComponent},

    {path: 'registered-medicament/:id', component: MedRegComponent},
    {path: 'unregistered-medicament/:id', component: MedRegComponent},

    {path: 'registered-medicament-approve/:id', component: MedRegApproveComponent},
    {path: 'unregistered-medicament-approve/:id', component: MedRegApproveComponent},
    {path: 'materia-prima-approve/:id', component: MedRegApproveComponent},
    {path: 'ambalaj-approve/:id', component: MedRegApproveComponent},

    {path: 'materia-prima/:id', component: AmbalajComponent},
    {path: 'ambalaj/:id', component: AmbalajComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ImportAuthorizationRoutingModule {
}
