import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class AnnihilationService {
    constructor(private http: HttpClient) { }

    confirmRegisterAnnihilation (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/annihilation/new-annihilation', model, {observe: 'response'});
    }
}