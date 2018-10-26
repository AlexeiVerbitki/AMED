import {
    Component,
    ComponentFactory, ComponentFactoryResolver,
    ComponentRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {DocIesire} from '../../../models/docIesire';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {Company} from "../../../models/company";
import {PricesRegService} from "../../../shared/service/reg-prices.service";
import {ReferencePriceComponent} from "../reference-price/reference-price.component";
import {Price} from "../../../models/price";

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
    requestNumber: number;
    currencyUSD:                string = '';
    currencyEUR:                string = '';
    currencyRUR:                string = '';
    today: Date = new Date();

    PriceRegForm: FormGroup;
    expirationReasons: any[] = [];
    selectedReason: any;
    expirationDate: Date;

    proposedPrices: any[] = [];
    selectedPrice : any = {};

      docIesire: DocIesire[] = [
        {denumire: 'Ordin de inregistrare a pretului', statut: 'Generat', status: true},
        {denumire: 'Anexa 1', statut: 'Generat', status: false},
        {denumire: 'Anexa 2', statut: 'Lipsa', status: false}
      ];

    decisions: any[] = [
        {description: 'Acceptă', id: 1},
        {description: 'Respinge', id: 2}
    ];


    @ViewChild("priceReferenceContainer", { read: ViewContainerRef }) priceReferenceContainer;
    priceReferenceComponentRef: ComponentRef<ReferencePriceComponent> [] = [];
    componentFactory: ComponentFactory<ReferencePriceComponent> = this.resolver.resolveComponentFactory(ReferencePriceComponent);

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private priceService: PricesRegService,
              private requestService: RequestService,
              private resolver: ComponentFactoryResolver) {

      this.PriceRegForm = fb.group({
          'id': [],
          'data': {disabled: true, value: new Date()},
          'requestNumber': [null],
          'startDate': [],
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

      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
              this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                      this.requestNumber = data.requestNumber;

                      if(data.medicament.prices != undefined) {
                          data.medicament.prices.forEach(price => this.proposedPrices = [...this.proposedPrices, {id: price.id, description: price.value + " " + price.currency.shortDescription}]);
                          data.medicament.prices[0].documents.forEach(doc => this.documents.push(doc));
                      }

                      if(data.medicament.referencePrices != undefined) {
                          let refPrices: Price[] = data.medicament.referencePrices;
                          if (refPrices != undefined && refPrices.length > 0) {
                              refPrices.forEach(value => {
                                  this.addReferencePriceRow();
                                  this.priceReferenceComponentRef[this.priceRefIndex - 1].instance.refPrice = value
                              })
                          }
                      }

                      this.PriceRegForm.get('company').setValue(data.medicament.company);
                      this.PriceRegForm.get('id').setValue(data.id);
                      this.PriceRegForm.get('startDate').setValue(data.startDate);
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

                      // let expirationDate: Date = data.medicament.expirationDate;
                      // if(expirationDate != undefined) {
                      //     let d: Date = new Date(expirationDate);
                      //     let expirationDate = d.getDay() + '/' +  d.getMonth() + '/' +  d.getFullYear();
                      //     this.PriceRegForm.get('medicament.expirationDate').setValue(expirationDate);
                      // }

                      var reqHist = data.requestHistories.reduce((p, n) => p.id < n.id ? p : n);
                      this.PriceRegForm.get('dataToSaveInStartDateRequestHistory').setValue(reqHist.endDate);
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
              error => {console.log(error); alert(error);}
          ));
  }

    priceRefIndex: number = 0;
    addReferencePriceRow() {
        this.priceReferenceComponentRef[this.priceRefIndex] = this.priceReferenceContainer.createComponent(this.componentFactory);
        this.priceReferenceComponentRef[this.priceRefIndex].instance.forEvaluation = true;
        this.priceReferenceComponentRef[this.priceRefIndex++].instance.formNr = this.priceRefIndex;
    }

    onPriceSelected($event) {
        this.selectedPrice = $event;
    }


    onReasonSelected($event) {
        this.selectedReason = $event;
    }

    nextStep() {
        this.formSubmitted = true;

        if (this.PriceRegForm.invalid) {
            return;
        }

        this.formSubmitted = false;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());
        this.priceReferenceComponentRef.forEach(row => row.destroy());
    }

}
