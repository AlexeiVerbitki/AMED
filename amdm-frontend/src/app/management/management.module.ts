import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../material-shared.module";
import {LicenseManagementComponent} from "./license/license-management/license-management.component";
import {MedicamentsComponent} from "./medicaments/medicaments.component";
import {ReceiptsComponent} from "./receipts/receipts.component";
import {AddReceiptDialogComponent} from "../dialog/add-receipt-dialog/add-receipt-dialog.component";
import {PriceAutoRevaluationComponent} from "./price-auto-revaluation/price-auto-revaluation.component";
import {PipeModule} from "../shared/pipe/pipe.module";
import {DocumentModule} from "../document/document.module";
import {PricesComponent} from "./prices/prices.component";
import {PriceReqEditModalComponent} from "./prices/price-req-edit-modal/price-req-edit-modal.component";
import {MatDialogModule} from "@angular/material";
import {XchangeinfoModule} from "../xchangeInfo/xchangeinfo.module";
import {PriceApprovalComponent} from "./price-approval/price-approval.component";
import {LicenseService} from "../shared/service/license/license.service";
import {AdministrationService} from "../shared/service/administration.service";
import {LicenseDetailsComponent} from "./license/license-details/license-details.component";
import {UploadFileService} from "../shared/service/upload/upload-file.service";
import {DrugAuthorizationDetailsDialogComponent} from "../dialog/drug-authorization-details-dialog/drug-authorization-details-dialog.component";
import {CPCADTaskComponent} from "../all-modules/module-7/cpcadtask/cpcadtask.component";
import { ClinicalTrialsComponent } from './clinical-trials/clinical-trials.component';
import {ClinicalTrialService} from "../shared/service/clinical-trial.service";
import { ClinicalTrialsDetailsComponent } from './clinical-trials/dialog/clinical-trials-details/clinical-trials-details.component';
import {AnnihilationDetailsComponent} from "./annihilation/annihilation-details/annihilation-details.component";
import {AnnihilationManagementComponent} from "./annihilation/annihilation-management/annihilation-management.component";
import {AnnihilationService} from "../shared/service/annihilation/annihilation.service";
import {MedicamentService} from "../shared/service/medicament.service";
import { AmendmentDetailsComponent } from './clinical-trials/dialog/amendment-details/amendment-details.component';
import { GenerateDocumentsComponent } from './generate-documents/generate-documents.component';
import { DdListComponent } from './generate-documents/dd-list/dd-list.component';
import { OaListComponent } from './generate-documents/oa-list/oa-list.component';
import { RequestsDdComponent } from './generate-documents/requests-dd/requests-dd.component';
import { MedicamentsOaComponent } from './generate-documents/medicaments-oa/medicaments-oa.component';
import {SelectIssueDateDialogComponent} from "../dialog/select-issue-date-dialog/select-issue-date-dialog.component";
import { RequestsOiComponent } from './generate-documents/requests-oi/requests-oi.component';
import { OiListComponent } from './generate-documents/oi-list/oi-list.component';


@NgModule({
    imports: [
        CommonModule,
        ManagementRoutingModule,
        FormsModule,
        MatDialogModule ,
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
	RequestsOiComponent,
	OiListComponent,
	AmendmentDetailsComponent
    ],
    entryComponents: [AddReceiptDialogComponent,PriceReqEditModalComponent,LicenseDetailsComponent,DrugAuthorizationDetailsDialogComponent, AnnihilationDetailsComponent, ClinicalTrialsDetailsComponent,SelectIssueDateDialogComponent,AmendmentDetailsComponent],
    providers: [LicenseService, AdministrationService,UploadFileService, AnnihilationService, MedicamentService, ClinicalTrialService,DdListComponent,OaListComponent
    ],
})
export class ManagementModule {
}
