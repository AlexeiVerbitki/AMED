import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Params} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NomenclatorService {

    constructor(private http: HttpClient) {
    }

    getMedicamentNomenclature(): Observable<any[]> {
        return this.http.get<any[]>('/api/nomenclator/medicaments', {});
    }

    getPricesClassifier(): Observable<any[]> {
        return this.http.get<any[]>('/api/classifier/prices', {});
    }

    getEconomicAgentsClassifier(): Observable<any[]> {
        return this.http.get<any[]>('/api/classifier/economic-agents', {});
    }

    getMedicamentInstructions(medId: string): Observable<any[]> {
        let Params = new HttpParams();
        Params = Params.set('medicamentId', medId);
        return this.http.get<any[]>('/api/nomenclator/medicament-instructions', {params: Params});
    }

    loadFile(relativePath: string): Observable<any> {
        return this.http.get('/api/documents/view-document', {params: {relativePath: relativePath}, responseType: 'blob'});
    }
}
