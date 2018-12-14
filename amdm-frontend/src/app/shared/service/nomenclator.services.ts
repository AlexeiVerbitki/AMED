import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class NomenclatorServices {
    constructor(private http: HttpClient) {
    }

    getAllBanks(): Observable<any> {
        return this.http.get('/api/nomenclator/all-banks', {});
    }

    getAllBanksAccounts(): Observable<any> {
        return this.http.get('/api/nomenclator/all-banks-accounts', {});
    }

}
