import { NgModule} from '@angular/core';
import {CommonModule, DatePipe, DecimalPipe} from '@angular/common';

import {PriceRoutingModule} from './price-routing.module';
import {PriceEvaluateMedComponent} from './price-evaluate-med/price-evaluate-med.component';
import {PriceRegMedComponent} from './price-reg-med/price-reg-med.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReferencePriceComponent} from "./reference-price/reference-price.component";
import {RequestService} from "../../shared/service/request.service";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {MatDialogModule} from "@angular/material";
import {DocumentModule} from "../../document/document.module";
import {OneMedPriceComponent} from "./one-med-price/one-med-price.component";
import {PriceEditModalComponent} from "./modal/price-edit-modal/price-edit-modal.component";
import {PriceAutoRevaluationComponent} from "./price-auto-revaluation/price-auto-revaluation.component";
import {XchangeInfoComponent} from "./xchangeInfo/xchangeinfo.component";
import {PipeModule} from "../../shared/pipe/pipe.module";
import {RevaluationGenericsComponent} from "./revaluation-generics/revaluation-generics.component";

@NgModule({
    entryComponents: [ReferencePriceComponent, PriceEditModalComponent, XchangeInfoComponent],
    imports: [
        CommonModule,
        PriceRoutingModule,
        FormsModule,
        MatDialogModule ,
        ReactiveFormsModule,
        DocumentModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        PipeModule
    ],
    schemas: [],
    declarations: [
        PriceRegMedComponent,
        PriceAutoRevaluationComponent,
        RevaluationGenericsComponent,
        OneMedPriceComponent,
        PriceEvaluateMedComponent,
        ReferencePriceComponent,
        PriceEditModalComponent,
        XchangeInfoComponent,
    ],
    providers: [UploadFileService, RequestService, PipeModule],

})
export class PriceModule {
}
