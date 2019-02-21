import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private http: HttpClient) { }

    getUnfinishedTasks(): Observable<any> {
        return this.http.get <any> ('/api/homepage/get-unfinished-tasks');
    }
}
