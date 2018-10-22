import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
} from "@angular/material";
import {TooltipModule, WavesModule} from "angular-bootstrap-md";
import {APP_DATE_FORMATS, AppDateAdapter} from "./shared/adapter/date.adapter";

@NgModule({
    imports: [
        MatButtonModule,
        MatToolbarModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatCardModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatListModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSliderModule,
        TooltipModule,
        WavesModule,
        MatRadioModule,
        MatTableModule,
        MatAutocompleteModule,
        NgSelectModule,

    ],
    declarations: [],
    exports: [
        MatButtonModule,
        MatToolbarModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatCardModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatListModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSliderModule,
        TooltipModule,
        WavesModule,
        MatRadioModule,
        MatTableModule,
        MatAutocompleteModule,
        NgSelectModule,
    ]
})
export class MaterialSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MaterialSharedModule,
            providers: [
                MatButtonModule,
                MatToolbarModule,
                MatSelectModule,
                MatTabsModule,
                MatInputModule,
                MatPaginatorModule,
                MatSortModule,
                MatProgressSpinnerModule,
                MatChipsModule,
                MatCardModule,
                MatSidenavModule,
                MatCheckboxModule,
                MatListModule,
                MatMenuModule,
                MatIconModule,
                MatTooltipModule,
                MatDatepickerModule,
                MatNativeDateModule,
                MatSliderModule,
                TooltipModule,
                WavesModule,
                MatRadioModule,
                MatTableModule,
                MatAutocompleteModule,
                NgSelectModule,
                {
                    provide: DateAdapter, useClass: AppDateAdapter
                },
                {
                    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
                }
            ]
        }
    }
}
