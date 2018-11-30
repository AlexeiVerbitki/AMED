import {NgModule} from "@angular/core";
import {PaymentComponent} from "./payment.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialSharedModule} from "../material-shared.module";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {AddPaymentOrderComponent} from "../dialog/add-payment-order/add-payment-order.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
    ],

    declarations:[PaymentComponent,AddPaymentOrderComponent],
    entryComponents : [AddPaymentOrderComponent],
    exports:[PaymentComponent,CommonModule, FormsModule, ReactiveFormsModule]
})
export class PaymentModule { }