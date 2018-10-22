import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClinicStudiesRoutingModule} from './clinic-studies-routing.module';
import {RegStudCliniceComponent} from "./reg-stud-clinice/reg-stud-clinice.component";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../../material-shared.module";
import {RegCerereComponent} from './reg-cerere/reg-cerere.component';
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import { AEvaluareaPrimaraComponent } from './a-evaluarea-primara/a-evaluarea-primara.component';
import {RequestService} from "../../shared/service/request.service";
import {DocumentModule} from "../../document/document.module";

@NgModule({
    imports: [
        CommonModule,
        ClinicStudiesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        DocumentModule
    ],
    schemas: [],
    declarations: [RegStudCliniceComponent, RegCerereComponent, AEvaluareaPrimaraComponent],

    providers: [UploadFileService,RequestService],
})
export class ClinicStudiesModule {
}
