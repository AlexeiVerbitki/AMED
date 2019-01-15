import { HomepageModalComponent } from './homepage-modal/homepage-modal.component';
import { HomepageComponent } from './homepage.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@NgModule({
  entryComponents: [HomepageModalComponent],
  imports: [
    CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MDBBootstrapModule.forRoot()

  ],
  declarations: [HomepageComponent, HomepageModalComponent]
})
export class HomepageModule { }
