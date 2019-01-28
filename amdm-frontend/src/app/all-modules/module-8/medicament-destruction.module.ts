import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MedicamentDestructionRoutingModule} from './medicament-destruction-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {DrugsDestroyRegisterComponent} from './drugs-destroy-register/drugs-destroy-register.component';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {MedicamentService} from '../../shared/service/medicament.service';
import {DocumentModule} from '../../document/document.module';
import {AnnihilationService} from '../../shared/service/annihilation/annihilation.service';
import { DrugsDestroyEvaluateComponent } from './drugs-destroy-evaluate/drugs-destroy-evaluate.component';
import {PaymentModule} from '../../payment/payment.module';
import { DrugsDestroyActualComponent } from './drugs-destroy-actual/drugs-destroy-actual.component';
import {AnnihilationMedDialogComponent} from '../../dialog/annihilation-med-dialog/annihilation-med-dialog.component';
import {PipeModule} from '../../shared/pipe/pipe.module';

@NgModule({
    imports: [
        CommonModule,
        MedicamentDestructionRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        DocumentModule,
        PaymentModule,
        PipeModule,
    ],
    entryComponents: [
        AnnihilationMedDialogComponent
    ],
    declarations: [ DrugsDestroyRegisterComponent, DrugsDestroyEvaluateComponent, DrugsDestroyActualComponent, AnnihilationMedDialogComponent],
    providers: [UploadFileService, MedicamentService, AnnihilationService, PipeModule
    ],
})
export class MedicamentDestructionModule {
}
