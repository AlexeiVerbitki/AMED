import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';

export class ServerUrlInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith('/api')) {
       const url = 'http://localhost:8443';
      // const url = 'http://172.19.42.3:8443';
      // const url = 'http://192.168.14.60:8447';
      request = request.clone({
        url: url + request.url
      });
    }
    return next.handle(request);
  }
}

