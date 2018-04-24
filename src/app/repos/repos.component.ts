import { Component, OnInit } from '@angular/core';
import { Repo } from '../models/repo';
import { GithubService } from '../github.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-repos',
    templateUrl: './repos.component.html',
    styleUrls: ['./repos.component.css']
})
export class ReposComponent implements OnInit {

    loaded = false;
    repos: Repo[] = [];

    constructor(
        private route: ActivatedRoute,
        private githubService: GithubService
    ) { }

    ngOnInit() {
        const orgName = this.route.snapshot.paramMap.get('orgName');
        this.getRepos(orgName);
    }

    sortBy(property: string): void {
        this.repos.sort((a, b) => b[property] - a[property]);
    }

    getRepos(orgName: string): void {
        const repoBuild: Repo[] = [];
        this.githubService.getRepos(orgName)
            .subscribe(
                repo => repoBuild.push(repo),
                error => console.log(error),
                () => {
                    this.repos = repoBuild;
                    this.loaded = true;
                }
            );
    }

}
