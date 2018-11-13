import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NomenclatorRootComponent} from "./nomenclator-root/nomenclator-root.component";

const routes: Routes = [
    {path: '', component: NomenclatorRootComponent},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NomenclatureRoutingModule {
}
