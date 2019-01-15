import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocFlowRoutingModule} from './doc-flow-routing.module';
import {MatDialogModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialSharedModule} from '../../material-shared.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {RegDocComponent} from './reg-doc/reg-doc.component';
import {DocumentModule} from '../../document/document.module';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {RequestService} from '../../shared/service/request.service';
import {CanDeactivateGuard} from '../../shared/auth-guard/can-deactivate-guard.service';
import { EvaluateDocComponent } from './evaluate-doc/evaluate-doc.component';
import { EvaluateModalComponent } from './modal/evaluate-modal/evaluate-modal.component';

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
    entryComponents: [EvaluateModalComponent],
    declarations: [RegDocComponent, EvaluateDocComponent, EvaluateModalComponent],
    providers: [UploadFileService, RequestService, CanDeactivateGuard]
})
export class DocFlowModule {
}
