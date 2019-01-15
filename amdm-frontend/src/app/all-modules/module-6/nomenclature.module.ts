import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NomenclatureRoutingModule} from './nomenclature-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {CatalogPriceDrugsComponent} from './catalog-price-drugs/catalog-price-drugs.component';
import {ClasifyDrugsComponent} from './clasify-drugs/clasify-drugs.component';
import {ClasifyEconomicsAgencyComponent} from './clasify-economics-agency/clasify-economics-agency.component';
import {NomenclatorDrugsComponent} from './nomenclator-drugs/nomenclator-drugs.component';
import { NomenclatorRootComponent } from './nomenclator-root/nomenclator-root.component';

@NgModule({
    imports: [
        CommonModule,
        NomenclatureRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    declarations: [NomenclatorRootComponent, CatalogPriceDrugsComponent, ClasifyDrugsComponent, ClasifyEconomicsAgencyComponent, NomenclatorDrugsComponent, NomenclatorRootComponent]
})
export class NomenclatureModule {
}
