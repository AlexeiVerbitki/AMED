import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

@Injectable({
    providedIn: 'root'
})
export class ClinicalTrialService {

    constructor(private http: HttpClient) {
    }

    loadClinicalTrailListByFilter(filter: any): Observable<any> {
        return this.http.post('/api/clinical-trails/get-filtered-clinical-trials', filter);
    }

    loadClinicalTrailById(id: string): Observable<any> {
        return this.http.get('/api/clinical-trails/get-clinical-trial-id', {params: {id: id}});
    }

    loadRegistrationRequestById(id: string): Observable<any> {
        return this.http.get('/api/clinical-trails/load-request', {params: {id: id}});
    }

    generateDocNr(): Observable<any> {
        return this.http.get('/api/clinical-trails/generate-ct-sequence-nr', {});
    }

    validIDNP(idnp: string): Observable<any> {
        return this.http.get('/api/validate-idnp', {params: {idnp: idnp}});
    }
}
