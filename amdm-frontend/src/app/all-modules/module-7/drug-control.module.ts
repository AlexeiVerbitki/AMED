import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DrugControlRoutingModule} from './drug-control-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CollapseModule, MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {CerereSolicAutorComponent} from "./cerere-solic-autor/cerere-solic-autor.component";
import {CerereModAutorActComponent} from "./cerere-mod-autor-act/cerere-mod-autor-act.component";
import {CerereImportExportComponent} from "./cerere-import-export/cerere-import-export.component";
import {CerereDubAutorActComponent} from "./cerere-dub-autor-act/cerere-dub-autor-act.component";
import {RegDrugControl} from "./reg-drug-control/reg-drug-control";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {RequestService} from "../../shared/service/request.service";
import {DocumentModule} from "../../document/document.module";
import {PaymentModule} from "../../payment/payment.module";
import {LicenseService} from "../../shared/service/license/license.service";

@NgModule({
    imports: [
        CommonModule,
        DrugControlRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        CollapseModule,
        DocumentModule,
        PaymentModule
    ],
    declarations: [CerereDubAutorActComponent, CerereImportExportComponent, CerereModAutorActComponent, CerereSolicAutorComponent, RegDrugControl],
    providers: [UploadFileService, RequestService, LicenseService]

})
export class DrugControlModule {
}
