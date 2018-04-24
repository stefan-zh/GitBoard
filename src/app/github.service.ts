import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { expand, map, mergeMap } from 'rxjs/operators';
import { Repo } from './models/repo';

const httpOptions: {headers: HttpHeaders, observe: 'response'} = {
    observe: 'response',
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'token 99133ba6c79c5d94db6f7e0392c482839e44cbbc'
    })
};

@Injectable()
export class GithubService {

    constructor(private http: HttpClient) { }

    // returns an observable with the contents and next link
    private getPage(url: string): Observable<{
        content: Repo[],
        next: string | null
    }> {
        return this.http.get<Repo[]>(url, httpOptions).pipe(
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
        return this.getPage(url).pipe(
            expand(({next}) => next ? this.getPage(next) : empty()),
            mergeMap(({content}) => content)
        );
    }

}
