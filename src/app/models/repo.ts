import { Contributor } from './contributor';

export class Repo {
    id: number;
    name: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    contributors: Contributor[];
}
