import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReceiptManagementService {

    constructor(private http: HttpClient) { }

    getUnfinishedTasks(request: any): Observable<any> {
        return this.http.post<any>('/api/receips/get-pay-orders-by-filter', request, {observe: 'response'});
    }
}
