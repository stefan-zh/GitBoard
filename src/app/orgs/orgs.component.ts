import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Contributor } from '../models/contributor';
import { Repo } from '../models/repo';

@Component({
    selector: 'app-repos',
    templateUrl: './orgs.component.html',
    styleUrls: ['./orgs.component.css']
})
export class OrgsComponent implements OnInit {

    loaded = false;
    notFound = false;
    repos: Repo[] = [];

    constructor(
        private route: ActivatedRoute,
        private githubService: GithubService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loaded = false;
            this.getRepos(params['orgName'])
        });
    }

    /**
     * Sorts the repos
     *
     * @param {string} property - the property on which we are sorting
     */
    sortBy(property: string): void {
        this.repos.sort((a, b) => {
            const left = a[property];
            const right = b[property];
            if (Array.isArray(left) && Array.isArray(right)) {
                return right.length - left.length
            }
            return right - left;
        });
    }

    /**
     * Fetches all repo and contributor information for the given organization
     *
     * @param {string} orgName - the name of the organization
     */
    getRepos(orgName: string): void {
        const repoBuild: Repo[] = [];
        this.githubService.getRepos(orgName).pipe(
            map(repo => this.getRepoContributors(orgName, repo))
        ).subscribe(
            repo => repoBuild.push(repo),
            error => {
                this.loaded = true;
                this.notFound = true;
                this.repos = [];
                console.log(error);
            },
            () => {
                this.loaded = true;
                this.notFound = false;
                this.repos = repoBuild;
            }
        );
    }

    // fetches contributors data for the repo
    private getRepoContributors(orgName: string, repo: Repo): Repo {
        const contributors: Contributor[] = [];
        repo.contributors = contributors;
        this.githubService.getRepoContributors(orgName, repo.name)
            .subscribe(
                contributor => contributors.push(contributor),
                error => console.log(error),
                () => repo.contributors = contributors
            );
        return repo;
    }

}
