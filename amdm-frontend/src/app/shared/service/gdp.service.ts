import {Injectable} from '@angular/core';
import {AdministrationService} from './administration.service';
import {MedicamentService} from './medicament.service';
import {RequestService} from './request.service';
import {AuthService} from './authetication.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Company} from '../../models/company';
import {Country} from '../../models/country';
import {Currency} from '../../models/currency';
import {CurrencyHistory} from '../../models/currencyHistory';
import {DocumentService} from './document.service';
import {TaskService} from './task.service';
import {Price} from '../../models/price';


@Injectable({
    providedIn: 'root'
})
export class GDPService {

    constructor(private administrationService: AdministrationService,
                private medicamentService: MedicamentService,
                private requestService: RequestService,
                private authService: AuthService,
                private documentService: DocumentService,
                private taskService: TaskService,
                private http: HttpClient) {
    }

    getCompanies(): Observable<Company[]> {
        return this.administrationService.getAllCompaniesMinimal();
    }

    getRequestStepByIdAndCode(requestTypeId: string, code: string): Observable<any> {
        return this.taskService.getRequestStepByIdAndCode(requestTypeId, code);
    }

    getAllDocTypes(): Observable<any> {
        return this.administrationService.getAllDocTypes();
    }

    getMedicamentById(id: string): any {
        return this.medicamentService.getMedicamentById(id);
    }

    generateDocNumber(): Observable<any> {
        return this.http.get('/api/administration/generate-gmp-request-number', {});
    }

    generateCertificateNumber(): Observable<any> {
        return this.http.get('/api/administration/generate-gdp-certificate-number', {});
    }

    getAllMedicamentTypes(): Observable<any> {
        return this.administrationService.getAllMedicamentTypes();
    }

    getCountries(): Observable<Country[]> {
        return this.administrationService.getCountries();
    }

    getCurrenciesShort(): Observable<Currency[]> {
        return this.administrationService.getCurrenciesShort();
    }

    getUsername(): string {
        return this.authService.getUserName();
    }

    addRegistrationRequestForGDP(request: any): Observable<any> {
        return this.http.post<any>('/api/add-reg-request-gdp', request, {observe: 'response'});
    }

    validIDNP(idnp: string): Observable<boolean> {
        return this.requestService.validIDNP(idnp);
    }


    documentsByPricesIds(priceIds: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/price/documents-by-prices-ids', priceIds, {observe: 'response'});
    }

    getDocumentsByIds(requests: any): Observable<any> {
        return this.documentService.getDocumentsByIds(requests);
    }


    saveDocuments(documetns: any): Observable<any> {
        return this.http.post<any>('/api/documents/save-docs', documetns, {observe: 'response'});
    }


    getPriceTypes(price: string): Observable<any> {
        return this.http.get('/api/price/price-types', {params: {price: price}});
    }


    getRelatedMedicaments(internationalNameId: string): Observable<any> {
        return this.http.get('/api/medicaments/related', {params: {internationalNameId: internationalNameId}});
    }


    getCompanyNamesAndIdnoList(partialName: string): Observable<any[]> {
        return this.administrationService.getCompanyNamesAndIdnoList(partialName);
    }

    getDocumentTypes(): Observable<any> {
        return this.documentService.getDocumentTypes();
    }

    viewTableData(columns: string[], data: any[]): Observable<any> {
        return this.documentService.viewTableData(columns, data);
    }

    getRequest(id: string): Observable<any> {
        return this.http.get('/api/load-gdp-request', {params: {id: id}});
    }

    getAllEmployees(): Observable<any> {
        return this.administrationService.getAllEmployees();
    }

    retrieveLicenseByIdno(idno: string): Observable<any> {
        return this.http.get('/api/license/retrieve-license-by-idno', {params : { idno : idno} });
    }

    getPriceById(id: string): Observable<any> {
        return this.http.get('/api/price/by-id', {params: {id: id}});
    }


    getOriginalMedsByInternationalName(id: string): Observable<any> {
        return this.http.get('/api/price/original-meds-prices', {params: {id: id}});
    }

    getPrevYearsPrices(id: string): Observable<any> {
        return this.http.get('/api/price/prev-years-prices', {params: {id: id}});
    }

    getMedPrice(medId: string): Observable<Price> {
        return this.http.get<Price>('/api/price/med-price', {params: {id: medId}});
    }

    getPricesByFilter(filter: any): Observable<any> {
        return this.http.post<any>('/api/price/by-filter', filter, {observe: 'response'});
    }

    viewAccompanyingLetter(object: any): Observable<any> {
        return this.http.post('/api/gdp/accompanying-letter', object, {responseType: 'blob'});
    }

    viewGDPCertificate(object: any): Observable<any> {
        return this.http.post('/api/gdp/gdp-certificate', object, {responseType: 'blob'});
    }

    viewGDPOrder(object: any): Observable<any> {
        return this.http.post('/api/gdp/gdp-order', object, {responseType: 'blob'});
    }

    viewAnexa1(): Observable<any> {
        return this.http.get('/api/price-docs/view-anexa1', {responseType: 'blob'});
    }

    viewApprovalOrder(): Observable<any> {
        return this.http.get('/api/price-docs/view-approval-order', {responseType: 'blob'});
    }

    getAuthorisationsByFilter(filter: any): Observable<any> {
        return this.http.post<any>('/api/gdp/gmp-authorisations-by-filter', filter, {observe: 'response'});
    }
}
