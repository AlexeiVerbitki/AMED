import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GenericNomenclatureRoutingModule} from './generic-nomenclature-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {GenericNomenclatureComponent} from "./generic-nomenclature.component";

@NgModule({
    imports: [
        CommonModule,
        GenericNomenclatureRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    declarations: [GenericNomenclatureComponent]
})
export class GenericNomenclatureModule {
}
