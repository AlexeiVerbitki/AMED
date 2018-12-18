import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GenericNomenclatureComponent} from "./generic-nomenclature.component";

const routes: Routes = [
    { path: '', component: GenericNomenclatureComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenericNomenclatureRoutingModule { }
