import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Medicament} from '../../models/medicament';

@Injectable({providedIn: 'root'})
export class MedicamentService {
    constructor(private http: HttpClient) {
    }

    // getMedicamentNamesList(partialName: string): Observable<any[]> {
    //     let Params = new HttpParams();
    //     Params = Params.set('partialName', partialName);
    //
    //     return this.http.get<any[]>('/api/medicaments/search-medicament-names-by-name', {params: Params});
    // }

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

    interruptProcess(details: any): Observable<any> {
        return this.http.post<any>('/api/medicaments/interrupt-process', details, {observe: 'response'});
    }

    getMedicamentByRegisterNumber(registerNumber: any): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('registerNumber', registerNumber);
        return this.http.get<any>('/api/medicaments/search-medicaments-by-register-number',{params: Params});
    }

}
