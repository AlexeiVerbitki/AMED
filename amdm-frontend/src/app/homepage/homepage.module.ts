import {HomepageModalComponent} from './homepage-modal/homepage-modal.component';
import {HomepageComponent} from './homepage.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../material-shared.module';

@NgModule({
    entryComponents: [HomepageModalComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot()
    ],
    declarations: [HomepageComponent, HomepageModalComponent]
})
export class HomepageModule {
}
