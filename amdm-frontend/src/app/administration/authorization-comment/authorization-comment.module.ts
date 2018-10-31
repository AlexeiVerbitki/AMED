import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationCommentRoutingModule } from './authorization-comment-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {AuthorizationCommentComponent} from "./authorization-comment.component";

@NgModule({
  imports: [
    CommonModule,
    AuthorizationCommentRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      MDBBootstrapModule.forRoot(),
      MaterialSharedModule.forRoot(),
  ],
  declarations: [AuthorizationCommentComponent]
})
export class AuthorizationCommentModule { }
