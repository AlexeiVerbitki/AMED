import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LicenseManagementComponent} from "./license/license-management/license-management.component";
import {MedicamentsComponent} from "./medicaments/medicaments.component";

const routes: Routes = [
    {path: 'license/view-all', component: LicenseManagementComponent},
    {path: 'medicaments', component: MedicamentsComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManagementRoutingModule {
}
