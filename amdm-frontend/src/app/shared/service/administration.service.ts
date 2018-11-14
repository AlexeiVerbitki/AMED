import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {from, Observable} from "rxjs";

@Injectable()
export class AdministrationService {
    constructor(private http: HttpClient) {
    }

    generateDocNr(): Observable<any> {
        return this.http.get('/api/administration/generate-doc-nr', {});
    }

    getAllCompanies(): Observable<any> {
        return this.http.get('/api/administration/all-companies', {});
    }

    // return companies with only id and name
    getAllCompaniesMinimal(): Observable<any> {
        return this.http.get('/api/administration/all-companies-details', {});
    }

    getAllStates(): Observable<any> {
        return this.http.get('/api/administration/all-states');
    }

    getLocalitiesByState(stateId: string): Observable<any> {
        return this.http.get('/api/administration/all-localities-by-state', {params: {stateId: stateId}});
    }

    getAllPharamceuticalFormTypes(): Observable<any> {
        return this.http.get('/api/administration/all-pharamceutical-form-types', {});
    }

    getAllPharamceuticalFormsByTypeId(typeId: string): Observable<any> {
        return this.http.get('/api/administration/all-pharamceutical-forms', {params: {typeId: typeId}});
    }

    getAllPharamceuticalFormsByName(partialDescr: string): Observable<any> {
        return this.http.get('/api/administration/search-pharamceutical-forms-by-descr', {params: {partialDescr: partialDescr}});
    }

    getAllDocTypes(): Observable<any> {
        return this.http.get('/api/administration/all-doc-types', {});
    }

    getAllActiveSubstances(): Observable<any> {
        return this.http.get('/api/administration/all-active-substances', {});
    }

    getAllUnitsOfMeasurement(): Observable<any> {
        return this.http.get('/api/administration/all-units-of-measurement', {});
    }

    getAllMedicamentForms(): Observable<any> {
        return this.http.get('/api/administration/all-medicament-forms', {});
    }

    getAllServiceCharges(): Observable<any> {
        return this.http.get('/api/administration/all-service-charges', {});
    }

    getCountries(): Observable<any> {
        return this.http.get('/api/administration/countries');
    }

    getCurrenciesShort(): Observable<any> {
        return this.http.get('/api/price/all-currencies-short');
    }

    getPrevMonthAVGCurrencies(): Observable<any> {
        // const httpOptions = {
        //     headers: new HttpHeaders({
        //         'Access-Control-Allow-Origin':'*',
        //     })
        // };
        return this.http.get('/api/price/prev-month-avg-currencies');//,  httpOptions);
    }

    getCurrencyHistory(day: Date): Observable<any> {
        let params: HttpParams;

        if (day != undefined) {
            params = new HttpParams();
            params.append('from', day.getDay() + '-' + day.getMonth() + '-' + day.getFullYear());
        }

        return this.http.get('/api/price/today-currencies-short', {params: params});
    }

    generateReceiptNr(): Observable<any> {
        return this.http.get('/api/administration/generate-receipt-nr')
    }

    getAllMedicamentTypes(): Observable<any> {
        return this.http.get('/api/administration/all-medicament-types', {});
    }

    getAllManufactures(): Observable<any> {
        return this.http.get('/api/administration/all-manufactures', {});
    }

    getManufacturersByName(partialName: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('partialName', partialName);

        return this.http.get<any[]>('/api/administration/search-manufactures-by-name', {params: Params});
    }

    getAllInternationalNames(): Observable<any> {
        return this.http.get('/api/administration/all-international-names', {});
    }

    sendEmail(title: string, content: string, mailAddress: string): Observable<any> {
        return this.http.get('/api/administration/send-email', {
            params: {
                title: title,
                content: content,
                mailAddress: mailAddress
            }
        });
    }

    getAllEmployees(): Observable<any> {
        return this.http.get('/api/administration/all-employees', {});
    }

    getEmployeeById(id: string): Observable<any> {
        return this.http.get('/api/administration/employee-by-id', {params: {id: id}});
    }

    getAllInvestigators(): Observable<any> {
        return this.http.get('/api/administration/all-investigators', {});
    }

    getAllMedicalInstitutions(): Observable<any> {
        return this.http.get('/api/administration/all-medical-institutions', {});
    }

    getCompanyNamesAndIdnoList(partialName: string): Observable<any[]> {
        let Params = new HttpParams();
        Params = Params.set('partialName', partialName);

        return this.http.get<any[]>('/api/administration/search-companies-by-name-or-idno', {params: Params});
    }

    getAllAtcCodesByCode(partialCode: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('partialCode', partialCode);

        return this.http.get('/api/administration/all-atc-codes-by-code', {params: Params});
    }

    getClinicalTrailsCodAndEudra(partialCode: string): Observable<any[]>{
        let Params = new HttpParams();
        Params = Params.set('partialCode', partialCode);

        return this.http.get<any[]>('/api/administration/all-clinical-trails-by-cod-or-eudra', {params: Params});
    }
}
