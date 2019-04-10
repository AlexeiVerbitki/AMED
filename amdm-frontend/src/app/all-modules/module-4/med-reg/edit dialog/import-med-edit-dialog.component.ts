import {Cerere} from './../../../../models/cerere';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../../shared/service/administration.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '../../../../dialog/confirmation-dialog.component';
import {Document} from '../../../../models/document';
import {RequestService} from '../../../../shared/service/request.service';
import {Subject} from 'rxjs/index';
import {LoaderService} from '../../../../shared/service/loader.service';
import {AuthService} from '../../../../shared/service/authetication.service';
import {MedicamentService} from '../../../../shared/service/medicament.service';

@Component({
    selector: 'app-import-med-dialog',
    templateUrl: './import-med-edit-dialog.component.html',
    styleUrls: ['./import-med-edit-dialog.component.css']
})
export class ImportMedEditDialogComponent implements OnInit, OnDestroy {
    cereri: Cerere[] = [];
    evaluateImportForm: FormGroup;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    addMedicamentClicked: boolean;
    docs: Document [] = [];
    unitOfImportTable: any[] = [];
    manufacturersRfPr: Observable<any[]>;
    loadingManufacturerRfPr = false;
    manufacturerInputsRfPr = new Subject<string>();
    importer: Observable<any[]>;
    loadingCompany = false;
    sellerAddress: any;
    importerAddress: any;
    producerAddress: any;
    codeAmed: any;
    solicitantCompanyList: Observable<any[]>;
    unitSumm: any;
    formModel: any;
    valutaList: any[];
    importData: any;
    medicamentData: any;
    atcCodes: Observable<any[]>;
    loadingAtcCodes = false;
    atcCodesInputs = new Subject<string>();
    customsCodes: Observable<any[]>;
    loadingcustomsCodes = false;
    customsCodesInputs = new Subject<string>();
    pharmaceuticalForm: Observable<any[]>;
    loadingpharmaceuticalForm = false;
    pharmaceuticalFormInputs = new Subject<string>();
    unitsOfMeasurement: Observable<any[]>;
    medicaments: Observable<any[]>;
    loadingmedicaments = false;
    medicamentsInputs = new Subject<string>();
    internationalMedicamentNames: Observable<any[]>;
    loadinginternationalMedicamentName = false;
    internationalMedicamentNameInputs = new Subject<string>();
    checked: boolean;
    medType: any;
    protected companyInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];
    importSources: any[] = [];

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dialogData: any,
                private requestService: RequestService,
                public dialog: MatDialogRef<ImportMedEditDialogComponent>,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoaderService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                public medicamentService: MedicamentService,
                private administrationService: AdministrationService) {
    }

    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable') as FormArray;
    }

    ngOnInit() {
        console.log('dialogData: ', this.dialogData);
        this.importData = this.dialogData;
        this.medType = this.dialogData.medtType;
        this.valutaList = [];
        this.checked = false;
        this.currentDate = new Date();
        this.sellerAddress = '';
        this.producerAddress = '';
        this.importerAddress = '';
        this.formSubmitted = false;
        this.addMedicamentClicked = false;
        this.loadEconomicAgents();
        this.loadManufacturersRfPr();
        this.loadImportSources();
        this.loadCurrenciesShort();
        this.loadCustomsCodes();
        this.loadATCCodes();
        this.loadPharmaceuticalForm();
        this.loadUnitsOfMeasurement();
        this.loadMedicaments();
        this.loadInternationalMedicamentName();

        this.evaluateImportForm = this.fb.group({
            'importAuthorizationEntity': this.fb.group({
                'unitOfImportTable': this.fb.group({
                    customsCode: [{value: null, disabled: false}, Validators.required],
                    name: [{value: null, disabled: false}, Validators.required],
                    quantity: [{value: null, disabled: false}, [Validators.required, Validators.min(0.01)]],
                    approvedQuantity: [{value: null, disabled: true}, [Validators.required, Validators.min(0.01)]],
                    price: [{value: null, disabled: false}, Validators.required],
                    currency: [{value: null, disabled: true}, Validators.required],
                    summ: [{value: null, disabled: true}, Validators.required],
                    producer: [{value: null, disabled: false}, Validators.required],
                    expirationDate: [{value: null, disabled: false}, Validators.required],
                    atcCode: [{value: null, disabled: false}, Validators.required],
                    medicament: [{value: null, disabled: true}, Validators.required],
                    pharmaceuticalForm: [{value: null, disabled: false}, Validators.required],
                    dose: [{value: null, disabled: false}, Validators.required],
                    registrationRmNumber: [{value: null, disabled: true}, Validators.required],
                    unitsOfMeasurement: [{value: null, disabled: false}, Validators.required],
                    registrationRmDate: [{value: null, disabled: true}, Validators.required],
                    internationalMedicamentName: [{value: null, disabled: false}, Validators.required],
                    importSources: [null, Validators.required]
                }),
            }),
        });

        if (this.dialogData.medicament) {

            console.log('this.dialogData.medicament', this.dialogData.medicament);

            const codeValid = this.dialogData.medicament.code;
            const customsCodeValid = this.dialogData.medicament.customsCode;
            const nameValid = this.dialogData.medicament.name;
            const quantityValid = this.dialogData.quantity;
            const approvedQuantityValid = this.dialogData.medicament.approvedQuantity;
            const priceValid = this.dialogData.price;
            const currencyValid = this.dialogData.currency;

            console.log('this.dialogData.medicament.manufactures', this.dialogData.medicament.manufactures);
            const producerValid = this.dialogData.medicament.manufactures.length > 0 ? this.dialogData.medicament.manufactures[0].manufacture : '';
            const expirationDateValid = this.dialogData.medicament.expirationDate;
            const pharmaceuticalFormValid = this.dialogData.medicament.pharmaceuticalForm;
            const doseValid = this.dialogData.medicament.dose;
            const unitsOfMeasurementValid = this.dialogData.medicament.division;
            const internationalMedicamentNameValid = this.dialogData.medicament.internationalMedicamentName;
            const atcCodeValid = this.dialogData.medicament.atcCode;
            const registrationRmNumberValid = this.dialogData.medicament.registrationNumber;
            const registrationRmDateValid = this.dialogData.medicament.registrationDate;
            const manufacturesValid = this.dialogData.medicament.manufactures.length > 0
                && this.dialogData.medicament.manufactures[0].manufacture
                && this.dialogData.medicament.manufactures[0].manufacture.address
                && this.dialogData.medicament.manufactures[0].manufacture.country.description;

            if (codeValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(this.dialogData.medicament.code);
            }
            if (customsCodeValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(this.dialogData.medicament.customsCode);
            }
            if (nameValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(this.dialogData.medicament.name);
            }
            if (quantityValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(this.dialogData.quantity);
            }
            if (approvedQuantityValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setValue(this.dialogData.approvedQuantity);
            }
            if (priceValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').setValue(this.dialogData.price);
            }
            if (currencyValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(this.dialogData.currency.shortDescription);
            }
            if (producerValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(this.dialogData.medicament.manufactures[0].manufacture);
            }
            if (expirationDateValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(new Date(this.dialogData.medicament.expirationDate));
            }
            if (pharmaceuticalFormValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(this.dialogData.medicament.pharmaceuticalForm);
            }
            if (doseValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(this.dialogData.medicament.dose);
            }
            if (unitsOfMeasurementValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(this.dialogData.medicament.division);
            }
            if (internationalMedicamentNameValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName')
                    .setValue(this.dialogData.medicament.internationalMedicamentName);
            }
            if (atcCodeValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(this.dialogData.medicament.atcCode);
            }
            if (registrationRmNumberValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(this.dialogData.medicament.registrationNumber);
            }
            if (registrationRmDateValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(new Date(this.dialogData.medicament.registrationDate));
            }
            if (manufacturesValid) {
                this.producerAddress = this.dialogData.medicament.manufactures[0].manufacture.address + ', '
                    + this.dialogData.medicament.manufactures[0].manufacture.country.description;
            }

            this.unitSumm = this.dialogData.summ;

        } else {

            const codeAmedValid = this.dialogData.codeAmed;
            const customsCodeValid = this.dialogData.customsCode;
            const nameValid = this.dialogData.name;
            const quantityValid = this.dialogData.quantity;
            const approvedQuantityValid = this.dialogData.approvedQuantity;
            const priceValid = this.dialogData.price;
            const shortDescriptionValid = this.dialogData.currency.shortDescription;
            const producerValid = this.dialogData.producer;
            const pharmaceuticalFormValid = this.dialogData.pharmaceuticalForm;
            const doseValid = this.dialogData.dose;
            const unitsOfMeasurementValid = this.dialogData.unitsOfMeasurement;
            const internationalMedicamentNameValid = this.dialogData.internationalMedicamentName;
            const atcCodeValid = this.dialogData.atcCode;
            const registrationNumberValid = this.dialogData.registrationNumber;
            const importSources = this.dialogData.importSources;
            const producerAddressValid =
                this.producerAddress =
                    this.dialogData.producer && this.dialogData.producer.address && this.dialogData.producer.country && this.dialogData.producer.country.description;

            if (codeAmedValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(this.dialogData.codeAmed);
            }
            if (customsCodeValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(this.dialogData.customsCode);
            }
            if (nameValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(this.dialogData.name);
            }
            if (quantityValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(this.dialogData.quantity);
            }
            if (approvedQuantityValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setValue(this.dialogData.approvedQuantity);
            } else{
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setErrors(null);
            }
            if (priceValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').setValue(this.dialogData.price);
            }
            if (shortDescriptionValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(this.dialogData.currency.shortDescription);
            }
            if (producerValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(this.dialogData.producer);
            }
            if (pharmaceuticalFormValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(this.dialogData.pharmaceuticalForm);
            }
            if (doseValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(this.dialogData.dose);
            }
            if (unitsOfMeasurementValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(this.dialogData.unitsOfMeasurement);
            }
            if (internationalMedicamentNameValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(this.dialogData.internationalMedicamentName);
            }
            if (atcCodeValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(this.dialogData.atcCode);
            }
            if (registrationNumberValid) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(this.dialogData.registrationNumber);
            } else {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setErrors(null);
            }
            if (producerAddressValid) {
                this.producerAddress = this.dialogData.producer.address + ', ' + this.dialogData.producer.country.description;
            }
            if (importSources) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.importSources').setValue(this.dialogData.importSources);
            }
            if (this.dialogData.registrationDate) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(new Date(this.dialogData.registrationDate));
            }
            if (this.dialogData.expirationDate) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(new Date(this.dialogData.expirationDate));
            } else{
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setErrors(null);
            }
            this.unitSumm = this.dialogData.summ;
        }
        console.log('this.dialogData.producer', this.dialogData.producer);


        if (this.importData.currentStep == 'AP' || this.importData.currentStep == 'E') {
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').enable();
        }


        this.onChanges();

    }

    setApproved(i: any) {
        if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved == false) {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
        } else {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false;
        }

        console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']',
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved);
    }

    cancel(): void {
        this.dialog.close();
    }

    reject(): void {
        this.dialog.close([false]);
    }

    confirm(): void {
        console.log('this.evaluateImportForm',this.evaluateImportForm);
        if (this.evaluateImportForm.valid) {
            this.addMedicamentClicked = true;
            if (this.evaluateImportForm.valid) {
                this.dialog.close([true, this.evaluateImportForm.value]);
                this.addMedicamentClicked = false;
            }
        }
    }

    onChanges(): void {
        if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity')) {

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').valueChanges.subscribe(val => {
                if (val) {
                    this.unitSumm = val * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    console.log('this,this.unitSumm', this.unitSumm);
                }
            }));
        }
    }

    addUnitOfImport() {
        this.addMedicamentClicked = true;

        if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid) {
            this.unitOfImportTable.push({
                codeAmed: this.codeAmed,
                customsCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').value,
                name: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').value,
                quantity: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value,
                approvedQuantity: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').value,
                price: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
                currency: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').value,
                summ: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
                producer: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').value,
                expirationDate: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').value,
                pharmaceuticalForm: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').value,
                dose: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').value,
                unitsOfMeasurement: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').value,
                internationalMedicamentName: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').value,
                atcCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').value,
                registrationNumber: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').value,
                registrationDate: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').value,
            });

            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(null);
            this.producerAddress = null;
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(null);

            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(null);

            this.addMedicamentClicked = false;
        }
        console.log('this.unitOfImportTable', this.unitOfImportTable);
    }

    loadImportSources() {
        this.subscriptions.push(
            this.administrationService.getImportSources().subscribe(data => {
                    this.importSources = data;
                    console.log('importSources', data);

                },
                error => console.log(error)
            )
        );
    }
    loadATCCodes() {
        this.customsCodes =
            this.customsCodesInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingcustomsCodes = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllCustomsCodesByDescription(term).pipe(
                        tap(() => this.loadingcustomsCodes = false)
                    )
                )
            );
    }

    loadInternationalMedicamentName() {
        this.internationalMedicamentNames =
            this.internationalMedicamentNameInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadinginternationalMedicamentName = true;

                }),
                flatMap(term =>

                    this.administrationService.getAllInternationalNamesByName(term).pipe(
                        tap(() => this.loadinginternationalMedicamentName = false)
                    )
                )
            );
    }

    loadPharmaceuticalForm() {
        this.pharmaceuticalForm =
            this.pharmaceuticalFormInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingpharmaceuticalForm = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllPharamceuticalFormsByName(term).pipe(
                        tap(() => this.loadingpharmaceuticalForm = false)
                    )
                )
            );
    }

    loadMedicaments() {
        this.medicaments =
            this.medicamentsInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingmedicaments = true;

                }),
                flatMap(term =>
                    this.medicamentService.getMedicamentByName(term).pipe(
                        tap(() => this.loadingmedicaments = false)
                    )
                )
            );
    }


    loadUnitsOfMeasurement() {
        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                },
                error => console.log(error)
            )
        );
    }

    loadCustomsCodes() {
        this.atcCodes =
            this.atcCodesInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingAtcCodes = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllAtcCodesByCode(term).pipe(
                        tap(() => this.loadingAtcCodes = false)
                    )
                )
            );

    }


    loadEconomicAgents() {
        this.importer =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.administrationService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );
    }


    loadManufacturersRfPr() {
        this.manufacturersRfPr =
            this.manufacturerInputsRfPr.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingManufacturerRfPr = true;

                }),
                flatMap(term =>
                    this.administrationService.getManufacturersByName(term).pipe(
                        tap(() => this.loadingManufacturerRfPr = false)
                    )
                )
            );
    }

    loadCurrenciesShort() {
        this.administrationService.getCurrenciesShort().subscribe(data => {
                this.valutaList = data;

            },
            error => console.log('loadCurrenciesShort() ERROR', error)
        );
    }

    interruptProcess() {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            // console.log('result', result);
            if (result) {
                this.loadingService.show();
                let modelToSubmit: any = {};
                modelToSubmit = this.importData;
                modelToSubmit.currentStep = 'C';
                modelToSubmit.endDate = new Date();
                modelToSubmit.documents = this.docs;
                modelToSubmit.medicaments = [];
                modelToSubmit.requestHistories.push({
                    startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
                    endDate: new Date(),
                    username: this.authService.getUserName(),
                    step: 'E'
                });
                modelToSubmit.documents = this.docs;
                this.subscriptions.push(
                    this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                        this.router.navigate(['/dashboard/homepage']);
                        this.loadingService.hide();
                    }, error => {
                        this.loadingService.hide();
                        console.log(error);
                    })
                );
            }
        });
    }


    nextStep() {
        this.formSubmitted = true;
        let modelToSubmit: any = {};
        this.loadingService.show();

        modelToSubmit.endDate = new Date();
        modelToSubmit = this.importData;

        modelToSubmit.requestHistories.push({
            startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'E'
        });

        console.log('this.evaluateImportForm.value', this.evaluateImportForm.value);
        //=============

        modelToSubmit.medicaments = [];
        console.log('modelToSubmit', modelToSubmit);
        alert('before addImportRequest(modelToSubmit)');
        // this.subscriptions.push(this.requestService.addImportRequest(this.importData).subscribe(data => {
        this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                alert('after addImportRequest(modelToSubmit)');
                console.log('addImportRequest(modelToSubmit).subscribe(data) ', data);
                this.loadingService.hide();
                // this.router.navigate(['dashboard/module']); for now to post multiple times
            }, error => {
                alert('Something went wrong while sending the model');
                console.log('error: ', error);
                this.loadingService.hide();
            }
        ));

        this.formSubmitted = false;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
