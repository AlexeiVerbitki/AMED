import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DrugsDestroyRegisterComponent} from "./drugs-destroy-register/drugs-destroy-register.component";
import {DrugsDestroyEvaluateComponent} from "./drugs-destroy-evaluate/drugs-destroy-evaluate.component";

const routes: Routes = [
    {path: 'register', component: DrugsDestroyRegisterComponent},
    {path: 'evaluate/:id', component: DrugsDestroyEvaluateComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MedicamentDestructionRoutingModule {
}
