import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankAccountsRoutingModule } from './bank-accounts-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MaterialSharedModule } from 'src/app/material-shared.module';
import { BankAccountsComponent } from './bank-accounts.component';

@NgModule({
  imports: [
    CommonModule,
    BankAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [BankAccountsComponent]
})
export class BankAccountsModule { }
