import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DrugDecisionsService {
    constructor(private http: HttpClient) {
    }

    getDrugDecisionsByFilter(filter: any): Observable<any> {

        return this.http.post<any>('/api/drug-decisions/by-filter', filter, {observe: 'response'});

    }

    getDrugDecisionById(id: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('id', id);

        return this.http.get<any>('/api/drug-decisions/by-id', {params: Params});
    }

    getCompaniesByNameCodeAndIdno(term: string, idno: string): Observable<any> {

        const filter = {
            name: term,
            code: term,
            idno: idno
        };

        return this.http.post<any>('/api/drug-decisions/search-companies-by-name-or-code-and-idno', filter);

    }

    getAuthorizedSubstancesByNameOrCode(term: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('term', term);

        return this.http.get<any>('/api/drug-decisions/search-substances-by-name-or-code', {params: Params});
    }

    getImportExportDetailsBySubstance(id: any): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('id', id);

        return this.http.get<any>('/api/drug-decisions/get-import-export-details-by-substance-id', {params: Params});
    }

    getImportExportDetailsByDecisionId(id: any): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('id', id);

        return this.http.get<any>('/api/drug-decisions/get-import-export-details-by-decision-id', {params: Params});
    }

    saveImportExportDetails(substanceDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/drug-decisions/save-import-export-details', substanceDetails, {observe: 'response'});
    }


    addAuthorizationDetails(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/drug-decisions/add-authorization-details', requestDetails, {observe: 'response'});
    }

    getUnitsByRefUnitCode(code: any): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('refCode', code);

        return this.http.get<any>('/api/drug-decisions/get-units-by-reference-code', {params: Params});
    }

    getOldDetailsByCompanyCode(code: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('code', code);

        return this.http.get<any>('/api/drug-decisions/get-old-details-by-company-code', {params: Params});
    }

    getRequest(id: string): Observable<any> {
        return this.http.get('/api/drug-decisions/load-request', {params: {id: id}});
    }


    searchLastRequest(filialId: string): Observable<any> {
        return this.http.get('/api/drug-decisions/search-last-act-auth', {params: {filialId: filialId}});
    }

    generateRegistrationRequestNumber(): Observable<any> {
        return this.http.get('/api/drug-decisions/generate-registration-request-number', {});
    }
}
