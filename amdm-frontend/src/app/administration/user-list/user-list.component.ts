import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {AdministrationService} from '../../shared/service/administration.service';
import {UserListModalComponent} from './user-list-modal/user-list-modal.component';
import {LoaderService} from '../../shared/service/loader.service';
import {SuccessOrErrorHandlerService} from '../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
    displayedColumns: any[] = ['id', 'username', 'email', 'firstName', 'lastName', 'phoneNumber', 'department', 'status', 'roles'];

    dataSource = new MatTableDataSource<any>();
    row: any;
    private modelToView: any[] = [];

    private subscriptions: Subscription[] = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    constructor(private adminService: AdministrationService, private navbarTitleService: NavbarTitleService, public dialog: MatDialog,
                private loadingService: LoaderService, private successOrErrorHandlerService: SuccessOrErrorHandlerService) {
    }

    addAuthorities() {
        const dialogRef = this.dialog.open(UserListModalComponent, {
            width: '1200px'
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Administrare utilizatori');
        let id = 1;
        this.subscriptions.push(this.adminService.getAllValidUsersWithRoles().subscribe(data => {
            data.forEach(object => {
                this.modelToView.push({
                    id: id++,
                    username: object.username,
                    email: object.email,
                    firstName: object.firstName,
                    lastName: object.lastName,
                    phoneNumber: object.phoneNumber,
                    department: object.userGroup,
                    status: object.nmLdapUserStatusEntity.description,
                    roles: this.concatRoles(object.srcRole),
                });
            });
            this.dataSource.data = this.modelToView;
        }));
    }

    concatRoles(roles: any): string {
        let result = '';
        let finalResult = '';
        let i = +1;
        roles.forEach(v => {
            result = i + '. ' + v.description + '; ';
            finalResult += result;
            i++;
        });
        return finalResult;
    }

    sycnronizeUsers(): void {
        this.subscriptions.push(this.adminService.synchronizeUsers().subscribe(data => {
                let id = 1;
                this.modelToView = [];
                data.forEach(object => {
                    this.modelToView.push({
                        id: id++,
                        username: object.username,
                        email: object.email,
                        firstName: object.firstName,
                        lastName: object.lastName,
                        phoneNumber: object.phoneNumber,
                        department: object.userGroup,
                        status: object.nmLdapUserStatusEntity.description,
                        roles: this.concatRoles(object.srcRole),
                    });
                });
                this.dataSource.data = this.modelToView;
                this.successOrErrorHandlerService.showSuccess('Utilizatorii au fost sincronizati cu succes!');
            }
        ));
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Utilizatori pe pagina: ';
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
