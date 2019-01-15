import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { InstructionComponent } from './instruction.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MaterialSharedModule} from '../../material-shared.module';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {PipeModule} from '../../shared/pipe/pipe.module';


@NgModule({
  imports: [
    CommonModule, NgSelectModule,  ReactiveFormsModule,   MaterialSharedModule.forRoot(),
      MDBBootstrapModule.forRoot(), PipeModule
  ],
  declarations: [InstructionComponent],
  exports: [InstructionComponent, CommonModule, FormsModule],
  providers: [UploadFileService, PipeModule]

})
export class InstructionModule { }
