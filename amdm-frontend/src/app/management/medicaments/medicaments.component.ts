import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {AdministrationService} from "../../shared/service/administration.service";
import {MedicamentService} from "../../shared/service/medicament.service";
import {MedicamentDetailsDialogComponent} from "../../dialog/medicament-details-dialog/medicament-details-dialog.component";

@Component({
    selector: 'app-medicaments',
    templateUrl: './medicaments.component.html',
    styleUrls: ['./medicaments.component.css']
})
export class MedicamentsComponent implements OnInit {

    mForm: FormGroup;
    displayedColumns: any[] = ['code', 'name', 'atcCode', 'registerNumber', 'registrationDate', 'division', 'authorizationHolder', 'expirationDate'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private subscriptions: Subscription[] = [];

    internationalNames: any[];
    pharmaceuticalFormTypes: any[];
    pharmaceuticalForms: any[];
    authorizationHolders: any[];
    manufactures: any[];
    types: any[];
    groups: any[];
    prescriptions: any[] = [];
    activeSubstances: any[];
    areSACheckBoxesDisabled: boolean;

    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService,
                private dialog: MatDialog,
                private medicamentService: MedicamentService) {

        this.mForm = fb.group({
            'code': [null],
            'name': [null],
            'atcCode': [null],
            'registerNumber': [null],
            'registrationDateFrom': [null],
            'registrationDateTo': [null],
            'internationalName': [null],
            'pharmaceuticalFormType': [null],
            'pharmaceuticalForm': [null],
            'authorizationHolder': [null],
            'expirationDateFrom': [null],
            'expirationDateTo': [null],
            'type': [null],
            'group': [null],
            'prescription': [null],
            'terms': [null],
            'requestNumber': [null],
            'division': [null],
            'manufacture': [null],
            'activeSubstances': [null],
        });
        this.areSACheckBoxesDisabled = true;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Prorcese pe pagina: ";
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
        this.subscriptions.push(
            this.administrationService.getAllInternationalNames().subscribe(data => {
                    this.internationalNames = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactures = data;
                    this.authorizationHolders = this.manufactures.filter(r => r.authorizationHolder == 1);
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentTypes().subscribe(data => {
                    this.types = data;
                    this.types = this.types.filter(r => r.category == 'M');
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentGroups().subscribe(data => {
                    this.groups = data;
                },
                error => console.log(error)
            )
        );

        this.prescriptions = [...this.prescriptions, {value: 1, description: 'Cu prescripţie'}];
        this.prescriptions = [...this.prescriptions, {value: 0, description: 'Fără prescripţie'}];

        this.subscriptions.push(
            this.administrationService.getAllActiveSubstances().subscribe(data => {
                    this.activeSubstances = data;
                },
                error => console.log(error)
            )
        );
    }

    checkPharmaceuticalFormTypeValue() {

        if (this.mForm.get('pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.mForm.get('pharmaceuticalFormType').value.id).subscribe(data => {
                    this.mForm.get('pharmaceuticalForm').setValue(null);
                    this.pharmaceuticalForms = data;
                },
                error => console.log(error)
            )
        );
    }

    checkSAValue(valueOne : any, valueAll : any) {
        if (this.mForm.get('activeSubstances').value == null || this.mForm.get('activeSubstances').value.length == 0) {
            this.areSACheckBoxesDisabled = true;
            valueOne.checked = false;
            valueAll.checked = false;
            return;
        } else {
            if (this.areSACheckBoxesDisabled) {
            this.areSACheckBoxesDisabled = false;
            valueAll.checked = false;
            valueOne.checked = true;
            return;
        }
        }
    }

    checkOneSA(valueOne: any, valueAll: any) {
        if (valueOne.checked) {
            valueAll.checked = false;
        } else {
            valueAll.checked = true;
        }
    }

    checkAllSA(valueOne: any, valueAll: any) {
        if (valueAll.checked) {
            valueOne.checked = false;
        } else {
            valueOne.checked = true;
        }
    }

    clear(valueOne: any, valueAll: any,valueExpirated: any) {
        this.mForm.reset();
        valueOne.checked = false;
        valueAll.checked = false;
        valueExpirated.checked = false;
    }

    getMedicaments(valueOne: any, valueAll: any,valueExpirated: any) {
        let dto = this.mForm.value;
        dto.allSA = valueAll.checked;
        dto.atLeastOneSA = valueOne.checked;
        dto.expiratedMedicaments = valueExpirated.checked;
        if (this.mForm.get('prescription').value) {
            dto.prescription = this.mForm.get('prescription').value.value;
        }
        this.subscriptions.push(
            this.medicamentService.getMedicamentsByFilter(dto
            ).subscribe(request => {
                    this.dataSource.data = request.body;
                },
                error => console.log(error)
            ));
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

    navigateToUrl(rowDetails: any) {

    }

    showMedicamentDetails(element:any) {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width='1100px';

        dialogConfig2.data = {
            value: element.code
        };

        this.dialog.open(MedicamentDetailsDialogComponent, dialogConfig2);
    }
}
