import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {LoginComponent} from './login/login.component';
import {ModuleComponent} from "./all-modules/module.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {TaskComponent} from "./task/task.component";
import {AdministrationComponent} from "./administration/administration.component";
import {HistoryComponent} from "./history/history.component";
import {MainDashboardComponent} from "./dashboard/main-dashboard.component";
import {ModuleDashboardComponent} from "./dashboard/module-dashboard.component";
import {AuthGuard} from "./shared/auth-guard/auth.guard";
import {AdminDashboardComponent} from "./dashboard/admin-dashboard.component";
import {GestDocComponent} from "./document-management/gest-doc/gest-doc.component";

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
                ],
            },
            {path: 'task', component: TaskComponent},
            {path: 'doc-management', component: GestDocComponent},
            {path: 'history', component: HistoryComponent},
            {
                path: '', component: AdminDashboardComponent,
                children: [
                    {path: '', redirectTo: 'admin', pathMatch: 'full'},
                    {path: 'admin', component: AdministrationComponent},
                    {
                        path: 'admin/authorization-comment',
                        loadChildren: '../app/administration/authorization-comment/authorization-comment.module#AuthorizationCommentModule'
                    },
                    {
                        path: 'admin/bank',
                        loadChildren: '../app/administration/bank/bank-module.module#BankModuleModule'
                    },
                    {
                        path: 'admin/bank-accounts',
                        loadChildren: '../app/administration/bank/bank-accounts/bank-accounts.module#BankAccountsModule'
                    },
                    {
                        path: 'admin/cessation-reasons',
                        loadChildren: '../app/administration/cessation-reasons/cessation-reasons.module#CessationReasonsModule'
                    },
                    {
                        path: 'admin/clasificarea-tipul-medicamentului',
                        loadChildren: '../app/administration/clasificarea-tip-med/clasificarea-tip-med.module#ClasificareaTipMedModule'
                    },
                    {
                        path: 'admin/clasificarea-medicamentului',
                        loadChildren: '../app/administration/clasify-med/clasify-med.module#ClasifyMedModule'
                    },
                    {
                        path: 'admin/country',
                        loadChildren: '../app/administration/country/country.module#CountryModule'
                    },
                    {
                        path: 'admin/country-group',
                        loadChildren: '../app/administration/country-group/country-group.module#CountryGroupModule'
                    },
                    {
                        path: 'admin/currencies',
                        loadChildren: '../app/administration/currencies/currencies.module#CurrenciesModule'
                    },
                    {
                        path: 'admin/currencies-history',
                        loadChildren: '../app/administration/currencies-history/currencies-history.module#CurrenciesHistoryModule'
                    },
                    {
                        path: 'admin/custom-groups',
                        loadChildren: '../app/administration/custom-groups/custom-groups.module#CustomGroupsModule'
                    },
                    {
                        path: 'admin/custom-points',
                        loadChildren: '../app/administration/custom-points/custom-points.module#CustomPointsModule'
                    },
                    {
                        path: 'admin/customs-codes',
                        loadChildren: '../app/administration/customs-codes/customs-codes.module#CustomsCodesModule'
                    },
                    {
                        path: 'admin/documents-archive',
                        loadChildren: '../app/administration/documents-archive/documents-archive.module#DocumentsArchiveModule'
                    },
                    {
                        path: 'admin/documents-type',
                        loadChildren: '../app/administration/documents-type/documents-type.module#DocumentsTypeModule'
                    },
                    {
                        path: 'admin/economic-agent-bank-accounts',
                        loadChildren: '../app/administration/economic-agent-bank-accounts/economic-agent-bank-accounts.module#EconomicAgentBankAccountsModule'
                    },
                    {
                        path: 'admin/economic-agent-contact-info',
                        loadChildren: '../app/administration/economic-agent-contact-info/economic-agent-contact-info.module#EconomicAgentContactInfoModule'
                    },
                    {
                        path: 'admin/economic-agents',
                        loadChildren: '../app/administration/economic-agents/economic-agents.module#EconomicAgentsModule'
                    },
                    {
                        path: 'admin/employees',
                        loadChildren: '../app/administration/employees/employees.module#EmployeesModule'
                    },
                    {
                        path: 'admin/identification-document-types',
                        loadChildren: '../app/administration/identification-document-types/identification-document-types.module#IdentificationDocumentTypesModule'
                    },
                    {
                        path: 'admin/international-medicament-name',
                        loadChildren: '../app/administration/international-medicament-name/international-medicament-name.module#InternationalMedicamentNameModule'
                    },
                    {
                        path: 'admin/import-authorization',
                        loadChildren: '../app/administration/import-authorization/import-authorization.module#ImportAuthorizationModule'
                    },
                    {
                        path: 'admin/labels',
                        loadChildren: '../app/administration/labels/labels.module#LabelsModule'
                    },
                    {
                        path: 'admin/licenses',
                        loadChildren: '../app/administration/licenses/licenses.module#LicensesModule'
                    },
                    {
                        path: 'admin/localities',
                        loadChildren: '../app/administration/localities/localities.module#LocalitiesModule'
                    },
                    {
                        path: 'admin/manufactures',
                        loadChildren: '../app/administration/manufactures/manufactures.module#ManufacturesModule'
                    },
                    {
                        path: 'admin/manufactures-bank-accounts',
                        loadChildren: '../app/administration/manufactures-bank-accounts/manufactures-bank-accounts.module#ManufacturesBankAccountsModule'
                    },
                    {
                        path: 'admin/medicament-forms',
                        loadChildren: '../app/administration/medicament-forms/medicament-forms.module#MedicamentFormsModule'
                    },
                    {
                        path: 'admin/medicament-group',
                        loadChildren: '../app/administration/medicament-group/medicament-group.module#MedicamentGroupModule'
                    },
                    {
                        path: 'admin/medicament-type',
                        loadChildren: '../app/administration/medicament-type/medicament-type.module#MedicamentTypeModule'
                    },
                    {
                        path: 'admin/organization',
                        loadChildren: '../app/administration/organization/organization.module#OrganizationModule'
                    },
                    {
                        path: 'admin/organization-bank-accounts',
                        loadChildren: '../app/administration/organization-bank-accounts/organization-bank-accounts.module#OrganizationBankAccountsModule'
                    },
                    {
                        path: 'admin/partners',
                        loadChildren: '../app/administration/partners/partners.module#PartnersModule'
                    },
                    {
                        path: 'admin/pharmaceutical-form-types',
                        loadChildren: '../app/administration/pharmaceutical-form-types/pharmaceutical-form-types.module#PharmaceuticalFormTypesModule'
                    },
                    {
                        path: 'admin/pharmaceutical-forms',
                        loadChildren: '../app/administration/pharmaceutical-forms/pharmaceutical-forms.module#PharmaceuticalFormsModule'
                    },
                    {
                        path: 'admin/price',
                        loadChildren: '../app/administration/price/price.module#PriceModule'
                    },
                    {
                        path: 'admin/price-expiration',
                        loadChildren: '../app/administration/price-expiration/price-expiration.module#PriceExpirationModule'
                    },
                    {
                        path: 'admin/price-expiration-reasons',
                        loadChildren: '../app/administration/price-expiration-reasons/price-expiration-reasons.module#PriceExpirationReasonsModule'
                    },
                    {
                        path: 'admin/price-types',
                        loadChildren: '../app/administration/price-types/price-types.module#PriceTypesModule'
                    },
                    {
                        path: 'admin/process-steps',
                        loadChildren: '../app/administration/process-steps/process-steps.module#ProcessStepsModule'
                    },
                    {
                        path: 'admin/professions',
                        loadChildren: '../app/administration/professions/professions.module#ProfessionsModule'
                    },
                    {
                        path: 'admin/registration-request',
                        loadChildren: '../app/administration/registration-request/registration-request.module#RegistrationRequestModule'
                    },
                    {
                        path: 'admin/request-types',
                        loadChildren: '../app/administration/request-types/request-types.module#RequestTypesModule'
                    },
                    {
                        path: 'admin/states',
                        loadChildren: '../app/administration/state/state.module#StateModule'
                    },
                    {
                        path: 'admin/subdivisions',
                        loadChildren: '../app/administration/subdivisions/subdivisions.module#SubdivisionsModule'
                    },
                    {
                        path: 'admin/substanta-activa',
                        loadChildren: '../app/administration/substanta-activa/substanta-activa.module#SubstantaActivaModule'
                    },
                    {
                        path: 'admin/substanta-aux',
                        loadChildren: '../app/administration/substanta-aux/substanta-aux.module#SubstantaAuxModule'
                    },
                    {
                        path: 'admin/taxe',
                        loadChildren: '../app/administration/taxe/taxe.module#TaxeModule'
                    },
                    {
                        path: 'admin/traffic-archive',
                        loadChildren: '../app/administration/traffic-archive/traffic-archive.module#TrafficArchiveModule'
                    },
                    {
                        path: 'admin/types-of-customs-transactions',
                        loadChildren: '../app/administration/types-of-customs-transactions/types-of-customs-transactions.module#TypesOfCustomsTransactionsModule'
                    },
                    {
                        path: 'admin/types-of-drugs-changes',
                        loadChildren: '../app/administration/types-of-drugs-changes/types-of-drugs-changes.module#TypesOfDrugsChangesModule'
                    },
                    {
                        path: 'admin/types-of-economic-agents',
                        loadChildren: '../app/administration/types-of-economic-agents/types-of-economic-agents.module#TypesOfEconomicAgentsModule'
                    },
                    {
                        path: 'admin/types-of-pharmacy-activity',
                        loadChildren: '../app/administration/types-of-pharmacy-activity/types-of-pharmacy-activity.module#TypesOfPharmacyActivityModule'
                    },
                    {
                        path: 'admin/units-of-measure',
                        loadChildren: '../app/administration/units-of-measure/units-of-measure.module#UnitsOfMeasureModule'
                    },

                ],
            },

        ],
        //canActivate: [AuthGuard]
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
