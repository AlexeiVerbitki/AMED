import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {NomenclatorService} from '../../../shared/service/nomenclator.service';
import {LoaderService} from '../../../shared/service/loader.service';

@Component({
    selector: 'app-clasify-economics-agency',
    templateUrl: './clasify-economics-agency.component.html',
    styleUrls: ['../nomenclator.component.css']
})
export class ClasifyEconomicsAgencyComponent implements OnInit, OnDestroy {


    @ViewChild(MatPaginator) paginator: MatPaginator;
    filter = new FormControl('');
    dataSource = new MatTableDataSource<any>();
    columnsToDisplay = ['idno', 'denumire', 'adresa', 'seria', 'nr'];
    row = {id: '', idno: '', name: '', address: '', serialNr: '', nr: ''};
    private subscriptions: Subscription[] = [];

    constructor(private navbarTitleService: NavbarTitleService, private nomenclatorService: NomenclatorService, private loadingService: LoaderService) {}

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data: any, filter: any) => {
            const f = JSON.parse(filter);
            return (data.idno && data.idno.toLowerCase().startsWith(f.idno))
            && (data.name && data.name.toLowerCase().startsWith(f.name))
            && (data.address && data.address.toLowerCase().startsWith(f.address))
            && (data.serialNr && data.serialNr.toLowerCase().startsWith(f.serialNr))
            && (data.nr && data.nr.toLowerCase().startsWith(f.nr));
        };
    }

    filterColumn(column, $event) {
        this.row[column] = $event.target.value;
        this.dataSource.filter = JSON.stringify(this.row);
    }

    ngOnInit() {

        this.navbarTitleService.showTitleMsg('Clasificatorul agenților economici cu activitate farmaceutică');

        this.loadingService.show();
        this.subscriptions.push(this.nomenclatorService.getEconomicAgentsClassifier().subscribe(data => {
            this.loadingService.hide();
            this.dataSource.data = data;
            this.dataSource.data.forEach((r: any) => {
                r.idno = r.idno ? r.idno : '';
                r.name = r.name ? r.name : '';
                r.address = r.address ? r.address : '';
                r.serialNr = r.serialNr ? r.serialNr : '';
                r.nr = r.nr ? r.nr : '';
            });
            console.log(data);

        }, error => {
            console.log('error', error);
            this.loadingService.hide();
        }));
    }
}
