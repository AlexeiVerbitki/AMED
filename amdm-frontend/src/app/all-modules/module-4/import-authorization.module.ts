import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ImportAuthorizationRoutingModule} from './import-authorization-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {ImportAuthorizationEvaluateComponent} from './import-authorization-evaluate/import-authorization-evaluate.component';
import {ImportAuthorizationRequestComponent} from './import-authorization-request/import-authorization-request.component';
import {MedRegComponent} from './med-reg/med-reg.component';
import {AmbalajComponent} from './ambalaj/ambalaj.component';
import {DocumentModule} from '../../document/document.module';
import {ImportMedDialogComponent} from './dialog/import-med-dialog.component';
import {XchangeinfoModule} from '../../xchangeInfo/xchangeinfo.module';
import {ImportManagement} from './import-management/import-management';
import {ImportManagementDialog} from './import-management/import-management-dialog/import-management-dialog';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {MedRegApproveComponent} from './med-reg-approve/med-reg-approve.component';
import {RequestService} from '../../shared/service/request.service';
import {AuthorizationsTable} from "./Authorizations table/authorizations-table";
import {ViewAuthorizationComponent} from "./Authorizations table/view-authorization/view-authorization.component";
import {ViewAuthorizationDialog} from "./Authorizations table/view-authorization-dialog/view-authorization-dialog";


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
        ImportMedDialogComponent, ImportManagementDialog, ViewAuthorizationDialog
    ],
    declarations: [ImportAuthorizationEvaluateComponent, ImportAuthorizationRequestComponent,
        MedRegComponent, AmbalajComponent,
        MedRegApproveComponent, ImportMedDialogComponent, ImportManagement, ImportManagementDialog,
        AuthorizationsTable, ViewAuthorizationComponent, ViewAuthorizationDialog ],
    providers: [UploadFileService, RequestService]
})
export class ImportAuthorizationModule {
}
