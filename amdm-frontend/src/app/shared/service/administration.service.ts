import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AdministrationService {
    constructor(private http: HttpClient) {
    }

    getNomenclatureDate(nomenclatureNr: string): Observable<any> {
        return this.http.get('/api/administration/get-nomenclature', {params: {nomenclature: nomenclatureNr}});
    }

    removeNomenclatureRow(nomenclatureNr: string, id: string): Observable<any> {
        return this.http.get('/api/administration/remove-nomenclature-row', {
            params: {
                id: id,
                nomenclature: nomenclatureNr
            }
        });
    }

    updateNomenclatureRow(nomenclatureNr: string, nomenclature: any): Observable<HttpResponse<any>> {
        nomenclature.tableNr = nomenclatureNr;
        return this.http.post<any>('/api/administration/update-row', nomenclature, {observe: 'response'});
    }

    insertNomenclatureRow(nomenclatureNr: string, nomenclature: any): Observable<HttpResponse<any>> {
        nomenclature.tableNr = nomenclatureNr;
        return this.http.post<any>('/api/administration/insert-row', nomenclature, {observe: 'response'});
    }

    generateDocNr(): Observable<any> {
        return this.http.get('/api/administration/generate-doc-nr', {});
    }

    generateImportAuthDocNr(): Observable<any> {
        return this.http.get('/api/administration/generate-import-auth-doc-nr', {});
    }

    generateGMPRequestNumber(): Observable<any> {
        return this.http.get('/api/administration/generate-gmp-request-number', {});
    }

    generateMedicamentRegistrationRequestNumber(): Observable<any> {
        return this.http.get('/api/administration/generate-medicament-registration-request-number', {});
    }

    generateMedicamentPostAuthorizationRequestNumber(): Observable<any> {
        return this.http.get('/api/administration/generate-medicament-post-authorization-request-number', {});
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

    getAllMedicamentGroups(): Observable<any> {
        return this.http.get('/api/administration/all-medicament-groups', {});
    }

    getAllRequestTypes(): Observable<any> {
        return this.http.get('/api/administration/all-request-types', {});
    }

    getAllCustomsCodes(): Observable<any> {
        return this.http.get('/api/administration/all-customs-codes', {});
    }

    getAllPharamceuticalFormsByName(partialDescr: string): Observable<any> {
        return this.http.get('/api/administration/search-pharamceutical-forms-by-descr', {params: {partialDescr: partialDescr}});
    }

    getAllDocTypes(): Observable<any> {
        return this.http.get('/api/administration/all-doc-types', {});
    }

    getAllSysParams(): Observable<any> {
        return this.http.get('/api/administration/all-sys-params', {});
    }

    getAllActiveSubstances(): Observable<any> {
        return this.http.get('/api/administration/all-active-substances', {});
    }

    getAllAuxiliarySubstances(): Observable<any> {
        return this.http.get('/api/administration/all-auxiliary-substances', {});
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

    getImportSources(): Observable<any> {
        return this.http.get('/api/administration/all-import-sources');
    }

    getCustomsPoints(): Observable<any> {
        return this.http.get('/api/administration/customs-points');
    }

    getPrevMonthAVGCurrencies(): Observable<any> {
        return this.http.get('/api/price/prev-month-avg-currencies');
    }

    getCurrencyHistory(day: Date): Observable<any> {
        let params: HttpParams;

        if (day !== undefined) {
            params = new HttpParams();
            params.append('from', day.getDay() + '-' + day.getMonth() + '-' + day.getFullYear());
        }

        return this.http.get('/api/price/today-currencies-short', {params: params});
    }

    getCurrencyByPeriod(day: Date): Observable<any> {
        // let params: HttpParams;
        let date: any;

        if (day !== undefined) {
            const dayOfMonth = day.getDate();
            const month = day.getMonth() + 1;
            const year = day.getFullYear();

            date = year + '-' + month + '-' + dayOfMonth;
            // date =  day.toISOString();
        }
        // params = params.set("from", {params : day});
        // return this.http.get('/api/load-import-request', {params: {id: id}});
        return this.http.get('/api/price/exchange-rate-by-period', {params: {date: date}});
    }

    generateReceiptNr(): Observable<any> {
        return this.http.get('/api/administration/generate-receipt-nr');
    }

    getAllMedicamentTypes(): Observable<any> {
        return this.http.get('/api/administration/all-medicament-types', {});
    }

    getAllSterileProducts(): Observable<any> {
        return this.http.get('/api/administration/all-sterile-products', {});
    }

    getAllNesterileProducts(): Observable<any> {
        return this.http.get('/api/administration/all-nesterile-products', {});
    }

    getAllBiologicalMedicines(): Observable<any> {
        return this.http.get('/api/administration/all-biological-medicines', {});
    }

    getAllGMPManufacures(): Observable<any> {
        return this.http.get('/api/administration/all-gmp-manufactures', {});
    }

    getAllImportActivities(): Observable<any> {
        return this.http.get('/api/administration/all-import-activities', {});
    }

    getAllSterilizations(): Observable<any> {
        return this.http.get('/api/administration/all-sterilizations', {});
    }

    getAllPrimaryPackaging(): Observable<any> {
        return this.http.get('/api/administration/all-primary-packaging', {});
    }

    getAllSecondaryPackaging(): Observable<any> {
        return this.http.get('/api/administration/all-secondary-packaging', {});
    }

    getAllTestsForQualityControl(): Observable<any> {
        return this.http.get('/api/administration/all-tests-for-quality-control', {});
    }

    getAllManufactures(): Observable<any> {
        return this.http.get('/api/administration/all-manufactures', {});
    }

    getManufacturersByName(partialName: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('partialName', partialName);

        return this.http.get<any[]>('/api/administration/search-manufactures-by-name', {params: Params});
    }

    getManufacturersByIDNO(idno: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('idno', idno);

        return this.http.get<any[]>('/api/administration/search-manufactures-by-idno', {params: Params});
    }

    getAllInternationalNames(): Observable<any> {
        return this.http.get('/api/administration/all-international-names', {});
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

    getCompanyDetailsForLicense(partialName: string): Observable<any[]> {
        let Params = new HttpParams();
        Params = Params.set('partialName', partialName);

        return this.http.get<any[]>('/api/administration/all-companies-details-license', {params: Params});
    }

    getAllAtcCodesByCode(partialCode: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('partialCode', partialCode);

        return this.http.get('/api/administration/all-atc-codes-by-code', {params: Params});
    }

    getAllInternationalNamesByName(partialName: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('partialName', partialName);
        console.log('partialName: ', partialName);

        return this.http.get<any[]>('/api/administration/all-international-names-by-name', {params: Params});
    }

    getClinicalTrailsCodAndEudra(partialCode: string): Observable<any[]> {
        let Params = new HttpParams();
        Params = Params.set('partialCode', partialCode);

        return this.http.get<any[]>('/api/clinical-trails/all-clinical-trails-by-cod-or-eudra', {params: Params});
    }

    getClinicalTrailNotificationTypes(): Observable<any[]> {
        return this.http.get<any[]>('/api/clinical-trails/all-clinical-trail-notification-types');
    }

    getClinicalTrailsPhases(): Observable<any> {
        return this.http.get('/api/administration/all-clinical-trail-phases', {});
    }

    getClinicalTrailsTypest(): Observable<any> {
        return this.http.get('/api/clinical-trails/all-clinical-trail-types', {});
    }

    getAllCustomsCodesByDescription(partialCode: string): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('partialCode', partialCode);

        return this.http.get('/api/administration/all-customs-code-by-description', {params: Params});
    }

    getReceiptsByPaymentOrderNumbers(paymentOrderNumbers: any[]): Observable<any> {
        return this.http.post<any>('/api/administration/receipts-by-payment-order-numbers', paymentOrderNumbers, {observe: 'response'});
    }

    getReceiptsByFilter(filter: any): Observable<any> {
        return this.http.post<any>('/api/administration/receipts-by-filter', filter, {observe: 'response'});
    }

    addReceipt(receiptDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/administration/add-receipt', receiptDetails, {observe: 'response'});
    }

    editReceipt(receiptDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/administration/edit-receipt', receiptDetails, {observe: 'response'});
    }

    removeReceipt(id: number): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/administration/remove-receipt', id, {observe: 'response'});
    }

    addPaymentOrder(paymentOrder: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/administration/add-payment-order', paymentOrder, {observe: 'response'});
    }

    removePaymentOrder(id: number): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/administration/remove-payment-order', id, {observe: 'response'});
    }

    getPaymentOrders(requestId): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('requestId', requestId);
        return this.http.get('/api/administration/get-payment-orders-by-request-id', {params: Params});
    }

    getServiceChargeByCategory(category: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('category', category);

        return this.http.get<any[]>('/api/administration/find-service-charge-by-code', {params: params});
    }

    getCompanyesListByIdno(idno: string): Observable<any[]> {
        let Params = new HttpParams();
        Params = Params.set('idno', idno);

        return this.http.get<any[]>('/api/administration/search-companies-by-idno', {params: Params});
    }


    saveEcAgent(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/nomenclature/agent/save', model, {observe: 'response'});
    }

    updateEcAgent(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/nomenclature/agent/update', model, {observe: 'response'});
    }

    generateEcAgentCode(): Observable<any> {
        return this.http.get('/api/nomenclature/agent/generate-code-agent');
    }

    getAllEcAgentsGroupByIdno(): Observable<any> {
        return this.http.get('/api/nomenclature/all-economic-agents-by-idno', {observe: 'response'});
    }

    getParentAgentEcForIdno(idno: string): Observable<any> {
        return this.http.get('/api/nomenclature/parent-for-idno', {observe: 'response', params: {idno: idno}});
    }

    getFilialsForIdno(idno: string): Observable<any> {
        return this.http.get('/api/nomenclature/filials-for-idno', {observe: 'response', params: {idno: idno}});
    }

    variatonTypesJSON(): Observable<any> {
        return this.http.get('/api/administration/variation-types-to-json', {});
    }

    validIDNP(idnp: string): Observable<any> {
        return this.http.get('/api/validate-idnp', {params: {idnp: idnp}});
    }

    getAllValidUsersWithRoles(): Observable<any> {
        return this.http.get('/api/administration/get-all-valid-users-with-roles');
    }

    getAllValidUsers(): Observable<any> {
        return this.http.get('/api/administration/get-all-valid-users');
    }

    synchronizeUsers(): Observable<any> {
        return this.http.get('/api/administration/synchronize-all-users', {responseType: 'json'});
    }

    getUserRightsAndRoles(): Observable<any> {
        return this.http.get('/api/administration/user-rights-and-roles', {responseType: 'json'});
    }

    getAllAuthorities(): Observable<any> {
        return this.http.get('/api/administration/get-all-authorities', {responseType: 'json'});
    }

    synchronizeRolesWithAuthorities(rolesWithRights: any): Observable<string> {
        return this.http.post('/api/administration/sync-roles-with-authorities', rolesWithRights, {
            observe: 'body',
            responseType: 'text'
        });
    }

    getMedInstSubdivisionsByMedInstId(id: string): Observable<any> {
        return this.http.get('/api/administration/get-med-inst-subdivisions-by-id', {params: {id: id}});
    }

    getAllReportTypes(): Observable<any> {
        return this.http.get('/api/administration/all-report-types', {});
    }

    getAllReportsByReportType(reportTypeId): Observable<any> {
        return this.http.get('/api/administration/all-reports-by-report-type', {params: {id: reportTypeId}});
    }

    getPathByDocNumberAndTypeCode(number, typeCode): Observable<any> {
        return this.http.get('/api/administration/get-path-by-doc-number-and-request-id', {params: {number: number, typeCode: typeCode},  responseType: 'text'});
    }
}
