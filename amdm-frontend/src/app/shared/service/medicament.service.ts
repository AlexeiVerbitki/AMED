import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Medicament} from '../../models/medicament';

@Injectable({providedIn: 'root'})
export class MedicamentService {
  constructor(private http: HttpClient) {}

  getCompanyMedicaments(companyId): Observable<Medicament[]> {
    let Params = new HttpParams();
    Params = Params.set('companyId', companyId);

    return this.http.get<Medicament[]>('/api/medicaments/company-medicaments', { params: Params });//, responseType: 'text'});
  }

  getMedicamentNamesList(partialName: string) : Observable<any[]> {
      let Params = new HttpParams();
      Params = Params.set('partialName', partialName);

      return this.http.get<any[]>('/api/medicaments/search-medicament-names-by-name', {params: Params});
  }

    getMedicamentById(id: string ) : Observable<any> {
        let Params = new HttpParams();
        Params = Params.set('id', id);

        return this.http.get<any>('/api/medicaments/search-medicament-by-id', {params: Params});
    }

    saveRequest(doc: any,type:any) : Observable<any> {
      if(type=='NOTIFICATION')
      {
          return this.http.post<any>('/api/medicaments/save-notification-letter', doc, {observe: 'response'});
      }
      else {
          return this.http.post<any>('/api/medicaments/save-request-additional-data', doc, {observe: 'response'});
      }
    }

    saveOrderInterrupt(doc: any) : Observable<any> {
        return this.http.post<any>('/api/medicaments/save-order-interrupt', doc, {observe: 'response'});
    }

    answerReceivedRequestAdditionalData(doc: any) : Observable<any> {
        return this.http.post<any>('/api/medicaments/answer-received-request-additional-data', doc, {observe: 'response'});
    }
}
