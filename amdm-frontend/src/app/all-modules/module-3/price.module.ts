import { NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PriceRoutingModule} from './price-routing.module';
import {PriceEvaluateMedComponent} from './price-evaluate-med/price-evaluate-med.component';
import {PriceRegMedComponent} from './price-reg-med/price-reg-med.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReferencePriceComponent} from "./reference-price/reference-price.component";
import { ProposedPriceComponent } from './proposed-price/proposed-price.component';
import {RequestService} from "../../shared/service/request.service";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {MatDialogModule} from "@angular/material";
import {DocumentModule} from "../../document/document.module";

@NgModule({
    entryComponents: [ReferencePriceComponent, ProposedPriceComponent],
    imports: [
        CommonModule,
        PriceRoutingModule,
        FormsModule,
        MatDialogModule ,
        ReactiveFormsModule,
        DocumentModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    schemas: [],
    declarations: [PriceRegMedComponent, PriceEvaluateMedComponent, ReferencePriceComponent, ProposedPriceComponent],
    providers: [UploadFileService, RequestService],

})
export class PriceModule {
}
