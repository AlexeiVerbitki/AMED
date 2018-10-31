import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsTypeComponent } from './documents-type.component';

const routes: Routes = [
  {path: '', component: DocumentsTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsTypeRoutingModule { }
