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

    evaluateNextLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/next-evaluation-license', model, {observe: 'response'});
    }


    stopLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/stop-license', model, {observe: 'response'});
    }

    finishLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/finish-license', model, {observe: 'response'});
    }


    confirmIssueLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/confirm-issue-license', model, {observe: 'response'});
    }


    confirmModifyLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/confirm-modify-license', model, {observe: 'response'});
    }

    confirmDuplicateLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/confirm-duplicate-license', model, {observe: 'response'});
    }

    retrieveAllRequestTypes(): Observable<any> {
        return this.http.get('/api/license/all-license-request-types');
    }

    retrieveLicenseByRequestId(id: string): Observable<any> {
        return this.http.get('/api/license/retrieve-license-by-request-id', {params :{ id : id} });
    }

    retrieveLicenseByEconomicAgentId(id: string): Observable<any> {
        return this.http.get('/api/license/retrieve-license-by-economic-agent-id', {params :{ id : id} });
    }

    loadAnnounces(): Observable<any> {
        return this.http.get('/api/license/retrieve-announce-methods');
    }

    loadActivities(): Observable<any> {
        return this.http.get('/api/license/retrieve-activities');
    }

}