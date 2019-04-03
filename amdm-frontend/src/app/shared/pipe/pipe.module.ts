import {NgModule} from '@angular/core';
import {DigitsAfterDecimalPipe} from './digits-after-decimal.pipe';
import {LicenseStatusPipe} from './license-status.pipe';
import {SafePipe} from './safe.pipe';

@NgModule({
    imports:        [],
    declarations:   [DigitsAfterDecimalPipe, LicenseStatusPipe, SafePipe],
    exports:        [DigitsAfterDecimalPipe, LicenseStatusPipe, SafePipe],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
