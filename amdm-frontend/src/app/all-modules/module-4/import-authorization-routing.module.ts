import {RouterModule, Routes} from '@angular/router';
import {ImportAuthorizationRequestComponent} from "./import-authorization-request/import-authorization-request.component";
import { MedRegComponent } from './med-reg/med-reg.component';
import { MedNeregComponent } from './med-nereg/med-nereg.component';
import { MateriaPrimaComponent } from './materia-prima/materia-prima.component';
import { AmbalajComponent } from './ambalaj/ambalaj.component';
import {NgModule} from "@angular/core";

const routes: Routes = [
    {path: 'register', component: ImportAuthorizationRequestComponent},
    {path: 'registered-medicament', component: MedRegComponent},
    {path: 'unregistered-medicament', component: MedNeregComponent},
    {path: 'materia-prima', component: MateriaPrimaComponent},
    {path: 'ambalaj', component: AmbalajComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ImportAuthorizationRoutingModule {
}
