import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocFlowRoutingModule} from './doc-flow-routing.module';
import {MatDialogModule} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../../material-shared.module";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {RegDocComponent} from './reg-doc/reg-doc.component';
import {DocumentModule} from "../../document/document.module";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {RequestService} from "../../shared/service/request.service";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        DocFlowRoutingModule,
        FormsModule,
        DocumentModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
    ],
    declarations: [RegDocComponent],
    providers: [UploadFileService,RequestService]
})
export class DocFlowModule {
}
