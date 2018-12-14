import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankAccountsRoutingModule } from './bank-accounts-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MaterialSharedModule } from 'src/app/material-shared.module';
import { BankAccountsComponent } from './bank-accounts.component';
import {NomenclatorServices} from "../../../shared/service/nomenclator.services";

@NgModule({
  imports: [
    CommonModule,
    BankAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [BankAccountsComponent],
  providers: [NomenclatorServices]
})
export class BankAccountsModule { }
