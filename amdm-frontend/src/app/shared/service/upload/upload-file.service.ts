import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable()
export class UploadFileService {

  constructor(private http: HttpClient) { }


    pushFileToStorage(file: File, nrCerere: string): Observable<HttpEvent<{}>> {
        const formdata: FormData = new FormData();

        formdata.append('file', file);
        formdata.append('nrCerere', nrCerere);

        const req = new HttpRequest('POST', '/api/documents/pushFile', formdata, {
            reportProgress: true,
            responseType: 'json'
        });

        return this.http.request(req);
    }

    removeFileFromStorage(relativeFolder : string): Observable<any>{
        return this.http.get('/api/documents/removeFile', {params :{ relativeFolder : relativeFolder}, observe: 'response'  });
    }

    loadFile(relativePath: string): Observable<any> {
        return this.http.get('/api/documents/view-document', {params: {relativePath: relativePath}, responseType: 'blob'});
    }

}
