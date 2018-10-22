import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from '../service/authetication.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                public auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // this will be passed from the route config
        // on the data property
        const expectedRoles: string[] = route.data.expectedRoles;

        const token = localStorage.getItem('authenticationToken');

        if (!token) {
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }

        const jwtHelper = new JwtHelperService();
        // decode the token to get its payload
        const tokenPayload = jwtHelper.decodeToken(token);

        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }

        return true;
    }
}
