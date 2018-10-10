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

  getAllActiveSubstances(): Observable<any> {
        return this.http.get('/api/administration/all-active-substances', {});
  }
}
