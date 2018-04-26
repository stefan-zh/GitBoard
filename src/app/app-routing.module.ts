import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgsComponent } from './orgs/orgs.component';

const routes: Routes = [
    { path: '', redirectTo: '/org/octokit', pathMatch: 'full' },
    { path: 'org/:orgName', component: OrgsComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
