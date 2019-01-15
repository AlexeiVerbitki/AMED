import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
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
        return this.http.post('/api/documents/view-bon-de-plata', bonDePlataDetails, {responseType: 'blob'});
    }

    viewBonDePlataSuplimentar(bonDePlataDetails: any): Observable<any> {
        return this.http.post('/api/documents/view-bon-de-plata-suplimentar', bonDePlataDetails, {responseType: 'blob'});
    }

    viewBonDePlataNimicire(requestNimicire: any): Observable<any> {
        return this.http.post('/api/documents/view-bon-de-plata-nimicire', requestNimicire, {responseType: 'blob'});
    }


    viewRequest(nrDocument: any, content: any, title: any, type: any): Observable<any> {
        return this.http.get('/api/documents/view-request-additional-data', {
            params: {
                nrDocument: nrDocument,
                content: content,
                title: title,
                type: type,
            }, responseType: 'blob'
        });
    }

    viewRequestNew(model: any): Observable<any> {
        return this.http.post('/api/documents/view-request-additional-data-new', model, {responseType: 'blob'});
    }

    viewMedicamentAuthorizationOrder(docNr: any): Observable<any> {
        return this.http.get('/api/documents/view-medicament-authorization-order', {
            params: {
                nrDocument: docNr
            }, responseType: 'blob'
        });
    }

    viewMedicamentAuthorizationCertificate(model: any): Observable<any> {
        return this.http.post('/api/documents/view-medicament-authorization-certificate', model, {responseType: 'blob'});
    }

    viewMedicamentModificationCertificate(model: any): Observable<any> {
        return this.http.post('/api/documents/view-medicament-modification-certificate', model, {responseType: 'blob'});
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

    viewTableData(columns: string[], data: any[]): Observable<any> {
        const object: any = {};
        object.columns = columns;
        object.data = data;

        return this.http.post('/api/documents/view-table-pdf', object, {responseType: 'blob'});

    }

    generateDD(ddDetails: any): Observable<any> {
        return this.http.post('/api/documents/generate-dd', ddDetails, {responseType: 'blob'});
    }

    generateDDM(ddDetails: any): Observable<any> {
        return this.http.post('/api/documents/generate-ddm', ddDetails, {responseType: 'blob'});
    }

    generateOI(oiDetails: any): Observable<any> {
        return this.http.post('/api/documents/generate-oi', oiDetails, {responseType: 'blob'});
    }

    generateOIM(oiDetails: any): Observable<any> {
        return this.http.post('/api/documents/generate-oim', oiDetails, {responseType: 'blob'});
    }

    generateOA(oaDetails: any): Observable<any> {
        return this.http.post('/api/documents/generate-oa', oaDetails, {responseType: 'blob'});
    }

    generateOM(oaDetails: any): Observable<any> {
        return this.http.post('/api/documents/generate-om', oaDetails, {responseType: 'blob'});
    }

    removeDD(element: any): Observable<any> {
        return this.http.post('/api/documents/remove-dd', element, {observe: 'response'});
    }

    removeDDM(element: any): Observable<any> {
        return this.http.post('/api/documents/remove-ddm', element, {observe: 'response'});
    }

    removeOI(element: any): Observable<any> {
        return this.http.post('/api/documents/remove-oi', element, {observe: 'response'});
    }

    removeOIM(element: any): Observable<any> {
        return this.http.post('/api/documents/remove-oim', element, {observe: 'response'});
    }

    removeOA(element: any): Observable<any> {
        return this.http.post('/api/documents/remove-oa', element, {observe: 'response'});
    }

    removeOM(element: any): Observable<any> {
        return this.http.post('/api/documents/remove-om', element, {observe: 'response'});
    }

    addDD(document: any, file: File): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('id', document.id);
        formdata.append('file', file);
        return this.http.post('/api/documents/add-dd', formdata, {observe: 'response'});
    }

    addDDM(document: any, file: File): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('id', document.id);
        formdata.append('file', file);
        return this.http.post('/api/documents/add-ddm', formdata, {observe: 'response'});
    }

    addOI(document: any, file: File): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('id', document.id);
        formdata.append('file', file);
        return this.http.post('/api/documents/add-oi', formdata, {observe: 'response'});
    }

    addOIM(document: any, file: File): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('id', document.id);
        formdata.append('file', file);
        return this.http.post('/api/documents/add-oim', formdata, {observe: 'response'});
    }

    addOA(document: any, file: File): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('id', document.id);
        formdata.append('dateOfIssue', document.dateOfIssue);
        formdata.append('file', file);
        return this.http.post('/api/documents/add-oa', formdata, {observe: 'response'});
    }

    addOM(document: any, file: File): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('id', document.id);
        formdata.append('dateOfIssue', document.dateOfIssue);
        formdata.append('file', file);
        return this.http.post('/api/documents/add-om', formdata, {observe: 'response'});
    }

}
