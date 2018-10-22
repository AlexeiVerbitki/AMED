import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

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
        return this.http.get('/api/administration/all-companies-min', {});
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

  getAllPharamceuticalFormsByTypeId(typeId : string): Observable<any> {
        return this.http.get('/api/administration/all-pharamceutical-forms', {params :{ typeId : typeId} });
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
    
    getCountries(): Observable<any> {
        return this.http.get('/api/administration/countries');
    }

    getCurrenciesShort(): Observable<any> {
        return this.http.get('/api/price/all-currencies-short');
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

    getAllInternationalNames(): Observable<any> {
        return this.http.get('/api/administration/all-international-names', {});
    }
}
