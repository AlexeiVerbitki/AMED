import {NgModule} from '@angular/core';
import {DigitsAfterDecimalPipe} from './digits-after-decimal.pipe';
import {LicenseStatusPipe} from './license-status.pipe';
import {SafePipe} from './safe.pipe';
import {TableFilterPipe} from './table-filter.pipe';

@NgModule({
    imports:        [],
    declarations:   [DigitsAfterDecimalPipe, LicenseStatusPipe, SafePipe, TableFilterPipe],
    exports:        [DigitsAfterDecimalPipe, LicenseStatusPipe, SafePipe, TableFilterPipe],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
