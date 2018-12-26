import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LicenseRoutingModule} from './license-routing.module';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../../material-shared.module";
import {RegMedCerereLicComponent} from "./reg-med-cerere-lic/reg-med-cerere-lic.component";
import {EvaluareCerereLicComponent} from "./evaluare-cerere-lic/evaluare-cerere-lic.component";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {LicenseService} from "../../shared/service/license/license.service";
import {EliberareCerereLicComponent} from './eliberare-cerere-lic/eliberare-cerere-lic.component';
import {DocumentModule} from "../../document/document.module";
import {PaymentModule} from "../../payment/payment.module";
import {LicenseDecisionDialogComponent} from "../../dialog/license-decision-dialog/license-decision-dialog.component";
import {AddLicenseFarmacistComponent} from './add-license-farmacist/add-license-farmacist.component';
import {MatDialogModule} from "@angular/material";
import {EcAgentModule} from "../../administration/economic-agent/ec-agent.module";

@NgModule({
    imports: [
        CommonModule,
        LicenseRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        DocumentModule,
        PaymentModule,
        EcAgentModule
    ],
    schemas: [],
    entryComponents: [
        LicenseDecisionDialogComponent,
        AddLicenseFarmacistComponent,
    ],
    declarations: [RegMedCerereLicComponent,
        EvaluareCerereLicComponent,
	 EliberareCerereLicComponent,
        LicenseDecisionDialogComponent,
        AddLicenseFarmacistComponent,
    ]    ,
    providers: [UploadFileService, LicenseService,
    ],
})
export class LicenseModule {
}
