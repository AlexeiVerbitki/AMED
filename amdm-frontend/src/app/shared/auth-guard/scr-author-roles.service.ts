import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class ScrAuthorRolesService {

    public scrAuthArr: BehaviorSubject<string[]>;

    constructor() {
        this.scrAuthArr = new BehaviorSubject<string[]>([]);
        const token = localStorage.getItem('authenticationToken');
        if (!token) {
            return;
        }
        this.scrAuthArr.next((new JwtHelperService()).decodeToken(token).ROLE.split(','));
    }

    changeValue(authArray: string[]) {
        this.scrAuthArr.next(authArray);
    }

    isRightAssigned(expectedRole: string): boolean {
        return this.scrAuthArr.value.indexOf(expectedRole) > -1;
    }
}
