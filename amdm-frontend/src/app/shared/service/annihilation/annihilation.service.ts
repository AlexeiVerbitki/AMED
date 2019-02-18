import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AnnihilationService {
    constructor(private http: HttpClient) {
    }

    confirmRegisterAnnihilation(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/annihilation/new-annihilation', model, {observe: 'response'});
    }


    confirmEvaluateAnnihilation(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/annihilation/confirm-evaluate-annihilation', model, {observe: 'response'});
    }

    finishAnnihilation(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>('/api/annihilation/finish-annihilation', model, {observe: 'response'});
    }


    retrieveAnnihilationByRequestId(id: string): Observable<any> {
        return this.http.get('/api/annihilation/retrieve-annihilation-by-request-id', {params: {id: id}});
    }

    retrieveCommisions(): Observable<any> {
        return this.http.get('/api/annihilation/retrieve-all-commisions');
    }

    retrieveDestructionMethods(): Observable<any> {
        return this.http.get('/api/annihilation/retrieve-all-destruction-methods');
    }

    viewActDeReceptie(object: any): Observable<any> {
        return this.http.post('/api/annihilation/view-act-receptie', object, {responseType: 'blob'});
    }

    viewProcesVerbal(object: any): Observable<any> {
        return this.http.post('/api/annihilation/view-proces-verbal', object, {responseType: 'blob'});
    }

    viewListaPentruComisie(object: any): Observable<any> {
        return this.http.post('/api/annihilation/view-lista-pentru-comisie', object, {responseType: 'blob'});
    }

    loadAnnihListByFilter(object: any): Observable<any> {
        return this.http.post('/api/annihilation/get-filtered-annihilations', object);
    }

    findAnnihilationById(id: string): Observable<any> {
        return this.http.get('/api/annihilation/find-annihilation-by-id', {params: {annihilationId: id}});
    }

    generateRegistrationRequestNumber(): Observable<any> {
        return this.http.get('/api/annihilation/generate-registration-request-number', {});
    }
}
