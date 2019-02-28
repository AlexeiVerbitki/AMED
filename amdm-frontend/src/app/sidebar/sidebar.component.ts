import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ScrAuthorRolesService} from '../shared/auth-guard/scr-author-roles.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    @Output()
    public skipEvent: EventEmitter<any> = new EventEmitter();

    skip = true;

    constructor(private roleSrv: ScrAuthorRolesService) {
    }

    ngOnInit() {
    }

    skipMenu() {
        this.skip = !this.skip;
        this.skipEvent.emit(this.skip);
    }

    checkRole(role: string) {
        return this.roleSrv.isRightAssigned(role);
    }

    checkRoleForTaskspage() {
        return this.roleSrv.isRightAssigned('scr_module_1') || this.roleSrv.isRightAssigned('scr_module_2') ||
            this.roleSrv.isRightAssigned('scr_module_3') || this.roleSrv.isRightAssigned('scr_module_4') ||
            this.roleSrv.isRightAssigned('scr_module_5') || this.roleSrv.isRightAssigned('scr_module_6') ||
            this.roleSrv.isRightAssigned('scr_module_7') || this.roleSrv.isRightAssigned('scr_module_8') ||
            this.roleSrv.isRightAssigned('scr_module_9') || this.roleSrv.isRightAssigned('scr_module_10') ||
            this.roleSrv.isRightAssigned('scr_module_11') || this.roleSrv.isRightAssigned('scr_module_12') ||
            this.roleSrv.isRightAssigned('scr_admin');
    }

}
