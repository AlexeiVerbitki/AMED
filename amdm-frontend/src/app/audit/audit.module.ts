import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuditRoutingModule} from './audit-routing.module';
import {AuditComponent} from './audit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../material-shared.module';

@NgModule({
  imports: [
    CommonModule,
    AuditRoutingModule,
      FormsModule,
      MatDialogModule,
      ReactiveFormsModule,
      MDBBootstrapModule.forRoot(),
      MaterialSharedModule.forRoot(),
  ],
  declarations: [AuditComponent]
})
export class AuditModule { }
