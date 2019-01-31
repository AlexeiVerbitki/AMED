import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegCerereComponent} from "./reg-cerere/reg-cerere.component";

const routes: Routes = [
    {path: 'reg-cerere', component: RegCerereComponent},
    // { path: 'evaluate/:id', component: PriceEvaluateMedComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GDPRoutingModule {
}