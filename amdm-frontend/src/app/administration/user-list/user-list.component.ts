import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {AdministrationService} from '../../shared/service/administration.service';
import {debounceTime} from 'rxjs/operators';

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


    constructor(private adminService: AdministrationService, private navbarTitleService: NavbarTitleService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Administrare utilizatori');

        this.subscriptions.push(this.adminService.getAllValidUsersWithRoles().subscribe(data => {
            data.forEach(object => {
                this.modelToView.push({
                    id: object.id,
                    username: object.username,
                    email: object.email,
                    firstName: object.firstName,
                    lastName: object.lastName,
                    phoneNumber: object.phoneNumber,
                    department: object.department,
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
                console.log(data);
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

    openModal(rowDetails: any) {
        console.log(rowDetails);
    }

    isLink(rowDetails: any): boolean {
        return true;
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
