import {NgModule} from '@angular/core';
import {DigitsAfterDecimalPipe} from './digits-after-decimal.pipe';
import {LicenseStatusPipe} from './license-status.pipe';
import {DivisionsArrayToStringPipe} from './divisions-array-to-string.pipe';

@NgModule({
    imports: [],
    declarations: [DigitsAfterDecimalPipe, LicenseStatusPipe, DivisionsArrayToStringPipe],
    exports: [DigitsAfterDecimalPipe, LicenseStatusPipe, DivisionsArrayToStringPipe],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
