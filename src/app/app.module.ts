import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GithubService } from './services/github.service';
import { AppRoutingModule } from './app-routing.module';
import { OrgsComponent } from './components/orgs/orgs.component';

@NgModule({
    declarations: [
        AppComponent,
        OrgsComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        GithubService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
