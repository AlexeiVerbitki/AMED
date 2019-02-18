import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EcAgentRoutingModule} from './ec-agent-routing.module';
import {AddEcAgentComponent} from './add-ec-agent/add-ec-agent.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialSharedModule} from '../../material-shared.module';
import {LicenseService} from '../../shared/service/license/license.service';
import {AdministrationService} from '../../shared/service/administration.service';
import {MatDialogModule} from '@angular/material';
import {EcAgentListComponent} from './ec-agent-list/ec-agent-list.component';
import {LocalityService} from '../../shared/service/locality.service';

@NgModule({
    imports: [
        CommonModule,
        EcAgentRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        MatDialogModule ,
    ],
    declarations: [
        AddEcAgentComponent,
        EcAgentListComponent
    ],
    providers: [LicenseService, AdministrationService, LocalityService
    ],
    entryComponents: [AddEcAgentComponent]
})
export class EcAgentModule {
}
