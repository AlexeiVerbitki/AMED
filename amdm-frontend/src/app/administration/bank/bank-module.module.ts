import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankModuleRoutingModule } from './bank-module-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {BankComponent} from "./bank.component";
import {NomenclatorServices} from "../../shared/service/nomenclator.services";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {RequestService} from "../../shared/service/request.service";

@NgModule({
  imports: [
    CommonModule,
    BankModuleRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      MDBBootstrapModule.forRoot(),
      MaterialSharedModule.forRoot()
  ],
  declarations: [BankComponent],
  providers: [NomenclatorServices],
})
export class BankModuleModule { }
