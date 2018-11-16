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
import {Medicament} from "../../../models/medicament";

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

    proposedPrices:      Price[] = [];
    selectedPrice : any = {};
    refPrices:      Price[] = [];
    prevPrices:     Price[] = [];
    relatedMeds:     any[] = [];
    avgRelatedMeds:     number = 0;
    minRefPrices:   any[] = [];
    dciAndOriginAvgs:   any[] = [];
    minOtherCountriesCatPrices:   any[] = [];
    priceTypes: any[];
    MedType = MedicamentType;
    needSelectPrice: boolean = false;

    hasReferencePrices: boolean = false;
    hasOriginCountryPrices: boolean = false;
    hasOtherCountriesPrices: boolean = false;

    priceRequestId: number;

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
          'initiator':          [null],
          'assignedUser':       [null],
          'startDate': {disabled: true, value: new Date()},
          'dataToSaveInStartDateRequestHistory': [''],
          'currentStep': ['E'],
          'price': fb.group({
              id: [null],
              value: [null],
              currency: [null],
              folderNr: [null],
              nationalPrice: [null],
          }),
          'evaluation':  fb.group({
              'expirationDate': [null, Validators.required],
              'selectedPrice': [null, Validators.required],
              'selectedReason': [null, Validators.required],
              'decision': [null, Validators.required],
          }),
          // 'pricesRequest':
          //     fb.group({
          //         'id':             [null, Validators.required],
          //         'documents':      [],
          //         'referencePrices':[],
          //         'prices':         [],
                  'medicament':
                      fb.group({
                          'id': [],
                          'name': ['', Validators.required],
                          'registrationDate': [],
                          'expirationDate': [],
                          'pharmaceuticalForm': [null, Validators.required],
                          'dose': [null, Validators.required],
                          'division': [null, Validators.required],
                          'unitsOfMeasurementDesc': [null, Validators.required],
                          'internationalMedicamentName': [null, Validators.required],
                          'volume': [null],
                          'volumeQuantityMeasurementName': [null],
                          'termsOfValidity': [null, Validators.required],
                          'code': [null, Validators.required],
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
              // }),
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
      this.getPrevMonthAVGCurrencies();
      this.getDocumentsTypes();
      this.getAllPricesTypes();

      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
              this.subscriptions.push(this.priceService.getPricesRequest(params['id']).subscribe(data => {
                      console.log(data);

                      if(data.price.medicament != undefined) {
                          this.getMedPrevPrices(data.price);
                          this.getRelatedDCIMedicamentsPrices(data.price.medicament.internationalMedicamentName.id, data.price.id);
                      }

                      if(data.currentStep != 'R'){
                          console.log('Procesul a fost finisat deja');
                      }

                      if(data.pricesRequest){
                          this.priceRequestId = data.pricesRequest.id;
                      }

                      if(data.price != undefined) {
                          this.PriceRegForm.get('price.value').setValue(data.price.value);
                          this.PriceRegForm.get('price.currency').setValue(data.price.currency.description);
                          this.PriceRegForm.get('price.folderNr').setValue(data.price.folderNr);
                          this.convertToNationalCurrencyPrice()
                      }

                      data.documents.forEach(doc => {
                          this.documents.push(doc);

                      });

                      this.initRefPrices(data.price.referencePrices);

                      this.medicamentType = data.price.medicament.medicamentType;
                      this.PriceRegForm.get('company.name').setValue(data.company.name);
                      this.PriceRegForm.get('company.id').setValue(data.company.id);
                      this.PriceRegForm.get('id').setValue(data.id);
                      this.PriceRegForm.get('requestNumber').setValue(data.requestNumber);
                      this.PriceRegForm.get('type').setValue(data.type);
                      this.PriceRegForm.get('requestHistories').setValue(data.requestHistories);
                      this.PriceRegForm.get('typeValue').setValue(data.type.code);
                      this.PriceRegForm.get('medicament.id').setValue(data.price.medicament.id);
                      this.PriceRegForm.get('medicament.internationalMedicamentName').setValue(data.price.medicament.internationalMedicamentName ? data.price.medicament.internationalMedicamentName.description : undefined);
                      this.PriceRegForm.get('medicament.code').setValue(data.price.medicament.code);
                      this.PriceRegForm.get('medicament.manufactureName').setValue(data.price.medicament.manufacture ? data.price.medicament.manufacture.description : undefined);
                      this.PriceRegForm.get('medicament.name').setValue(data.price.medicament.name);
                      this.PriceRegForm.get('medicament.termsOfValidity').setValue(data.price.medicament.termsOfValidity);
                      this.PriceRegForm.get('medicament.dose').setValue(data.price.medicament.dose);
                      this.PriceRegForm.get('medicament.division').setValue(data.price.medicament.division);
                      this.PriceRegForm.get('medicament.unitsOfMeasurementDesc').setValue(data.price.medicament.unitsOfMeasurement?data.price.medicament.unitsOfMeasurement.description:undefined);
                      this.PriceRegForm.get('medicament.documents').setValue(data.price.medicament.documents);
                      this.PriceRegForm.get('medicament.registrationDate').setValue(data.price.medicament.registrationDate);
                      this.PriceRegForm.get('medicament.volume').setValue(data.price.medicament.volume);
                      this.PriceRegForm.get('medicament.volumeQuantityMeasurementName').setValue(data.price.medicament.volumeQuantityMeasurement ? data.price.medicament.volumeQuantityMeasurement.description:undefined);
                      this.PriceRegForm.get('medicament.expirationDate').setValue(data.price.medicament.expirationDate);
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

      this.getPricesExpirationReasons();
    }


    getPrevMonthAVGCurrencies(){
        this.subscriptions.push(this.priceService.getPrevMonthAVGCurrencies().subscribe(data =>{
            this.avgCurrencies = data;
            this.convertToNationalCurrencyPrice();
        }));
    }


    getDocumentsTypes() {
        this.subscriptions.push(this.priceService.getDocumentTypes().subscribe(data =>{
            data.forEach(type => {
                if(this.priceModuleAvaibleDocTypes.includes(type.category)) {
                    this.requiredOutputDocs.push(type);
                }
            });
            console.log('DocTypes', this.requiredOutputDocs);
        }));
    }

    getAllPricesTypes(){
        this.subscriptions.push(
            this.priceService.getAllPriceTypes().subscribe(priceTypes => {
                    this.priceTypes = priceTypes;
                },
                error => console.log(error)
            ));
    }

    getPricesExpirationReasons(){
        this.subscriptions.push(
            this.priceService.getPriceExpirationReasons().subscribe(reasons => {
                    this.expirationReasons = reasons;
                },
                error => console.log(error)
            ));
    }

    getMedPrevPrices(price: any) {
        this.subscriptions.push(
            this.priceService.getMedPrevPrices(price.medicament.id).subscribe(prevPrices => {
                    console.log('prev prices', prevPrices)
                    for(let i = 0; i < prevPrices.length; i++) {
                        if(prevPrices[i].id == price.id) {
                            prevPrices.splice(i, 1);
                            break;
                        }
                    }
                    this.prevPrices = prevPrices;
                },
                error => console.log(error)
            ));
    }


    getRelatedDCIMedicamentsPrices(internationalNameId: string, id: number) {
        this.subscriptions.push(
            this.priceService.getRelatedMedicaments(internationalNameId).subscribe(meds => {
                    console.log('getRelatedMedicaments', meds)
                    for(let i = 0; i < meds.length; i++) {
                        if(meds[i].priceId == id) {
                            meds.splice(i, 1);
                            break;
                        }
                    }
                    this.relatedMeds = meds;
                    this.avgRelatedMeds = 0;
                    this.relatedMeds.forEach(m => this.avgRelatedMeds += m.mdlValue?m.mdlValue:0);
                    this.avgRelatedMeds /= this.relatedMeds.length;

                    //------------------|AVG(ORIGIN , DCI)|--------------------
                    let avgOriginCountry = 0, originPriceCount = 0;
                    this.refPrices.forEach(p => {
                        if(p.type.description == 'În țara de origine') {
                            avgOriginCountry += +p.xchRateRefVal;
                            originPriceCount++;
                        }
                    });
                    if(originPriceCount > 0) {
                        this.dciAndOriginAvgs.push({source: 'Media în țara de origine', avg: avgOriginCountry / originPriceCount});
                    }

                    this.dciAndOriginAvgs.push({source: 'Media DCI', avg: this.avgRelatedMeds});
                    let avg = 0;
                    this.dciAndOriginAvgs.forEach(v => avg += v.avg);
                    avg /= this.dciAndOriginAvgs.length;
                    this.dciAndOriginAvgs.push({source: 'Media', avg: avg});
                },
                error => console.log(error)
            ));
    }

    convertToNationalCurrencyPrice(){
        if(this.avgCurrencies != undefined && this.avgCurrencies.length > 0 && this.PriceRegForm.get('price.currency').value != undefined) {
            let avgCur = this.avgCurrencies.find(cur => cur.currency.description == this.PriceRegForm.get('price.currency').value);
            this.PriceRegForm.get('price.nationalPrice').setValue(avgCur?avgCur.value:undefined);
        }
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
           outDoc.number = undefined;
           outDoc.status = "Nu este atasat";

           for(let doc of this.documents){
               if (doc.docType.description == outDoc.description) {
                   outDoc.number = doc.number;
                   outDoc.status = "Atasat";
                   break;
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

            this.hasReferencePrices = this.refPrices.some(p => p.type.description == 'În țara de referintă');
            this.hasOriginCountryPrices = this.refPrices.some(p => p.type.description == 'În țara de origine');
            this.hasOtherCountriesPrices = this.refPrices.some(p => p.type.description == 'În catalogul de piață a altor țări');
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
        // if (document.docType.category == 'OA') {
        //     this.subscriptions.push(this.documentService.viewMedicamentAuthorizationOrder(document.number).subscribe(data => {
        //             let file = new Blob([data], {type: 'application/pdf'});
        //             var fileURL = URL.createObjectURL(file);
        //             window.open(fileURL);
        //         }, error => {
        //             console.log('error ', error);
        //         }
        //         )
        //     );
        // } else {
        //     this.subscriptions.push(this.documentService.viewMedicamentAuthorizationCertificate(document.number).subscribe(data => {
        //             let file = new Blob([data], {type: 'application/pdf'});
        //             var fileURL = URL.createObjectURL(file);
        //             window.open(fileURL);
        //         }, error => {
        //             console.log('error ', error);
        //         }
        //         )
        //     );
        // }
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

        let priceModel : any = {};//this.PriceRegForm.value;
        priceModel.id = this.PriceRegForm.get('id').value;
        priceModel.requestNumber = this.PriceRegForm.get('requestNumber').value;
        priceModel.initiator = this.PriceRegForm.get('initiator').value;
        priceModel.startDate = this.PriceRegForm.get('startDate').value;
        priceModel.company = this.PriceRegForm.get('company').value;
        priceModel.currentStep = this.PriceRegForm.get('currentStep').value;
        priceModel.type = this.PriceRegForm.get('type').value;
        priceModel.endDate = new Date();
        priceModel.currentStep = 'E';
        priceModel.assignedUser = this.priceService.getUsername();
        priceModel.requestHistories = this.PriceRegForm.get('requestHistories').value;

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
                    p.type = acceptType;
                    p.expirationDate = expDate.value;
                    p.expirationReason = this.expirationReasons[0];
                }
            }
        }

        this.loadingService.hide();

        priceModel.pricesRequest = {
            id: this.priceRequestId,
            medicament: {id: this.PriceRegForm.get('medicament')['controls'].id.value},
            documents: this.documents,
            prices: this.proposedPrices,
            referencePrices: this.refPrices,
        }

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
