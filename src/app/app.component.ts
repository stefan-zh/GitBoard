import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'GitBoard';
    org: string = '';

    search(term: string): void {
        this.org = term;
    }
}
