import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RequestService} from '../../shared/service/request.service';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {MatDialogModule} from '@angular/material';
import {DocumentModule} from '../../document/document.module';
import {RegCerereComponent} from "./reg-cerere/reg-cerere.component";
import {GDPRoutingModule} from "./gdp-routing.module";

@NgModule({
    imports: [
        CommonModule,
        GDPRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        DocumentModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    schemas: [],
    declarations: [
        RegCerereComponent
    ],
    providers: [UploadFileService, RequestService],

})
export class GDPModule {
}
