import { Component, OnInit } from '@angular/core';
import { Repo } from '../repo';
import { GithubService } from '../github.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-repos',
    templateUrl: './repos.component.html',
    styleUrls: ['./repos.component.css']
})
export class ReposComponent implements OnInit {

    repos: Repo[] = [];

    constructor(
        private route: ActivatedRoute,
        private githubService: GithubService
    ) { }

    ngOnInit() {
        this.getRepos();
    }

    sortBy(property: string): void {
        this.repos.sort((a, b) => b[property] - a[property]);
    }

    getRepos(): void {
        const orgName = this.route.snapshot.paramMap.get('orgName');
        this.githubService.getRepos(orgName)
            .subscribe(
                repo => this.repos.push(repo)
            );
    }

}
