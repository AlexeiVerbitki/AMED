import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddLicenseFarmacistComponent} from "./add-license-farmacist.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {MatDialogModule} from "@angular/material";

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MDBBootstrapModule.forRoot(),
      MaterialSharedModule.forRoot(),
      MatDialogModule
  ],
  declarations: [AddLicenseFarmacistComponent],
  entryComponents: [AddLicenseFarmacistComponent]
})
export class AddLicenseFarmacistModule { }
