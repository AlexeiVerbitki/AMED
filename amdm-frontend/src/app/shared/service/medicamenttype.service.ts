import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class MedicamentTypeService {
    constructor(private http: HttpClient) {}

    getMedicamentTypesList() : Observable<any[]> {
        return this.http.get<any[]>('/api/medicament-type/all-medicament-types');
    }

}