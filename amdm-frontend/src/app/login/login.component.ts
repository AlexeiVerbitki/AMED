import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../shared/service/authetication.service';
import {ScrAuthorRolesService} from '../shared/auth-guard/scr-author-roles.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

    model: any = {};
    error: string;
    subscriptions: Subscription[];
    redirectUrl: string = undefined;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authenticationService: AuthService,
                private securityRoleService: ScrAuthorRolesService) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.authenticationService.logout();
        this.subscriptions.push(this.route.queryParams.subscribe(params => {
            this.redirectUrl = params['returnUrl'];
        }));
    }

    login() {
        this.subscriptions.push(this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    const bearerToken = data.headers.get('Authorization');
                    if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
                        const jwt = bearerToken.slice(7, bearerToken.length);
                        localStorage.setItem('authenticationToken', JSON.stringify(jwt));

                        //init authorities
                        this.securityRoleService.changeValue(new JwtHelperService().decodeToken(jwt).ROLE.split(','));
                    }
                    if (this.redirectUrl) {
                        this.router.navigate([this.redirectUrl]);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                },
                error => {
                    this.error = error;
                }));
    }


    logout() {
        this.subscriptions.push(this.authenticationService.logout().subscribe());
        this.router.navigate(['/']);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
