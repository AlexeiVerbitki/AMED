import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {Subscription} from "rxjs";
import {NomenclatureConstants} from "../../administration.constants";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {AddEcAgentComponent} from "../add-ec-agent/add-ec-agent.component";
import {LoaderService} from "../../../shared/service/loader.service";

@Component({
    selector: 'app-ec-agent-list',
    templateUrl: './ec-agent-list.component.html',
    styleUrls: ['./ec-agent-list.component.css']
})
export class EcAgentListComponent implements OnInit, OnDestroy {

    ecAgents: any [] = [];


    displayedColumns: any[] = ['code', 'idno', 'longName', 'name', 'registrationDate', 'legalAddress','actions'];
    dataSource = new MatTableDataSource<any>();
    visibility: boolean = false;

    private subscriptions: Subscription[] = [];
    nomenclatures = NomenclatureConstants;


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;


    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private administrationService: AdministrationService,
                public dialogDecision: MatDialog,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: ErrorHandlerService,
                public dialog: MatDialog,
                private loadingService: LoaderService,
    ) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Lista de agenti economici');

        this.loadingService.show();
        this.subscriptions.push(this.administrationService.getAllEcAgentsGroupByIdno().subscribe(data => {


                this.ecAgents = data.body;
                this.dataSource.data = this.ecAgents.slice();

                // this.dataSource.filterPredicate = this.createFilter();
                this.loadingService.hide();
            },error => this.loadingService.hide()
        ))


    }


    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Agenti economici per pagina: ";
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue:string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    changeVisibility() {
        this.visibility = !this.visibility;
    }

    addNew() {
        const dialogRef2 = this.dialog.open(AddEcAgentComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            console.log('sdf123', result);
            if (result && result.success) {
                console.log('sdf', result);
                //Reload list
                this.loadingService.show();
                this.subscriptions.push(this.administrationService.getAllEcAgentsGroupByIdno().subscribe(data => {
                    this.ecAgents = data.body;
                    this.dataSource.data = this.ecAgents.slice();
                    this.table.renderRows();

                    this.dataSource.filterPredicate = this.createFilter();
                    this.loadingService.hide();
                }, () => this.loadingService.hide()
                ))
            }
        });


    }

    createFilter():(data: any, filter: string) => boolean {
        let filterFunction = function (data, filter): boolean {
            const dataStr = data.code.toLowerCase() + data.idno ? data.idno.toLowerCase() : '' + data.name ? data.name.toLowerCase() : '' + data.longName ? data.longName.toLowerCase() : '' + data.legalAddress ? data.legalAddress.toLowerCase() : '';
            return dataStr.indexOf(filter) != -1;
        };
        return filterFunction;
    }

    editAgent(element : any){
        const dialogRef2 = this.dialog.open(AddEcAgentComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
                idno : element.idno
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            console.log('sdf123', result);
            if (result && result.success) {
                console.log('sdf', result);
                //Reload list
                this.subscriptions.push(this.administrationService.getAllEcAgentsGroupByIdno().subscribe(data => {
                    this.ecAgents = data.body;
                    this.dataSource.data = this.ecAgents.slice();
                    this.table.renderRows();

                    this.dataSource.filterPredicate = this.createFilter();
                }))
            }
        });
    }

    clearFilter(){
        this.dataSource.data = this.ecAgents.slice();
        this.table.renderRows();

        this.dataSource.filterPredicate = this.createFilter();
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
