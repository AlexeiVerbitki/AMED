import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostModifyRoutingModule} from './post-modify-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {RegModifyCerereComponent} from './reg-modify-cerere/reg-modify-cerere.component';
import {DocumentModule} from '../../document/document.module';
import {PaymentModule} from '../../payment/payment.module';
import {ExpertComiteeModule} from '../../common/expert-comitee/expert-comitee.module';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {RequestService} from '../../shared/service/request.service';
import {CanDeactivateGuard} from '../../shared/auth-guard/can-deactivate-guard.service';
import {PriceService} from '../../shared/service/prices.service';
import {EvaluarePrimaraModifyComponent} from './evaluare-primara-modify/evaluare-primara-modify.component';
import {ExpertiModifyComponent} from './experti-modify/experti-modify.component';
import {ProcessInterruptionModifyComponent} from './process-interruption-modify/process-interruption-modify.component';
import {InstructionModule} from '../../common/instruction/instruction.module';
import {MachetaModule} from '../../common/macheta/macheta.module';

@NgModule({
    imports: [
        CommonModule,
        PostModifyRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        InstructionModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        DocumentModule,
        InstructionModule,
        MachetaModule,
        PaymentModule,
        ExpertComiteeModule,
    ],
    schemas: [],
    declarations: [RegModifyCerereComponent, EvaluarePrimaraModifyComponent, ExpertiModifyComponent, ProcessInterruptionModifyComponent],
    providers: [UploadFileService, RequestService, CanDeactivateGuard, PriceService]
})
export class PostModifyModule {
}
