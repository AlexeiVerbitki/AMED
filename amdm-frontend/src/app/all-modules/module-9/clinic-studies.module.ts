import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClinicStudiesRoutingModule} from './clinic-studies-routing.module';
import {RegStudCliniceComponent} from "./reg-stud-clinice/reg-stud-clinice.component";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../../material-shared.module";
import {RegCerereComponent} from './reg-cerere/reg-cerere.component';
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import { AEvaluareaPrimaraComponent } from './a-evaluarea-primara/a-evaluarea-primara.component';
import {RequestService} from "../../shared/service/request.service";
import {DocumentModule} from "../../document/document.module";
import {PaymentModule} from "../../payment/payment.module";
import { AAnalizaComponent } from './a-analiza/a-analiza.component';
import {AdditionalDataDialogComponent} from "./dialog/additional-data-dialog/additional-data-dialog.component";
import { AIntrerupereComponent } from './a-intrerupere/a-intrerupere.component';
import { AAprobareComponent } from './a-aprobare/a-aprobare.component';
import { MatDialogModule } from '@angular/material';
import { BEvaluarePrimaraComponent } from './b-evaluare-primara/b-evaluare-primara.component';

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        ClinicStudiesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        DocumentModule,
        PaymentModule
    ],
    schemas: [],
    entryComponents: [
        AdditionalDataDialogComponent
    ],
    declarations: [RegStudCliniceComponent, RegCerereComponent, AEvaluareaPrimaraComponent, AAnalizaComponent, AdditionalDataDialogComponent, AIntrerupereComponent, AAprobareComponent, BEvaluarePrimaraComponent],

    providers: [UploadFileService,RequestService],
})
export class ClinicStudiesModule {
}
