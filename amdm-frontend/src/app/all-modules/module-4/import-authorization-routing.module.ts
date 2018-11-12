import {RouterModule, Routes} from '@angular/router';
import {ImportAuthorizationRequestComponent} from "./import-authorization-request/import-authorization-request.component";
import { MedRegComponent } from './med-reg/med-reg.component';
import { MedNeregComponent } from './med-nereg/med-nereg.component';
import { MateriaPrimaComponent } from './materia-prima/materia-prima.component';
import { AmbalajComponent } from './ambalaj/ambalaj.component';
import {NgModule} from "@angular/core";

const routes: Routes = [
    {path: 'register', component: ImportAuthorizationRequestComponent},
    {path: 'registered-medicament/:id', component: MedRegComponent},
    {path: 'unregistered-medicament/:id', component: MedNeregComponent},
    {path: 'materia-prima/:id', component: MateriaPrimaComponent},
    {path: 'ambalaj/:id', component: AmbalajComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ImportAuthorizationRoutingModule {
}
