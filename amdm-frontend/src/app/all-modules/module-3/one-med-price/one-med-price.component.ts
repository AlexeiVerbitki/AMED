import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {Medicament} from '../../../models/medicament';
import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
import {ReferencePriceComponent} from "../reference-price/reference-price.component";
import {Country} from "../../../models/country";
import {Currency} from "../../../models/currency";
import {UnitOfMeasure} from "../../../models/unitOfMeasure";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {PriceService} from "../../../shared/service/prices.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";

@Component({
    selector: 'app-one-med-price',
    templateUrl: './one-med-price.component.html',
    styleUrls: ['./one-med-price.component.css'],
    providers: [PriceService]
})
export class OneMedPriceComponent implements OnInit, OnDestroy {
    PriceRegForm: FormGroup;
    private subscriptions: Subscription[] = [];
    private getMedSubscr: Subscription;


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

    medCode: string = '';
    internationalName: string = '';
    termsOfValidity: number;
    dose: string = '';
    division: string = '';
    expirationDate: string = '';
    volumeQuantityMeasurement: string = '';
    manufacture: string = '';
    originale: boolean;
    volumeProp: number;


    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private priceService: PriceService,) {


        this.PriceRegForm = fb.group({
            value: [null, Validators.required],
            currency: [null, Validators.required],
            requestNumber: [null, Validators.required],
            medicament: [null, Validators.required],
        });
    }

    ngOnInit() {

        this.companyMedicaments =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
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

        this.generateRequestNumber();
    }

    generateRequestNumber() {
        this.subscriptions.push(
            this.priceService.generateDocNumber().subscribe(generatedNumber => {
                    this.PriceRegForm.get('requestNumber').setValue(generatedNumber);
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
        if(!this.priceDTO.price.referencePrices) {
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
        this.priceDTO.valid = this.PriceRegForm.valid;
        if(this.priceDTO.valid) {
            this.priceDTO.price.referencePrices.forEach(p => {
                if(!p.value || !p.division || !p.currency || !p.country || !p.type) {
                    this.priceDTO.valid = false;
                    return;
                }
            });
        }
        this.priceDTO.index = this.medIndex;
        this.priceDTOChange.emit(this.priceDTO);
    }


    checkMedExpiration(med: Medicament) {

        if (med.expirationDate == undefined) return;

        let expDate: Date = new Date();
        expDate.setMonth(expDate.getMonth() + 2);
        let expMedDate = new Date(med.expirationDate);

        let diffInMs: number = Date.parse(expMedDate.toDateString()) - Date.parse(expDate.toDateString());
        let diffInHours: number = diffInMs / 1000 / 60 / 60;

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

    private onMedSelected(newMed: any) {
        console.log(newMed);
        if (newMed == undefined) return;

        this.onRemoveMed();
        this.checkMedExpiration(newMed);


        this.medCode = newMed.code;

        let volumeQuantityMeas: UnitOfMeasure = newMed.volumeQuantityMeasurement;
        if (volumeQuantityMeas != undefined) {
            this.volumeQuantityMeasurement = volumeQuantityMeas.description;
        }

        if (newMed.manufactures && newMed.manufactures.length > 0) {
            this.manufacture = newMed.manufactures.find(m => m.producatorProdusFinit);
        }

        let internationalName: any = newMed.internationalMedicamentName;
        if (internationalName != undefined) {
            this.internationalName = internationalName.description;
        }

        this.originale = newMed.originale;

        let expDate: Date = newMed.expirationDate;
        if (expDate != undefined) {
            let d: Date = new Date(expDate);
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


    private getMedicaments($event) {

        if (!$event) {
            return;
        }

        let id = $event.id;
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
}
