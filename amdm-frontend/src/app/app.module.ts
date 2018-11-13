import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';

import {AppRoutingModule} from './app-routing.module';
import {HomepageComponent} from './homepage/homepage.component';
import {NotFoundComponent} from './not-found/not-found.component';

import {LoginComponent} from './login/login.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FooterComponent} from './footer/footer.component';
import {MainDashboardComponent} from './dashboard/main-dashboard.component';

import {AuthService} from './shared/service/authetication.service';
import {ServerUrlInterceptor} from './shared/interceptor/server-url.interceptor';
import {AdministrationService} from './shared/service/administration.service';
import {ConfirmationDialogComponent} from "./dialog/confirmation-dialog.component";
import {TaskComponent} from './task/task.component';
import {HistoryComponent} from './history/history.component';
import {ModuleComponent} from "./all-modules/module.component";
import {AdministrationComponent} from "./administration/administration.component";
import {ModuleDashboardComponent} from "./dashboard/module-dashboard.component";
import {JwtInterceptor} from "./shared/interceptor/jwt.interceptor";
import {MaterialSharedModule} from "./material-shared.module";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ErrorInterceptor} from "./shared/interceptor/error.interceptor";
import {ErrorResponseHandlerComponent} from "./server-response-handler/error-response-handler.component";
import {ErrorHandlerService} from "./shared/service/error-handler.service";
import {AdminDashboardComponent} from "./dashboard/admin-dashboard.component";
import {GestDocComponent} from "./document-management/gest-doc/gest-doc.component";
import {NumberOnlyDirective} from "./shared/directive/number-only.directive";
import {RequestAdditionalDataDialogComponent} from "./dialog/request-additional-data-dialog/request-additional-data-dialog.component";

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
        HomepageComponent,
        NotFoundComponent,
        LoginComponent,
        SidebarComponent,
        FooterComponent,
        MainDashboardComponent,
        ModuleDashboardComponent,
        AdminDashboardComponent,
        ConfirmationDialogComponent,
        TaskComponent,
        HistoryComponent,
        ModuleComponent,
        AdministrationComponent,
        ErrorResponseHandlerComponent,
        RequestAdditionalDataDialogComponent,
        GestDocComponent,
        NumberOnlyDirective
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        MaterialSharedModule.forRoot(),

    ],
    schemas: [],
    entryComponents: [
        ConfirmationDialogComponent,RequestAdditionalDataDialogComponent
    ],
    providers: [AuthService, AdministrationService, ErrorHandlerService, interceptors,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
