import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegModifyCerereComponent} from "./reg-modify-cerere/reg-modify-cerere.component";
import {CanDeactivateGuard} from "../../shared/auth-guard/can-deactivate-guard.service";
import {EvaluarePrimaraModifyComponent} from "./evaluare-primara-modify/evaluare-primara-modify.component";
import {ExpertiModifyComponent} from "./experti-modify/experti-modify.component";

const routes: Routes = [
    { path: 'register', component: RegModifyCerereComponent,  canDeactivate: [CanDeactivateGuard]},
    { path: 'evaluate/:id', component: EvaluarePrimaraModifyComponent,  canDeactivate: [CanDeactivateGuard]},
    { path: 'expert/:id', component: ExpertiModifyComponent,  canDeactivate: [CanDeactivateGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostModifyRoutingModule {
}
