import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MedicamentService {
    constructor(private http: HttpClient) {
    }

    getMedicamentNamesAndCodeList(partialName: string): Observable<any[]> {
        let Params = new HttpParams();
        Params = Params.set('partialName', partialName);

        return this.http.get<any[]>('/api/medicaments/search-medicament-names-by-name-or-code', {params: Params});
    }

    getMedicamentById(id: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('id', id);

        return this.http.get<any>('/api/medicaments/search-medicament-by-id', {params: Params});
    }

    getMedicamentByCode(code: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('code', code);

        return this.http.get<any>('/api/medicaments/search-medicament-by-code', {params: Params});
    }

    interruptProcess(details: any): Observable<any> {
        return this.http.post<any>('/api/medicaments/interrupt-process', details, {observe: 'response'});
    }

    saveDetailsFromCartelaMedicament(details: any): Observable<any> {
        return this.http.post<any>('/api/medicaments/save-cartela-medicament', details, {observe: 'response'});
    }

    getMedicamentHistory(codes: any): Observable<any> {
        return this.http.post<any>('/api/medicaments/medicament-history', codes, {observe: 'response'});
    }

    getMedicamentByRegisterNumber(registerNumber: any): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('registerNumber', registerNumber);
        return this.http.get<any>('/api/medicaments/search-medicaments-by-register-number', {params: Params});
    }

    getMedicamentByRegisterNumberFullDetails(registerNumber: any): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('registerNumber', registerNumber);
        return this.http.get<any>('/api/medicaments/search-medicaments-by-register-number-full-details', {params: Params});
    }

    getMedicamentsByFilter(filter: any): Observable<any> {
        return this.http.post<any>('/api/medicaments/by-filter', filter, {observe: 'response'});
    }

    getMedicamentByName(medName: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('medName', medName);
        console.log('medName:', medName);

        return this.http.get<any>('/api/medicaments/all-by-name', {params: Params});
    }

    getMedicamentByNameWithPrice(medName: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('medName', medName);
        console.log('medName:', medName);

        return this.http.get<any>('/api/medicaments/all-by-name-with-price', {params: Params});
    }

    getMedPrice(medicamentId: string): Observable<any> {
        return this.http.get('/api/price/med-current-price', {params: {id: medicamentId}});
    }
}
