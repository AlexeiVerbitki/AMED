import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypesOfCustomsTransactionsRoutingModule } from './types-of-customs-transactions-routing.module';
import { TypesOfCustomsTransactionsComponent } from './types-of-customs-transactions.component';

@NgModule({
  imports: [
    CommonModule,
    TypesOfCustomsTransactionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [TypesOfCustomsTransactionsComponent]
})
export class TypesOfCustomsTransactionsModule { }
