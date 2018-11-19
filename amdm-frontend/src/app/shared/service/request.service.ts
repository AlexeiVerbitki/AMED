import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class RequestService {

    constructor(private http: HttpClient) {
    }

    addMedicamentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-medicament-request', requestDetails, {observe: 'response'});
    }

    addMedicamentHistoryRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-medicament-history-request', requestDetails, {observe: 'response'});
    }

    getMedicamentRequest(id: string): Observable<any> {
        return this.http.get('/api/load-medicament-request', {params: {id: id}});
    }

    saveClinicalTrailRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/save-clinical-trail-request', requestDetails, {observe: 'response'});
    }


    addClinicalTrailRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-clinical-trail-request', requestDetails, {observe: 'response'});
    }

    addOutputDocumentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-output-document-request', requestDetails, {observe: 'response'});
    }

    getClinicalTrailRequest(id: string): Observable<any> {
        return this.http.get('/api/load-clinical-trail-request', {params: {id: id}});
    }

    addPriceRequests(requests: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-prices-request', requests, {observe: 'response'});
    }

    //used for interrupt proces s
    addMedicamentHistory(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-medicament-history', requestDetails, {observe: 'response'});
    }

    addImportRequest(requestDetails: any): Observable<HttpResponse<any>> {
        // console.log("requestDetails before sending ",requestDetails);
        return this.http.post<any>('/api/add-import-request', requestDetails, {observe: 'response'});

    }
    getImportRequest(id: string): Observable<any> {
        return this.http.get('/api/load-import-request', {params: {id: id}});
    }
}