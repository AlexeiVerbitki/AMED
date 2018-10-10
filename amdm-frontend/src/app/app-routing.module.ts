import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {LoginComponent} from './login/login.component';
import {ModuleComponent} from "./module/module.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {TaskComponent} from "./task/task.component";
import {AdministrationComponent} from "./administration/administration.component";
import {HistoryComponent} from "./history/history.component";
import {MainDashboardComponent} from "./dashboard/main-dashboard.component";
import {ModuleDashboardComponent} from "./dashboard/module-dashboard.component";
import {CerereSolicAutorComponent} from "./all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component";

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},

    {
        path: 'dashboard', component: MainDashboardComponent,
        children: [
            {path: '', redirectTo: 'homepage', pathMatch: 'full'},
            {path: 'homepage', component: HomepageComponent},
            {
                path: '', component: ModuleDashboardComponent,
                children: [
                    {path: '', redirectTo: 'module', pathMatch: 'full'},
                    {path: 'module', component: ModuleComponent},
                    {
                        path: 'module/medicament-registration',
                        loadChildren: '../app/all-modules/module-1/medicament-registration.module#MedicamentRegistrationModule'
                    },
                    {
                        path: 'module/post-modify',
                        loadChildren: '../app/all-modules/module-2/post-modify.module#PostModifyModule'
                    },
                    {
                        path: 'module/price',
                        loadChildren: '../app/all-modules/module-3/price.module#PriceModule'
                    },
                    {
                        path: 'module/import-authorization',
                        loadChildren: '../app/all-modules/module-4/import-authorization.module#ImportAuthorizationModule'
                    },
                    {
                        path: 'module/license',
                        loadChildren: '../app/all-modules/module-5/license.module#LicenseModule'
                    },
                    {
                        path: 'module/nomenclature',
                        loadChildren: '../app/all-modules/module-6/nomenclature.module#NomenclatureModule'
                    },
                    {
                        path: 'module/drug-control',
                        loadChildren: '../app/all-modules/module-7/drug-control.module#DrugControlModule'
                    },
                    {
                        path: 'module/medicament-destruction.module',
                        loadChildren: '../app/all-modules/module-8/medicament-destruction.module#MedicamentDestructionModule'
                    },
                    {
                        path: 'module/clinic-studies',
                        loadChildren: '../app/all-modules/module-9/clinic-studies.module#ClinicStudiesModule'
                    },
                ],
            },
            {path: 'task', component: TaskComponent},
            {path: 'history', component: HistoryComponent},
            {path: 'administration', component: AdministrationComponent}
        ]
    },
    {path: '**', component: NotFoundComponent},
];


@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: false})],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {
}
