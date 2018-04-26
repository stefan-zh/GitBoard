import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { expand, map, mergeMap } from 'rxjs/operators';
import { Repo } from '../models/repo';
import { Contributor } from '../models/contributor';

const httpOptions: {headers: HttpHeaders, observe: 'response'} = {
    observe: 'response',
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'token %PERSONAL_ACCESS_TOKEN%'
    })
};

@Injectable()
export class GithubService {

    constructor(private http: HttpClient) { }

    // returns an observable with the contents and next link
    private getPage<T>(url: string): Observable<{
        content: T[],
        next: string | null
    }> {
        return this.http.get<T[]>(url, httpOptions).pipe(
            map(resp => ({
                content: resp.body,
                next: this.nextLink(resp.headers)
            }))
        );
    }

    // extracts the next link from the link header
    private nextLink(headers: HttpHeaders): string | null {
        const link = headers.get('link');
        if (link) {
            const match = link.match(/<([^>]+)>;\s*rel="next"/);
            if (match) {
                const [, nextUrl] = match;
                return nextUrl;
            }
        }
        return null;
    }

    /**
     * Returns a stream of repos.
     *
     * @param {string} orgName - the organization name
     * @returns {Observable<Repo>} - stream of repos
     */
    getRepos(orgName: string): Observable<Repo> {
        if (!orgName.trim()) {
            // if not search term, return empty array.
            return empty();
        }
        const url = `https://api.github.com/orgs/${orgName}/repos?per_page=100`;
        return this.getPage<Repo>(url).pipe(
            expand(({next}) => next ? this.getPage(next) : empty()),
            mergeMap(({content}) => content)
        );
    }

    /**
     * Return a stream of contributors
     *
     * @param {string} orgName - the name of the organization
     * @param {string} repoName - the name of the repository
     * @returns {Observable<Contributor>} - the contributors on that repository
     */
    getRepoContributors(orgName: string, repoName: string): Observable<Contributor> {
        if (!orgName.trim() || !repoName.trim()) {
            // if not search term, return empty array.
            return empty();
        }
        const url = `https://api.github.com/repos/${orgName}/${repoName}/contributors?per_page=100`;
        return this.getPage<Contributor>(url).pipe(
            expand(({next}) => next ? this.getPage(next) : empty()),
            mergeMap(({content}) => content)
        );
    }

    /**
     * Gets the stream of public members of the organization.
     *
     * @param {string} orgName - the name of the organization
     * @returns {Observable<Contributor>} - the stream of public members
     */
    getOrgPublicMembers(orgName: string): Observable<Contributor> {
        if (!orgName.trim()) {
            // if not search term, return empty array.
            return empty();
        }
        const url = `https://api.github.com/orgs/${orgName}/public_members?per_page=100`;
        return this.getPage<Contributor>(url).pipe(
            expand(({next}) => next ? this.getPage(next) : empty()),
            mergeMap(({content}) => content)
        );
    }

}
