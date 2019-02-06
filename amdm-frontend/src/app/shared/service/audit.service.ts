import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuditService {

    constructor(private http: HttpClient) {
    }

    loadAuditListByFilter(object: any): Observable<any> {
        return this.http.post('/api/audit/get-filtered-audit', object);
    }


    findAllCategories(): Observable<any> {
        return this.http.get('/api/audit/get-all-categories');
    }


}
