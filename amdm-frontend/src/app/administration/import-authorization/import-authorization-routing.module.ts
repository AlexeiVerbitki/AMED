import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportAuthorizationComponent } from './import-authorization.component';

const routes: Routes = [
  {path: '', component: ImportAuthorizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportAuthorizationRoutingModule { }
