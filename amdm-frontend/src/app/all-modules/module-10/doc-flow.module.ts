import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocFlowRoutingModule} from './doc-flow-routing.module';
import {MatDialogModule} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../../material-shared.module";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import { RegDocComponent } from './reg-doc/reg-doc.component';

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        DocFlowRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
    ],
    declarations: [RegDocComponent]
})
export class DocFlowModule {
}
