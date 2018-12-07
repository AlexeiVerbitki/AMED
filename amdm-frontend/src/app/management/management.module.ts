import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManagementRoutingModule} from './management-routing.module';
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
        PriceAutoRevaluationComponent
    ],
    entryComponents: [AddReceiptDialogComponent,PriceReqEditModalComponent,]
})
export class ManagementModule {
}
