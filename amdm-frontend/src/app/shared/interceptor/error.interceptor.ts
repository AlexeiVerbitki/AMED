import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from "../service/authetication.service";
import {Router} from "@angular/router";
import {ErrorHandlerService} from "../service/error-handler.service";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService, private errorHandlerService: ErrorHandlerService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        this.authService.logout();
                        // location.reload(true);
                        this.router.navigateByUrl('/login', {preserveQueryParams: true});
                        return;
                    }
                    let errMsg = '';
                    if (error.status === 404) {
                        errMsg = 'No such method on the server'
                    } else if (error.status === 405) {
                        errMsg = 'Http method not allowed !!! (GET,POST,DELETE,UPDATE...)';
                    }
                    // Client Side Error
                    else if (error.error instanceof ErrorEvent) {
                        errMsg = 'Client error' + error.error.message;
                    } else {  // Server Side Error
                        errMsg = this.getErrorMessage(error); //`Server error Code: ${error.status},  Message: ${error.message}`;
                    }
                    console.log('Interceptor error: ', error);
                    this.errorHandlerService.error.next(errMsg);
                    return throwError(errMsg);
                })
            )
    }

    getErrorMessage(error: HttpErrorResponse): string {
        let errMsg = '';
        if (error.headers.get('X-app-alert') && error.headers.get('X-app-alert').length > 0) {
            errMsg = error.headers.get('X-app-alert');
        } else {
            errMsg = 'Error message: ' + error.message!!! + '\n Error error: ' + error.error.error;
        }
        return errMsg;
    }

}