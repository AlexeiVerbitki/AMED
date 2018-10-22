import {NgModule} from "@angular/core";
import {PaymentComponent} from "./payment.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../material-shared.module";
import {MDBBootstrapModule} from "angular-bootstrap-md";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
    ],

    declarations:[PaymentComponent],

    exports:[PaymentComponent,CommonModule, FormsModule, ReactiveFormsModule]
})
export class PaymentModule { }