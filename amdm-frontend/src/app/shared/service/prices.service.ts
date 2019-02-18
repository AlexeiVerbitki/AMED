import {Injectable} from '@angular/core';
import {AdministrationService} from './administration.service';
import {MedicamentService} from './medicament.service';
import {RequestService} from './request.service';
import {AuthService} from './authetication.service';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
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
export class PriceService {

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
        return this.http.get('/api/price/generate-price-request-number', {});
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

    getTodayCurrency(): Observable<CurrencyHistory[]> {
        return this.administrationService.getCurrencyHistory(new Date());
    }

    savePrices(priceModel: any): Observable<any> {
        return this.requestService.addPriceRequests(priceModel);
    }

    savePrice(priceModel: any): Observable<any> {
        return this.requestService.addPriceRequest(priceModel);
    }

    getUsername(): string {
        return this.authService.getUserName();
    }

    removeRequest(requestNr: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('requestNumber', requestNr);

        return this.http.get<any>('/api/remove-price-request', {params: Params});
    }

    getPriceExpirationReasons(): Observable<any> {
        return this.http.get('/api/price/all-price-expiration-reasons');
    }

    saveReevaluation(pricesModel: any): Observable<any> {
        return this.http.post<any>('/api/price/save-reevaluation', pricesModel, {observe: 'response'});
    }

    modifyPrices(requests: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-prices', requests, {observe: 'response'});
    }

    addRegistrationRequestForPrice(request: any): Observable<any> {
        return this.http.post<any>('/api/add-reg-request-price', request, {observe: 'response'});
    }

    validIDNP(idnp: string): Observable<boolean> {
        return this.requestService.validIDNP(idnp);
    }

    approvePrices(requests: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/approve-prices', requests, {observe: 'response'});
    }

    documentsByPricesIds(priceIds: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/price/documents-by-prices-ids', priceIds, {observe: 'response'});
    }

    getDocumentsByIds(requests: any): Observable<any> {
        return this.documentService.getDocumentsByIds(requests);
    }

    getPricesDocuments(requests: any): Observable<any> {
        return this.documentService.getPricesDocuments(requests);
    }

    makeAvailableAgain(prices: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/make-available', prices, {observe: 'response'});
    }

    saveDocuments(documetns: any): Observable<any> {
        return this.http.post<any>('/api/documents/save-docs', documetns, {observe: 'response'});
    }

    getPricesForRevaluation(): Observable<any> {
        return this.http.get('/api/price/revaluation');
    }

    getPricesForApproval(): Observable<any> {
        return this.http.get('/api/price/price-approval');
    }

    getGenericsPricesForRevaluation(priceId: string): Observable<any> {
        return this.http.get('/api/price/generics-revaluation', {params: {priceId: priceId}});
    }

    getPriceTypes(price: string): Observable<any> {
        return this.http.get('/api/price/price-types', {params: {price: price}});
    }

    getMedPrevPrices(medicamentId: string): Observable<any> {
        return this.http.get('/api/price/med-prev-prices', {params: {id: medicamentId}});
    }

    getRelatedMedicaments(internationalNameId: string): Observable<any> {
        return this.http.get('/api/medicaments/related', {params: {internationalNameId: internationalNameId}});
    }

    getPrevMonthAVGCurrencies(): Observable<any> {
        return this.administrationService.getPrevMonthAVGCurrencies();
    }

    getMedicamentNamesAndCodeList(term): Observable<any[]> {
        return this.medicamentService.getMedicamentNamesAndCodeList(term);
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

    getPricesRequest(id: string): Observable<any> {
        return this.http.get('/api/load-prices-request', {params: {id: id}});
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

    viewEvaluationSheet(object: any): Observable<any> {
        return this.http.post('/api/price-docs/view-evaluation-sheet', object, {responseType: 'blob'});
    }

    viewAnexa2(object: any): Observable<any> {
        return this.http.post('/api/price-docs/view-anexa2', object, {responseType: 'blob'});
    }

    viewAnexa3(object: any): Observable<any> {
        return this.http.post('/api/price-docs/view-anexa3', object, {responseType: 'blob'});
    }

    viewAnexa1(): Observable<any> {
        return this.http.get('/api/price-docs/view-anexa1', {responseType: 'blob'});
    }

    viewApprovalOrder(): Observable<any> {
        return this.http.get('/api/price-docs/view-approval-order', {responseType: 'blob'});
    }
}
