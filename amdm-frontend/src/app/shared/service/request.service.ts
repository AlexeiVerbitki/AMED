import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class RequestService{

    constructor(private http: HttpClient) { }

    addMedicamentRequest(requestDetails: any): Observable<HttpResponse<any>> {
        console.log(requestDetails);
        return this.http.post<any>('/api/add-medicament-request', requestDetails, {observe: 'response'});
    }
    
    getMedicamentRequest(id:string): Observable<any>
    {
        return this.http.get('/api/load-medicament-request', {params :{ id : id} });
    }

    addClinicalTrailRequest(requestDetails: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/add-clinical-trail-request', requestDetails, {observe: 'response'});
    }

    getClinicalTrailRequest(id:string): Observable<any>
    {
        return this.http.get('/api/load-clinical-trail-request', {params :{ id : id} });
    }

    addPriceRequest(requestDetails: any): Observable<HttpResponse<any>> {
        console.log(requestDetails);
        return this.http.post<any>('/api/add-prices-request', requestDetails, {observe: 'response'});
    }
}