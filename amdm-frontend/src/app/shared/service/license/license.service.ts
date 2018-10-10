import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {LicenseModel} from "../../../all-modules/module-5/license-model";


@Injectable()
export class LicenseService {

    constructor(private http: HttpClient) { }


    confirmRegisterLicense (model : any): Observable<HttpResponse<any>>
    {
        return this.http.post<any>('/api/license/new-license', model, {observe: 'response'});
    }

    retrieveAllRequestTypes(): Observable<any> {
        return this.http.get('/api/license/all-license-request-types');
    }

    retrieveLicenseById(id: string): Observable<any> {
        return this.http.get('/api/license/retrieve-license-by-id', {params :{ id : id} });
    }

}