import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DrugsDestroyRegisterComponent} from "./drugs-destroy-register/drugs-destroy-register.component";
import {AddMemberComponent} from "./add-member/add-member.component";
import {DrugsCauseFutilityComponent} from "./drugs-cause-futility/drugs-cause-futility.component";
import {DrugsConfirmDestroyComponent} from "./drugs-confirm-destroy/drugs-confirm-destroy.component";
import {DrugsDestroyComponent} from "./drugs-destroy/drugs-destroy.component";
import {DrugsDestroyDemandComponent} from "./drugs-destroy-demand/drugs-destroy-demand.component";
import {DrugsFinalDestroyComponent} from "./drugs-final-destroy/drugs-final-destroy.component";
import {DrugsFormComponent} from "./drugs-form/drugs-form.component";
import {DrugsMeasureComponent} from "./drugs-measure/drugs-measure.component";
import {DrugsPackComponent} from "./drugs-pack/drugs-pack.component";

const routes: Routes = [
    {path: 'register', component: DrugsDestroyRegisterComponent},
    {path: 'add-member', component: AddMemberComponent},
    {path: 'medicament-futility', component: DrugsCauseFutilityComponent},
    {path: 'confirm-destroy', component: DrugsConfirmDestroyComponent},
    {path: 'add-destroy-method', component: DrugsDestroyComponent},
    {path: 'evaluate', component: DrugsDestroyDemandComponent},
    {path: 'add-type', component: DrugsFormComponent},
    {path: 'add-unit', component: DrugsMeasureComponent},
    {path: 'add-wrapper', component: DrugsPackComponent},
    {path: 'destroy-process', component: DrugsFinalDestroyComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MedicamentDestructionRoutingModule {
}
