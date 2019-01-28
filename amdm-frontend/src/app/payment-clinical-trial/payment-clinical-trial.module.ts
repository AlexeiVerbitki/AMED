import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialSharedModule} from '../material-shared.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {PaymentClinicalTrialComponent} from './payment-clinical-trial.component';
import {AddCtPayOrderComponent} from '../dialog/add-ct-pay-order/add-ct-pay-order.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot()
    ],

    declarations: [PaymentClinicalTrialComponent, AddCtPayOrderComponent],
    entryComponents: [AddCtPayOrderComponent],
    exports: [PaymentClinicalTrialComponent, CommonModule, FormsModule, ReactiveFormsModule]
})

export class PaymentClinicalTrialModule { }
