import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class DrugDocumentsService {

    constructor(private http: HttpClient) {
    }

    viewAuthorization(data: any): Observable<any> {
        return this.http.post('/api/documents/view-authorization-data', data, {responseType: 'blob'});
    }

    viewImportExportAuthorization(data: any): Observable<any> {
        return this.http.post('/api/documents/view-import-export-authorization-data', data, { responseType: 'blob'});
    }

    viewScrisoareDeRefuz(data: any): Observable<any> {
        return this.http.post('/api/documents/view-scrisoare-de-refuz', data, {responseType: 'blob'});
    }
}
