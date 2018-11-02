import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class PharmaceuticalFormsService {
    constructor(private http: HttpClient) {}

    getPharmaceuticalFormsList() : Observable<any[]> {
        return this.http.get<any[]>('/api/pharmaceutical-forms/all-pharmaceutical-forms');
    }

}