import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class DrugDecisionsService {
    constructor(private http: HttpClient) {
    }

    getDrugDecisionsByFilter(filter: any): Observable<any> {

        return this.http.post<any>('/api/drug-decisions/by-filter', filter, {observe: 'response'});

    }

    getDrugDecisionById(id: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('id', id);

        return this.http.get<any>('/api/drug-decisions/by-id', {params: Params});
    }
}