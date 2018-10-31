import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationRequestComponent } from './registration-request.component';

const routes: Routes = [
  {path: '', component: RegistrationRequestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRequestRoutingModule { }
