import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialSharedModule} from '../material-shared.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {ReportsComponent} from './reports.component';
import {ReportsRoutingModule} from './reports-routing.module';
import {PipeModule} from "../shared/pipe/pipe.module";

@NgModule({
    imports: [
        CommonModule,
        ReportsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialSharedModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        PipeModule
    ],
    declarations: [ReportsComponent],
    entryComponents: [ReportsComponent],
    exports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ReportsModule {
}
