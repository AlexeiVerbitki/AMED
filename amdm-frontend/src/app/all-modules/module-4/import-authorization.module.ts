import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ImportAuthorizationRoutingModule} from './import-authorization-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {DocumentComponent} from "../../document/document.component";
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
import {DocumentModule} from "../../document/document.module";
import {MedRegApproveComponent} from "./med-reg-approve/med-reg-approve.component";
import {ImportMedDialog} from "./dialog/import-med-dialog";
import {MedInstInvestigatorsDialogComponent} from "../module-9/dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component";
import {AdditionalDataDialogComponent} from "../module-9/dialog/additional-data-dialog/additional-data-dialog.component";
import {XchangeinfoModule} from "../../xchangeInfo/xchangeinfo.module";
import {ImportManagement} from "./import-management/import-management";
import {ImportManagementDialog} from "./import-management/import-management-dialog/import-management-dialog";


@NgModule({
    imports: [
        CommonModule,
        ImportAuthorizationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DocumentModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        XchangeinfoModule
    ],
    entryComponents: [
       ImportMedDialog, ImportManagementDialog
    ],
    declarations: [ImportAuthorizationEvaluateComponent,ImportAuthorizationRequestComponent,
                    MedRegComponent, MedNeregComponent, MateriaPrimaComponent, AmbalajComponent,
                    MedRegApproveComponent, ImportMedDialog, ImportManagement, ImportManagementDialog],
    providers: [UploadFileService,RequestService]
})
export class ImportAuthorizationModule {
}
