import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CerereSolicAutorComponent} from "./cerere-solic-autor/cerere-solic-autor.component";
import {CerereModAutorActComponent} from "./cerere-mod-autor-act/cerere-mod-autor-act.component";
import {CerereImportExportComponent} from "./cerere-import-export/cerere-import-export.component";
import {CerereDubAutorActComponent} from "./cerere-dub-autor-act/cerere-dub-autor-act.component";
import {RegDrugControl} from "./reg-drug-control/reg-drug-control";
import {CPCADTaskComponent} from "./cpcadtask/cpcadtask.component";

const routes: Routes = [
    {path: 'activity-authorization/:id', component: CerereSolicAutorComponent},
    {path: 'transfer-authorization/:id', component: CerereImportExportComponent},
    {path: 'modify-authority/:id', component: CerereModAutorActComponent},
    {path: 'duplicate-authority/:id', component: CerereDubAutorActComponent},
    {path: 'reg-drug-control', component: RegDrugControl},
    {path: 'cpcadtask', component: CPCADTaskComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DrugControlRoutingModule {
}
