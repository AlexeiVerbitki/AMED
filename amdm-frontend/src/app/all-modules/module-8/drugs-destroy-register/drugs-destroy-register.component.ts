import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {Document} from '../../../models/document';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {AnnihilationService} from '../../../shared/service/annihilation/annihilation.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {ErrorHandlerService} from '../../../shared/service/error-handler.service';

@Component({
    selector: 'app-drugs-destroy-register',
    templateUrl: './drugs-destroy-register.component.html',
    styleUrls: ['./drugs-destroy-register.component.css']
})
export class DrugsDestroyRegisterComponent implements OnInit, OnDestroy {

    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    rFormSubbmitted = false;
    mFormSubbmitted = false;
    fFormSubbmitted = false;

    medicamentsToDestroy: any[];

    medicamente: Observable<any[]>;

    medInputs = new Subject<string>();
    medLoading = false;


    // count time
    startDate: Date;
    endDate: Date;

    // Validations
    mForm: FormGroup;
    rForm: FormGroup;
    // fForm: FormGroup;


    constructor(private router: Router,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                public dialog: MatDialog,
                private authService: AuthService,
                private medicamentService: MedicamentService,
                private annihilationService: AnnihilationService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: ErrorHandlerService) {

    }


    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Inregistrarea cererii de nimicire a medicamentelor');
        this.startDate = new Date();
        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.mForm.get('nrCererii').setValue(data);
                }
            )
        );

        this.medicamente =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) { return true; }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.medLoading = true;

                }),
                flatMap(term =>

                    this.medicamentService.getMedicamentNamesAndCodeList(term).pipe(
                        tap(() => this.medLoading = false)
                    )
                )
            );


        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) { return true; }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.administrationService.getCompanyDetailsForLicense(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );


        this.initFormData();

        this.onChanges();


    }

    checkMedInput(value: string): boolean {
        if (value.length > 2) {
            return true;
        }

        return false;
    }


    private initFormData() {
        this.rForm = this.fb.group({

            'medicaments': [null, Validators.required],
            'forma': [{value: null, disabled: true}],
            'doza': [{value: null, disabled: true}],
            'ambalajPrimar': [{value: null, disabled: true}],
            'seria': '',
            'quantity': [null, Validators.required],
            'reasonDestroy': [null, Validators.required],
            'note': '',
        });


        this.mForm = this.fb.group({
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataCererii': [{value: null, disabled: true}],
            'company': [null, Validators.required],

        });

        this.mForm.get('dataCererii').setValue(new Date());
    }


    onChanges(): void {
        this.rForm.get('medicaments').valueChanges.subscribe(val => {
            if (val) {
                this.subscriptions.push(
                    this.medicamentService.getMedicamentById(val.id).subscribe(data => {
                            this.rForm.get('forma').setValue(data.pharmaceuticalForm.description);
                            this.rForm.get('doza').setValue(data.dose);
                            this.rForm.get('ambalajPrimar').setValue(data.primarePackage);
                        },
                        error => {
                            this.rForm.get('forma').setValue(null);
                            this.rForm.get('doza').setValue(null);
                            this.rForm.get('ambalajPrimar').setValue(null);
                        }
                    )
                );
            } else {
                this.rForm.get('forma').setValue(null);
                this.rForm.get('doza').setValue(null);
                this.rForm.get('ambalajPrimar').setValue(null);
            }
        });
    }


    submitNew() {
        this.fFormSubbmitted = true;
        this.mFormSubbmitted = true;

        if (!this.mForm.valid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        this.endDate = new Date();

        this.fFormSubbmitted = false;
        this.mFormSubbmitted = false;

        const modelToSubmit: any = {};
        const annihilationModel: any = {};


        annihilationModel.documents = this.docs;
        annihilationModel.medicamentsMedicamentAnnihilationMeds = this.medicamentsToDestroy;
        annihilationModel.idno = this.mForm.get('company').value.idno;

        modelToSubmit.medicamentAnnihilation = annihilationModel;
        modelToSubmit.requestNumber = this.mForm.get('nrCererii').value;
        // modelToSubmit.company = {id : this.mForm.get('company').value.id};


        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'R'
        }];

        modelToSubmit.currentStep = 'E';
        modelToSubmit.startDate = this.startDate;
        modelToSubmit.initiator = this.authService.getUserName();
        modelToSubmit.assignedUser = this.authService.getUserName();


        this.subscriptions.push(
            this.annihilationService.confirmRegisterAnnihilation(modelToSubmit).subscribe(data => {
                    const result = data.body;
                    this.router.navigate(['/dashboard/module/medicament-destruction/evaluate', result]);
                }
            )
        );

    }

    addNewMedicament() {
        this.rFormSubbmitted = true;
        if (this.medicamentsToDestroy == null) {
            this.medicamentsToDestroy = [];
        }

        if (!this.rForm.valid) {
            return;
        }
        const id = this.rForm.get('medicaments').value.id;
        if (this.medicamentsToDestroy.find(md => md.medicamentId === id )) {
            return;
        }

        this.rFormSubbmitted = false;

        this.medicamentsToDestroy.push(
            {
                medicamentId: this.rForm.get('medicaments').value.id,
                medicamentName: this.rForm.get('medicaments').value.name,
                quantity : this.rForm.get('quantity').value,
                uselessReason : this.rForm.get('reasonDestroy').value,
                note : this.rForm.get('note').value,
                seria : this.rForm.get('seria').value
            }
        );

        this.rForm.get('medicaments').setValue(null);
        this.rForm.get('forma').setValue(null);
        this.rForm.get('doza').setValue(null);
        this.rForm.get('ambalajPrimar').setValue(null);
        this.rForm.get('quantity').setValue(null);
        this.rForm.get('reasonDestroy').setValue(null);
        this.rForm.get('note').setValue(null);
        this.rForm.get('seria').setValue(null);
    }

    removeMedicamentToDestroy(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta inregistrare?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.medicamentsToDestroy.splice(index, 1);
            }
        });
    }


    customSearchFn(term: string, item: any) {
        term = term.toLocaleLowerCase();
        return item.name.toLocaleLowerCase().indexOf(term) > -1 || item.code.toLocaleLowerCase() === term;
    }


    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
