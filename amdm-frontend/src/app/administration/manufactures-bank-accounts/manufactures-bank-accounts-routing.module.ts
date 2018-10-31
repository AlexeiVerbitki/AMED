import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManufacturesBankAccountsComponent } from './manufactures-bank-accounts.component';

const routes: Routes = [
  {path: '', component: ManufacturesBankAccountsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManufacturesBankAccountsRoutingModule { }
