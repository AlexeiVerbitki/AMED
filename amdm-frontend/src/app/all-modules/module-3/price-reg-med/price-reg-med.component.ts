import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver, ComponentRef, EventEmitter,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Company} from '../../../models/company';
import {Medicament} from '../../../models/medicament';
import {Document} from '../../../models/document';
import {MatDialog} from '@angular/material';
import {PricesRegService} from '../../../shared/service/reg-prices.service';
import {saveAs} from 'file-saver';
import {ReferencePriceComponent} from "../reference-price/reference-price.component";
import {Country} from "../../../models/country";
import {Currency} from "../../../models/currency";
import {ProposedPriceComponent} from "../proposed-price/proposed-price.component";
import {UnitOfMeasure} from "../../../models/unitOfMeasure";
import {Price} from "../../../models/price";
import {Router} from "@angular/router";


enum PriceRowType {
    Proposed = 1 ,
    Reference = 2
}

enum MedicamentType {
    Original = 2 ,
    Generic = 3
}


@Component({
  selector: 'app-price-reg-med',
  templateUrl: './price-reg-med.component.html',
  styleUrls: ['./price-reg-med.component.css'],
  providers: [PricesRegService]
})
export class PriceRegMedComponent implements OnInit, OnDestroy {

      MAX_REFERENCE_PRICES: number = 9;
      PriceRegForm: FormGroup;
      documents: Document[] = [];
      private subscriptions: Subscription[] = [];
      private getMedSubscr: Subscription;
      private generatedDocNrSeq: any;
      companies: Company[] = [];
      countries: Country[] = [];
      currencies: Currency[] = [];
      priceTypes: any[];
      companyMedicaments: Medicament[];
      formSubmitted: boolean;

      OriginCountryPriceTypeId: number;

      startRecDate: Date = new Date();

      @ViewChild("priceReferenceContainer", { read: ViewContainerRef }) priceReferenceContainer;

      @ViewChild("proposedPriceContainer", { read: ViewContainerRef }) proposedPriceContainer;

      priceReferenceComponentRef: ComponentRef<ReferencePriceComponent> [] = [];
      proposedPriceComponentRef: ComponentRef<ProposedPriceComponent> [] = [];

      proposedPriceRefIndex: number = 0;
      priceRefIndex: number = 0;

      componentFactory: ComponentFactory<ReferencePriceComponent> = this.resolver.resolveComponentFactory(ReferencePriceComponent);
      propPriceComponentFactory: ComponentFactory<ProposedPriceComponent> = this.resolver.resolveComponentFactory(ProposedPriceComponent);

