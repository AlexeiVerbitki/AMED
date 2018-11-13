import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValuteRoutingModule } from './valute-routing.module';
import {ValuteComponent} from "./valute.component";

@NgModule({
  imports: [
    CommonModule,
    ValuteRoutingModule
  ],
  declarations: [ValuteComponent]
})
export class ValuteModule { }
