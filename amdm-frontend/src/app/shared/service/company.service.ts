import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Company} from '../../models/company';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CompanyService {
  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>('/api/all-companies');
  }

  addCompany() { }
}
