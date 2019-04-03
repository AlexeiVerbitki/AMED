import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {LoginComponent} from './login/login.component';
import {ModuleComponent} from './all-modules/module.component';
import {HomepageComponent} from './homepage/homepage.component';
import {TaskComponent} from './task/task.component';
import {AdministrationComponent} from './administration/administration.component';
import {MainDashboardComponent} from './dashboard/main-dashboard.component';
import {ModuleDashboardComponent} from './dashboard/module-dashboard.component';
import {AuthGuard} from './shared/auth-guard/auth.guard';
import {AdminDashboardComponent} from './dashboard/admin-dashboard.component';
import {GestDocComponent} from './document-management/gest-doc/gest-doc.component';

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
                        path: 'module/medicament-destruction',
                        loadChildren: '../app/all-modules/module-8/medicament-destruction.module#MedicamentDestructionModule'
                    },
                    {
                        path: 'module/clinic-studies',
                        loadChildren: '../app/all-modules/module-9/clinic-studies.module#ClinicStudiesModule'
                    },
                    {
                        path: 'module/documents',
                        loadChildren: '../app/all-modules/module-10/doc-flow.module#DocFlowModule'
                    },
                    {
                        path: 'module/gmp',
                        loadChildren: '../app/all-modules/gmp/gmp.module#GMPModule'
                    },
                    {
                        path: 'module/gdp',
                        loadChildren: '../app/all-modules/gdp/gdp.module#GDPModule'
                    },
                ],
            },
            {path: 'task', component: TaskComponent},
            {path: 'doc-management', component: GestDocComponent},
             {
                path: 'management',
                loadChildren: '../app/management/management.module#ManagementModule'
            },
            {
                path: 'reports',
                loadChildren: '../app/reports/reports.module#ReportsModule'
            },
            {
                path: 'create-documents',
                loadChildren: '../app/create-documents/create-document.module#CreateDocumentModule'
            },
            {
                path: 'audit',
                loadChildren: '../app/audit/audit.module#AuditModule'
            },
            {
                path: '', component: AdminDashboardComponent,
                children: [
                    {path: '', redirectTo: 'admin', pathMatch: 'full'},
                    {path: 'admin', component: AdministrationComponent},
                    {
                        path: 'admin/generic-nomenclature/:id',
                        loadChildren: '../app/administration/generic-nomenclature/generic-nomenclature.module#GenericNomenclatureModule'
                    },
                    {
                        path: 'admin',
                        loadChildren: '../app/administration/economic-agent/ec-agent.module#EcAgentModule'
                    },
                    {
                        path: 'admin',
                        loadChildren: '../app/administration/user-list/user-list.module#UserListModule'
                    }
                ],
            },

        ], canActivateChild: [AuthGuard]
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
