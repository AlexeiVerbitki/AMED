import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../material-shared.module';
import {PipeModule} from '../shared/pipe/pipe.module';
import {MatDialogModule} from '@angular/material';
import {XchangeInfoComponent} from './xchangeinfo.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule ,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        PipeModule,
    ],
    declarations: [
        XchangeInfoComponent
    ],
    exports: [
        XchangeInfoComponent
    ],
    entryComponents: []
})
export class XchangeinfoModule {
}
