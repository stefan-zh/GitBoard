import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Contributor } from '../models/contributor';
import { Repo } from '../models/repo';

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
            tap(repo => this.getRepoContributors(orgName, repo))
        ).subscribe(
            repo => repoBuild.push(repo),
            error => console.log(error),
            () => {
                this.repos = repoBuild;
                this.loaded = true;
            }
        );
    }

    // fetches contributors data for the repo
    private getRepoContributors(orgName: string, repo: Repo): void {
        const contributors: Contributor[] = [];
        this.githubService.getRepoContributors(orgName, repo.name)
            .subscribe(
                contributor => contributors.push(contributor),
                error => console.log(error),
                () => repo.contributors = contributors
            );
    }

}
