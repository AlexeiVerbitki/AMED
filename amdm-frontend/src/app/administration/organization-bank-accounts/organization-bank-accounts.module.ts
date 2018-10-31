import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationBankAccountsRoutingModule } from './organization-bank-accounts-routing.module';
import { OrganizationBankAccountsComponent } from './organization-bank-accounts.component';

@NgModule({
  imports: [
    CommonModule,
    OrganizationBankAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [OrganizationBankAccountsComponent]
})
export class OrganizationBankAccountsModule { }
