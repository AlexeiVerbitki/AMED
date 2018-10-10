import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MedicamentDestructionRoutingModule} from './medicament-destruction-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MaterialSharedModule} from "../../material-shared.module";
import {AddMemberComponent} from "./add-member/add-member.component";
import {DrugsCauseFutilityComponent} from "./drugs-cause-futility/drugs-cause-futility.component";
import {DrugsConfirmDestroyComponent} from "./drugs-confirm-destroy/drugs-confirm-destroy.component";
import {DrugsDestroyComponent} from "./drugs-destroy/drugs-destroy.component";
import {DrugsDestroyDemandComponent} from "./drugs-destroy-demand/drugs-destroy-demand.component";
import {DrugsDestroyRegisterComponent} from "./drugs-destroy-register/drugs-destroy-register.component";
import {DrugsFinalDestroyComponent} from "./drugs-final-destroy/drugs-final-destroy.component";
import {DrugsPackComponent} from "./drugs-pack/drugs-pack.component";
import {DrugsMeasureComponent} from './drugs-measure/drugs-measure.component';
import {DrugsFormComponent} from "./drugs-form/drugs-form.component";

@NgModule({
    imports: [
        CommonModule,
        MedicamentDestructionRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
    ],
    declarations: [AddMemberComponent, DrugsCauseFutilityComponent, DrugsConfirmDestroyComponent, DrugsDestroyComponent,
        DrugsDestroyDemandComponent, DrugsDestroyRegisterComponent, DrugsFinalDestroyComponent, DrugsFormComponent,
        DrugsMeasureComponent, DrugsPackComponent]
})
export class MedicamentDestructionModule {
}
