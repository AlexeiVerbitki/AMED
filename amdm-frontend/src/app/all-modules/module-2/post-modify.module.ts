import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostModifyRoutingModule} from './post-modify-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {AprobModifyPostComponent} from "./aprob-modify-post/aprob-modify-post.component";
import { RegModifyCerereComponent } from './reg-modify-cerere/reg-modify-cerere.component';

@NgModule({
    imports: [
        CommonModule,
        PostModifyRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    declarations: [AprobModifyPostComponent, RegModifyCerereComponent]
})
export class PostModifyModule {
}
