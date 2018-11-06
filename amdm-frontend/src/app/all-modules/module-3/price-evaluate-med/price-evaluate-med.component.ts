import {
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {ActivatedRoute, Router} from "@angular/router";
import {Price} from "../../../models/price";
import {ModalService} from "../../../shared/service/modal.service";
import {Country} from "../../../models/country";
import {LoaderService} from "../../../shared/service/loader.service";
import {RequestAdditionalDataDialogComponent} from "../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component";
import {MatDialog} from "@angular/material";
import {PriceService} from "../../../shared/service/prices.service";

enum PriceReferenceType {
    OriginCountry = 3 ,
    ReferenceCountry = 4,
    OtherCountriesCatalog = 5

}
enum MedicamentType {
    Original = 2 ,
    Generic = 3
}

enum OutDocsStatus {
    Missing = 'Lipsește',
    Uploaded = 'Încărcat'
}

enum Decision {
    Accept = 1,
    Reject = 2
}

@Component({
  selector: 'app-price-evaluate-med',
  templateUrl: './price-evaluate-med.component.html',
  styleUrls: ['./price-evaluate-med.component.css'],
  providers: [PriceService]
})
export class PriceEvaluateMedComponent implements OnInit, OnDestroy {

    formSubmitted: boolean;

    private subscriptions: Subscription[] = [];
    documents: Document [] = [];
    outputDocuments: any[] = [];
    PriceRefType = PriceReferenceType;

    PriceRegForm: FormGroup;
    expirationReasons: any[] = [];

    formatedProposedPrices: any[] = [];
    proposedPrices:      Price[] = [];
    selectedPrice : any = {};
    refPrices:      Price[] = [];
    minRefPrices:   any[] = [];
    minOtherCountriesCatPrices:   any[] = [];
    priceTypes: any[];
    MedType = MedicamentType;
    needSelectPrice: boolean = false;

    requiredOutputDocs: any[] = [];
    medicamentType: any = {code:MedicamentType.Generic, description: 'Generic'};

     priceModuleAvaibleDocTypes: any[] = ['OP', 'A1', 'A2', 'DP', 'CP', 'RF', 'RC'];

    decisions: any[] = [
        {description: 'Acceptă', id: 1},
        {description: 'Respinge', id: 2}
    ];

    avgCurrencies: any[] = [];

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private priceService: PriceService,
              public dialogConfirmation: MatDialog,
              private router: Router,
              private loadingService: LoaderService,
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
          'pricesMedicament':
              fb.group({
                  'id': [],
                  'name': ['', Validators.required],
                  'registrationDate': [],
                  'expirationDate': [],
                  'pharmaceuticalForm': [null, Validators.required],
                  'dose': [null, Validators.required],
                  'unitsOfMeasurementDesc': [null, Validators.required],
                  'internationalMedicamentName': [null, Validators.required],
                  'volume': [null],
                  'termsOfValidity': [null, Validators.required],
                  'code': [null, Validators.required],
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
          'company': fb.group({
              'id': [],
              'name': ['', Validators.required],
          }),
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

      this.subscriptions.push(this.priceService.getDocumentTypes().subscribe(data =>{
          data.forEach(type => {
              if(this.priceModuleAvaibleDocTypes.includes(type.category)) {
                  this.requiredOutputDocs.push(type);
              }
          });
          console.log('DocTypes', this.requiredOutputDocs);
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
              this.subscriptions.push(this.priceService.getPricesRequest(params['id']).subscribe(data => {
                      console.log(data);
                      if(data.currentStep != 'R'){
                          console.log('Procesul a fost finisat deja');
                      }

                      if(data.prices != undefined) {
                          data.prices.forEach(price => this.formatedProposedPrices = [...this.formatedProposedPrices, {id: price.id, description: price.value + " " + price.currency.shortDescription}]);
                          data.prices[0].documents.forEach(doc => {
                              this.documents.push(doc);

                          });
                          this.proposedPrices = data.prices;
                      }

             //         this.initRefPrices(data.pricesMedicament.referencePrices);

                      this.PriceRegForm.get('company.name').setValue(data.company.name);
                      this.PriceRegForm.get('company.id').setValue(data.company.id);
                      this.PriceRegForm.get('id').setValue(data.id);
                      this.PriceRegForm.get('requestNumber').setValue(data.requestNumber);
                      this.PriceRegForm.get('type').setValue(data.type);
                      this.PriceRegForm.get('requestHistories').setValue(data.requestHistories);
                      this.PriceRegForm.get('typeValue').setValue(data.type.code);
                      this.PriceRegForm.get('pricesMedicament.id').setValue(data.pricesMedicament.id);
                      this.PriceRegForm.get('pricesMedicament.internationalMedicamentName').setValue(data.pricesMedicament.internationalMedicamentName.description);
                      this.PriceRegForm.get('pricesMedicament.code').setValue(data.pricesMedicament.code);
                      this.PriceRegForm.get('pricesMedicament.manufactureName').setValue(data.pricesMedicament.manufacture.description);
                      this.PriceRegForm.get('pricesMedicament.name').setValue(data.pricesMedicament.name);
                      this.PriceRegForm.get('pricesMedicament.termsOfValidity').setValue(data.pricesMedicament.termsOfValidity);
                      this.PriceRegForm.get('pricesMedicament.dose').setValue(data.pricesMedicament.dose);
                      this.PriceRegForm.get('pricesMedicament.unitsOfMeasurementDesc').setValue(data.pricesMedicament.unitsOfMeasurement.description);
                      this.PriceRegForm.get('pricesMedicament.documents').setValue(data.pricesMedicament.documents);
                      this.PriceRegForm.get('pricesMedicament.registrationDate').setValue(data.pricesMedicament.registrationDate);
                      this.PriceRegForm.get('pricesMedicament.volume').setValue(data.pricesMedicament.volume);
                      this.PriceRegForm.get('pricesMedicament.unitsQuantity').setValue(data.pricesMedicament.unitsQuantity);
                      this.PriceRegForm.get('pricesMedicament.storageQuantity').setValue(data.pricesMedicament.storageQuantity);
                      this.PriceRegForm.get('pricesMedicament.storageQuantityMeasurementName').setValue(data.pricesMedicament.storageQuantityMeasurement.description);
                      this.PriceRegForm.get('pricesMedicament.unitsQuantityMeasurementName').setValue(data.pricesMedicament.unitsQuantityMeasurement.description);
                      this.medicamentType = data.pricesMedicament.medicamentType;
                      this.PriceRegForm.get('pricesMedicament.expirationDate').setValue(data.pricesMedicament.expirationDate);
                      this.PriceRegForm.get('startDate').setValue(new Date(data.startDate));
                      this.initOutputDocs(data.outputDocuments);

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
                  })
              );
          })
      );

      this.subscriptions.push(
          this.priceService.getPriceExpirationReasons().subscribe(reasons => {
                  this.expirationReasons = reasons;
              },
              error => console.log(error)
          ));
    }

    onDecisionChange($event) {
      console.log($event);
      if($event.id == Decision.Accept) { //accepta
          this.needSelectPrice = true;
      } else if($event.id == Decision.Reject) {
          this.needSelectPrice = false;
      }
    }

    documentAdded($event) {
       this.outputDocuments.forEach(outDoc => {
           if(outDoc.status == "Nu este atasat") {
               for(let doc of this.documents){
                   if (doc.docType.description == outDoc.description) {
                       outDoc.number = doc.number;
                       outDoc.status = "Atasat";
                       break;
                   }
               }
           }
       });
    }


    initOutputDocs(outDocs: any) {

       if(outDocs) {
           for(let i = 0; i < outDocs.length; i++) {
               this.outputDocuments.push({
                   description: outDocs[i].docType.description,
                   number: outDocs[i].number,
                   status: outDocs[i].name ? "Atasat" : "Nu este atasat"
               })
           }
       }
    }

    hasUnloadedDocs() {
      return this.outputDocuments.some(value => value.status == "Nu este atasat");
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


    viewDoc(document: any) {
        if (document.docType.category == 'OA') {
            // this.subscriptions.push(this.documentService.viewMedicamentAuthorizationOrder(document.number).subscribe(data => {
            //         let file = new Blob([data], {type: 'application/pdf'});
            //         var fileURL = URL.createObjectURL(file);
            //         window.open(fileURL);
            //     }, error => {
            //         console.log('error ', error);
            //     }
            //     )
            // );
        } else {
            // this.subscriptions.push(this.documentService.viewMedicamentAuthorizationCertificate(document.number).subscribe(data => {
            //         let file = new Blob([data], {type: 'application/pdf'});
            //         var fileURL = URL.createObjectURL(file);
            //         window.open(fileURL);
            //     }, error => {
            //         console.log('error ', error);
            //     }
            //     )
            // );
        }
    }


    save() {

        this.loadingService.show();
        this.formSubmitted = true;

        let selectedPrice = this.PriceRegForm.get('evaluation')['controls'].selectedPrice;
        let expDate = this.PriceRegForm.get('evaluation')['controls'].expirationDate;
        let decision = this.PriceRegForm.get('evaluation')['controls'].decision;

        let canSave: boolean = this.documents.length > 0 && !this.hasUnloadedDocs() &&
            decision.value && ((this.needSelectPrice && (selectedPrice.value && (selectedPrice.value.id && expDate.value))) || !this.needSelectPrice);//acceptat

        if (!canSave) {
            this.loadingService.hide();
            return;
        }

        this.formSubmitted = false;

        let priceModel : any = {};// = this.PriceRegForm.value;
        priceModel.id = this.PriceRegForm.get('id').value;
        priceModel.requestNumber = this.PriceRegForm.get('requestNumber').value;
        priceModel.currentStep = this.PriceRegForm.get('currentStep').value;
        priceModel.company = this.PriceRegForm.get('company').value;
        priceModel.type = {code: "PMED"};//this.PriceRegForm.get('type').value;
        priceModel.pricesMedicament = {}//this.PriceRegForm.get('pricesMedicament').value;
        priceModel.pricesMedicament.id = this.PriceRegForm.get('pricesMedicament')['controls'].id.value;
        priceModel.requestHistories = this.PriceRegForm.get('requestHistories').value;
        priceModel.startDate = this.PriceRegForm.get('startDate').value;
         priceModel.endDate = new Date();

        priceModel.requestHistories.push(
            {
                startDate : this.PriceRegForm.get('dataToSaveInStartDateRequestHistory').value,
                endDate: new Date(),
                username : this.priceService.getUsername(),
                step : 'E'
            });

        if(decision.value.id == Decision.Accept) {
            const acceptType: any = this.priceTypes.filter(value => value.description == 'Acceptat')[0];

            for(let p of this.proposedPrices) {
                if(selectedPrice.value.id == p.id) {
                    p.type = acceptType; // pretul a fost acceptat
                    p.expirationDate = expDate.value;
                    p.expirationReason = this.expirationReasons[0];
                }

                p.documents = [...p.documents, ...this.documents];
            }
        }

        priceModel.pricesMedicament.prices = this.proposedPrices;
        console.log('priceModel:', JSON.stringify(priceModel));

        this.subscriptions.push(this.priceService.savePrice(priceModel).subscribe(data => {
                this.router.navigate(['dashboard/homepage']);
                this.loadingService.hide();
            },
            error1 => {
                console.log(error1);
                this.loadingService.hide();
            })
        );
        return false;
    }

    private sendInfoLetter(afterCallback?: () => void) {
        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            data: {
                requestNumber: this.PriceRegForm.get('requestNumber').value,
                requestId: this.PriceRegForm.get('id').value,
                modalType: 'NOTIFICATION',
                startDate: this.PriceRegForm.get('startDate').value,
            },
            width: '1000px',
            height: '550px',
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            // if (result.success) {
            //     afterCallback();
            //     this.outputDocuments.push(result);
            //     this.initialData.medicament.outputDocument = this.outputDocuments;
            //     this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
            //             this.outputDocuments = data.body.medicament.outputDocuments;
            //             this.checkOutputDocumentsStatus();
            //         }, error => console.log(error))
            //     );
            // }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());
    }

}
