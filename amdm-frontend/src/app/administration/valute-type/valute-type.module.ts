import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValuteTypeRoutingModule } from './valute-type-routing.module';
import {ValuteTypeComponent} from "./valute-type.component";

@NgModule({
  imports: [
    CommonModule,
    ValuteTypeRoutingModule
  ],
  declarations: [ValuteTypeComponent]
})
export class ValuteTypeModule { }
