import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentComponent } from "./document.component";
import {UploadFileService} from "../shared/service/upload/upload-file.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DocumentComponent],
  exports: [DocumentComponent, CommonModule, FormsModule],
    providers: [UploadFileService]
})
export class DocumentModule { }
