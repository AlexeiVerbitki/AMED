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
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

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
    maxDate = new Date();

    pharmaceuticalFormTypes: any[];
    pharmaceuticalForms: any[];
    unitsOfMeasurement: any[];

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
                private errorHandlerService: SuccessOrErrorHandlerService) {

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

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                }
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                }
            )
        );


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
            'forma': '',
            'unitOfMeasure': [null],
            'ambalajPrimar': '',
            'seria': '',
            'quantity': [null, Validators.required],
            'reasonDestroy': [null, Validators.required],
            'note': '',
            'registeredMedicament': [null],
            'notRegMedName': [null, Validators.required],
            'pharmaceuticalFormType': [null, Validators.required],
            'confirmDocuments': '',

        });


        this.mForm = this.fb.group({
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataCererii': [{value: null, disabled: true}],
            'company': [null, Validators.required],
            'telefonContact': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'emailContact': [null, Validators.email],
            'persResDepCereriiFirstname': [null, Validators.required],
            'persResDepCereriiLastname': [null, Validators.required],
            'nrProcurii1': [null],
            'dataProcurii1': [{value: null, disabled: true}],
            'idnp': '',

        });

        this.mForm.get('dataCererii').setValue(new Date());
    }


    onChanges(): void {
        this.rForm.get('medicaments').valueChanges.subscribe(val => {
            if (val) {
                this.subscriptions.push(
                    this.medicamentService.getMedicamentById(val.id).subscribe(data => {
                            
                            this.rForm.get('pharmaceuticalFormType').setValue(data.pharmaceuticalForm.type);
                            this.rForm.get('forma').setValue(data.pharmaceuticalForm);
                            this.rForm.get('ambalajPrimar').setValue(data.primarePackage);
                        },
                        error => {
                            this.rForm.get('pharmaceuticalFormType').setValue(null);
                            this.rForm.get('forma').setValue(null);
                            this.rForm.get('ambalajPrimar').setValue(null);
                        }
                    )
                );
            } else {
                this.rForm.get('pharmaceuticalFormType').setValue(null);
                this.rForm.get('forma').setValue(null);
                this.rForm.get('ambalajPrimar').setValue(null);
            }
        });

        this.rForm.get('pharmaceuticalFormType').valueChanges.subscribe(val => {
            this.rForm.get('forma').setValue(null);
            if (val) {
                this.subscriptions.push(
                    this.administrationService.getAllPharamceuticalFormsByTypeId(val.id).subscribe(data => {
                            this.pharmaceuticalForms = data;
                        },
                        error => this.rForm.get('forma').setValue(null)
                    )
                );
            }
            else
            {
                this.rForm.get('forma').setValue(null);
                this.pharmaceuticalForms = [];
            }
        });

        this.rForm.get('registeredMedicament').valueChanges.subscribe(val => {
            if (val) {
                if (val === '1')
                {
                    this.rForm.get('medicaments').setValidators(Validators.required);
                    this.rForm.get('medicaments').updateValueAndValidity();

                    this.rForm.get('notRegMedName').setValidators(null);
                    this.rForm.get('notRegMedName').updateValueAndValidity();
                }
                else if (val === '0')
                {
                    this.rForm.get('medicaments').setValidators(null);
                    this.rForm.get('medicaments').updateValueAndValidity();

                    this.rForm.get('notRegMedName').setValidators(Validators.required);
                    this.rForm.get('notRegMedName').updateValueAndValidity();
                }
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

        if (!this.medicamentsToDestroy || this.medicamentsToDestroy.length == 0)
        {
            this.errorHandlerService.showError('Nu a fost adaugat nici un medicament pentru disturgere.');
            return;
        }

        this.endDate = new Date();

        this.fFormSubbmitted = false;
        this.mFormSubbmitted = false;

        const modelToSubmit: any = {};
        const annihilationModel: any = {};



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
        modelToSubmit.documents = this.docs;

        modelToSubmit.registrationRequestMandatedContacts = [{mandatedLastname : this.mForm.get('persResDepCereriiLastname').value,
            mandatedFirstname : this.mForm.get('persResDepCereriiFirstname').value,
            phoneNumber : this.mForm.get('telefonContact').value,
            email : this.mForm.get('emailContact').value,
            requestMandateNr : this.mForm.get('nrProcurii1').value,
            requestMandateDate : this.mForm.get('dataProcurii1').value,
            idnp : this.mForm.get('idnp').value,
        }];


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

        if (this.rForm.get('registeredMedicament').value === '1'){
            const id = this.rForm.get('medicaments').value.id;

            //Do not register the same medicament id
            if (this.medicamentsToDestroy.find(md => md.medicamentId === id )) {
                return;
            }
        }




        this.rFormSubbmitted = false;

        if (this.rForm.get('registeredMedicament').value === '1') {
            this.medicamentsToDestroy.push(
                {
                    medicamentId: this.rForm.get('medicaments').value.id,
                    medicamentName: this.rForm.get('medicaments').value.name,
                    quantity : this.rForm.get('quantity').value,
                    uselessReason : this.rForm.get('reasonDestroy').value,
                    note : this.rForm.get('note').value,
                    seria : this.rForm.get('seria').value,
                    pharmaceuticalForm : this.rForm.get('forma').value,
                    unitsOfMeasurement : this.rForm.get('unitOfMeasure').value,
                    confirmativeDocuments : this.rForm.get('confirmDocuments').value,
                    primaryPackage : this.rForm.get('ambalajPrimar').value,
                }
            );
        }

        else if (this.rForm.get('registeredMedicament').value === '0'){
            this.medicamentsToDestroy.push(
                {
                    medicamentName: this.rForm.get('notRegMedName').value,
                    notRegisteredName: this.rForm.get('notRegMedName').value,
                    quantity : this.rForm.get('quantity').value,
                    uselessReason : this.rForm.get('reasonDestroy').value,
                    note : this.rForm.get('note').value,
                    seria : this.rForm.get('seria').value,
                    pharmaceuticalForm : this.rForm.get('forma').value,
                    unitsOfMeasurement : this.rForm.get('unitOfMeasure').value,
                    confirmativeDocuments : this.rForm.get('confirmDocuments').value,
                    primaryPackage : this.rForm.get('ambalajPrimar').value,
                }
            );
        }


        this.rForm.get('medicaments').setValue(null);
        this.rForm.get('forma').setValue(null);
        this.rForm.get('unitOfMeasure').setValue(null);
        this.rForm.get('ambalajPrimar').setValue(null);
        this.rForm.get('quantity').setValue(null);
        this.rForm.get('reasonDestroy').setValue(null);
        this.rForm.get('note').setValue(null);
        this.rForm.get('seria').setValue(null);
        this.rForm.get('notRegMedName').setValue(null);
        this.rForm.get('registeredMedicament').setValue(null);
        this.rForm.get('pharmaceuticalFormType').setValue(null);
        this.rForm.get('confirmDocuments').setValue(null);
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
