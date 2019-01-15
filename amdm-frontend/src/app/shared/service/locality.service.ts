import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LocalityService {

    constructor(private http: HttpClient) {
    }


    loadLocalityDetails(id: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('id', id);

        return this.http.get<any[]>('/api/localities/load-locality', {params: Params});
    }
}
