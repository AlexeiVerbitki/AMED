import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizationCommentComponent} from "./authorization-comment.component";

const routes: Routes = [
    { path: '', component: AuthorizationCommentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizationCommentModuleRoutingModule { }
