import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-main-dashboard',
    template: `
        <app-sidebar></app-sidebar>
        <app-navbar></app-navbar>
        <div class="mt-5">
            <div class="container-fluid">
                <div class="row">
                    <div class="offset-lg-3 offset-xl-3 col-xl-9 col-lg-9 offset-xxl-2 col-xxl-10">
                        <router-outlet></router-outlet>
                    </div>
                </div>
            </div>
        </div>`,
    // style: ``,
})
export class MainDashboardComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
