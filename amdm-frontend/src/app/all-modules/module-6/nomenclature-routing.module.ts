import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogPriceDrugsComponent} from "./catalog-price-drugs/catalog-price-drugs.component";
import {ClasifyDrugsComponent} from "./clasify-drugs/clasify-drugs.component";
import {ClasifyEconomicsAgencyComponent} from "./clasify-economics-agency/clasify-economics-agency.component";
import {NomenclatorDrugsComponent} from "./nomenclator-drugs/nomenclator-drugs.component";

const routes: Routes = [
    {path: 'price-catalog', component: CatalogPriceDrugsComponent},
    {path: 'medicament-classifier', component: ClasifyDrugsComponent},
    {path: 'economic-agents-classifier', component: ClasifyEconomicsAgencyComponent},
    {path: 'medicament-nomenclature', component: NomenclatorDrugsComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NomenclatureRoutingModule {
}
