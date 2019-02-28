import {Component, OnInit} from '@angular/core';
import {ScrAuthorRolesService} from '../shared/auth-guard/scr-author-roles.service';

@Component({
    selector: 'app-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {

    constructor(private roleSrv: ScrAuthorRolesService) {
    }

    ngOnInit() {
    }

    checkRole(role: string) {
        return this.roleSrv.isRightAssigned(role);
    }
}
