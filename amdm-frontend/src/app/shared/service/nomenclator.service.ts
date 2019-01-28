import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NomenclatorService {

    constructor(private http: HttpClient) {
    }

    getMedicamentNomenclature(): Observable<any[]> {
        return this.http.get<any[]>('/api/nomenclator/medicaments', {});
    }

    getMedicamentClassifier(): Observable<any[]> {
        return this.http.get<any[]>('/api/classifier/medicaments', {});
    }

    getPricesClassifier(): Observable<any[]> {
        return this.http.get<any[]>('/api/classifier/prices', {});
    }

    getEconomicAgentsClassifier(): Observable<any[]> {
        return this.http.get<any[]>('/api/classifier/economic-agents', {});
    }
}
