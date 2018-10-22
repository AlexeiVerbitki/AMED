import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DocumentService {

    constructor(private http: HttpClient) {
    }

    uploadDocument() {
    }

    removeDocument() {
    }

    generateDistributionDisposition(nrCerere : any): Observable<any> {
        return this.http.get('/api/documents/generate-distribution-disposition', {
            params: {nrCerere: nrCerere},
            responseType: 'text'
        });
    }
}
