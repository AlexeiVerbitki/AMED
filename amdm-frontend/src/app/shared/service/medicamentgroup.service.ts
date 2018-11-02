import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class MedicamentGroupService {
    constructor(private http: HttpClient) {}

    getMedicamentGroupList() : Observable<any[]> {
        return this.http.get<any[]>('/api/medicament-group/all-medicament-groups');
    }

}