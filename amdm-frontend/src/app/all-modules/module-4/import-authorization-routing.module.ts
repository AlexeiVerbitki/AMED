import {RouterModule, Routes} from '@angular/router';
import {ImportAuthorizationRequestComponent} from "./import-authorization-request/import-authorization-request.component";
import {ImportAuthorizationEvaluateComponent} from "./import-authorization-evaluate/import-authorization-evaluate.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
    {path: 'register', component: ImportAuthorizationRequestComponent},
    {path: 'evaluate', component: ImportAuthorizationEvaluateComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ImportAuthorizationRoutingModule {
}
