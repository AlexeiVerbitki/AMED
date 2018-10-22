import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PriceRoutingModule} from './price-routing.module';
import {PriceEvaluateMedComponent} from './price-evaluate-med/price-evaluate-med.component';
import {PriceRegMedComponent} from './price-reg-med/price-reg-med.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DocumentModule} from '../../document/document.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {ReferencePriceComponent} from "./reference-price/reference-price.component";

@NgModule({
    entryComponents: [ReferencePriceComponent],
    imports: [
        CommonModule,
        PriceRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        DocumentModule,
        NgSelectModule

    ],
    schemas: [],
    declarations: [PriceRegMedComponent, PriceEvaluateMedComponent, ReferencePriceComponent]

})
export class PriceModule {
}
