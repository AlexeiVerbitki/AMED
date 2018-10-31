import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationBankAccountsComponent } from './organization-bank-accounts.component';

const routes: Routes = [
  {path: '', component: OrganizationBankAccountsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationBankAccountsRoutingModule { }
