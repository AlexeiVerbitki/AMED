import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PriceRoutingModule} from './price-routing.module';
import {PriceEvaluateMedComponent} from './price-evaluate-med/price-evaluate-med.component';
import {PriceRegMedComponent} from './price-reg-med/price-reg-med.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        PriceRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    schemas: [],
    declarations: [PriceRegMedComponent, PriceEvaluateMedComponent]
})
export class PriceModule {
}
