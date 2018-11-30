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

@NgModule({
  imports: [
    CommonModule,
    ManagementRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      MDBBootstrapModule.forRoot(),
      MaterialSharedModule.forRoot(),
  ],
  declarations: [LicenseManagementComponent,MedicamentsComponent,ReceiptsComponent,AddReceiptDialogComponent],
    entryComponents:[AddReceiptDialogComponent]
})
export class ManagementModule { }
