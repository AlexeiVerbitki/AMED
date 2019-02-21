import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DrugControlRoutingModule} from './drug-control-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CollapseModule, MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {CerereSolicAutorComponent} from './cerere-solic-autor/cerere-solic-autor.component';
import {CerereImportExportComponent} from './cerere-import-export/cerere-import-export.component';
import {RegDrugControl} from './reg-drug-control/reg-drug-control';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {RequestService} from '../../shared/service/request.service';
import {DocumentModule} from '../../document/document.module';
import {PaymentModule} from '../../payment/payment.module';
import {LicenseService} from '../../shared/service/license/license.service';
import {EcAgentModule} from '../../administration/economic-agent/ec-agent.module';
import {CpcdAuthLangComponent} from './cpcd-auth-lang/cpcd-auth-lang.component';
import {MatDialogModule} from '@angular/material';
import { CpcdRejectLetterComponent } from './cpcd-reject-letter/cpcd-reject-letter.component';
import { DeclarationImportExportComponent } from './declaration-import-export/declaration-import-export.component';
import { AddDeclarationDialogComponent } from './add-declaration-dialog/add-declaration-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        DrugControlRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        CollapseModule,
        DocumentModule,
        PaymentModule,
        EcAgentModule
    ],
    declarations: [ CerereImportExportComponent, CerereSolicAutorComponent, RegDrugControl, CpcdAuthLangComponent, CpcdRejectLetterComponent, DeclarationImportExportComponent, AddDeclarationDialogComponent],
    providers: [UploadFileService, RequestService, LicenseService],
    entryComponents: [CpcdAuthLangComponent, CpcdRejectLetterComponent, AddDeclarationDialogComponent],

})
export class DrugControlModule {
}
