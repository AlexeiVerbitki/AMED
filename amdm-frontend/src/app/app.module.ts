import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';

import {AppRoutingModule} from './app-routing.module';
import {NotFoundComponent} from './not-found/not-found.component';

import {LoginComponent} from './login/login.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FooterComponent} from './footer/footer.component';
import {MainDashboardComponent} from './dashboard/main-dashboard.component';

import {AuthService} from './shared/service/authetication.service';
import {ServerUrlInterceptor} from './shared/interceptor/server-url.interceptor';
import {AdministrationService} from './shared/service/administration.service';
import {ConfirmationDialogComponent} from './dialog/confirmation-dialog.component';
import {TaskComponent} from './task/task.component';
import {ModuleComponent} from './all-modules/module.component';
import {AdministrationComponent} from './administration/administration.component';
import {ModuleDashboardComponent} from './dashboard/module-dashboard.component';
import {JwtInterceptor} from './shared/interceptor/jwt.interceptor';
import {MaterialSharedModule} from './material-shared.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ErrorInterceptor} from './shared/interceptor/error.interceptor';
import {SuccessOrErrorResponseHandlerComponent} from './server-response-handler/success-or-error-response-handler.component';
import {SuccessOrErrorHandlerService} from './shared/service/success-or-error-handler.service';
import {AdminDashboardComponent} from './dashboard/admin-dashboard.component';
import {GestDocComponent} from './document-management/gest-doc/gest-doc.component';
import {NumberOnlyDirective} from './shared/directive/number-only.directive';
import {RequestAdditionalDataDialogComponent} from './dialog/request-additional-data-dialog/request-additional-data-dialog.component';
import {MatDialogModule, MatTreeModule} from '@angular/material';
import {ActiveSubstanceDialogComponent} from './dialog/active-substance-dialog/active-substance-dialog.component';
import {MedicamentDetailsDialogComponent} from './dialog/medicament-details-dialog/medicament-details-dialog.component';
import {MedicamentHistoryDialogComponent} from './dialog/medicament-history-dialog/medicament-history-dialog.component';
import {MedicamentModificationsDialogComponent} from './dialog/medicament-modifications-dialog/medicament-modifications-dialog.component';
import {PipeModule} from './shared/pipe/pipe.module';
import {NavbarTitleService} from './shared/service/navbar-title.service';
import {AuxiliarySubstanceDialogComponent} from './dialog/auxiliary-substance-dialog/auxiliary-substance-dialog.component';
import {DivisionSelectDialogComponent} from './dialog/division-select-dialog/division-select-dialog.component';
import {AddManufactureComponent} from './dialog/add-manufacture/add-manufacture.component';
import {AddDivisionComponent} from './dialog/add-division/add-division.component';
import {AddExpertComponent} from './dialog/add-expert/add-expert.component';
import {registerLocaleData} from '@angular/common';
import localeRo from '@angular/common/locales/ro-MD';
import {SelectVariationTypeComponent} from './dialog/select-variation-type/select-variation-type.component';
import {HomepageModule} from './homepage/homepage.module';
import {NomenclatureModule} from './all-modules/module-6/nomenclature.module';
import {SelectSubsidiaryModalComponent} from './all-modules/gdp/select-subsidiary-modal/select-subsidiary-modal.component';
import {InspectorsModalComponent} from './all-modules/gdp/inspectors-modal/inspectors-modal.component';
import {SelectDocumentNumberComponent} from './dialog/select-document-number/select-document-number.component';
import {AuthGuard} from './shared/auth-guard/auth.guard';
import {AddLaboratorStandardsComponent} from './dialog/add-laborator-standards/add-laborator-standards.component';

registerLocaleData(localeRo, 'ro-MD');

const interceptors = [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
},
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ServerUrlInterceptor,
        multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
        multi: true
    }];

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        NotFoundComponent,
        LoginComponent,
        SidebarComponent,
        FooterComponent,
        MainDashboardComponent,
        ModuleDashboardComponent,
        AdminDashboardComponent,
        ConfirmationDialogComponent,
        TaskComponent,
        ModuleComponent,
        AdministrationComponent,
        SuccessOrErrorResponseHandlerComponent,
        RequestAdditionalDataDialogComponent,
        GestDocComponent,
        NumberOnlyDirective,
        ActiveSubstanceDialogComponent,
        AddManufactureComponent,
        AddDivisionComponent,
        SelectVariationTypeComponent,
        AddExpertComponent,
        AuxiliarySubstanceDialogComponent,
        MedicamentDetailsDialogComponent,
        MedicamentHistoryDialogComponent,
        MedicamentModificationsDialogComponent,
        DivisionSelectDialogComponent,
        AddLaboratorStandardsComponent,
        SelectSubsidiaryModalComponent,
        InspectorsModalComponent,
        SelectDocumentNumberComponent
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        MatDialogModule,
        MatTreeModule,
        ReactiveFormsModule,
        HomepageModule,
        NomenclatureModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),
        PipeModule.forRoot(),
    ],
    schemas: [],
    entryComponents: [
        DivisionSelectDialogComponent,AddLaboratorStandardsComponent, AuxiliarySubstanceDialogComponent, ConfirmationDialogComponent, MedicamentHistoryDialogComponent, SelectDocumentNumberComponent,
        MedicamentModificationsDialogComponent, RequestAdditionalDataDialogComponent, ActiveSubstanceDialogComponent, MedicamentDetailsDialogComponent,
        AddManufactureComponent, AddDivisionComponent, AddExpertComponent, SelectVariationTypeComponent, SelectSubsidiaryModalComponent, InspectorsModalComponent
    ],
    providers: [AuthGuard, AuthService, AdministrationService, SuccessOrErrorHandlerService, NavbarTitleService, interceptors, {provide: LOCALE_ID, useValue: 'ro-MD'}
    ],
    bootstrap: [AppComponent]
})

export class AppModule {


}
