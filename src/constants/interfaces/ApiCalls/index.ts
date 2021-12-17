export abstract class ApiCalls {
    protected apiUrl: string;

    constructor(url: string) {
        this.apiUrl = url;
    }

    private parseQueryParameters(queryParams: {[key: string]: string|number} | undefined): string | null{
        if(!queryParams) return null;
        let query: string[] = [];
        for(let param in queryParams){
            query.push(`${param}=${queryParams[param]}`);
        }
        return `?${query.join('&')}`;
    }

    protected fetch(route: string, callback: (response: any) => void, queryParams?: {[key: string]: string|number}): void{
        fetch(`${this.apiUrl}${route}${this.parseQueryParameters(queryParams)}`)
            .then(response => response.json())
            .then(response => callback(response))
            .catch(err => console.error(err))
    }
}