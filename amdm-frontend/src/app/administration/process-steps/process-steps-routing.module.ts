import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessStepsComponent } from './process-steps.component';

const routes: Routes = [
  {path: '', component: ProcessStepsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessStepsRoutingModule { }
