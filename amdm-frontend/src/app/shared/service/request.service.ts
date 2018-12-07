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

    getMedicamentHistory(id: string): Observable<any> {
        return this.http.get('/api/load-medicament-history', {params: {id: id}});
    }

    saveClinicalTrailRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/clinical-trails/save-request', requestDetails, {observe: 'response'});
    }


    addClinicalTrailRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/clinical-trails/add-request', requestDetails, {observe: 'response'});
    }

    addClinicalTrailAmendmentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/clinical-trails/add-amendment-request', requestDetails, {observe: 'response'});
    }

    addClinicalTrailAmendmentNextRequest(requestDetails: any): Observable<HttpResponse<any>> {
        console.log('addClinicalTrailAmendmentNextRequest');
        return this.http.post<any>('/api/clinical-trails/add-amendment-next-reques', requestDetails, {observe: 'response'});
    }

    finishClinicalTrailAmendmentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        console.log('finishClinicalTrailAmendmentRequest');
        return this.http.post<any>('/api/clinical-trails/finish-amendment-request', requestDetails, {observe: 'response'});
    }

    savePostauthorizationMedicament(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/save-postauthorization-medicament', requestDetails, {observe: 'response'});
    }

    addOutputDocumentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-output-document-request', requestDetails, {observe: 'response'});
    }

    getClinicalTrailRequest(id: string): Observable<any> {
        return this.http.get('/api/clinical-trails/load-request', {params: {id: id}});
    }

    getClinicalTrailAmendmentRequest(id: string): Observable<any> {
        return this.http.get('/api/clinical-trails/load-amendment-request', {params: {id: id}});
    }

    saveClinicalTrailAmendmentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/clinical-trails/save-amendment-request', requestDetails, {observe: 'response'});
    }

    addPriceRequests(requests: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-prices-request', requests, {observe: 'response'});
    }

    addPriceRequest(request: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-price-request', request, {observe: 'response'});
    }

    addMedicamentHistory(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-medicament-history', requestDetails, {observe: 'response'});
    }


    addMedicamentRegistrationHistoryOnInterruption(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-medicament-registration-history', requestDetails, {observe: 'response'});
    }

    addMediacmentPostauthorizationHistoryOnInterruption(requestDetails: any): Observable<HttpResponse<any>> {
        console.log(requestDetails);
        return this.http.post<any>('/api/add-medicament-postauthorization-history', requestDetails, {observe: 'response'});
    }
    
    addDocumentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-document-request', requestDetails, {observe: 'response'});
    }

    getRequestsByRegNumber(regNumber: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/get-requests-by-registration-number', regNumber, {observe: 'response'});
    }
    addImportRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-import-request', requestDetails, {observe: 'response'});
    }
    getImportRequest(id: string): Observable<any> {
        return this.http.get('/api/load-import-request', {params: {id: id}});
    }

    getActiveLicenses(id: string): Observable<any> {
        return this.http.get('/api/load-active-licenses', {params: {id: id}});
    }

    getMedPricesHistory(medicamentId: string): Observable<any> {
        return this.http.get('/api/price/med-prev-prices',  {params: {id: medicamentId}});
    }
}