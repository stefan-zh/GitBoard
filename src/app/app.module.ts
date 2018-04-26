import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GithubService } from './services/github.service';
// import { InMemoryDataService }  from './in-memory-data.service';
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
        //
        // // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
        // // and returns simulated server responses.
        // // Remove it when a real server is ready to receive requests.
        // HttpClientInMemoryWebApiModule.forRoot(
        //     InMemoryDataService, { dataEncapsulation: false }
        // )
    ],
    providers: [
        GithubService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
