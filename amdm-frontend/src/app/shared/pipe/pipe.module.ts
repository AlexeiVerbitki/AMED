import { NgModule } from '@angular/core';
import {DigitsAfterDecimalPipe} from "./digits-after-decimal.pipe";

@NgModule({
    imports:        [],
    declarations:   [DigitsAfterDecimalPipe],
    exports:        [DigitsAfterDecimalPipe],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}