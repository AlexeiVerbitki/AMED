import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialSharedModule} from '../../material-shared.module';
import {MatDialogModule} from '@angular/material';

import {UserListRoutingModule} from './user-list-routing.module';
import {UserListComponent} from './user-list.component';

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
        UserListComponent,
    ],
    providers: [],
    entryComponents: [UserListComponent]
})
export class UserListModule {
}
