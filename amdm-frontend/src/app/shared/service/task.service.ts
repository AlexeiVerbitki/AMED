import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor(private http: HttpClient) {
    }


    getRequestNames(): Observable<any> {
        return this.http.get('/api/tasks/request-names');
    }

    getRequestTypes(requestId: string): Observable<any> {
        return this.http.get('/api/tasks/request-types', {params: {id: requestId}});
    }

    getRequestTypeSteps(requestTypeId: string): Observable<any> {
        return this.http.get('/api/tasks/request-steps', {params: {id: requestTypeId}});
    }

    getTasksByFilter(request: any): Observable<any> {
        return this.http.post<any>('/api/tasks/get-filtered-tasks', request, {observe: 'response'});
    }
}