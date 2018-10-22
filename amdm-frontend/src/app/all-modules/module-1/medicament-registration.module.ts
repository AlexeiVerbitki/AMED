import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MedicamentRegistrationRoutingModule} from './medicament-registration-routing.module';
import {RegCerereComponent} from "./reg-cerere/reg-cerere.component";
import {EvaluarePrimaraComponent} from "./evaluare-primara/evaluare-primara.component";
import {SamsaComponent} from "./samsa/samsa.component";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DocumentComponent} from "../../document/document.component";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {RequestService} from "../../shared/service/request.service";
import {NumberOnlyDirective} from "../../shared/directive/number-only.directive";
import {PaymentComponent} from "../../payment/payment.component";

@NgModule({
    imports: [
        CommonModule,
        MedicamentRegistrationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    schemas: [],
    declarations: [RegCerereComponent, EvaluarePrimaraComponent, SamsaComponent, DocumentComponent,NumberOnlyDirective,PaymentComponent,],
    providers: [UploadFileService,RequestService]
})
export class MedicamentRegistrationModule {
}
