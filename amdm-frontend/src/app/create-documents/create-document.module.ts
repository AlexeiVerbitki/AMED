import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CreateDocumentRoutingModule} from './create-document-routing.module';
import {DdCtListComponent} from './generate-documents/dd-ct-list/dd-ct-list.component';
import {RequestsOiComponent} from './generate-documents/requests-oi/requests-oi.component';
import {OiModifyListComponent} from './generate-documents/oi-modify-list/oi-modify-list.component';
import {RequestsOiModifyComponent} from './generate-documents/requests-oi-modify/requests-oi-modify.component';
import {SelectIssueDateDialogComponent} from '../dialog/select-issue-date-dialog/select-issue-date-dialog.component';
import {OaListComponent} from './generate-documents/oa-list/oa-list.component';
import {DdListComponent} from './generate-documents/dd-list/dd-list.component';
import {OmListComponent} from './generate-documents/om-list/om-list.component';
import {RequestsDdComponent} from './generate-documents/requests-dd/requests-dd.component';
import {OiListComponent} from './generate-documents/oi-list/oi-list.component';
import {MedicamentsOaComponent} from './generate-documents/medicaments-oa/medicaments-oa.component';
import {LmpcModifyListComponent} from './generate-documents/lmpc-modify-list/lmpc-modify-list.component';
import {GenerateDocumentsComponent} from './generate-documents/generate-documents.component';
import {DdModifyListComponent} from './generate-documents/dd-modify-list/dd-modify-list.component';
import {RequestDdCtComponent} from './generate-documents/request-dd-ct/request-dd-ct.component';
import {MedicamentsOmComponent} from './generate-documents/medicaments-om/medicaments-om.component';
import {RequestsDdModifyComponent} from './generate-documents/requests-dd-modify/requests-dd-modify.component';
import {LmpcListComponent} from './generate-documents/lmpc-list/lmpc-list.component';
import {ManagementRoutingModule} from '../management/management-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../material-shared.module';
import {PipeModule} from '../shared/pipe/pipe.module';
import {DocumentModule} from '../document/document.module';
import {XchangeinfoModule} from '../xchangeInfo/xchangeinfo.module';
import { DdCtAmendListComponent } from './generate-documents/dd-ct-amend-list/dd-ct-amend-list.component';
import { RequestDdCtAmendComponent } from './generate-documents/request-dd-ct-amend/request-dd-ct-amend.component';

@NgModule({
    imports: [
        CommonModule,
        CreateDocumentRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        PipeModule,
        DocumentModule,
        XchangeinfoModule
    ],
    declarations: [
        DdListComponent,
        OaListComponent,
        GenerateDocumentsComponent,
        OaListComponent,
        RequestsDdComponent,
        MedicamentsOaComponent,
        SelectIssueDateDialogComponent,
        RequestsOiComponent,
        OiListComponent,
        DdModifyListComponent,
        MedicamentsOmComponent,
        OmListComponent,
        OiModifyListComponent,
        RequestsDdModifyComponent,
        RequestsOiModifyComponent,
        DdCtListComponent,
        RequestDdCtComponent,
        LmpcListComponent,
        LmpcModifyListComponent,
        DdCtAmendListComponent,
        RequestDdCtAmendComponent],
    entryComponents: [SelectIssueDateDialogComponent],
    providers: [DdListComponent, OaListComponent],
})
export class CreateDocumentModule {
}
