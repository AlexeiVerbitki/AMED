import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrenciesHistoryRoutingModule } from './currencies-history-routing.module';
import { CurrenciesHistoryComponent } from './currencies-history.component';

@NgModule({
  imports: [
    CommonModule,
    CurrenciesHistoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ CurrenciesHistoryComponent ]
})
export class CurrenciesHistoryModule { }
