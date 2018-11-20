import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver, ComponentRef, EventEmitter, Input,
    OnDestroy,
    OnInit, Output,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {Medicament} from '../../../models/medicament';
import {Document} from '../../../models/document';
import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
import {ReferencePriceComponent} from "../reference-price/reference-price.component";
import {Country} from "../../../models/country";
import {Currency} from "../../../models/currency";
import {UnitOfMeasure} from "../../../models/unitOfMeasure";
import {Price} from "../../../models/price";
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "../../../shared/service/loader.service";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {PriceService} from "../../../shared/service/prices.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MedicamentType} from "../price-constants";

@Component({
  selector: 'app-one-med-price',
  templateUrl: './one-med-price.component.html',
  styleUrls: ['./one-med-price.component.css'],
  providers: [PriceService]
})
export class OneMedPriceComponent implements OnInit, OnDestroy {

      MAX_REFERENCE_PRICES: number = 9;
      PriceRegForm: FormGroup;
      documents: Document[] = [];
      private subscriptions: Subscription[] = [];
      private getMedSubscr: Subscription;



      companies: Observable<any[]>;
      loadingCompany : boolean = false;
      companyInputs = new Subject<string>();

      countries: Country[] = [];
      currencies: Currency[] = [];
      priceTypes: any[];

      companyMedicaments: Observable<any[]>;
      medInputs = new Subject<string>();
      medLoading = false;


      OriginCountryPriceTypeId: number;

      startRecDate: Date = new Date();

      @ViewChild("priceReferenceContainer", { read: ViewContainerRef }) priceReferenceContainer;
      priceReferenceComponentRef: ComponentRef<ReferencePriceComponent> [] = [];
      priceRefIndex: number = 0;
      componentFactory: ComponentFactory<ReferencePriceComponent> = this.resolver.resolveComponentFactory(ReferencePriceComponent);

    @Output()
    public submit: EventEmitter<any> = new EventEmitter();

    @Input()
    public formSubmitted: boolean;

    @Input()
    public medIndex: number;

    medCode:                    string = '';
    internationalName:          string = '';
    termsOfValidity:            number;
    dose:                       string = '';
    division:                   string = '';
    expirationDate:             string = '';
    volumeQuantityMeasurement:  string = '';
    volumeProp:                 number;
    pricesRequestId:            number;
    medicamentType:             any = {code:MedicamentType.Generic, description: 'Generic'};
    MedType = MedicamentType;

