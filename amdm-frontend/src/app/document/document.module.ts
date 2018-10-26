import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DocumentComponent } from "./document.component";
import {UploadFileService} from "../shared/service/upload/upload-file.service";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  imports: [
    CommonModule,NgSelectModule,  ReactiveFormsModule,
  ],
  declarations: [DocumentComponent],
  exports: [DocumentComponent, CommonModule, FormsModule],
    providers: [UploadFileService]
})
export class DocumentModule { }
