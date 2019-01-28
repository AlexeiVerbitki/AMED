import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialSharedModule} from '../../material-shared.module';
import {LicenseService} from '../../shared/service/license/license.service';
import {AdministrationService} from '../../shared/service/administration.service';
import {MatDialogModule} from '@angular/material';
import {LocalityService} from '../../shared/service/locality.service';

import { UserListRoutingModule } from './user-list-routing.module';
import { UserListComponent } from './user-list.component';

@NgModule({
  imports: [
    CommonModule,
    UserListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
    MatDialogModule,
],
declarations: [
    UserListComponent
],
providers: [LicenseService, AdministrationService, LocalityService
],
entryComponents: [UserListComponent]
})
export class UserListModule { }
