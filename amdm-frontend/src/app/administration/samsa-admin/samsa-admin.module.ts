import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamsaAdminRoutingModule } from './samsa-admin-routing.module';
import {SamsaAdminComponent} from "./samsa-admin.component";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";

@NgModule({
  imports: [
    CommonModule,
    SamsaAdminRoutingModule,
      MDBBootstrapModule.forRoot(),
      MaterialSharedModule.forRoot(),
  ],
  declarations: [SamsaAdminComponent]
})
export class SamsaAdminModule { }
