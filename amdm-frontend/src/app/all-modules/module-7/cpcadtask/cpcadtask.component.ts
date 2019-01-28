import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';

import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {DrugDecisionsService} from '../../../shared/service/drugs/drugdecisions.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {DrugSubstanceTypesService} from '../../../shared/service/drugs/drugsubstancetypes.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {DrugAuthorizationDetailsDialogComponent} from '../../../dialog/drug-authorization-details-dialog/drug-authorization-details-dialog.component';

@Component({
    selector: 'cpcadtask', templateUrl: './cpcadtask.component.html', styleUrls: ['./cpcadtask.component.css']
})
export class CPCADTaskComponent implements OnInit, AfterViewInit, OnDestroy {
    taskForm: FormGroup;
    drugSubstanceTypes: any[];

    displayedColumns: any[] = ['protocolNr', 'protocolDate', 'requestNumber', 'companyName', 'drugSubstanceTypeDescription', 'substanceName'];
    dataSource = new MatTableDataSource<any>();
    row: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    medLoading = false;
    companies: Observable<any[]>;
    filteredOptions: Observable<any[]>;
    disabled: boolean;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, private route: Router, private drugDecisionsService: DrugDecisionsService,
                private drugSubstanceTypesService: DrugSubstanceTypesService, private administrationService: AdministrationService,
                private medicamentService: MedicamentService, private dialog: MatDialog) {
        this.taskForm = fb.group({
            'id': [], 'protocolNr': [null, {validators: Validators.required}], 'protocolDate': [null], 'drugSubstanceTypesId': [null], 'requestNumber': [null],
            'companyName': [null], 'drugSubstanceTypeDescription': [null], 'company': [], 'companyId': [null], 'selectedMedicament': [null], 'medicamentId': [null],
            'substanceName': [null], 'precursor': [{value: false, disabled: this.disabled}],
            'psihotrop': [{value: false, disabled: this.disabled}], 'stupefiant': [{value: false, disabled: this.disabled}]
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Procese pe pagina: ';
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {

        this.getDrugSubstanceTypes();

        this.getAllCompanies();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getAllCompanies() {

        this.companies = this.companyInputs.pipe(filter((result: string) => {
            if (result && result.length > 2) {
                return true;
            }
        }), debounceTime(400), distinctUntilChanged(), tap((val: string) => {
            this.loadingCompany = true;

        }), flatMap(term =>

            this.administrationService.getCompanyNamesAndIdnoList(term).pipe(tap(() => this.loadingCompany = false))));
    }

    findTasks() {

        this.setSelectedCompany();
        this.populateSelectedSubstances();
        this.subscriptions.push(this.drugDecisionsService.getDrugDecisionsByFilter(this.taskForm.value).subscribe(data => {
            this.dataSource.data = data.body;
        }));
    }

    setSelectedCompany() {

        if (this.taskForm.get('company').value) {
            const company = this.taskForm.get('company').value;
            this.taskForm.get('companyId').setValue(company.id);
        } else {
            this.taskForm.get('companyId').setValue(null);
        }
    }

    populateSelectedSubstances() {

        if (this.taskForm.get('precursor').value || this.taskForm.get('psihotrop').value || this.taskForm.get('stupefiant').value) {

            const precursor = this.taskForm.get('precursor').value;
            const psihotrop = this.taskForm.get('psihotrop').value;
            const stupefiant = this.taskForm.get('stupefiant').value;

            this.taskForm.get('drugSubstanceTypesId').setValue(null);
            if (precursor && !psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR');
                this.taskForm.get('drugSubstanceTypesId').setValue(medicamnet.id);
            } else if (!precursor && psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PSIHOTROP');
                this.taskForm.get('drugSubstanceTypesId').setValue(medicamnet.id);
            } else if (!precursor && !psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'STUPEFIANT');
                this.taskForm.get('drugSubstanceTypesId').setValue(medicamnet.id);
            } else if (precursor && psihotrop && !stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/PSIHOTROP');
                this.taskForm.get('drugSubstanceTypesId').setValue(medicamnet.id);
            } else if (precursor && !psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/STUPEFIANT');
                this.taskForm.get('drugSubstanceTypesId').setValue(medicamnet.id);
            } else if (!precursor && psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PSIHOTROP/STUPEFIANT');
                this.taskForm.get('drugSubstanceTypesId').setValue(medicamnet.id);
            } else if (precursor && psihotrop && stupefiant) {
                const medicamnet = this.drugSubstanceTypes.find(r => r.code == 'PRECURSOR/PSIHOTROP/STUPEFIANT');
                this.taskForm.get('drugSubstanceTypesId').setValue(medicamnet.id);
            }
        } else {
            this.taskForm.get('drugSubstanceTypesId').setValue(null);
        }
    }

    getDrugSubstanceTypes() {

        this.subscriptions.push(this.drugSubstanceTypesService.getDrugSubstanceTypesList().subscribe(data => {
            this.drugSubstanceTypes = data;
        }, error => console.log(error)));
    }

    tasksManagement() {

        this.route.navigate(['dashboard/module/drug-control/reg-drug-control/']);

    }

    showDetails(element: any) {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '1600px';

        dialogConfig2.data = {
            value: element.id
        };

        this.dialog.open(DrugAuthorizationDetailsDialogComponent, dialogConfig2);
    }
}
