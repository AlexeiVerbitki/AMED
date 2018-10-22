import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationCommentModuleRoutingModule } from './authorization-comment-module-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {AuthorizationCommentComponent} from "./authorization-comment.component";

@NgModule({
  imports: [
    CommonModule,
    AuthorizationCommentModuleRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      MDBBootstrapModule.forRoot(),
      MaterialSharedModule.forRoot(),
  ],
  declarations: [AuthorizationCommentComponent]
})
export class AuthorizationCommentModuleModule { }