    currencyUSD:                string = '';
    currencyEUR:                string = '';
    currencyRUR:                string = '';
    medCode:                    string = '';
    internationalName:          string = '';
    termsOfValidity:            number;
    dose:                       number;
    expirationDate:             string = '';
    unitsOfMeasurement:         string = '';
    unitsQuantityMeasurement:   string = '';
    storageQuantityMeasurement: string = '';
    storageQuantity:            number;
    volumeProp:                 number;
    unitsQuantity:              number;
    medicamentType:             MedicamentType = MedicamentType.Generic;
    MedType = MedicamentType;

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private priceService: PricesRegService,
              private router: Router,
              private resolver: ComponentFactoryResolver) {

        this.PriceRegForm = fb.group({
            requestNumber:      {disabled: true, value: null},
            startDate:          {disabled: false, value: new Date()},
            company:            [null, Validators.required],
            currentStep:        ['R'],
            medicament:     fb.group({
                                name:                    [null, Validators.required],
                                internationalName:       [null, Validators.required],
                                storageQuantity:         [null, Validators.required],
                            }),
            type:
                fb.group({
                    code: ['PMED', Validators.required]
                }),
        });
  }

  ngOnInit() {
        this.subscriptions.push(
          this.priceService.generateDocNumber().subscribe(generatedNumber => {
              this.generatedDocNrSeq = generatedNumber;
              this.PriceRegForm.get('requestNumber').setValue(this.generatedDocNrSeq);
            },
            error => {console.log(error); alert(error);}
          )
        );

        this.subscriptions.push(
          this.priceService.getCompanies().subscribe(companiesData => {
              this.companies = companiesData;
            },
            error => {console.log(error); alert(error);}
        ));

      this.subscriptions.push(
          this.priceService.getCountries().subscribe(countriesData => {
                  this.countries = countriesData;
              },
              error => console.log(error)
          ));

      this.subscriptions.push(
          this.priceService.getCurrenciesShort().subscribe(currenciesData => {
                  this.currencies = currenciesData;
              },
              error => console.log(error)
          ));

      this.subscriptions.push(
          this.priceService.getAllPriceTypes().subscribe(priceTypes => {
                  this.priceTypes = priceTypes;
                  for(let p of this.priceTypes) {
                      if(p.description == 'În țara de origine') {
                          this.OriginCountryPriceTypeId = p.id;
                          break;
                      }
                  }
              },
              error => console.log(error)
          ));

      this.subscriptions.push(
          this.priceService.getTodayCurrency().subscribe(currenciesData => {
                currenciesData.forEach(az => {
                    if(az.currency.code === 'EUR') {
                        this.currencyEUR = az.value;
                    } else if (az.currency.code === 'SUA') {
                        this.currencyUSD = az.value;
                    } else if (az.currency.code === 'RUB') {
                        this.currencyRUR = az.value;
                    }
                })
              },
              error => console.log(error)
          ));
  }


    addReferencePriceRow() {
        if (this.priceReferenceComponentRef.length < this.MAX_REFERENCE_PRICES) {
            this.priceReferenceComponentRef[this.priceRefIndex] = this.priceReferenceContainer.createComponent(this.componentFactory);
            this.priceReferenceComponentRef[this.priceRefIndex].instance.countries = this.countries;
            this.priceReferenceComponentRef[this.priceRefIndex].instance.formNr = this.priceRefIndex;
            this.priceReferenceComponentRef[this.priceRefIndex].instance.types = this.priceTypes;
            this.priceReferenceComponentRef[this.priceRefIndex].instance.remove.subscribe(event => this.removePriceRow(event, PriceRowType.Reference));
            this.priceReferenceComponentRef[this.priceRefIndex++].instance.currencies = this.currencies;
        }
    }

    addProposedPriceRow() {
        this.proposedPriceComponentRef[this.proposedPriceRefIndex] = this.proposedPriceContainer.createComponent(this.propPriceComponentFactory);
        this.proposedPriceComponentRef[this.proposedPriceRefIndex].instance.formNr = this.proposedPriceRefIndex;
        this.proposedPriceComponentRef[this.proposedPriceRefIndex].instance.remove.subscribe(event => this.removePriceRow(event, PriceRowType.Proposed));
        this.proposedPriceComponentRef[this.proposedPriceRefIndex++].instance.currencies = this.currencies;
    }

    removePriceRow(rowNr, rowType: PriceRowType) {
      let newIndex : number = 0;

        if(rowType === PriceRowType.Proposed) {
            this.proposedPriceComponentRef[rowNr].destroy();
            this.proposedPriceComponentRef.splice(rowNr, 1);
            this.proposedPriceComponentRef.forEach(value => value.instance.formNr = newIndex++);
            this.proposedPriceRefIndex--;
        } else if (rowType === PriceRowType.Reference) {
            this.priceReferenceComponentRef[rowNr].destroy();
            this.priceReferenceComponentRef.splice(rowNr, 1);
            this.priceReferenceComponentRef.forEach(value => value.instance.formNr = newIndex++);
            this.priceRefIndex--;
        }
    }


  private onCompanySelected(event) {
      this.onRemoveMed();
      this.getMedicaments(event.id);
  }

  private onMedSelected(newMed: Medicament) {
      console.log(newMed);
      if(newMed == undefined) return;
      this.onRemoveMed();

      this.medCode = newMed.code;

      let prices: Price[] = newMed.prices;
      if(prices != undefined && prices.length > 0) {
          prices.forEach(value => {
              this.addProposedPriceRow();
              this.proposedPriceComponentRef[this.proposedPriceRefIndex - 1].instance.price = value
          });
          this.documents = [];
          prices[0].documents.forEach(doc => this.documents.push(doc));
      }

      let refPrices: Price[] = newMed.referencePrices;
      if (refPrices != undefined && refPrices.length > 0) {
          refPrices.forEach(value => {
              // if(value.type == 3) { // 3 - pret in tara de origine 4 - pret in tara de referinta
              this.addReferencePriceRow();
              this.priceReferenceComponentRef[this.priceRefIndex - 1].instance.refPrice = value;
          })
      }

      let unitsOfMess: UnitOfMeasure = newMed.unitsOfMeasurement;
      if (unitsOfMess != undefined) {
          this.unitsOfMeasurement = unitsOfMess.description;
      }

      let unitQuantityMeas: UnitOfMeasure = newMed.unitsQuantityMeasurement;
      if(unitQuantityMeas != undefined) {
          this.unitsQuantityMeasurement = unitQuantityMeas.description;
      }

      let storageQuantityMeas: UnitOfMeasure = newMed.storageQuantityMeasurement;
      if(storageQuantityMeas != undefined) {
          this.storageQuantityMeasurement = storageQuantityMeas.description;
      }

      let internationalName: any = newMed.internationalMedicamentName;
      if(internationalName != undefined) {
          this.internationalName = internationalName.description;
      }

      let medType: any = newMed.medicamentType;
      if(medType != undefined) {
          this.medicamentType = (<MedicamentType>medType.code);
      }

      let expDate: Date = newMed.expirationDate;
      if(expDate != undefined) {
          let d: Date = new Date(expDate);
          this.expirationDate = d.getDay() + '/' +  d.getMonth() + '/' +  d.getFullYear();
      }

      this.dose = newMed.dose;
      this.termsOfValidity = newMed.termsOfValidity;
      this.storageQuantity = newMed.storageQuantity;
      this.unitsQuantity = newMed.unitsQuantity;
      this.volumeProp = newMed.volume;
  }


  private onRemoveMed() {
      this.PriceRegForm.get('medicament')['controls'].storageQuantity.reset();
      this.medCode = '';
      this.unitsOfMeasurement = '';
      this.unitsQuantityMeasurement = '';
      this.internationalName = '';
      this.storageQuantityMeasurement = '';
      this.medicamentType = undefined;
      this.dose = undefined;
      this.expirationDate = '';
      this.termsOfValidity = undefined;
      this.storageQuantity = undefined;
      this.unitsQuantity = undefined;
      this.volumeProp = undefined;
      this.proposedPriceComponentRef.forEach(value => value.destroy());
      this.priceReferenceComponentRef.forEach(value => value.destroy());
      this.proposedPriceComponentRef = [];
      this.priceReferenceComponentRef = [];
      this.proposedPriceRefIndex = 0;
      this.priceRefIndex = 0;
  }


  private onRemoveCompany() {
      this.PriceRegForm.get('medicament')['controls'].name.reset();
      this.onRemoveMed();
      this.companyMedicaments = [];
  }

  private getMedicaments(id) {
      this.PriceRegForm.get('medicament')['controls'].name.reset();
    if (id !== undefined) {
      if (this.getMedSubscr !== undefined) {
          this.getMedSubscr.unsubscribe();
      }

      this.getMedSubscr = this.priceService.getCompanyMedicaments(id).subscribe(
              medicaments =>  {
                  this.companyMedicaments = medicaments;
              }, error1 => alert(error1.toString())
          );
    }
  }


    nextStep() {
        this.formSubmitted = true;
        this.priceReferenceComponentRef.forEach(form => form.instance.formSubmitted = true);
        this.proposedPriceComponentRef.forEach(form => form.instance.formSubmitted = true);

        let isGeneric: boolean = this.medicamentType != undefined && this.medicamentType == MedicamentType.Generic;

        let dfdf: boolean = (!isGeneric || (isGeneric && this.priceReferenceComponentRef.length > 0));

        let canSave: boolean = this.documents.length > 0 &&
            this.PriceRegForm.get('company').valid &&
            this.PriceRegForm.get('medicament')['controls'].name.valid &&
            this.proposedPriceRefIndex > 0 && (!isGeneric || (isGeneric && this.priceReferenceComponentRef.length > 0))



        if(!canSave)
        {
            return;
        }

        this.priceReferenceComponentRef.forEach(form => form.instance.formSubmitted = false);
        this.proposedPriceComponentRef.forEach(form => form.instance.formSubmitted = false);
        this.formSubmitted = false;

        let priceModel : any = this.PriceRegForm.value;
        priceModel.requestHistories = [
            {
                startDate : this.startRecDate,
                endDate: new Date(),
                username : this.priceService.getUsername(),
                step : 'R'
            }];

        priceModel.requestNumber = this.PriceRegForm.get('requestNumber').value;
        priceModel.medicament = priceModel.medicament.name;
        priceModel.medicament.storageQuantity = this.PriceRegForm.get('medicament')['controls'].storageQuantity.value;

        let prices : Price[] = [], refPrices: Price[] = [];
        this.proposedPriceComponentRef.forEach(value => {
            value.instance.price.documents = this.documents;
            value.instance.price.medicamentId = priceModel.medicament.id;
            value.instance.price.type = {id: 1};
            prices.push(value.instance.price);
        });
        this.priceReferenceComponentRef.forEach(value => {
            value.instance.refPrice.medicamentId = priceModel.medicament.id;
            refPrices.push(value.instance.refPrice);
        });
        priceModel.medicament.prices = prices;
        priceModel.medicament.referencePrices = refPrices;

        this.subscriptions.push(this.priceService.savePrice(priceModel).subscribe(data => {
                this.router.navigate(['dashboard/module/price/evaluate/' + data.body]);
            }, error1 => alert(error1))
        );
        return false;
    }


  ngOnDestroy() {
      this.subscriptions.forEach(value => value.unsubscribe());
      this.priceReferenceComponentRef.forEach(row => row.destroy());
      this.proposedPriceComponentRef.forEach(row => row.destroy());
  }

    // ngAfterContentInit() {
    //     alert('ngAfterContentInit');
    //     // this.footer now points to the instance of `FooterComponent`
    // }
    //
    // ngAfterViewInit() {
    //     alert('ngAfterViewInit');
    // }
}
