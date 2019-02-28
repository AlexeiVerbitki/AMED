import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from '../service/authetication.service';

@Injectable()
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

        // const jwtHelper = new JwtHelperService();
        // decode the token to get its payload
        // const tokenPayload = jwtHelper.decodeToken(token);
        // console.log(jwtHelper.isTokenExpired(tokenPayload.exp));

        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }

        return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // console.log('canActivateChild', route);

        return this.canActivate(route, state);
    }
}
