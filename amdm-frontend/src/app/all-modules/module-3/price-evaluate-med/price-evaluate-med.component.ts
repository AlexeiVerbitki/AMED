import {
    Component,
    ComponentFactoryResolver,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {DocIesire} from '../../../models/docIesire';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {Company} from "../../../models/company";
import {PricesRegService} from "../../../shared/service/reg-prices.service";
import {Price} from "../../../models/price";
import {ModalDirective} from "angular-bootstrap-md";
import {ModalService} from "../../../shared/service/modal.service";
import {Country} from "../../../models/country";

enum PriceReferenceType {
    OriginCountry = 3 ,
    ReferenceCountry = 4,
    OtherCountriesCatalog = 5

}
enum MedicamentType {
    Original = 2 ,
    Generic = 3
}

@Component({
  selector: 'app-price-evaluate-med',
  templateUrl: './price-evaluate-med.component.html',
  styleUrls: ['./price-evaluate-med.component.css'],
  providers: [PricesRegService]
})
export class PriceEvaluateMedComponent implements OnInit, OnDestroy {

    formSubmitted: boolean;

    private subscriptions: Subscription[] = [];
    documents: Document [] = [];
    company: Company;
    currencyUSD:                string = '';
    currencyEUR:                string = '';
    currencyRUR:                string = '';
    PriceRefType = PriceReferenceType;

    PriceRegForm: FormGroup;
    expirationReasons: any[] = [];
    selectedReason: any;

    proposedPrices: any[] = [];
    selectedPrice : any = {};
    refPrices:      Price[] = [];
    minRefPrices:   any[] = [];
    minOtherCountriesCatPrices:   any[] = [];
    priceTypes: any[];
    MedType = MedicamentType;
    medicamentType: number;

      docIesire: DocIesire[] = [
        {denumire: 'Ordin de inregistrare a pretului', statut: 'Generat', status: true},
        {denumire: 'Anexa 1', statut: 'Generat', status: false},
        {denumire: 'Anexa 2', statut: 'Lipsa', status: false}
      ];

    decisions: any[] = [
        {description: 'Acceptă', id: 1},
        {description: 'Respinge', id: 2}
    ];

    avgCurrencies: any[] = [];

    @ViewChild('basicModal') modal: ModalDirective;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private priceService: PricesRegService,
              private requestService: RequestService,
              private resolver: ComponentFactoryResolver,
              private modalService: ModalService) {

      this.PriceRegForm = fb.group({
          'id': [],
          'data': {disabled: true, value: new Date()},
          'requestNumber': [null],
          'startDate': {disabled: true, value: new Date()},
          'dataToSaveInStartDateRequestHistory': [''],
          'currentStep': ['E'],
          'evaluation':  fb.group({
              'expirationDate': [null, Validators.required],
              'selectedPrice': [null, Validators.required],
              'selectedReason': [null, Validators.required],
              'decision': [null, Validators.required],
          }),
          'medicament':
              fb.group({
                  'id': [],
                  'name': ['', Validators.required],
                  'registrationDate': [],
                  'expirationDate': [],
                  'companyValue': [''],
                  'pharmaceuticalForm': [null, Validators.required],
                  'dose': [null, Validators.required],
                  'unitsOfMeasurementDesc': [null, Validators.required],
                  'internationalMedicamentName': [null, Validators.required],
                  'volume': [null],
                  'termsOfValidity': [null, Validators.required],
                  'code': [null, Validators.required],
                  'medicamentType': [null, Validators.required],
                  'storageQuantityMeasurementName': [null, Validators.required],
                  'storageQuantity': [null, Validators.required],
                  'unitsQuantityMeasurementName': [null, Validators.required],
                  'unitsQuantity': [null, Validators.required],
                  'prescription': [null, Validators.required],
                  'authorizationHolder': [null, Validators.required],
                  'manufactureName': [null],
                  'documents': [],
                  'status': ['P'],
                  'group':
                      fb.group({
                              'code': ['', Validators.required]
                          }
                      )
              }),
          'company': [''],
          'recetaType': [''],
          'medicamentGroup': [''],
          'activeSubstance': [null],
          'activeSubstanceCode': [''],
          'activeSubstanceQuantity': [null],
          'activeSubstanceUnit': [null],
          'manufactureSA': [null],
          'manufactureCountrySA': [null],
          'manufactureAddressSA': [null],
          'type': [],
          'typeValue': {disabled: true, value: null},
          'requestHistories': [],
      });
  }


  ngOnInit() {
      this.subscriptions.push(this.priceService.getPrevMonthAVGCurrencies().subscribe(data =>{
          this.avgCurrencies = data;
          console.log(this.avgCurrencies);
      }));

      this.subscriptions.push(
          this.priceService.getAllPriceTypes().subscribe(priceTypes => {
                  this.priceTypes = priceTypes;
                  // for(let p of this.priceTypes) {
                  //     if(p.description == 'În țara de origine') {
                  //         this.OriginCountryPriceTypeId = p.id;
                  //         break;
                  //     }
                  // }
              },
              error => console.log(error)
          ));


      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
              this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                      if(data.currentStep != 'R'){
                          alert('Procesul a fost finisat deja');
                      }

                      if(data.medicament.prices != undefined) {
                          data.medicament.prices.forEach(price => this.proposedPrices = [...this.proposedPrices, {id: price.id, description: price.value + " " + price.currency.shortDescription}]);
                          data.medicament.prices[0].documents.forEach(doc => this.documents.push(doc));
                      }

                  console.log(data.medicament.referencePrices);
                      this.initRefPrices(data.medicament.referencePrices);

                      this.PriceRegForm.get('company').setValue(data.medicament.company);
                      this.PriceRegForm.get('id').setValue(data.id);
                      this.PriceRegForm.get('requestNumber').setValue(data.requestNumber);
                      this.PriceRegForm.get('type').setValue(data.type);
                      this.PriceRegForm.get('requestHistories').setValue(data.requestHistories);
                      this.PriceRegForm.get('typeValue').setValue(data.type.code);
                      this.PriceRegForm.get('medicament.id').setValue(data.medicament.id);
                      this.PriceRegForm.get('medicament.internationalMedicamentName').setValue(data.medicament.internationalMedicamentName.description);
                      this.PriceRegForm.get('medicament.companyValue').setValue(data.medicament.company.name);
                      this.PriceRegForm.get('medicament.code').setValue(data.medicament.code);
                      this.PriceRegForm.get('medicament.manufactureName').setValue(data.medicament.manufacture.description);
                      this.PriceRegForm.get('medicament.name').setValue(data.medicament.name);
                      this.PriceRegForm.get('medicament.termsOfValidity').setValue(data.medicament.termsOfValidity);
                      this.PriceRegForm.get('medicament.dose').setValue(data.medicament.dose);
                      this.PriceRegForm.get('medicament.unitsOfMeasurementDesc').setValue(data.medicament.unitsOfMeasurement.description);
                      this.PriceRegForm.get('medicament.documents').setValue(data.medicament.documents);
                      this.PriceRegForm.get('medicament.registrationDate').setValue(data.medicament.registrationDate);
                      this.PriceRegForm.get('medicament.volume').setValue(data.medicament.volume);
                      this.PriceRegForm.get('medicament.unitsQuantity').setValue(data.medicament.unitsQuantity);
                      this.PriceRegForm.get('medicament.storageQuantity').setValue(data.medicament.storageQuantity);
                      this.PriceRegForm.get('medicament.storageQuantityMeasurementName').setValue(data.medicament.storageQuantityMeasurement.description);
                      this.PriceRegForm.get('medicament.unitsQuantityMeasurementName').setValue(data.medicament.unitsQuantityMeasurement.description);
                      this.PriceRegForm.get('medicament.medicamentType').setValue(data.medicament.medicamentType.code);
                      this.PriceRegForm.get('startDate').setValue(new Date(data.startDate));

                      let expDate: Date = new Date();
                      expDate.setFullYear(expDate.getFullYear() + 1);
                      this.PriceRegForm.get('evaluation.expirationDate').setValue(expDate);
                      // let beginDate: Date = data.startDate;
                      // if(beginDate != undefined) {
                      //     let d: Date = new Date(beginDate);
                      //     let begDateString = d.getDay() + '/' +  d.getMonth() + '/' +  d.getFullYear();
                      //     this.PriceRegForm.get('startDate').setValue(d);
                      // }

                      if(data.requestHistories != undefined && data.requestHistories.length > 0) {
                          var reqHist = data.requestHistories.reduce((p, n) => p.id < n.id ? p : n);
                          this.PriceRegForm.get('dataToSaveInStartDateRequestHistory').setValue(reqHist.endDate);
                      }
                      let xs = this.documents;
                      xs = xs.map(x => {
                          x.isOld = true;
                          return x;
                      });

                     console.log('PriceRegForm:');
                     console.log(this.PriceRegForm);

                  })
              );
          })
      );

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

      this.subscriptions.push(
          this.priceService.getPriceExpirationReasons().subscribe(reasons => {
                  this.expirationReasons = reasons;
              },
              error => console.log(error)
          ));
  }

    onPriceSelected($event) {
        this.selectedPrice = $event;
    }


    onReasonSelected($event) {
        this.selectedReason = $event;
    }


    initRefPrices(referencePrices?: Price[]) {

        if(referencePrices != undefined) {
            this.refPrices = referencePrices;
            if (this.refPrices != undefined &&this.refPrices.length > 0) {
                this.refPrices.forEach(refPrice => {

                    for(let avgCur of this.avgCurrencies) {
                        if(avgCur.currency.id == refPrice.currency.id) {
                            refPrice['xchRateRef'] =  avgCur.value;
                            refPrice['xchRateRefVal'] =  avgCur.value * +refPrice.value;
                            break;
                        }
                    }

                    if(!refPrice.hasOwnProperty('xchRateRef')){ // this is fucking Moldo Leu
                        refPrice['xchRateRef'] =  1;
                        refPrice['xchRateRefVal'] = refPrice.value;
                    }

                    for(let avgCur of this.avgCurrencies) {

                        if (avgCur.currency.code == 'EUR') {
                            refPrice['xchRateEur'] =  avgCur.value;
                            refPrice['xchRateEurVal'] = refPrice['xchRateRefVal'] / avgCur.value;

                        } else if (avgCur.currency.code == 'USD') {
                            refPrice['xchRateUsd'] = avgCur.value;
                            refPrice['xchRateUsdVal'] = refPrice['xchRateRefVal'] / avgCur.value;

                        }
                    }
                });
            }

            this.initAverageMinPrice(this.minRefPrices, PriceReferenceType.ReferenceCountry);
            this.initAverageMinPrice(this.minOtherCountriesCatPrices, PriceReferenceType.OtherCountriesCatalog);
        }
    }

    initAverageMinPrice(array: any[], type: PriceReferenceType) {
        this.refPrices.sort((a, b) => {
            if(a['xchRateRefVal'] < b['xchRateRefVal']) {
                return -1;
            } else if (a['xchRateRefVal'] > b['xchRateRefVal']){
                return 1;
            }
            return 0;
        });

        array.push(...this.refPrices.filter(value => value.type.id == type).slice(0,3));
        let avgMinPrice: Price = new Price();
        avgMinPrice.country = new Country();
        avgMinPrice.country.description = 'Prețul Mediu';
        avgMinPrice['xchRateRefVal'] = 0;
        avgMinPrice['xchRateUsdVal'] = 0;
        avgMinPrice['xchRateEurVal'] = 0;

        array.forEach(price => {
            avgMinPrice['xchRateRefVal'] += price['xchRateRefVal'];
            avgMinPrice['xchRateUsdVal'] += price['xchRateUsdVal'];
            avgMinPrice['xchRateEurVal'] += price['xchRateEurVal'];
        });

        avgMinPrice['xchRateRefVal'] /= array.length;
        avgMinPrice['xchRateUsdVal'] /= array.length;
        avgMinPrice['xchRateEurVal'] /= array.length;

        array.push(avgMinPrice);
    }


    save() {

       // this.modalService.data.next({modalType : 'WAITING'});

        // this.modalService.data.next({
        //         requestNumber: 105440,
        //         requestId: 299,
        //         modalType: 'REQUEST_ADDITIONAL_DATA',
        //         mainPageStartDate: new Date()
        //     }
        // );


        // let dialogRef = this.dialogConfirmation.open(ModalInfoLetterComponent);

        // infoLetterDialog.afterClosed().subscribe(result => {
        //     if (result) {
        //         // if (this.waitingForm.get('code').value == '1') {
        //         //     var docEntity = {
        //         //         requestId: this.requestId
        //         //     };
        //         //     this.subscriptions.push(this.medicamentService.answerReceivedRequestAdditionalData(docEntity).subscribe(data => {
        //         //             this.modal.hide();
        //         //             this.modalService.data.next({action: 'CLOSE_MODAL'});
        //         //         }, error => console.log('Raspuns primit nu a fost inregistrat in baza de date'))
        //         //     );
        //         } else {
        //             //this.generateOrderAndSaveInDB();
        //             //navigate dsfsdf
        //         }
        // });

      //  infoLetterDialog.close('!!!');

        this.formSubmitted = true;

        if (this.PriceRegForm.invalid) {
            return;
        }

        this.formSubmitted = false;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());
    }

}
