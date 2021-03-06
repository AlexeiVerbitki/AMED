import {Observable, Subscription} from 'rxjs';
import {AfterViewInit, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from '../shared/service/authetication.service';
import {Router} from '@angular/router';
import {NavbarTitleService} from '../shared/service/navbar-title.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
    @Output()
    public skipEvent: EventEmitter<any> = new EventEmitter();

    eventsSubscription: Subscription;

    @HostBinding('class.is-open') @Input()
    isOpen = false;

    currentUser: string = '';

    title = '';
    skip = true;
    classValue: any = 'offset-lg-3 offset-xl-3 col-xl-9 col-lg-9 offset-xxl-2 col-xxl-10 navbar fixed-top navbar-expand-lg navbar-dark darkskie scrolling-navbar intro-fixed-nav';

    constructor(private authService: AuthService, private router: Router, private titleService: NavbarTitleService) {
    }

    @Input() events: Observable<void>;


    ngOnInit() {
        this.currentUser = this.authService.getUserName();

        this.eventsSubscription = this.events.subscribe(event => {
            if (event) {
                this.classValue = 'offset-lg-3 offset-xl-3 col-xl-9 col-lg-9 offset-xxl-2 col-xxl-10 navbar fixed-top navbar-expand-lg navbar-dark darkskie scrolling-navbar intro-fixed-nav';
            } else {
                this.classValue = 'offset-xxl-1 offset-xl-1 skip-offset-lg col-xxl-11 col-xl-11 skip-col-lg navbar fixed-top navbar-expand-lg navbar-dark darkskie scrolling-navbar intro-fixed-nav';
            }
        });
        this.titleService.message.asObservable().subscribe(value => {
            this.title = value;
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    ngAfterViewInit(): void {
    }

    skipMenu() {
        this.skip = !this.skip;
        this.skipEvent.emit(this.skip);
    }

    skipValueChanged($event) {
        this.skip = $event.value;
        if (this.skip) {
            this.classValue = 'offset-xxl-1 offset-xl-1 skip-offset-lg col-xxl-11 col-xl-11 skip-col-lg navbar fixed-top navbar-expand-lg ' +
                'navbar-dark darkskie scrolling-navbar intro-fixed-nav';
        } else {
            this.classValue = 'offset-lg-3 offset-xl-3 col-xl-9 col-lg-9 offset-xxl-2 col-xxl-10 navbar fixed-top navbar-expand-lg navbar-dark ' +
                'darkskie scrolling-navbar intro-fixed-nav';
        }
        // this.classValue = !this.classValue;
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
        this.titleService.message.complete();
    }
}
