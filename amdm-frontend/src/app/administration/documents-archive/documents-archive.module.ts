import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsArchiveRoutingModule } from './documents-archive-routing.module';
import { DocumentsArchiveComponent } from './documents-archive.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentsArchiveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ DocumentsArchiveComponent ]
})
export class DocumentsArchiveModule { }
