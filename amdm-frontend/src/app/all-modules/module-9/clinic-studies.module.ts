import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClinicStudiesRoutingModule} from './clinic-studies-routing.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialSharedModule} from '../../material-shared.module';
import {RegCerereComponent} from './reg-cerere/reg-cerere.component';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {AEvaluareaPrimaraComponent} from './a-evaluarea-primara/a-evaluarea-primara.component';
import {RequestService} from '../../shared/service/request.service';
import {DocumentModule} from '../../document/document.module';
import {PaymentModule} from '../../payment/payment.module';
import {AAnalizaComponent} from './a-analiza/a-analiza.component';
import {AdditionalDataDialogComponent} from './dialog/additional-data-dialog/additional-data-dialog.component';
import {AIntrerupereComponent} from './a-intrerupere/a-intrerupere.component';
import {AAprobareComponent} from './a-aprobare/a-aprobare.component';
import {MatDialogModule} from '@angular/material';
import {BEvaluarePrimaraComponent} from './b-evaluare-primara/b-evaluare-primara.component';
import {MedInstInvestigatorsDialogComponent} from './dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component';
import {BAprobareComponent} from './b-aprobare/b-aprobare.component';
import {BIntrerupereComponent} from './b-intrerupere/b-intrerupere.component';
import {CNotificareComponent} from './c-notificare/c-notificare.component';
import {ClinicalTrialService} from '../../shared/service/clinical-trial.service';
import {PaymentClinicalTrialModule} from '../../payment-clinical-trial/payment-clinical-trial.module';
import {AddCtExpertComponent} from './dialog/add-ct-expert/add-ct-expert.component';
import {InvestigatorsDialogComponent} from './dialog/investigators-dialog/investigators-dialog.component';
import {AddCtMedicamentComponent} from './dialog/add-ct-medicament/add-ct-medicament.component';
import {AddCtActSubstComponent} from './dialog/add-ct-act-subst/add-ct-act-subst.component';
import {EcAgentModule} from '../../administration/economic-agent/ec-agent.module';


@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        ClinicStudiesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        DocumentModule,
        PaymentModule,
        PaymentClinicalTrialModule,
        EcAgentModule
    ],
    schemas: [],
    entryComponents: [
        AdditionalDataDialogComponent,
        MedInstInvestigatorsDialogComponent,
        AddCtExpertComponent,
        InvestigatorsDialogComponent,
        AddCtMedicamentComponent,
        AddCtActSubstComponent
    ],
    declarations: [RegCerereComponent, AEvaluareaPrimaraComponent, AAnalizaComponent, AdditionalDataDialogComponent, AIntrerupereComponent, AAprobareComponent,
        BEvaluarePrimaraComponent, MedInstInvestigatorsDialogComponent, BAprobareComponent, BIntrerupereComponent, CNotificareComponent, AddCtExpertComponent,
        InvestigatorsDialogComponent, AddCtMedicamentComponent, AddCtActSubstComponent],

    providers: [UploadFileService, RequestService, ClinicalTrialService],
})
export class ClinicStudiesModule {
}
