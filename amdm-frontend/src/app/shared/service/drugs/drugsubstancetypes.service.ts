import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class DrugSubstanceTypesService {
    constructor(private http: HttpClient) {}

    getDrugSubstanceTypesList() : Observable<any[]> {
        return this.http.get<any[]>('/api/drug-substance-types/all-drug-substance-types');
    }

}