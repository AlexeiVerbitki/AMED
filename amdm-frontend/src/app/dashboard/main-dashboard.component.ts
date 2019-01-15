import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {LoaderService} from '../shared/service/loader.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-main-dashboard',
    template: `
		<app-sidebar (skipEvent)="skipValueChanged($event)"></app-sidebar>
		<app-navbar [events]="skipEvent.asObservable()"></app-navbar>
		<div class="body-loader" *ngIf=loaderActive>
			<div class="loader">
				<svg class="circular" viewBox="25 25 50 50">
					<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
				</svg>
			</div>
		</div>
		<div class="mt-5">
			<div class="container-fluid">
				<div class="row">
					<div [ngClass]="classValue ? 'offset-xxl-1 offset-xl-1 skip-offset-lg col-xxl-11 col-xl-11 skip-col-lg' :
					'offset-lg-3 offset-xl-3 col-xl-9 col-lg-9 offset-xxl-2 col-xxl-10'">
						<router-outlet></router-outlet>
					</div>
				</div>
			</div>
		</div>
		<app-server-response-handler></app-server-response-handler>
    `,
    // style: ``,
})
export class MainDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

    @Output()
    public skipEvent: EventEmitter<any> = new EventEmitter();
    loaderActive: boolean;
    skip: boolean;
    classValue: any;
    sideBarIsOpened = false;
    private subscriptions: Subscription[] = [];

    constructor(private loadingService: LoaderService) {
    }

    ngAfterViewInit(): void {
        this.loadingService.loading.asObservable().subscribe(async value => {
            this.loaderActive = await value;
        });
    }

    ngOnInit() {
        this.loaderActive = false;
        this.sideBarIsOpened = true;
    }

    skipValueChanged($event) {
        console.log('event skip', $event);
        this.classValue = !$event;
        this.skipEvent.emit($event);
        this.skip = $event.value;
    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
