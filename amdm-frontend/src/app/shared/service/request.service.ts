import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class RequestService {

    constructor(private http: HttpClient) {
    }

    addMedicamentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-medicament-request', requestDetails, {observe: 'response'});
    }

    addGMPRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-gmp-request', requestDetails, {observe: 'response'});
    }

    finishGMPRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/finish-gmp-request', requestDetails, {observe: 'response'});
    }

    addMedicamentHistoryRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-medicament-history-request', requestDetails, {observe: 'response'});
    }

    getMedicamentRequest(id: string): Observable<any> {
        return this.http.get('/api/load-medicament-request', {params: {id: id}});
    }

    loadGMPDetails(id: string): Observable<any> {
        return this.http.get('/api/load-gmp-details', {params: {id: id}});
    }

    validIDNP(idnp: string): Observable<any> {
        return this.http.get('/api/validate-idnp', {params: {idnp: idnp}});
    }

    getOldRequestIdByMedicamentRegNr(regNr: string): Observable<any> {
        return this.http.get('/api/get-old-request-id-by-medicament-regnr', {params: {regNr: regNr}});
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

    addClinicalTrailNotificationRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/clinical-trails/add-notification-request', requestDetails, {observe: 'response'});
    }

    addClinicalTrailAmendmentNextRequest(requestDetails: any): Observable<HttpResponse<any>> {
        console.log('addClinicalTrailAmendmentNextRequest');
        return this.http.post<any>('/api/clinical-trails/add-amendment-next-reques', requestDetails, {observe: 'response'});
    }

    finishClinicalTrailAmendmentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        console.log('finishClinicalTrailAmendmentRequest');
        return this.http.post<any>('/api/clinical-trails/finish-amendment-request', requestDetails, {observe: 'response'});
    }

    finishClinicalTrailNotificationRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/clinical-trails/finish-notification-request', requestDetails, {observe: 'response'});
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
    addInvoiceRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-invoice-request', requestDetails, {observe: 'response'});
    }
    viewImportAuthorization(object: any): Observable<any> {
        return this.http.post('/api/view-import-authorization', object, { responseType: 'blob'});
    }
    viewImportAuthorizationSpecification(object: any): Observable<any> {
        return this.http.post('/api/view-import-authorization-specification', object, { responseType: 'blob'});
    }

    getAuthorizationDetailsByNameOrCode(id: string, authId: string): Observable<any> {
        return this.http.get('/api/load-import-authorization-details', {params: {id: id, authId: authId}});
    }

    getAuthorizationByFilter(authorizationsNumber: any, applicant: any,expirationDate: any, summ: any, currency: any ): Observable<any> {
      return this.http.get('/api/load-import-authorization-by-filter', {params: {authorizationsNumber: authorizationsNumber, applicant: applicant, expirationDate: expirationDate, summ: summ, currency: currency}});
      // return this.http.get('/api/load-import-authorization-by-filter', {authorizationsNumber, applicant, expirationDate, summ, currency});
    }

    getInvoiceQuota(nameOrCodeAmed: string, authorizationNumber: string): Observable<any> {
        return this.http.get('/api/get-invoice-quota', {params: {nameOrCodeAmed: nameOrCodeAmed, authorizationNumber: authorizationNumber}});
    }
    getAuthorizationByAuth(id: string): Observable<any> {
        return this.http.get('/api/load-import-authorization-byAuth', {params: {id: id}});
    }
    // getAuthorizationByAuth(id: string): Observable<any> {
    //     return this.http.get('/api/load-import-authorization-byAuth', {params: {id: id}});
    // }

    getActiveLicenses(id: string): Observable<any> {
        return this.http.get('/api/load-active-licenses', {params: {id: id}});
    }

    getMedPricesHistory(medicamentId: string): Observable<any> {
        return this.http.get('/api/price/med-prev-prices', {params: {id: medicamentId}});
    }

    getDocumentModuleRequest(id: string): Observable<any> {
        return this.http.get('/api/load-document-module-request', {params: {id: id}});
    }

    saveDocumentModuleRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/doc-module/save-document-request', requestDetails, {observe: 'response'});
    }

    includeExpertsInDD(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/include-experts-dd', requestDetails, {observe: 'response'});
    }

    getRequestsForDD(): Observable<any> {
        return this.http.get('/api/get-request-dd');
    }

    getRequestsForDDM(): Observable<any> {
        return this.http.get('/api/get-request-ddm');
    }

    getRequestsForOI(): Observable<any> {
        return this.http.get('/api/get-request-oi');
    }

    getRequestsForOIM(): Observable<any> {
        return this.http.get('/api/get-request-oim');
    }

    getMedicamentsForOA(): Observable<any> {
        return this.http.get('/api/get-medicaments-oa');
    }

    getMedicamentsForOM(): Observable<any> {
        return this.http.get('/api/get-medicaments-om');
    }

    getDDs(): Observable<any> {
        return this.http.get('/api/get-dds');
    }

    getDDMs(): Observable<any> {
        return this.http.get('/api/get-ddms');
    }


    getOIs(): Observable<any> {
        return this.http.get('/api/get-ois');
    }

    getOIMs(): Observable<any> {
        return this.http.get('/api/get-oims');
    }

    getOAs(): Observable<any> {
        return this.http.get('/api/get-oas');
    }

    getOMs(): Observable<any> {
        return this.http.get('/api/get-oms');
    }

    setMedicamentApproved(ids: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/medicament-approved', ids, {observe: 'response'});
    }

    setMedicamentModifyApproved(id: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/medicament-modify-approved', id, {observe: 'response'});
    }

    getOldRequestTerm(code: string): Observable<any>  {
        return this.http.get('/api/get-old-request-term', {params: {code: code}});
    }

    getRequestsForDDCt(): Observable<any> {
        return this.http.get('/api/get-request-dd-ct');
    }

    getRequestsForDDACt(): Observable<any> {
        return this.http.get('/api/get-request-dd-amd-ct');
    }

    getDDCs(): Observable<any> {
        return this.http.get('/api/get-ddcs');
    }

    getDDACs(): Observable<any> {
        return this.http.get('/api/get-ddacs');
    }

    getRequestsForAnih(): Observable<any> {
        return this.http.get('/api/get-request-anih');
    }

    getAnihs(): Observable<any> {
        return this.http.get('/api/get-anih-meds');
    }

    interruptGMPProcess(details: any): Observable<any> {
        return this.http.post<any>('/api/interrupt-gmp-process', details, {observe: 'response'});
    }

}
