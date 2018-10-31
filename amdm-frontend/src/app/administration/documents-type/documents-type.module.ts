import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsTypeRoutingModule } from './documents-type-routing.module';
import { DocumentsTypeComponent } from './documents-type.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentsTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ DocumentsTypeComponent ]
})
export class DocumentsTypeModule { }
