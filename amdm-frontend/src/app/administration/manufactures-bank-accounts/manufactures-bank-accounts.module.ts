import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManufacturesBankAccountsRoutingModule } from './manufactures-bank-accounts-routing.module';
import { ManufacturesBankAccountsComponent } from './manufactures-bank-accounts.component';

@NgModule({
  imports: [
    CommonModule,
    ManufacturesBankAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ ManufacturesBankAccountsComponent]
})
export class ManufacturesBankAccountsModule { }
