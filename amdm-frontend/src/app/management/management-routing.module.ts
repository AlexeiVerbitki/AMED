import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LicenseManagementComponent} from "./license/license-management/license-management.component";
import {MedicamentsComponent} from "./medicaments/medicaments.component";
import {ReceiptsComponent} from "./receipts/receipts.component";
import {PriceAutoRevaluationComponent} from "./price-auto-revaluation/price-auto-revaluation.component";
import {PricesComponent} from "./prices/prices.component";
import {PriceApprovalComponent} from "./price-approval/price-approval.component";

const routes: Routes = [
    {path: 'license/view-all', component: LicenseManagementComponent},
    {path: 'medicaments', component: MedicamentsComponent},
    {path: 'receipts', component: ReceiptsComponent},
    {path: 'auto-revaluation',component: PriceAutoRevaluationComponent},
    {path: 'prices-approval',component: PriceApprovalComponent},
    {path: 'prices', component: PricesComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManagementRoutingModule {
}
