import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NavbarTitleService} from "../shared/service/navbar-title.service";

@Component({
    selector: 'app-administration',
    templateUrl: './administration.component.html',
    styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

    // private subscriptions: Subscription[] = [];

    constructor(private router: Router, private navbarTitleService: NavbarTitleService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Administrare');
    }

    navigateTo(id: number) {
        this.router.navigate(['/dashboard/admin/generic-nomenclature/' + id], { skipLocationChange: true });
    }

    navigateToEconomicAgents() {
        this.router.navigate(['/dashboard/admin/ec-agent/view-all/'], { skipLocationChange: true });
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
    }
}
