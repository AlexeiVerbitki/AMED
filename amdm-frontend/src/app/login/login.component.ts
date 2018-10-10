import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {Router} from '@angular/router';
import {AuthService} from '../shared/service/authetication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

    model: any = {};
    error: string;
    subscriptions: Subscription[];

    constructor(private router: Router,
                private authenticationService: AuthService) {
    }

    ngOnInit() {
        this.subscriptions = [];
    }

    login() {
        this.subscriptions.push(this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    const bearerToken = data.headers.get('Authorization');
                    if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
                        const jwt = bearerToken.slice(7, bearerToken.length);
                        localStorage.setItem('authenticationToken', JSON.stringify(jwt));
                    }
                    this.router.navigate(['/dashboard']);
                },
                error => {
                    console.log('Login error  ', this.error);
                    console.log('Login error  ', error);
                    this.error = error.error;
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
