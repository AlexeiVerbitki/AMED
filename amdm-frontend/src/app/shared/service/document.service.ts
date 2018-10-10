import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DocumentService {

  constructor(private http: HttpClient) { }

  generateDocNr(): Observable<any> {
    return this.http.get('/api/generate-doc-nr', {});
  }
  uploadDocument() { }
  removeDocument() { }
}
