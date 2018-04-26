import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { last, mergeMap, tap} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Contributor } from '../../models/contributor';
import { Repo } from '../../models/repo';

@Component({
    selector: 'app-repos',
    templateUrl: './orgs.component.html',
    styleUrls: ['./orgs.component.css']
})
export class OrgsComponent implements OnInit {

    loaded = false;
    notFound = false;
    repos: Repo[] = [];
    publicMembers: Map<number, Contributor>;
    sortedIntContrib: Contributor[] = [];
    sortedExtContrib: Contributor[] = [];
    cat: string;

    private internalContributors: Map<number, Contributor>;
    private externalContributors: Map<number, Contributor>;

    constructor(
        private route: ActivatedRoute,
        private githubService: GithubService
    ) { }

    ngOnInit() {
        this.cat = 'repos';
        this.publicMembers = new Map<number, Contributor>();
        this.internalContributors = new Map<number, Contributor>();
        this.externalContributors = new Map<number, Contributor>();
        this.route.params.subscribe(params => {
            this.loaded = false;
            this.fetchData(params['orgName']);
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
     * Applies the selected category (repos|contributors)
     *
     * @param {string} cat - the selected category
     */
    category(cat: string): void {
        this.cat = cat;
    }

    /**
     * Fetches all repo and contributor information for the given organization
     *
     * @param {string} orgName - the name of the organization
     */
    getRepos(orgName: string): void {
        const repoBuild: Repo[] = [];
        this.githubService.getRepos(orgName).pipe(
            mergeMap(repo => this.getRepoContributors(orgName, repo))
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

                // sort collections
                this.sortedIntContrib = Array.from(this.internalContributors.values());
                this.sortedIntContrib.sort((a, b) => b.contributions - a.contributions);
                this.sortedExtContrib = Array.from(this.externalContributors.values());
                this.sortedExtContrib.sort((a, b) => b.contributions - a.contributions);
            }
        );
    }

    // fetches contributors data for the repo
    private getRepoContributors(orgName: string, repo: Repo): Observable<Repo> {
        repo.contributors = [];
        return this.githubService.getRepoContributors(orgName, repo.name).pipe(
            tap(contributor => {
                // add to the total collection of contributors for this repo
                repo.contributors.push(contributor);

                // update the contributor statistics maps
                const publicMember = this.publicMembers.get(contributor.id);
                const map = publicMember ? this.internalContributors : this.externalContributors;
                let contrib = map.get(contributor.id);
                if (contrib) {
                    contrib.contributions = contrib.contributions + contributor.contributions;
                } else {
                    contrib = new Contributor();
                    contrib.id = contributor.id;
                    contrib.login = contributor.login;
                    contrib.html_url = contributor.html_url;
                    contrib.contributions = contributor.contributions;
                }
                map.set(contributor.id, contrib);
            }),
            // only picks the last contributor and replaces him/her with the repo
            last(
                () => false,
                () => repo,
                repo
            )
        );
    }

    /**
     * Fetches the repo and contributors data
     *
     * @param {string} orgName - the organization
     */
    fetchData(orgName: string): void {
        this.githubService.getOrgPublicMembers(orgName)
            .subscribe(
                member => this.publicMembers.set(member.id, member),
                error => {
                    this.loaded = true;
                    this.notFound = true;
                    console.log(error);
                },
                () => this.getRepos(orgName)
            );
    }

}
