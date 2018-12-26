import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-administration',
    templateUrl: './administration.component.html',
    styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

    // private subscriptions: Subscription[] = [];

    constructor(private router: Router,) {
    }

    ngOnInit() {

    }

    navigateTo(id: number) {
        this.router.navigate(['/dashboard/admin/generic-nomenclature/' + id], { skipLocationChange: true });
    }

    navigateToEconomicAgents(){
        this.router.navigate(['/dashboard/admin/ec-agent/view-all/'], { skipLocationChange: true });
    }
}
