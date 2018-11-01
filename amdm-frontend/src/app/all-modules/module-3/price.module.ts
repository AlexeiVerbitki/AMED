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
import {DocumentComponent} from "../../document/document.component";
import {RequestAdditionalDataDialogComponent} from "../../dialog/request-additional-data-dialog/request-additional-data-dialog.component";
import {MatDialogModule} from "@angular/material";

@NgModule({
    entryComponents: [ReferencePriceComponent, ProposedPriceComponent],
    imports: [
        CommonModule,
        PriceRoutingModule,
        FormsModule,
        MatDialogModule ,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    schemas: [],
    declarations: [PriceRegMedComponent, PriceEvaluateMedComponent, ReferencePriceComponent, DocumentComponent, ProposedPriceComponent,RequestAdditionalDataDialogComponent],
    providers: [UploadFileService, RequestService],

})
export class PriceModule {
}
