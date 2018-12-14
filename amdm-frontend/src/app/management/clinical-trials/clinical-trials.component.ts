import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs/index";
import {NavbarTitleService} from "../../shared/service/navbar-title.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClinicalTrialService} from "../../shared/service/clinical-trial.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
    selector: 'app-clinical-trials',
    templateUrl: './clinical-trials.component.html',
    styleUrls: ['./clinical-trials.component.css']
})
export class ClinicalTrialsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    ctForm: FormGroup;

    //Datasource table
    displayedColumns: any[] = ['code', 'eudraCt_nr', 'treatment', 'provenance', 'cometee', 'cometeeDate', 'sponsor'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    //Treatments
    treatmentList: any[] = [
        {'id': 1, 'description': 'Unicentric', 'code': 'U'},
        {'id': 2, 'description': 'Multicentric', 'code': 'M'}
    ];

    //Provenances
    provenanceList: any[] = [
        {'id': 3, 'description': 'Național', 'code': 'N'},
        {'id': 4, 'description': 'Internațional', 'code': 'I'}
    ];

    constructor(private fb: FormBuilder,
                private navbarTitleService: NavbarTitleService,
                private clinicTrialService: ClinicalTrialService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Cartela studiu clinic');

        this.ctForm = this.fb.group({
            'code': [''],
            'eudraCtNr': [''],
            'treatment': [],
            'provenance': [],
            'treatmentId': [''],
            'provenanceId': [''],
            'company': [''],
            'sponsor': [''],
            'startDateInternational': [''],
            'startDateNational': [''],
            'endDateNational': [''],
            'endDateInternational': [''],
            'phase': [''],
            'medicalInstitution': [],
        })
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Studii clinice per pagina: ";
        this.dataSource.sort = this.sort;
    }

    private clear(): void {
        console.log('clear button pressed');
        this.ctForm.reset();
    }

    private getClinicalTrials(): void {

        let submitForm = this.ctForm.value;
        if (submitForm.treatment) {
            submitForm.treatmentId = submitForm.treatment.id;
        }
        if (submitForm.provenance) {
            submitForm.provenanceId = submitForm.provenance.id;
        }

        console.log('search clinical trials pressed');
        console.log('this.ctForm', this.ctForm.value);

        this.subscriptions.push(this.clinicTrialService.loadClinicalTrailListByFilter(this.ctForm.value).subscribe(data => {
                console.log('filtered data', data);
                this.dataSource.data = data;
                //this.dataSource.data = data;
            }, error => {
                // this.loadingService.hide();
                console.log(error)
            })
        );

    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
