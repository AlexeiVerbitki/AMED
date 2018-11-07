import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ImportAuthorizationRoutingModule} from './import-authorization-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {ImportAuthorizationEvaluateComponent} from "./import-authorization-evaluate/import-authorization-evaluate.component";
import {ImportAuthorizationRequestComponent} from "./import-authorization-request/import-authorization-request.component";
import { MedRegComponent } from './med-reg/med-reg.component';
import { MedNeregComponent } from './med-nereg/med-nereg.component';
import { MateriaPrimaComponent } from './materia-prima/materia-prima.component';
import { AmbalajComponent } from './ambalaj/ambalaj.component';
import {RegCerereComponent} from "../module-1/reg-cerere/reg-cerere.component";
import {ProcessInterruptionComponent} from "../module-1/process-interruption/process-interruption.component";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {RequestService} from "../../shared/service/request.service";
import {DocumentComponent} from "../../document/document.component";

@NgModule({
    imports: [
        CommonModule,
        ImportAuthorizationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    declarations: [ImportAuthorizationEvaluateComponent,ImportAuthorizationRequestComponent, MedRegComponent, MedNeregComponent, MateriaPrimaComponent, AmbalajComponent, DocumentComponent ],
    providers: [UploadFileService,RequestService]
})
export class ImportAuthorizationModule {
}
