import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {AdministrationService} from '../../../shared/service/administration.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-user-list-modal',
    templateUrl: './user-list-modal.component.html',
    styleUrls: ['./user-list-modal.component.css']
})
export class UserListModalComponent implements OnInit {

    roles: any[] = [{}];
    authorities: any[] = [{}];
    selectedRole: any;

    displayedColumns: string[] = ['select', 'description'];
    dataSource = new MatTableDataSource<any>();
    selection: SelectionModel<any> = new SelectionModel(true, this.roles[0].authorities);
    @ViewChild(MatPaginator) paginator: MatPaginator;

    private subscriptions: Subscription[] = [];


    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            this.roles[this.selectedRole].authorities = [];
        } else {
            this.dataSource.data.forEach(row => this.selection.select(row));
            this.roles[this.selectedRole].authorities = this.dataSource.data;
        }

    }

    constructor(private adminService: AdministrationService, private successOrErrorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;

        this.subscriptions.push(this.adminService.getUserRightsAndRoles().subscribe(roleData => {
            this.roles = roleData.slice();
            this.selectedRole = 0;

            this.subscriptions.push(this.adminService.getAllAuthorities().subscribe(authorityData => {
                this.authorities = authorityData.slice();
                this.dataSource.data = this.authorities;
                this.selectExistingAuthorities(0);
            }));
        }));
    }

    private selectExistingAuthorities(id: number) {
        this.selection.clear();
        this.dataSource.data.forEach(row => {
            this.roles[id].authorities.forEach(authority => {
                if (row.id == authority.id) {
                    this.selection.select(row);
                }
            });
        });
    }

    valueChanged() {
        this.selectExistingAuthorities(this.selectedRole);
    }

    changeAuthList(row: any) {
        if (this.selection.isSelected(row)) {
            this.roles[this.selectedRole].authorities.push(row);
        } else {
            const newAuthorities = this.roles[this.selectedRole].authorities.filter(authority => authority.id != row.id);
            this.roles[this.selectedRole].authorities = newAuthorities;
        }
    }

    save() {
        this.adminService.synchronizeRolesWithAuthorities(this.roles).subscribe(resp => {
            this.successOrErrorHandlerService.showSuccess(resp);
        });
    }
}
