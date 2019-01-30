import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NomenclatureRoutingModule} from './nomenclature-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {CatalogPriceDrugsComponent} from './catalog-price-drugs/catalog-price-drugs.component';
import {ClasifyEconomicsAgencyComponent} from './clasify-economics-agency/clasify-economics-agency.component';
import {NomenclatorDrugsComponent} from './nomenclator-drugs/nomenclator-drugs.component';
import { NomenclatorRootComponent } from './nomenclator-root/nomenclator-root.component';
import {NomenclatorModalComponent} from "./nomenclator-modal/nomenclator-modal.component";
import {MatDialogModule} from "@angular/material";
import {CatalogPriceModalComponent} from "./catalog-price-modal/catalog-price-modal.component";

@NgModule({
    entryComponents: [NomenclatorModalComponent, CatalogPriceModalComponent],
    imports: [
        CommonModule,
        NomenclatureRoutingModule,
        FormsModule,
        MatDialogModule ,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    declarations: [NomenclatorRootComponent, CatalogPriceDrugsComponent, ClasifyEconomicsAgencyComponent, NomenclatorDrugsComponent, NomenclatorRootComponent, NomenclatorModalComponent, CatalogPriceModalComponent]
})
export class NomenclatureModule {
}
