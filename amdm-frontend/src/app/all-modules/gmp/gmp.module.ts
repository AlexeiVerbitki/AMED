import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GmpRoutingModule} from './gmp-routing.module';
import {RegCerereGmpComponent} from './reg-cerere-gmp/reg-cerere-gmp.component';
import {EvaluarePrimaraGmpComponent} from './evaluare-primara-gmp/evaluare-primara-gmp.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {RequestService} from '../../shared/service/request.service';
import {DocumentModule} from '../../document/document.module';
import {PaymentModule} from '../../payment/payment.module';
import {ProcessInterruptionComponent} from './process-interruption/process-interruption.component';
import {CanDeactivateGuard} from '../../shared/auth-guard/can-deactivate-guard.service';
import {LicenseService} from '../../shared/service/license/license.service';
import {AddDescriptionComponent} from '../../dialog/add-description/add-description.component';
import {MatDialogModule} from '@angular/material';
import {LaboratorDialogComponent} from '../../dialog/laborator-dialog/laborator-dialog.component';
import {QualifiedPersonDialogComponent} from '../../dialog/qualified-person-dialog/qualified-person-dialog.component';
import {SearchMedicamentsDialogComponent} from '../../dialog/search-medicaments-dialog/search-medicaments-dialog.component';
import {SelectInspectionDateForAfComponent} from '../../dialog/select-inspection-date-for-af/select-inspection-date-for-af.component';

@NgModule({
    imports: [
        CommonModule,
        GmpRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        DocumentModule,
        PaymentModule
    ],
    schemas: [],
    declarations: [QualifiedPersonDialogComponent, SearchMedicamentsDialogComponent, SelectInspectionDateForAfComponent, LaboratorDialogComponent,
        RegCerereGmpComponent, EvaluarePrimaraGmpComponent, ProcessInterruptionComponent, AddDescriptionComponent],
    entryComponents: [AddDescriptionComponent, LaboratorDialogComponent, QualifiedPersonDialogComponent,
        SearchMedicamentsDialogComponent, SelectInspectionDateForAfComponent],
    providers: [UploadFileService, RequestService, CanDeactivateGuard, LicenseService]
})
export class GMPModule {
}
