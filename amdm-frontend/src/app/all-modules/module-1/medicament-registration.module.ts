import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MedicamentRegistrationRoutingModule} from './medicament-registration-routing.module';
import {RegCerereComponent} from "./reg-cerere/reg-cerere.component";
import {EvaluarePrimaraComponent} from "./evaluare-primara/evaluare-primara.component";
import {SamsaComponent} from "./samsa/samsa.component";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {RequestService} from "../../shared/service/request.service";
import {NumberOnlyDirective} from "../../shared/directive/number-only.directive";
import {RequestAdditionalDataDialogComponent} from "../../dialog/request-additional-data-dialog/request-additional-data-dialog.component";
import {WaitingResponseDialogComponent} from "../../dialog/waiting-response-dialog/waiting-response-dialog.component";
import {DocumentModule} from "../../document/document.module";
import {PaymentModule} from "../../payment/payment.module";

@NgModule({
    imports: [
        CommonModule,
        MedicamentRegistrationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        DocumentModule,
        PaymentModule,
    ],
    schemas: [],
    declarations: [RegCerereComponent, EvaluarePrimaraComponent, SamsaComponent, NumberOnlyDirective,RequestAdditionalDataDialogComponent,WaitingResponseDialogComponent],
    providers: [UploadFileService,RequestService]
})
export class MedicamentRegistrationModule {
}
