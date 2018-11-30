import {Injectable} from '@angular/core';
import {AdministrationService} from "./administration.service";
import {CompanyService} from "./company.service";
import {MedicamentService} from "./medicament.service";
import {RequestService} from "./request.service";
import {AuthService} from "./authetication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Company} from "../../models/company";
import {Medicament} from "../../models/medicament";
import {Country} from "../../models/country";
import {Currency} from "../../models/currency";
import {CurrencyHistory} from "../../models/currencyHistory";
import {DocumentService} from "./document.service";
import {TaskService} from "./task.service";
import {Price} from "../../models/price";


@Injectable({
    providedIn: 'root'
})
export class PriceService {

    constructor(private administrationService: AdministrationService,
                private companyService: CompanyService,
                private medicamentService: MedicamentService,
                private requestService: RequestService,
                private authService: AuthService,
                private documentService: DocumentService,
                private taskService: TaskService,
                private http: HttpClient) {}

    getCompanies(): Observable<Company[]> {
        return this.administrationService.getAllCompaniesMinimal();
    }

    getRequestStepByIdAndCode(requestTypeId: string,code : string): Observable<any> {
        return this.taskService.getRequestStepByIdAndCode(requestTypeId, code);
    }

    getAllDocTypes(): Observable<any> {
        return this.administrationService.getAllDocTypes();
    }

    getMedicamentById(id: string): any {
        return this.medicamentService.getMedicamentById(id);
    }

    generateDocNumber(): Observable<any> {
        return this.administrationService.generateDocNr();
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

    getPriceExpirationReasons(): Observable<any> {
        return this.http.get('/api/price/all-price-expiration-reasons');
    }

    getPricesForRevaluation(): Observable<any> {
        return this.http.get('/api/price/revaluation');
    }

    getPriceTypes(price: string): Observable<any> {
        return this.http.get('/api/price/price-types', {params: {price: price}});
    }

    getMedPrevPrices(medicamentId: string): Observable<any> {
        return this.http.get('/api/price/med-prev-prices',  {params: {id: medicamentId}});
    }

    getRelatedMedicaments(internationalNameId: string): Observable<any> {
        return this.http.get('/api/medicaments/related',  {params: {internationalNameId: internationalNameId}});
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

    getPricesRequest(id: string): Observable<any> {
        return this.http.get('/api/load-prices-request', {params: {id: id}});
    }


    getOriginalMedsByInternationalName(id: string): Observable<any> {
        return this.http.get('/api/price/original-meds-prices', {params: {id: id}});
    }

    getMedPrice(medId: string): Observable<Price> {
        return this.http.get<Price>('/api/price/med-price', {params: {id: medId}});
    }

    getPricesByFilter(filter: any): Observable<any> {
        // const httpOptions = {
        //     observe: 'response',
        //     headers: new HttpHeaders({
        //         'Access-Control-Allow-Origin':'*',
        //     })
        // };
        return this.http.post<any>('/api/price/by-filter', filter, {observe: 'response'});
    }
}
