import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ImportAuthorizationRoutingModule} from './import-authorization-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {ImportAuthorizationEvaluateComponent} from "./import-authorization-evaluate/import-authorization-evaluate.component";
import {ImportAuthorizationRequestComponent} from "./import-authorization-request/import-authorization-request.component";

@NgModule({
    imports: [
        CommonModule,
        ImportAuthorizationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    declarations: [ImportAuthorizationEvaluateComponent,ImportAuthorizationRequestComponent]
})
export class ImportAuthorizationModule {
}
