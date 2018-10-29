import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../material-shared.module";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {ExpertComiteeComponent} from "./expert-comitee.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
    ],

    declarations:[ExpertComiteeComponent],

    exports:[ExpertComiteeComponent,CommonModule, FormsModule, ReactiveFormsModule]
})
export class ExpertComiteeModule { }