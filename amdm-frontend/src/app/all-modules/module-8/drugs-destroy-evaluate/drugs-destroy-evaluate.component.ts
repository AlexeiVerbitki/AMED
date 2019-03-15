import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Document} from '../../../models/document';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {AnnihilationService} from '../../../shared/service/annihilation/annihilation.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {DocumentService} from '../../../shared/service/document.service';
import {AnnihilationMedDialogComponent} from '../../../dialog/annihilation-med-dialog/annihilation-med-dialog.component';
import {DecimalPipe} from '@angular/common';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';

@Component({
    selector: 'app-drugs-destroy-evaluate',
    templateUrl: './drugs-destroy-evaluate.component.html',
    styleUrls: ['./drugs-destroy-evaluate.component.css']
})
export class DrugsDestroyEvaluateComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    mFormSubbmitted = false;
    // fFormSubbmitted: boolean = false;

    requestId: string;
    oldData: any;
    viewModelData: any;

    destructionMethods: any [];

    medicamentsToDestroy: any[];
    medicamente: Observable<any[]>;

    medInputs = new Subject<string>();
    medLoading = false;


    pharmaceuticalFormTypes: any[];
    pharmaceuticalForms: any[];
    unitsOfMeasurement: any[];

    totalSum: number;

    additionalBonDePlata: any;

    numberPipe: DecimalPipe = new DecimalPipe('en-US');

    //count time
    startDate: Date;
    endDate: Date;

    paymentTotal: number;
    // outDocuments: any[] = [];

    //Validations
    mForm: FormGroup;


    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                public dialog: MatDialog,
                private authService: AuthService,
                private medicamentService: MedicamentService,
                private annihilationService: AnnihilationService,
                private loadingService: LoaderService,
                private documentService: DocumentService,
                public dialogDetails: MatDialog,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Receptia medicamentelor');
        this.startDate = new Date();

        this.initFormData();

        this.medicamente =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
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


        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];

                this.subscriptions.push(
                    this.annihilationService.retrieveAnnihilationByRequestId(this.requestId).subscribe(data => {
                            this.oldData = data;
                            this.viewModelData = data;
                            this.patchData(data);
                        }
                    )
                );


                this.subscriptions.push(
                    this.annihilationService.retrieveDestructionMethods().subscribe(data => {
                            this.destructionMethods = data;
                        }
                    )
                );
            } else {
                return;
            }
        }));


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


    private initFormData() {
        this.mForm = this.fb.group({
            'nrCererii': [{value: null, disabled: true}],
            'dataCererii': [{value: null, disabled: true}],
            'company': [{value: null, disabled: true}, Validators.required],
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
            'dose': [],
            'confirmDocuments': '',
            'destroyMethod': [null, Validators.required],
            'tax': [null, [Validators.required, Validators.pattern('^\\d+(\\.\\d{0,2})?$')]],
            'taxTotal': [{value: null, disabled: true}],

        });

    }

    onChanges(): void {
        this.mForm.get('medicaments').valueChanges.subscribe(val => {
            if (val) {
                this.subscriptions.push(
                    this.medicamentService.getMedicamentById(val.id).subscribe(data => {

                            this.mForm.get('pharmaceuticalFormType').setValue(data.pharmaceuticalForm.type);
                            this.mForm.get('forma').setValue(data.pharmaceuticalForm);
                            this.mForm.get('ambalajPrimar').setValue(data.primarePackage);
                            this.mForm.get('dose').setValue(data.dose);
                        },
                        error => {
                            this.mForm.get('pharmaceuticalFormType').setValue(null);
                            this.mForm.get('forma').setValue(null);
                            this.mForm.get('ambalajPrimar').setValue(null);
                            this.mForm.get('dose').setValue(null);
                        }
                    )
                );
            } else {
                this.mForm.get('pharmaceuticalFormType').setValue(null);
                this.mForm.get('forma').setValue(null);
                this.mForm.get('ambalajPrimar').setValue(null);
                this.mForm.get('dose').setValue(null);
            }
        });

        this.mForm.get('pharmaceuticalFormType').valueChanges.subscribe(val => {
            this.mForm.get('forma').setValue(null);
            if (val) {
                this.subscriptions.push(
                    this.administrationService.getAllPharamceuticalFormsByTypeId(val.id).subscribe(data => {
                            this.pharmaceuticalForms = data;
                        },
                        error => this.mForm.get('forma').setValue(null)
                    )
                );
            } else {
                this.mForm.get('forma').setValue(null);
                this.pharmaceuticalForms = [];
            }
        });

        this.mForm.get('registeredMedicament').valueChanges.subscribe(val => {
            if (val) {
                if (val === '1') {
                    this.mForm.get('medicaments').setValidators(Validators.required);
                    this.mForm.get('medicaments').updateValueAndValidity();

                    this.mForm.get('notRegMedName').setValidators(null);
                    this.mForm.get('notRegMedName').updateValueAndValidity();
                    this.mForm.get('dose').disable();
                } else if (val === '0') {
                    this.mForm.get('medicaments').setValidators(null);
                    this.mForm.get('medicaments').updateValueAndValidity();

                    this.mForm.get('notRegMedName').setValidators(Validators.required);
                    this.mForm.get('notRegMedName').updateValueAndValidity();
                    this.mForm.get('dose').enable();
                }
            }
        });

        this.mForm.get('tax').valueChanges.subscribe(val => {
            if (val) {
                this.mForm.get('taxTotal').setValue(this.numberPipe.transform(val * this.mForm.get('quantity').value, '1.2-2'));
            } else {
                this.mForm.get('taxTotal').setValue(null);
            }
        });
    }


    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataCererii').patchValue(new Date(data.startDate));

        this.mForm.get('company').patchValue(data.medicamentAnnihilation.companyName);

        this.docs = data.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.medicamentsToDestroy = data.medicamentAnnihilation.medicamentsMedicamentAnnihilationMeds;
        this.medicamentsToDestroy.forEach(mtd => {
            if (mtd.medicamentId) {
                this.subscriptions.push(
                    this.medicamentService.getMedicamentById(mtd.medicamentId).subscribe(data => {
                            mtd.form = data.pharmaceuticalForm.description;
                            mtd.dose = data.dose;
                            mtd.primarePackage = data.primarePackage;
                        }
                    )
                );
            }
        });

        this.calculateTotalSum();


        // this.refreshOutputDocuments();
    }

    submit() {
        this.mFormSubbmitted = true;
        // if ( this.docs.length == 0) {
        //     this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        //     return;
        // }

        if (this.paymentTotal < 0) {
            this.errorHandlerService.showError('Nu s-a efectuat plata.');
            return;
        }

        if (this.medicamentsToDestroy.find(mtd => !mtd.destructionMethod)) {
            this.errorHandlerService.showError('Nu s-a indicat metoda de distrugere pentru toate medicamentele.');
            return;
        }

        this.mFormSubbmitted = false;
        const modelToSubmit = this.composeModel('A');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    const result = data.body;
                    this.router.navigate(['/dashboard/module/medicament-destruction/actual', result]);
                }
            )
        );
    }

    confirm() {
        // this.mFormSubbmitted = true;
        // if (this.docs.length == 0) {
        //     return;
        // }
        //
        // this.mFormSubbmitted = false;
        const modelToSubmit = this.composeModel('E');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    // this.router.navigate(['/dashboard/module']);
                    this.errorHandlerService.showSuccess('Datele au fost salvate');
                }
            )
        );
    }


    private composeModel(currentStep: string) {

        this.endDate = new Date();

        const modelToSubmit: any = this.oldData;
        const annihilationModel: any = this.oldData.medicamentAnnihilation;


        modelToSubmit.id = this.requestId;

        modelToSubmit.documents = this.docs;
        annihilationModel.medicamentsMedicamentAnnihilationMeds = this.medicamentsToDestroy;

        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'E'
        }];

        modelToSubmit.currentStep = currentStep;
        modelToSubmit.assignedUser = this.authService.getUserName();

        modelToSubmit.medicamentAnnihilation = annihilationModel;
        return modelToSubmit;
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }


    viewDoc(document: any) {
        this.loadingService.show();
        this.subscriptions.push(this.annihilationService.viewActDeReceptie(this.composeModel('E')).subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    generareTax() {
        this.subscriptions.push(this.administrationService.getServiceChargeByCategory('BN').subscribe(data => {
                const paymentOrder = {
                    date: new Date(),
                    amount: this.totalSum,
                    registrationRequestId: this.requestId,
                    serviceCharge: data,
                    quantity: 1

                };
                this.subscriptions.push(this.administrationService.addPaymentOrder(paymentOrder).subscribe(data => {
                    //Refresh list
                    this.additionalBonDePlata = data;
                    this.viewModelData = this.composeModel('E');
                }));

            })
        );


    }

    // checkAllDocumentsWasAttached(): boolean {
    //     return !this.outDocuments.find(od => od.status.mode === 'N');
    // }
    //
    // documentAdded(event) {
    //     this.refreshOutputDocuments();
    // }

    details(medicamentToDestroy: any) {
        const dialogRef2 = this.dialogDetails.open(AnnihilationMedDialogComponent, {
            width: '850px',
            height: '650px',
            data: {
                annihilationMed: medicamentToDestroy,
                destructionMethods: this.destructionMethods
            },
            hasBackdrop: true
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                medicamentToDestroy = result.annihilationMed;
                this.calculateTotalSum();
            }
        });
    }


    calculateTotalSum() {
        this.totalSum = 0;
        this.medicamentsToDestroy.forEach(md => {
            if (md.tax) {
                md.taxTotal = this.numberPipe.transform(md.tax * md.quantity, '1.2-2');
                this.totalSum += md.tax * md.quantity;
            }
        });

        // this.totalSum = this.numberPipe.transform(this.totalSum, '1.2-2');
    }


    addNewMedicament() {
        this.mFormSubbmitted = true;
        if (this.medicamentsToDestroy == null) {
            this.medicamentsToDestroy = [];
        }

        if (!this.mForm.valid) {
            return;
        }

        if (this.mForm.get('registeredMedicament').value === '1') {
            const id = this.mForm.get('medicaments').value.id;

            //Do not register the same medicament id
            if (this.medicamentsToDestroy.find(md => md.medicamentId === id)) {
                return;
            }
        }
        this.mFormSubbmitted = false;

        if (this.mForm.get('registeredMedicament').value === '1') {
            this.medicamentsToDestroy.push(
                {
                    medicamentId: this.mForm.get('medicaments').value.id,
                    medicamentName: this.mForm.get('medicaments').value.name,
                    quantity: this.mForm.get('quantity').value,
                    uselessReason: this.mForm.get('reasonDestroy').value,
                    note: this.mForm.get('note').value,
                    seria: this.mForm.get('seria').value,
                    pharmaceuticalForm: this.mForm.get('forma').value,
                    unitsOfMeasurement: this.mForm.get('unitOfMeasure').value,
                    confirmativeDocuments: this.mForm.get('confirmDocuments').value,
                    primaryPackage: this.mForm.get('ambalajPrimar').value,
                    destructionMethod: this.mForm.get('destroyMethod').value,
                    tax: this.mForm.get('tax').value,
                    taxTotal: this.mForm.get('taxTotal').value,
                }
            );
        } else if (this.mForm.get('registeredMedicament').value === '0') {
            this.medicamentsToDestroy.push(
                {
                    medicamentName: this.mForm.get('notRegMedName').value,
                    notRegisteredName: this.mForm.get('notRegMedName').value,
                    quantity: this.mForm.get('quantity').value,
                    uselessReason: this.mForm.get('reasonDestroy').value,
                    note: this.mForm.get('note').value,
                    seria: this.mForm.get('seria').value,
                    pharmaceuticalForm: this.mForm.get('forma').value,
                    unitsOfMeasurement: this.mForm.get('unitOfMeasure').value,
                    confirmativeDocuments: this.mForm.get('confirmDocuments').value,
                    primaryPackage: this.mForm.get('ambalajPrimar').value,
                    destructionMethod: this.mForm.get('destroyMethod').value,
                    tax: this.mForm.get('tax').value,
                    taxTotal: this.mForm.get('taxTotal').value,
                    notRegisteredDose: this.mForm.get('dose').value,
                }
            );
        }

        this.calculateTotalSum();


        this.mForm.get('medicaments').setValue(null);
        this.mForm.get('forma').setValue(null);
        this.mForm.get('unitOfMeasure').setValue(null);
        this.mForm.get('ambalajPrimar').setValue(null);
        this.mForm.get('quantity').setValue(null);
        this.mForm.get('reasonDestroy').setValue(null);
        this.mForm.get('note').setValue(null);
        this.mForm.get('seria').setValue(null);
        this.mForm.get('notRegMedName').setValue(null);
        this.mForm.get('registeredMedicament').setValue(null);
        this.mForm.get('pharmaceuticalFormType').setValue(null);
        this.mForm.get('confirmDocuments').setValue(null);
        this.mForm.get('destroyMethod').setValue(null);
        this.mForm.get('tax').setValue(null);
        this.mForm.get('taxTotal').setValue(null);
        this.mForm.get('dose').setValue(null);
    }

    removeMedicamentToDestroy(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta inregistrare?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.medicamentsToDestroy.splice(index, 1);
                this.calculateTotalSum();
            }
        });
    }


    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
