import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GenerateDocumentsComponent} from "./generate-documents/generate-documents.component";

const routes: Routes = [
    {path: 'generate-documents', component: GenerateDocumentsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreateDocumentRoutingModule {
}
