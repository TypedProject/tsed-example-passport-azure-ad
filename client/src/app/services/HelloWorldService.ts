import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ToasterService} from "angular2-toaster";
import {AuthService} from "./core/azureAd/AuthService";
import {flatMap, map} from "rxjs/operators";
import {HttpClientService} from "./core/azureAd/HttpClientService";

const SERVER_URL = "http://localhost:8070";
// const HELLO = "/rest/hello-no-world";
const HELLO = "/rest/hello-world";
const AUTH = "/rest/hello-auth";
const HEAD_AUTH = "/rest/hello-head-auth";

const SCOPE_BASE = "api://translationeditor-test";

interface HttpOptions {
    scopes: string[];
}

const ADD_SCOPE_BASE = (i => {
    if (i.search(SCOPE_BASE) === -1) {
        return SCOPE_BASE + "/" + i;
    }
});

@Injectable()
export class HelloWorldService {

    // constructor(private http: HttpClient, private authService: AuthService, private toast: ToasterService) {
    constructor(private httpClientService: HttpClientService, private toast: ToasterService) {
        httpClientService.setServer(SERVER_URL);
    }

    // async httpOptions(options: HttpOptions = {scopes: []}): Promise<any> {
    //     if (!SERVER_URL) {
    //         throw new Error(`httpOptions - server is not defined`);
    //     }
    //     const headers = {
    //         "Content-Type": "application/json",
    //         "Access-Control-Allow-Origin": SERVER_URL,
    //         Authorization: "Bearer " + bearer,
    // };
    // console.log(`httpOptions - given scopes: ${JSON.stringify(options.scopes)}`);
    // if (options.scopes && options.scopes.length > 0) {
    //     const bearer = await this.authService.retrieveToken(options.scopes);
    //     headers["Authorization"] = "Bearer " + bearer;
    // }
    // return {
    //     headers: new HttpHeaders(headers)
    // };
    // }

    async helloWorld(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.httpClientService.get(SERVER_URL + HELLO, {scopesApplied: true})
                .subscribe((value: any) => {
                    console.log(`SERVER_URL + HELLO get: ${JSON.stringify(value)}`);
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
            // let scopes = undefined;
            // this.http.head<any>(SERVER_URL + HELLO, {observe: "response", ...await this.httpOptions() as object})
            //     .pipe(map(response => {
            //             const scopesIn = response.headers.get("scopes");
            //             const scopes = typeof scopesIn === "string" ? JSON.parse(scopesIn) : scopesIn;
            //             console.log(`  mscopes: ${JSON.stringify(scopes)}`);
            //             return scopes ? scopes.scopes : [];
            //         }),
            //         flatMap(async requestScopes => {
            //             const scopes = requestScopes.map(ADD_SCOPE_BASE);
            //             console.log(`  helloWorld observabale - scopes: ${JSON.stringify(scopes)}`);
            //             return this.http.get(SERVER_URL + HELLO, {...await this.httpOptions({scopes}) as object});
            //         }),
            //         flatMap(response => {
            //             console.log(`flatMap response: ${JSON.stringify(response)}, keys: ${Object.keys(response)}`);
            //             return response;
            //         })
            //         , tap(value => console.log(`tap shows: ${JSON.stringify(value)}`))
            // )
            // .subscribe((value: any) => {
            //     console.log(`SERVER_URL + HELLO get: ${JSON.stringify(value)}`);
            //     return resolve(value);
            // }, (error) => {
            //     this.handleError(error, "helloWorld");
            //     reject(error);
            // });
        });
    }

    private handleError(error, where): any {
        let msg;
        if (error.status === 403) {
            msg = `Unauthorized: ${JSON.stringify(error)}`;
        } else {
            msg = JSON.stringify(error);
        }
        console.error(msg);
        this.toast.pop("error", where, msg);
    }
}
