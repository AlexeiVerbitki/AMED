import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/index";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient) {
    }

    getPaymentOrders(requestId): Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('requestId', requestId);
        return this.http.get('/api/clinical-trails-payment/get-payment-orders-by-request-id', {params: Params});
    }

    saveCtPayOrder(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/clinical-trails-payment/save-payment-order', model, {observe: 'response'});
    }

    deleteCtPayOrder(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/clinical-trails-payment/delete-payment-order', model, {observe: 'response'});
    }

    generatePaymentNote(model: any): Observable<any>{
        return this.http.post('/api/clinical-trails-payment/generate-payment-order', model, { responseType: 'blob'});
    }
}
