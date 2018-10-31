import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsArchiveComponent } from './documents-archive.component';

const routes: Routes = [
  {path: '', component: DocumentsArchiveComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsArchiveRoutingModule { }
