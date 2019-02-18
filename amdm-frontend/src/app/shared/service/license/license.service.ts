import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class LicenseService {

    constructor(private http: HttpClient) { }


    confirmRegisterLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/new-license', model, {observe: 'response'});
    }

    saveEvaluateLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/save-evaluation-license', model, {observe: 'response'});
    }

    evaluateNextLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/next-evaluation-license', model, {observe: 'response'});
    }


    stopLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/stop-license', model, {observe: 'response'});
    }

    finishLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/finish-license', model, {observe: 'response'});
    }


    confirmIssueLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/confirm-issue-license', model, {observe: 'response'});
    }


    confirmModifyLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/confirm-modify-license', model, {observe: 'response'});
    }

    confirmDuplicateLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/confirm-duplicate-license', model, {observe: 'response'});
    }

    confirmPrelungireLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/confirm-prelungire-license', model, {observe: 'response'});
    }

    confirmAnulareLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/confirm-anulare-license', model, {observe: 'response'});
    }

    confirmSuspendareLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/confirm-suspendare-license', model, {observe: 'response'});
    }

    confirmReluareLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/confirm-reluare-license', model, {observe: 'response'});
    }

    confirmCesionareLicense (model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/license/confirm-cesionare-license', model, {observe: 'response'});
    }

    retrieveAllRequestTypes(): Observable<any> {
        return this.http.get('/api/license/all-license-request-types');
    }

    retrieveLicenseByRequestId(id: string): Observable<any> {
        return this.http.get('/api/license/retrieve-license-by-request-id', {params : { id : id} });
    }

    retrieveLicenseByRequestIdCompleted(id: string): Observable<any> {
        return this.http.get('/api/license/retrieve-license-by-request-id-completed', {params : { id : id} });
    }

    retrieveLicenseByIdno(idno: string): Observable<any> {
        return this.http.get('/api/license/retrieve-license-by-idno', {params : { idno : idno} });
    }

    retrieveSuspendedLicenseByIdno(idno: string): Observable<any> {
        return this.http.get('/api/license/retrieve-suspended-license-by-idno', {params : { idno : idno} });
    }

    loadAnnounces(): Observable<any> {
        return this.http.get('/api/license/retrieve-announce-methods');
    }

    loadActivities(): Observable<any> {
        return this.http.get('/api/license/retrieve-activities');
    }

    retrieveAgentsByIdnoWithoutLicense(idno: string): Observable<any> {
        return this.http.get('/api/license/retrieve-agents-by-idno-without-license', {params : { idno : idno} });
    }

    viewAnexaLicenta(object: any): Observable<any> {
        return this.http.post('/api/license/view-anexa-licenta', object, { responseType: 'blob'});
    }

    viewLicenta(object: any): Observable<any> {
        return this.http.post('/api/license/view-licenta', object, { responseType: 'blob'});
    }


    loadLicenseListByFilter(object: any): Observable<any> {
        return this.http.post('/api/license/get-filtered-licenses', object);
    }


    findLicenseById(id: string): Observable<any> {
        return this.http.get('/api/license/find-license-by-id', {params : { licenseId : id} });
    }

    loadEcAgentTypes(): Observable<any> {
        return this.http.get('/api/license/retrieve-economic-agent-type');
    }

    findRequestsForLicense(id: string): Observable<any> {
        return this.http.get('/api/license/find-requests-by-license-id', {params : { licenseId : id} });
    }

    compareRevisionForLicense(licenseId: string, reqId: string): Observable<any> {
        return this.http.get('/api/license/compare-with-previous-rev', {params : { licenseId : licenseId, reqId : reqId} });
    }

    generateRegistrationRequestNumber(): Observable<any> {
        return this.http.get('/api/license/generate-registration-request-number', {});
    }

}
