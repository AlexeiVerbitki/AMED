import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrenciesHistoryComponent } from './currencies-history.component';

const routes: Routes = [
  {path: '', component: CurrenciesHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrenciesHistoryRoutingModule { }
