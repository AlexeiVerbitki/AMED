import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../shared/service/authetication.service";
import {Router} from "@angular/router";
import {NavbarTitleService} from "../shared/service/navbar-title.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
    title: string = '';

    constructor(private authService: AuthService, private router: Router, private titleService: NavbarTitleService) {
    }

    ngOnInit() {
    }

    logout() {
        this.authService.logout().subscribe();
        this.router.navigate(['/']);
    }

    ngAfterViewInit(): void {
        this.titleService.message.asObservable().subscribe(value => {
            // if (value && value.length > 0) {
                this.title = value;
            // }
        });
    }


    ngOnDestroy() {
        this.titleService.message.complete();
    }
}
