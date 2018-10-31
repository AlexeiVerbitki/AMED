import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentificationDocumentTypesRoutingModule } from './identification-document-types-routing.module';
import { IdentificationDocumentTypesComponent } from './identification-document-types.component';

@NgModule({
  imports: [
    CommonModule,
    IdentificationDocumentTypesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [IdentificationDocumentTypesComponent]
})
export class IdentificationDocumentTypesModule { }
