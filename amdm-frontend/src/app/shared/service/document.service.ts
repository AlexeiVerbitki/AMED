import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DocumentService {

    constructor(private http: HttpClient) {
    }

    generateDistributionDisposition(nrCerere: any): Observable<any> {
        return this.http.get('/api/documents/generate-distribution-disposition', {
            params: {nrCerere: nrCerere},
            responseType: 'text'
        });
    }

    // generateRequestAdditionalData(nrDocument: any, nrCerere: any, content: any, title: any,type : any): Observable<any> {
    //         return this.http.get('/api/documents/generate-request-additional-data', {
    //             params: {nrDocument: nrDocument, nrCerere: nrCerere, content: content, title: title,type:type},
    //             responseType: 'text'
    //         });
    // }

    viewDD(nrDocument: any): Observable<any> {
        return this.http.get('/api/documents/view-distribution-disposition', {
            params: {
                nrDoc: nrDocument
            }, responseType: 'blob'
        });
    }

    viewBonDePlata(bonDePlataDetails: any): Observable<any> {
        return this.http.post('/api/documents/view-bon-de-plata', bonDePlataDetails,{ responseType: 'blob'});
    }

    viewBonDePlataSuplimentar(bonDePlataDetails: any): Observable<any> {
        return this.http.post('/api/documents/view-bon-de-plata-suplimentar', bonDePlataDetails,{ responseType: 'blob'});
    }

    viewBonDePlataNimicire(requestNimicire: any): Observable<any> {
            return this.http.post('/api/documents/view-bon-de-plata-nimicire', requestNimicire,{ responseType: 'blob'});
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

    viewRequestNew(model : any): Observable<any> {
        return this.http.post('/api/documents/view-request-additional-data-new', model,{ responseType: 'blob'});
    }

    viewMedicamentAuthorizationOrder(docNr : any): Observable<any> {
        return this.http.get('/api/documents/view-medicament-authorization-order', {
            params: {
                nrDocument : docNr
            }, responseType: 'blob'
        });
    }

    viewMedicamentAuthorizationCertificate(docNr : any): Observable<any> {
        return this.http.get('/api/documents/view-medicament-authorization-certificate', {
            params: {
                nrDocument : docNr
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

    getDocumentTypes(): Observable<any> {
        return this.http.get('/api/documents/get-document-types');
    }

    getDocumentsByIds(documentsIds: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/documents/by-ids', documentsIds, {observe: 'response'});
    }

    getPricesDocuments(pricesIds: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/documents/by-price-ids', pricesIds, {observe: 'response'});
    }

    viewTableData(columns : string[], data : any[]): Observable<any> {
        let object : any = {};
        object.columns = columns;
        object.data = data;

        return this.http.post('/api/documents/view-table-pdf', object, { responseType: 'blob'});

    }

    // generateOrdinDeInrerupereAInregistrariiMedicamentului(nrDocument: any, nrCerere: any): Observable<any> {
    //     return this.http.get('/api/documents/generate-interrupt-order-of-medicament-registration', {
    //         params: {nrDocument: nrDocument, nrCerere: nrCerere},
    //         responseType: 'text'
    //     });
    // }
    //
    // generateCertificatulDeAutorizare(nrCerere: any): Observable<any> {
    //     return this.http.get('/api/documents/generate-certificatul-de-autorizare', {
    //         params: {nrCerere : nrCerere},
    //         responseType: 'text'
    //     });
    // }
}