    updateRouteId: string;

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private priceService: PriceService,
              private router: Router,
              private route: ActivatedRoute,
              private resolver: ComponentFactoryResolver,
              private loadingService: LoaderService) {

          this.subscriptions.push(
          this.route.params.subscribe(params => {
              if (params['id']) {
                  this.updateRouteId = params.id;
              }
          }));

        this.PriceRegForm = fb.group({
            id:                 [null],
            price:              [null, Validators.required],
            currency:           [null, Validators.required],
            requestNumber:      [null, Validators.required],
            company:            [null, Validators.required],
            medicament:         [null, Validators.required],
        });
  }

  ngOnInit() {

      this.companies =
          this.companyInputs.pipe(
              filter((result: string) => {
                  if (result && result.length > 2) return true;
              }),
              debounceTime(400),
              distinctUntilChanged(),
              tap((val: string) => {
                  this.loadingCompany = true;

              }),
              flatMap(term =>

                  this.priceService.getCompanyNamesAndIdnoList(term).pipe(
                      tap(() => this.loadingCompany = false)
                  )
              )
          );

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
          this.priceService.getPriceTypes('2').subscribe(priceTypes => {
                  this.priceTypes = priceTypes;

                  var i = 0;
                  while (i < this.priceTypes.length) {
                      if (this.priceTypes[i].description == 'Propus' || this.priceTypes[i].description == 'Acceptat') {
                          this.priceTypes.splice(i, 1);
                      }
                      else {
                          ++i;
                      }
                  }

                  for(let p of this.priceTypes) {
                      if(p.description == 'În țara de origine') {
                          this.OriginCountryPriceTypeId = p.id;
                          break;
                      }
                  }
              },
              error => console.log(error)
          ));

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

      if(this.updateRouteId != undefined) {
          this.subscriptions.push(
              this.priceService.getPricesRequest(this.updateRouteId).subscribe(request => {
                  console.log('requewst', JSON.stringify(request));
                  this.pricesRequestId = request.pricesRequest.id;
                  this.PriceRegForm.get('id').setValue(request.id);
                  this.PriceRegForm.get('requestNumber').setValue(request.requestNumber);
                  this.PriceRegForm.get('company').setValue(request.company);
                  this.PriceRegForm.get('medicament').setValue(request.pricesRequest.medicament);
                  this.PriceRegForm.get('initiator').setValue(request.initiator);
                  this.PriceRegForm.get('requestHistories').setValue(request.requestHistories);
                  this.onMedSelected(request.pricesRequest.medicament);
                  this.initPrices(request.pricesRequest);

                  this.documents = [];
                  request.pricesRequest.documents.forEach(doc => this.documents.push(doc));
          }));
      } else {
          this.subscriptions.push(
              this.priceService.generateDocNumber().subscribe(generatedNumber => {
                      this.PriceRegForm.get('requestNumber').setValue(generatedNumber);
                  },
                  error => {console.log(error); alert(error);}
              )
          );
      }
  }


  sendDTO() {
      let refPrices: Price[] = [];
      this.priceReferenceComponentRef.forEach(value => {
          refPrices.push(value.instance.refPrice);
      });
      let dto: any = this.PriceRegForm.value;
      dto.referencePrices = refPrices;
      dto.index = this.medIndex;
      dto.valid = this.PriceRegForm.valid;
      this.submit.emit(dto);
  }

    addReferencePriceRow() {
        if (this.priceReferenceComponentRef.length < this.MAX_REFERENCE_PRICES) {
            this.priceReferenceComponentRef[this.priceRefIndex] = this.priceReferenceContainer.createComponent(this.componentFactory);
            this.priceReferenceComponentRef[this.priceRefIndex].instance.countries = this.countries;
            this.priceReferenceComponentRef[this.priceRefIndex].instance.formNr = this.priceRefIndex;
            this.priceReferenceComponentRef[this.priceRefIndex].instance.types = this.priceTypes;
            this.priceReferenceComponentRef[this.priceRefIndex].instance.formSubmitted = this.formSubmitted;
            this.priceReferenceComponentRef[this.priceRefIndex].instance.remove.subscribe(event => this.removePriceRow(event));
            this.priceReferenceComponentRef[this.priceRefIndex].instance.change.subscribe(event => this.sendDTO());
            this.priceReferenceComponentRef[this.priceRefIndex++].instance.currencies = this.currencies;
        }
    }


    removePriceRow(rowNr) {
      let newIndex : number = 0;
            this.priceReferenceComponentRef[rowNr].destroy();
            this.priceReferenceComponentRef.splice(rowNr, 1);
            this.priceReferenceComponentRef.forEach(value => value.instance.formNr = newIndex++);
            this.priceRefIndex--;
    }


  private onCompanySelected(event) {
      this.sendDTO();
      // this.onRemoveMed();
      // this.getMedicaments(event.id);
  }

  private onPriceChange($event) {
      this.sendDTO();
  }

  private onCurrencyChange($event) {
      this.sendDTO();
  }


  private initPrices(newMed: any) {
      if(!newMed) return;

      // let prices: Price[] = newMed.prices;
      // if(prices != undefined && prices.length > 0) {
      //     prices.forEach(value => {
      //         this.addProposedPriceRow();
      //         this.proposedPriceComponentRef[this.proposedPriceRefIndex - 1].instance.price = value
      //     });
      // }

      let refPrices: Price[] = newMed.referencePrices;
      if (refPrices != undefined && refPrices.length > 0) {
          refPrices.forEach(value => {
              // if(value.type == 3) { // 3 - pret in tara de origine 4 - pret in tara de referinta
              this.addReferencePriceRow();
              this.priceReferenceComponentRef[this.priceRefIndex - 1].instance.refPrice = value;
          })
      }
  }

  checkMedExpiration(med: Medicament) {

      if(med.expirationDate == undefined) return;

      let expDate: Date = new Date();
      expDate.setFullYear(expDate.getFullYear() + 1);
      let expMedDate = new Date(med.expirationDate);

      let diffInMs: number = Date.parse(expMedDate.toDateString()) - Date.parse(expDate.toDateString());
      let diffInHours: number = diffInMs / 1000 / 60 / 60 ;

       if (diffInHours >= 0) {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              data: {
                  message: 'Medicamentul selectat expiră în curînd, selectați altul!',
                  confirm: false
              }
          });
          dialogRef.afterClosed().subscribe(result => {
              // if(result) {
                  this.PriceRegForm.get('medicament').reset();
                  this.onRemoveMed();
              // }
          });
       }
  }

  private onMedSelected(newMed: Medicament) {
      console.log(newMed);
      if(newMed == undefined) return;

      this.onRemoveMed();
      this.checkMedExpiration(newMed);

      this.sendDTO();

      this.medCode = newMed.code;

      let volumeQuantityMeas: UnitOfMeasure = newMed.volumeQuantityMeasurement;
      if(volumeQuantityMeas != undefined) {
          this.volumeQuantityMeasurement = volumeQuantityMeas.description;
      }

      let internationalName: any = newMed.internationalMedicamentName;
      if(internationalName != undefined) {
          this.internationalName = internationalName.description;
      }

      this.medicamentType = newMed.medicamentType;
      // if(newMed.medicamentType != undefined) {
      //     this.medicamentType = (<MedicamentType>newMed.medicamentType.code);
      // }

      let expDate: Date = newMed.expirationDate;
      if(expDate != undefined) {
          let d: Date = new Date(expDate);
          this.expirationDate = d.getDay() + '/' +  d.getMonth() + '/' +  d.getFullYear();
      }

      this.dose = newMed.dose;
      this.division = newMed.division;
      this.termsOfValidity = newMed.termsOfValidity;
      this.volumeProp = newMed.volume;
  }


  private onRemoveMed() {
      this.medCode = '';
      this.internationalName = '';
      this.volumeQuantityMeasurement = '';
      this.medicamentType = undefined;
      this.dose = undefined;
      this.division = undefined;
      this.expirationDate = '';
      this.termsOfValidity = undefined;
      this.volumeProp = undefined;
      this.priceReferenceComponentRef.forEach(value => value.destroy());
      this.priceReferenceComponentRef = [];
      this.priceRefIndex = 0;
  }





  private onRemoveCompany() {
      // this.PriceRegForm.get('medicament')['controls'].name.reset();
      // this.onRemoveMed();
    //  this.companyMedicaments = [];
  }

    private getMedicaments($event) {

      if(!$event)
      {
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
                }, error1 => alert(error1.toString())
            );
        }
    }



  ngOnDestroy() {
      this.subscriptions.forEach(value => value.unsubscribe());
      this.priceReferenceComponentRef.forEach(row => row.destroy());
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
