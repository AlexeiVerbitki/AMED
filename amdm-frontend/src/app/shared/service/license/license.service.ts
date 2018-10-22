import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable()
export class LicenseService {

    constructor(private http: HttpClient) { }


    confirmRegisterLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/new-license', model, {observe: 'response'});
    }

    saveEvaluateLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/save-evaluation-license', model, {observe: 'response'});
    }

    retrieveAllRequestTypes(): Observable<any> {
        return this.http.get('/api/license/all-license-request-types');
    }

    retrieveLicenseByRequestId(id: string): Observable<any> {
        return this.http.get('/api/license/retrieve-license-by-request-id', {params :{ id : id} });
    }

    loadAnnounces(): Observable<any> {
        return this.http.get('/api/license/retrieve-announce-methods');
    }

}