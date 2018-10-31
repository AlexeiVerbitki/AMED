import { MaterialSharedModule } from './../../material-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomGroupsRoutingModule } from './custom-groups-routing.module';
import { CustomGroupsComponent } from './custom-groups.component';

@NgModule({
  imports: [
    CommonModule,
    CustomGroupsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialSharedModule.forRoot(),
  ],
  declarations: [ CustomGroupsComponent ]
})
export class CustomGroupsModule { }
