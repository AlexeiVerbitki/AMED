import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegMedCerereLicComponent} from './reg-med-cerere-lic/reg-med-cerere-lic.component';
import {EvaluareCerereLicComponent} from './evaluare-cerere-lic/evaluare-cerere-lic.component';
import {EliberareCerereLicComponent} from './eliberare-cerere-lic/eliberare-cerere-lic.component';
import {ViewCompletedLicenseComponent} from './view-completed-license/view-completed-license.component';

const routes: Routes = [
    {path: 'register', component: RegMedCerereLicComponent},
    {path: 'evaluate/:id', component: EvaluareCerereLicComponent},
    {path: 'issue/:id', component: EliberareCerereLicComponent},
    {path: 'view-completed/:id', component: ViewCompletedLicenseComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LicenseRoutingModule {
}
