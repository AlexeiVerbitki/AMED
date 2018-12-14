import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MedicamentRegistrationRoutingModule} from './medicament-registration-routing.module';
import {RegCerereComponent} from "./reg-cerere/reg-cerere.component";
import {EvaluarePrimaraComponent} from "./evaluare-primara/evaluare-primara.component";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {RequestService} from "../../shared/service/request.service";
import {DocumentModule} from "../../document/document.module";
import {PaymentModule} from "../../payment/payment.module";
import {ProcessInterruptionComponent} from "./process-interruption/process-interruption.component";
import {ExpertiComponent} from './experti/experti.component';
import {ExpertComiteeModule} from "../../expert-comitee/expert-comitee.module";
import {CanDeactivateGuard} from "../../shared/auth-guard/can-deactivate-guard.service";
import {InstructionModule} from "../../common/instruction/instruction.module";
import {MachetaModule} from "../../common/macheta/macheta.module";

@NgModule({
    imports: [
        CommonModule,
        MedicamentRegistrationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        DocumentModule,
        InstructionModule,
        MachetaModule,
        PaymentModule,
        ExpertComiteeModule

    ],
    schemas: [],
    declarations: [RegCerereComponent, EvaluarePrimaraComponent, ProcessInterruptionComponent, ExpertiComponent],
    providers: [UploadFileService,RequestService, CanDeactivateGuard]
})
export class MedicamentRegistrationModule {
}
