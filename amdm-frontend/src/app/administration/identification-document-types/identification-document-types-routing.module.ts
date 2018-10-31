import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentificationDocumentTypesComponent } from './identification-document-types.component';

const routes: Routes = [
  {path: '', component: IdentificationDocumentTypesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentificationDocumentTypesRoutingModule { }
