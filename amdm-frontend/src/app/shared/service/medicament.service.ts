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

    return this.http.get<Medicament[]>('/api/company-medicaments', { params: Params});
  }

  addMedicament() { }
}
