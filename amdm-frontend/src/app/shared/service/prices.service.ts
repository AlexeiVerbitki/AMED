import {Injectable} from '@angular/core';
import {AdministrationService} from "./administration.service";
import {CompanyService} from "./company.service";
import {MedicamentService} from "./medicament.service";
import {RequestService} from "./request.service";
import {AuthService} from "./authetication.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Company} from "../../models/company";
import {Medicament} from "../../models/medicament";
import {Country} from "../../models/country";
import {Currency} from "../../models/currency";
import {CurrencyHistory} from "../../models/currencyHistory";
import {DocumentService} from "./document.service";


@Injectable()
export class PriceService {

    constructor(private administrationService: AdministrationService,
                private companyService: CompanyService,
                private medicamentService: MedicamentService,
                private requestService: RequestService,
                private authService: AuthService,
                private documentService: DocumentService,
                private http: HttpClient) {}

    getCompanies(): Observable<Company[]> {
        return this.administrationService.getAllCompaniesMinimal();
    }

    getMedicamentById(id: string): any {
        return this.medicamentService.getMedicamentById(id);
    }

    generateDocNumber(): Observable<any> {
        return this.administrationService.generateDocNr();
    }

    getCompanyMedicaments(companyId): Observable<Medicament[]> {
        return this.medicamentService.getCompanyMedicaments(companyId);
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

    savePrice(priceModel: any): Observable<any> {
        return this.requestService.addPriceRequest(priceModel);
    }

    getUsername(): string {
        return this.authService.getUserName();
    }

    getPriceExpirationReasons(): Observable<any> {
        return this.http.get('/api/price/all-price-expiration-reasons');
    }

    getAllPriceTypes(): Observable<any> {
        return this.http.get('/api/price/all-price-types');
    }

    getPrevMonthAVGCurrencies(): Observable<any> {
        return this.administrationService.getPrevMonthAVGCurrencies();
    }

    getMedicamentNamesAndCodeList(term): Observable<any[]> {
        return this.medicamentService.getMedicamentNamesAndCodeList(term);
    }

    getDocumentTypes(): Observable<any> {
        return this.documentService.getDocumentTypes();
    }

    getPricesRequest(id: string): Observable<any> {
        return this.http.get('/api/load-prices-request', {params: {id: id}});
    }
}
