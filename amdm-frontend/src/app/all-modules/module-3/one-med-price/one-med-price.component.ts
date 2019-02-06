import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {Medicament} from '../../../models/medicament';
import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
import {Country} from '../../../models/country';
import {Currency} from '../../../models/currency';
import {UnitOfMeasure} from '../../../models/unitOfMeasure';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {PriceService} from '../../../shared/service/prices.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';

@Component({
    selector: 'app-one-med-price',
    templateUrl: './one-med-price.component.html',
    styleUrls: ['./one-med-price.component.css'],
    providers: [PriceService, {provide: NG_VALUE_ACCESSOR, useExisting: OneMedPriceComponent, multi: true}]
})
export class OneMedPriceComponent implements OnInit, OnDestroy { //ControlValueAccessor {
    PriceRegForm: FormGroup;
    companyMedicaments: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;
    @Input()
    priceDTO: any = {documents: []};
    @Output()
    public priceDTOChange: EventEmitter<any> = new EventEmitter();
    @Output()
    public medicamentChange: EventEmitter<any> = new EventEmitter();
    @Input()
    public formSubmitted: boolean;
    @Input()
    public medIndex: number;
    @Input()
    countries: Country[] = [];
    @Input()
    currencies: Currency[] = [];
    @Input()
    priceTypes: any[];
    medCode = '';
    internationalName = '';
    termsOfValidity: number;
    dose = '';
    division = '';
    expirationDate = '';
    volumeQuantityMeasurement = '';
    manufacture: any;
    originale: boolean;
    volumeProp: number;
    private subscriptions: Subscription[] = [];
    private getMedSubscr: Subscription;

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private priceService: PriceService) {


        this.PriceRegForm = fb.group({
            value: [null, Validators.required],
            currency: [null, Validators.required],
            requestNumber: [null, Validators.required],
            medicament: [null, Validators.required],
        });
    }

    @Input()
    set baseRequestNumber(value) {
        this.PriceRegForm.get('requestNumber').setValue(value);
    }

    ngOnInit() {

        this.companyMedicaments =
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

                    this.priceService.getMedicamentNamesAndCodeList(term).pipe(
                        tap(() => this.medLoading = false)
                    )
                )
            );

        // this.generateRequestNumber();
    }

    generateRequestNumber() {
        this.subscriptions.push(
            this.priceService.generateDocNumber().subscribe(generatedNumber => {
                    this.PriceRegForm.get('requestNumber').setValue(this.baseRequestNumber + '/' + generatedNumber[0]);
                },
                error => {
                    console.log(error);
                }
            )
        );
    }

    documentAdded($event) {
    }

    addReferencePriceRow() {
        if (!this.priceDTO.price.referencePrices) {
            this.priceDTO.price.referencePrices = [];
        }
        this.priceDTO.valid = false;
        this.priceDTO.price.referencePrices.push({});
    }

    removeReferencePrice(index: number) {
        this.priceDTO.price.referencePrices.splice(index, 1);
        this.sendDTO();
    }

    sendDTO() {
        if (!this.priceDTO.price) {
            this.priceDTO.price = {
                referencePrices: []
            };
        }
        this.priceDTO.price.value = this.PriceRegForm.get('value').value;
        this.priceDTO.price.currency = this.PriceRegForm.get('currency').value;
        this.priceDTO.price.medicament = this.PriceRegForm.get('medicament').value;
        this.priceDTO.price.requestNumber = this.PriceRegForm.get('requestNumber').value;
        this.priceDTO.price.type = {id: 1};
        this.priceDTO.valid = this.PriceRegForm.valid;
        if (this.priceDTO.valid) {
            this.priceDTO.price.referencePrices.forEach(p => {
                if (!p.value || !p.division || !p.currency || !p.country || !p.type) {
                    this.priceDTO.valid = false;
                    return;
                }
            });
        }
        this.priceDTO.index = this.medIndex;
        this.priceDTOChange.emit(this.priceDTO);
    }


    checkMedExpiration(med: Medicament) {

        if (med.expirationDate == undefined) {
            return;
        }

        const expDate: Date = new Date();
        expDate.setMonth(expDate.getMonth() + 2);
        const expMedDate = new Date(med.expirationDate);

        const diffInMs: number = Date.parse(expMedDate.toDateString()) - Date.parse(expDate.toDateString());
        const diffInHours: number = diffInMs / 1000 / 60 / 60;

        if (expMedDate < expDate) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    message: 'Medicamentul selectat expiră în curînd, selectați altul!',
                    confirm: false
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.PriceRegForm.get('medicament').reset();
                    this.onRemoveMed();
                    this.sendDTO();
                }
            });
        }
    }

    getMedicaments($event) {
        if (!$event) {
            return;
        }

        const id = $event.id;
        if (id !== undefined) {
            if (this.getMedSubscr !== undefined) {
                this.getMedSubscr.unsubscribe();
            }

            this.getMedSubscr = this.priceService.getMedicamentById(id).subscribe(
                medicament => {
                    this.onMedSelected(medicament);
                }, error1 => console.log(error1.toString())
            );
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());
    }

    private onMedSelected(newMed: any) {
        console.log(newMed);
        if (newMed == undefined) {
            return;
        }

        this.onRemoveMed();
        this.checkMedExpiration(newMed);


        this.medCode = newMed.code;

        const volumeQuantityMeas: UnitOfMeasure = newMed.volumeQuantityMeasurement;
        if (volumeQuantityMeas != undefined) {
            this.volumeQuantityMeasurement = volumeQuantityMeas.description;
        }

        if (newMed.manufactures && newMed.manufactures.length > 0) {
            this.manufacture = newMed.manufactures.find(m => m.producatorProdusFinit);
        }

        const internationalName: any = newMed.internationalMedicamentName;
        if (internationalName != undefined) {
            this.internationalName = internationalName.description;
        }

        this.originale = newMed.originale;

        const expDate: Date = newMed.expirationDate;
        if (expDate != undefined) {
            const d: Date = new Date(expDate);
            this.expirationDate = d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear();
        }

        this.dose = newMed.dose;
        this.division = newMed.division;
        this.termsOfValidity = newMed.termsOfValidity;
        this.volumeProp = newMed.volume;

        this.sendDTO();
        newMed.index = this.medIndex;
        this.medicamentChange.emit(newMed);
    }

    private onRemoveMed() {
        this.medCode = '';
        this.internationalName = '';
        this.volumeQuantityMeasurement = '';
        this.originale = undefined;
        this.manufacture = undefined;
        this.dose = '';
        this.division = '';
        this.expirationDate = '';
        this.termsOfValidity = undefined;
        this.volumeProp = undefined;
    }
}
