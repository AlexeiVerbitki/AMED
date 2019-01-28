import { NgModule } from '@angular/core';
import {DigitsAfterDecimalPipe} from './digits-after-decimal.pipe';
import { LicenseStatusPipe } from './license-status.pipe';

@NgModule({
    imports:        [],
    declarations:   [DigitsAfterDecimalPipe, LicenseStatusPipe],
    exports:        [DigitsAfterDecimalPipe, LicenseStatusPipe],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
