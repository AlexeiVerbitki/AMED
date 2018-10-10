import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AprobModifyPostComponent} from "./aprob-modify-post/aprob-modify-post.component";
import {RegModifyCerereComponent} from "./reg-modify-cerere/reg-modify-cerere.component";

const routes: Routes = [
    {path: 'register', component: RegModifyCerereComponent},
    {path: 'modify', component: AprobModifyPostComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostModifyRoutingModule {
}
