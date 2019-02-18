import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CerereSolicAutorComponent} from './cerere-solic-autor/cerere-solic-autor.component';
import {CerereImportExportComponent} from './cerere-import-export/cerere-import-export.component';
import {RegDrugControl} from './reg-drug-control/reg-drug-control';

const routes: Routes = [
    {path: 'activity-authorization/:id', component: CerereSolicAutorComponent},
    {path: 'transfer-authorization/:id', component: CerereImportExportComponent},
    {path: 'reg-drug-control', component: RegDrugControl}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DrugControlRoutingModule {
}
