import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddEcAgentComponent} from './add-ec-agent/add-ec-agent.component';
import {EcAgentListComponent} from './ec-agent-list/ec-agent-list.component';

const routes: Routes = [
    {path: 'ec-agent/add', component: AddEcAgentComponent},
    {path: 'ec-agent/view-all', component: EcAgentListComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcAgentRoutingModule {
}
