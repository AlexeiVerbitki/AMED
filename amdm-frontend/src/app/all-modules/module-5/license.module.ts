import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LicenseRoutingModule} from './license-routing.module';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../../material-shared.module";
import {RegMedCerereLicComponent} from "./reg-med-cerere-lic/reg-med-cerere-lic.component";
import {EvaluareCerereLicComponent} from "./evaluare-cerere-lic/evaluare-cerere-lic.component";
import {DocumentComponent} from "../../document/document.component";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {LicenseService} from "../../shared/service/license/license.service";
import { EliberareCerereLicComponent } from './eliberare-cerere-lic/eliberare-cerere-lic.component';

@NgModule({
    imports: [
        CommonModule,
        LicenseRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    schemas: [],
    declarations: [RegMedCerereLicComponent,
        EvaluareCerereLicComponent,
	 DocumentComponent,
	 EliberareCerereLicComponent
    ]    ,
    providers: [UploadFileService, LicenseService

    ],
})
export class LicenseModule {
}
