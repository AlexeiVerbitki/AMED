import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from '../service/authetication.service';
import {SuccessOrErrorHandlerService} from '../service/success-or-error-handler.service';


@Injectable()
export class RoleAuthGuard implements CanActivate {

    constructor(private router: Router,
                public auth: AuthService,
                private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    canActivate(route: ActivatedRouteSnapshot) {

        // this will be passed from the route config
        // on the data property
        const expectedRoles: string[] = route.data.expectedRoles;
        const token = localStorage.getItem('authenticationToken');

        if (!token) {
            return false;
        }

        const jwtHelper = new JwtHelperService();
        // decode the token to get its payload
        const tokenPayload = jwtHelper.decodeToken(token);

        if (!this.auth.isAuthenticated()) {
            // 403.html
            this.router.navigate(['/login']);
            return false;
        }

        if (!expectedRoles.includes(tokenPayload.role)) {
            this.errorHandlerService.error.next('You don\'t have sufficient rights');
            return false;
        }


        return true;
    }
}
