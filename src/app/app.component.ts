import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'GitBoard';

    constructor(private router: Router) { }

    search(term: string) {
        return this.router.navigate([`/org/${term}`]);
    }
}
