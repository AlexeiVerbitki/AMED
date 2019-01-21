import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManagementRoutingModule} from './management-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../material-shared.module';
import {LicenseManagementComponent} from './license/license-management/license-management.component';
import {MedicamentsComponent} from './medicaments/medicaments.component';
import {ReceiptsComponent} from './receipts/receipts.component';
import {AddReceiptDialogComponent} from '../dialog/add-receipt-dialog/add-receipt-dialog.component';
import {PriceAutoRevaluationComponent} from './price-auto-revaluation/price-auto-revaluation.component';
import {PipeModule} from '../shared/pipe/pipe.module';
import {DocumentModule} from '../document/document.module';
import {PricesComponent} from './prices/prices.component';
import {PriceReqEditModalComponent} from './prices/price-req-edit-modal/price-req-edit-modal.component';
import {MatDialogModule} from '@angular/material';
import {XchangeinfoModule} from '../xchangeInfo/xchangeinfo.module';
import {PriceApprovalComponent} from './price-approval/price-approval.component';
import {LicenseService} from '../shared/service/license/license.service';
import {AdministrationService} from '../shared/service/administration.service';
import {LicenseDetailsComponent} from './license/license-details/license-details.component';
import {UploadFileService} from '../shared/service/upload/upload-file.service';
import {DrugAuthorizationDetailsDialogComponent} from '../dialog/drug-authorization-details-dialog/drug-authorization-details-dialog.component';
import {CPCADTaskComponent} from '../all-modules/module-7/cpcadtask/cpcadtask.component';
import {ClinicalTrialsComponent} from './clinical-trials/clinical-trials.component';
import {ClinicalTrialService} from '../shared/service/clinical-trial.service';
import {ClinicalTrialsDetailsComponent} from './clinical-trials/dialog/clinical-trials-details/clinical-trials-details.component';
import {AnnihilationDetailsComponent} from './annihilation/annihilation-details/annihilation-details.component';
import {AnnihilationManagementComponent} from './annihilation/annihilation-management/annihilation-management.component';
import {AnnihilationService} from '../shared/service/annihilation/annihilation.service';
import {MedicamentService} from '../shared/service/medicament.service';
import {AmendmentDetailsComponent} from './clinical-trials/dialog/amendment-details/amendment-details.component';
import {GenerateDocumentsComponent} from './generate-documents/generate-documents.component';
import {DdListComponent} from './generate-documents/dd-list/dd-list.component';
import {OaListComponent} from './generate-documents/oa-list/oa-list.component';
import {RequestsDdComponent} from './generate-documents/requests-dd/requests-dd.component';
import {MedicamentsOaComponent} from './generate-documents/medicaments-oa/medicaments-oa.component';
import {SelectIssueDateDialogComponent} from '../dialog/select-issue-date-dialog/select-issue-date-dialog.component';
import {RequestsOiComponent} from './generate-documents/requests-oi/requests-oi.component';
import {OiListComponent} from './generate-documents/oi-list/oi-list.component';
import {NotificationDetailslsComponent} from './clinical-trials/dialog/notification-detailsls/notification-detailsls.component';
import {DdModifyListComponent} from './generate-documents/dd-modify-list/dd-modify-list.component';
import {MedicamentsOmComponent} from './generate-documents/medicaments-om/medicaments-om.component';
import {OmListComponent} from './generate-documents/om-list/om-list.component';
import {OiModifyListComponent} from './generate-documents/oi-modify-list/oi-modify-list.component';
import {RequestsDdModifyComponent} from './generate-documents/requests-dd-modify/requests-dd-modify.component';
import {RequestsOiModifyComponent} from './generate-documents/requests-oi-modify/requests-oi-modify.component';
import {LicenseHistoryDialogComponent} from './license/license-history-dialog/license-history-dialog.component';
import {LicenseHistoryDetailComponent} from './license/license-history-detail/license-history-detail.component';
import {SelectDocumentNumberComponent} from "../dialog/select-document-number/select-document-number.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DdCtListComponent} from './generate-documents/dd-ct-list/dd-ct-list.component';
import {RequestDdCtComponent} from './generate-documents/request-dd-ct/request-dd-ct.component';


@NgModule({
    imports: [
        CommonModule,
        ManagementRoutingModule,
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
        LicenseManagementComponent,
        MedicamentsComponent,
        ReceiptsComponent,
        AddReceiptDialogComponent,
        PricesComponent,
        PriceReqEditModalComponent,
        PriceApprovalComponent,
        PriceAutoRevaluationComponent,
        LicenseDetailsComponent,
        CPCADTaskComponent,
        DrugAuthorizationDetailsDialogComponent,
        AnnihilationManagementComponent,
        AnnihilationDetailsComponent,
        DdListComponent,
        OaListComponent,
        ClinicalTrialsComponent,
        GenerateDocumentsComponent,
        ClinicalTrialsDetailsComponent,
        OaListComponent,
        RequestsDdComponent,
        MedicamentsOaComponent,
        SelectIssueDateDialogComponent,
        SelectDocumentNumberComponent,
        RequestsOiComponent,
        OiListComponent,
        AmendmentDetailsComponent,
        NotificationDetailslsComponent,
        DdModifyListComponent,
        MedicamentsOmComponent,
        OmListComponent,
        OiModifyListComponent,
        RequestsDdModifyComponent,
        RequestsOiModifyComponent,
        LicenseHistoryDialogComponent,
        LicenseHistoryDetailComponent,
        DdCtListComponent,
        RequestDdCtComponent
    ],
    entryComponents: [AddReceiptDialogComponent, PriceReqEditModalComponent, LicenseDetailsComponent, DrugAuthorizationDetailsDialogComponent, AnnihilationDetailsComponent, ClinicalTrialsDetailsComponent, SelectIssueDateDialogComponent, AmendmentDetailsComponent, NotificationDetailslsComponent, LicenseHistoryDialogComponent, LicenseHistoryDetailComponent, SelectDocumentNumberComponent],
    providers: [LicenseService, AdministrationService, UploadFileService, AnnihilationService, MedicamentService, ClinicalTrialService, DdListComponent, OaListComponent],
})
export class ManagementModule {
}
