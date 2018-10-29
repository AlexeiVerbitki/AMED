import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ImportAuthorizationRoutingModule} from './import-authorization-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {ImportAuthorizationRequestComponent} from "./import-authorization-request/import-authorization-request.component";
import {MedRegComponent} from './med-reg/med-reg.component';
import {MedNeregComponent} from './med-nereg/med-nereg.component';
import {MateriaPrimaComponent} from './materia-prima/materia-prima.component';
import {AmbalajComponent} from './ambalaj/ambalaj.component';

@NgModule({
    imports: [
        CommonModule,
        ImportAuthorizationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    declarations: [ImportAuthorizationRequestComponent, MedRegComponent, MedNeregComponent, MateriaPrimaComponent, AmbalajComponent]
})
export class ImportAuthorizationModule {
}
