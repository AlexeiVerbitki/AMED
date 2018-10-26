import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DocumentService {

    constructor(private http: HttpClient) {
    }

    uploadDocument() {
    }

    removeDocument() {
    }

    generateDistributionDisposition(nrCerere: any): Observable<any> {
        return this.http.get('/api/documents/generate-distribution-disposition', {
            params: {nrCerere: nrCerere},
            responseType: 'text'
        });
    }

    generateRequestAdditionalData(nrDocument: any, nrCerere: any, content: any, title: any,type : any): Observable<any> {
            return this.http.get('/api/documents/generate-request-additional-data', {
                params: {nrDocument: nrDocument, nrCerere: nrCerere, content: content, title: title,type:type},
                responseType: 'text'
            });
    }

    viewRequest(nrDocument: any, content: any, title: any,type : any): Observable<any> {
            return this.http.get('/api/documents/view-request-additional-data', {
                params: {
                    nrDocument: nrDocument,
                    content: content,
                    title: title,
                    type : type,
                }, responseType: 'blob'
            });
    }

    viewOrdinDeInrerupereAInregistrariiMedicamentului(nrDocument: any): Observable<any> {
        return this.http.get('/api/documents/view-interrupt-order-of-medicament-registration', {
            params: {
                nrDocument: nrDocument
            }, responseType: 'blob'
        });
    }

    generateOrdinDeInrerupereAInregistrariiMedicamentului(nrDocument: any, nrCerere: any): Observable<any> {
        return this.http.get('/api/documents/generate-interrupt-order-of-medicament-registration', {
            params: {nrDocument: nrDocument, nrCerere: nrCerere},
            responseType: 'text'
        });
    }
}
