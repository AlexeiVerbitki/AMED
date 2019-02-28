import {Component, OnDestroy, OnInit, } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Document} from '../../../models/document';
import {ActivatedRoute, Router} from '@angular/router';
import {Price} from '../../../models/price';
import {Country} from '../../../models/country';
import {LoaderService} from '../../../shared/service/loader.service';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';
import {MatDialog} from '@angular/material';
import {PriceService} from '../../../shared/service/prices.service';
import {PriceEditModalComponent} from '../modal/price-edit-modal/price-edit-modal.component';
import {Decision, PriceReferenceType} from '../price-constants';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-price-evaluate-med', templateUrl: './price-evaluate-med.component.html', styleUrls: ['./price-evaluate-med.component.css'], providers: [PriceService]
})
export class PriceEvaluateMedComponent implements OnInit, OnDestroy {

    formSubmitted: boolean;
    documents: Document [] = [];
    outputDocuments: any[] = [];
    PriceRefType = PriceReferenceType;
    PriceRegForm: FormGroup;
    selectedPrice: any = {};
    refPrices: any[] = [];
    prevPrices: any[] = [];
    prevYearsImportPrices: any[] = [];
    relatedMeds: any[] = [];
    avgRelatedMeds = 0;
    minRefPrices: any[] = [];
    dciAndOriginAvgs: any[] = [];
    minOtherCountriesCatPrices: any[] = [];
    priceTypes: any[];
    needSelectPrice = false;
    requiredOutputDocs: any[] = [];
    medicamentOriginalType = false;
    priceModuleAvaibleDocTypes: any[] = ['OP', 'A1', 'A2', 'DP', 'CP', 'RF', 'RC', 'FE'];
    decisions: any[] = [{description: 'Acceptat', id: 1}, {description: 'Respins', id: 2}];
    medicaments: any[] = [];
    avgCurrencies: any[] = [];
    initialData: any = {};
    registrationRequestMandatedContacts: any[] = [];
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private priceService: PriceService, public dialogConfirmation: MatDialog,
                private navbarTitleService: NavbarTitleService, private router: Router, public dialog: MatDialog, private loadingService: LoaderService,
                private errorHandlerService: SuccessOrErrorHandlerService) {

        this.PriceRegForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'initiator': [null],
            'assignedUser': [null],
            'requestStatus': [null],
            'startDate': {disabled: true, value: new Date()},
            'dataToSaveInStartDateRequestHistory': [''],
            'currentStep': ['E'],
            'price': fb.group({
                id: [null],
                value: [null],
                currency: [null],
                totalQuantity: [null],
                folderNr: [null],
                nationalPrice: [null],
                type: [null],
                nmPriceId: [null]
            }),
            'evaluation': fb.group({
                'expirationDate': [{value: null, disabled: true}, Validators.required],
                'selectedPrice': [null, Validators.required],
                'selectedReason': [null, Validators.required],
                'decision': [null, Validators.required],
            }),
            'medicament': fb.group({
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
                'manufactureCountry': [null],
                'commercialName': [null],
                'documents': [],
                'status': ['P'],
                'group': fb.group({
                    'code': ['', Validators.required]
                })
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

    addNewReferencePrice(priceType: PriceReferenceType) {
        const type = this.priceTypes.find(p => p.id == priceType);
        const newPrice: any = {
            priceId: this.PriceRegForm.get('price.id').value, type: type
        };

        this.priceEditModalOpen(newPrice, -1);
    }

    priceEditModalOpen(price: any, index: number): void {
        const dialogRef = this.dialog.open(PriceEditModalComponent, {
            data: price, width: '650px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);

            if (result) {
                if (index == -1) {
                    price.country = result.country;
                    price.value = result.price;
                    price.currency = result.currency;
                    price.totalQuantity = result.totalQuantity;
                    price.division = result.division;
                    this.refPrices.push(price);
                    index = this.refPrices.length - 1;
                } else {
                    this.refPrices[index].country = result.country;
                    this.refPrices[index].value = result.price;
                    this.refPrices[index].currency = result.currency;
                    this.refPrices[index].totalQuantity = result.totalQuantity;
                    this.refPrices[index].division = result.division;
                }
                this.calculateCurrencyConversion(this.refPrices[index]);
                this.processAveragePrices();
            }
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Evaluarea cererii de inregistrare a pretului la medicamente');

        this.getDocumentsTypes();
        this.getAllPricesTypes();

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.priceService.getPricesRequest(params['id']).subscribe(data => {
                console.log('getPricesRequest', data);
                this.initialData = Object.assign({}, data);

                if (data.registrationRequestMandatedContacts) {
                    this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
                }

                if (data.price.medicament != undefined) {
                    if (data.price.currency.shortDescription == 'MDL') {
                        data.price.mdlValue = data.price.value;
                    } else {
                        this.avgCurrencies.forEach(cur => {
                            if (data.price.currency.id == cur.currency.id) {
                                data.price.mdlValue = cur.value * data.price.value;
                                return;
                            }
                        });
                    }
                    this.getMedPrevPrices(data.price);
                    if (data.price.medicament.internationalMedicamentName) {
                        this.getRelatedDCIMedicamentsPrices(data.price.medicament.internationalMedicamentName.id, data.price.id);
                    }
                    data.price.medicament.price = {mdlValue: data.price.mdlValue, totalQuantity: data.price.totalQuantity, value: data.price.value, currency: data.price.currency};
                    data.price.medicament.target = 'Medicamentul cu prețul solicitat';
                    data.price.medicament.rowType = 1;
                    this.medicaments.push(data.price.medicament);


                    if (!data.price.medicament.originale && data.price.medicament.internationalMedicamentName) {
                        this.subscriptions.push(this.priceService.getOriginalMedsByInternationalName(data.price.medicament.internationalMedicamentName.id).subscribe(
                            m => {
                                console.log('getOriginalMedsByInternationalName', m);
                                m.forEach(m => {
                                    const priceModel = m.medicament;
                                    priceModel.price = {mdlValue: m.priceMdl, value: m.price, currency: m.currency, totalQuantity: '-'};
                                    priceModel.target = 'Medicamentul Original de bază';
                                    priceModel.rowType = 2;
                                    this.medicaments.push(priceModel);
                                });
                            }));
                    }

                    this.subscriptions.push(this.priceService.getPrevYearsPrices(data.price.medicament.id).subscribe(meds => {
                        console.log('getPrevYearsPrices', meds);
                        this.prevYearsImportPrices = meds;
                    }));
                }

                if (data.price != undefined) {
                    this.PriceRegForm.get('price.id').setValue(data.price.id);
                    this.PriceRegForm.get('price.value').setValue(data.price.value);
                    this.PriceRegForm.get('price.totalQuantity').setValue(data.price.totalQuantity);
                    this.PriceRegForm.get('price.nmPriceId').setValue(data.price.nmPrice ? data.price.nmPrice.id : undefined);
                    this.PriceRegForm.get('price.currency').setValue(data.price.currency);
                    this.PriceRegForm.get('price.folderNr').setValue(data.price.folderNr);
                    this.PriceRegForm.get('price.type').setValue(data.price.type);
                    const acceptType = this.priceTypes.find(type => type.description == 'Acceptat');
                    if (data.price.type.id == acceptType.id) {
                        this.PriceRegForm.get('evaluation.decision').setValue(this.decisions[0]);
                    }
                    this.convertToNationalCurrencyPrice();
                }

                this.documents = data.documents;

                switch (data.currentStep) {
                    case 'R':
                        this.PriceRegForm.get('requestStatus').setValue('Înregistrare');
                        break;
                    case 'E':
                        this.PriceRegForm.get('requestStatus').setValue('Evaluare');
                        break;
                    case 'C':
                        this.PriceRegForm.get('requestStatus').setValue('Întrerupt');
                        break;
                    case 'AF':
                        this.PriceRegForm.get('requestStatus').setValue('Acceptat');
                        break;
                    case 'F':
                        this.PriceRegForm.get('requestStatus').setValue('Finisat');
                        break;
                }

                this.processReferencePrices(data.price.referencePrices);

                this.medicamentOriginalType = data.price.medicament.originale;
                this.PriceRegForm.get('company.name').setValue(data.company.name);
                this.PriceRegForm.get('company.id').setValue(data.company.id);
                this.PriceRegForm.get('id').setValue(data.id);
                this.PriceRegForm.get('requestNumber').setValue(data.requestNumber);
                this.PriceRegForm.get('initiator').setValue(data.initiator);
                this.PriceRegForm.get('type').setValue(data.type);
                this.PriceRegForm.get('requestHistories').setValue(data.requestHistories);
                this.PriceRegForm.get('typeValue').setValue(data.type.code);
                this.PriceRegForm.get('medicament.id').setValue(data.price.medicament.id);
                this.PriceRegForm.get('medicament.internationalMedicamentName').setValue(data.price.medicament.internationalMedicamentName ? data.price.medicament.internationalMedicamentName.description : undefined);
                this.PriceRegForm.get('medicament.code').setValue(data.price.medicament.code);
                this.PriceRegForm.get('medicament.manufactureName').setValue(data.price.medicament.manufactures[0] ? data.price.medicament.manufactures[0].manufacture.description : undefined);
                this.PriceRegForm.get('medicament.manufactureCountry').setValue(data.price.medicament.manufactures[0] ? data.price.medicament.manufactures[0].manufacture.country.description : undefined);
                this.PriceRegForm.get('medicament.name').setValue(data.price.medicament.name);
                this.PriceRegForm.get('medicament.termsOfValidity').setValue(data.price.medicament.termsOfValidity);
                this.PriceRegForm.get('medicament.dose').setValue(data.price.medicament.dose);
                this.PriceRegForm.get('medicament.division').setValue(data.price.medicament.division);
                this.PriceRegForm.get('medicament.unitsOfMeasurementDesc').setValue(data.price.medicament.unitsOfMeasurement ? data.price.medicament.unitsOfMeasurement.description : undefined);
                this.PriceRegForm.get('medicament.documents').setValue(data.price.medicament.documents);
                this.PriceRegForm.get('medicament.registrationDate').setValue(data.price.medicament.registrationDate);
                this.PriceRegForm.get('medicament.volume').setValue(data.price.medicament.volume);
                this.PriceRegForm.get('medicament.volumeQuantityMeasurementName').setValue(data.price.medicament.volumeQuantityMeasurement ? data.price.medicament.volumeQuantityMeasurement.description : undefined);
                this.PriceRegForm.get('medicament.expirationDate').setValue(data.price.medicament.expirationDate);
                this.PriceRegForm.get('medicament.commercialName').setValue(data.price.medicament.commercialName);
                this.PriceRegForm.get('startDate').setValue(new Date(data.startDate));
                this.initOutputDocs(data.outputDocuments);

                const expDate: Date = new Date();
                expDate.setFullYear(expDate.getFullYear() + 1);
                this.PriceRegForm.get('evaluation.expirationDate').setValue(expDate);

                if (data.requestHistories != undefined && data.requestHistories.length > 0) {
                    const reqHist = data.requestHistories.reduce((p, n) => p.id < n.id ? p : n);
                    this.PriceRegForm.get('dataToSaveInStartDateRequestHistory').setValue(reqHist.endDate);
                }
            }, error1 => console.log('getPricesRequest', error1)));
        }));
    }

    updateCurrentMedPrice() {
        if (this.avgCurrencies == undefined || this.avgCurrencies.length == 0) {
            return;
        }

        this.medicaments.forEach(m => {
            if (m.rowType == 1) {
                const avgCur = this.avgCurrencies.find(cur => cur.currency.description == m.price.currency.description);
                const nationalCur = m.price.value * (avgCur ? avgCur.value : 1);
                m.price.mdlValue = nationalCur;
            }
        });
    }

    getDocumentsTypes() {
        this.subscriptions.push(this.priceService.getDocumentTypes().subscribe(data => {
            data.forEach(type => {
                if (this.priceModuleAvaibleDocTypes.includes(type.category)) {
                    this.requiredOutputDocs.push(type);
                }
            });
            console.log('DocTypes', this.requiredOutputDocs);
        }));
    }

    getAllPricesTypes() {
        this.subscriptions.push(this.priceService.getPriceTypes('3').subscribe(priceTypes => {
            this.priceTypes = priceTypes;
        }, error => console.log(error)));
    }

    getMedPrevPrices(price: any) {
        this.subscriptions.push(this.priceService.getMedPrevPrices(price.medicament.id).subscribe(prevPrices => {
            console.log('prev prices', prevPrices);
            this.prevPrices = prevPrices;
        }, error => console.log(error)));
    }

    calculateAvgRelatedMeds() {
        this.avgRelatedMeds = 0;
        this.relatedMeds.forEach(m => this.avgRelatedMeds += m.mdlValue ? m.mdlValue : 0);
        if (this.relatedMeds.length > 0) {
            this.avgRelatedMeds /= this.relatedMeds.length;
        }
    }

    getRelatedDCIMedicamentsPrices(internationalNameId: string, id: number) {
        this.subscriptions.push(this.priceService.getRelatedMedicaments(internationalNameId).subscribe(meds => {
            console.log('getRelatedMedicaments', meds);
            for (let i = 0; i < meds.length; i++) {
                if (meds[i].priceId == id) {
                    meds.splice(i, 1);
                    break;
                }
            }
            this.relatedMeds = meds;
            this.calculateAvgRelatedMeds();
            //------------------|AVG(ORIGIN , DCI)|--------------------
            this.calculateAVGOriginAndDci();
        }, error => console.log(error)));
    }

    calculateAVGOriginAndDci() {
        //------------------|AVG(ORIGIN , DCI)|--------------------
        this.dciAndOriginAvgs = [];
        let avgOriginCountry = 0, originPriceCount = 0;
        this.refPrices.forEach(p => {
            if (p.type.description == 'În țara de origine') {
                avgOriginCountry += +(<any>p).xchRateRefVal;
                originPriceCount++;
            }
        });
        if (originPriceCount > 0) {
            this.dciAndOriginAvgs.push({source: 'Media în țara de origine', avg: avgOriginCountry / originPriceCount});
        }

        if (this.avgRelatedMeds) {
            this.dciAndOriginAvgs.push({source: 'Media DCI', avg: this.avgRelatedMeds});
        }

        let avg = 0;
        this.dciAndOriginAvgs.forEach(v => avg += v.avg);
        avg /= this.dciAndOriginAvgs.length;
        this.dciAndOriginAvgs.push({source: 'Media', avg: avg});
    }

    convertToNationalCurrencyPrice() {
        if (this.avgCurrencies != undefined && this.avgCurrencies.length > 0 && this.PriceRegForm.get('price.currency').value != undefined) {
            const thisPriceCurrency = this.PriceRegForm.get('price.currency').value;
            const avgCur = this.avgCurrencies.find(cur => cur.currency.description == thisPriceCurrency.description);
            const nationalCur = this.PriceRegForm.get('price.value').value * (avgCur ? avgCur.value : 1);
            this.PriceRegForm.get('price.nationalPrice').setValue(nationalCur);
        }
    }

    onDecisionChange($event) {
        console.log($event);
        if ($event.id == Decision.Accept) { //accepta
            this.needSelectPrice = true;
        } else if ($event.id == Decision.Reject) {
            this.needSelectPrice = false;
        }
    }

    currentMedPriceChanged(i: number, newMdlPrice: string) {
        this.medicaments[i].price.mdlValue = +newMdlPrice;

        const avgCur = this.avgCurrencies.find(cur => cur.currency.code == this.medicaments[i].price.currency.code);
        this.medicaments[i].price.value = (+newMdlPrice / avgCur.value);
    }

    currencyChanged($event) {
        this.avgCurrencies = $event;
        this.convertToNationalCurrencyPrice();
        this.processReferencePrices(this.refPrices);
        this.updateCurrentMedPrice();
    }

    documentAdded($event) {

        this.outputDocuments.forEach(outDoc => {
            outDoc.number = undefined;
            outDoc.status = 'Nu este atasat';

            for (const doc of this.documents) {
                if (doc.docType.category == outDoc.docType.category) {
                    outDoc.number = doc.number;
                    outDoc.status = 'Atasat';
                    break;
                }
            }

        });
    }


    initOutputDocs(outDocs: any) {

        if (outDocs) {
            for (let i = 0; i < outDocs.length; i++) {
                this.outputDocuments.push({
                    docType: outDocs[i].docType, number: outDocs[i].number, status: outDocs[i].name ? 'Atasat' : 'Nu este atasat'
                });
            }
        }
    }

    hasUnloadedDocs() {
        return this.outputDocuments.some(value => value.status == 'Nu este atasat');
    }


    processReferencePrices(referencePrices?: Price[]) {
        if (referencePrices == undefined) {
            return;
        }

        this.refPrices = referencePrices;
        if (this.refPrices != undefined && this.refPrices.length > 0) {
            this.refPrices.forEach(refPrice => this.calculateCurrencyConversion(refPrice));
            this.processAveragePrices();
        }
    }

    processAveragePrices() {

        this.initAverageMinPrice(this.minRefPrices, PriceReferenceType.ReferenceCountry);
        this.initAverageMinPrice(this.minOtherCountriesCatPrices, PriceReferenceType.OtherCountriesCatalog);

        // this.hasReferencePrices = this.refPrices.some(p => p.type.description == 'În țara de referintă');
        // this.hasOriginCountryPrices = this.refPrices.some(p => p.type.description == 'În țara de origine');
        // this.hasOtherCountriesPrices = this.refPrices.some(p => p.type.description == 'În catalogul de piață a altor țări');
    }

    initAverageMinPrice(array: any[], type: PriceReferenceType) {
        array.splice(0, array.length);
        this.refPrices.sort((a, b) => {
            if (a['xchRateRefVal'] < b['xchRateRefVal']) {
                return -1;
            } else if (a['xchRateRefVal'] > b['xchRateRefVal']) {
                return 1;
            }
            return 0;
        });

        array.push(...this.refPrices.filter(value => value.type.id == type).slice(0, 3));
        const avgMinPrice: any = {};
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

        avgMinPrice.averageType = true;

        array.push(avgMinPrice);
    }

    calculateCurrencyConversion(refPrice: Price) {
        for (const avgCur of this.avgCurrencies) {
            if (avgCur.currency.id == refPrice.currency.id) {
                refPrice['xchRateRef'] = avgCur.value;
                refPrice['xchRateMDLInitVal'] = avgCur.value * +refPrice.value;
                refPrice['xchRateRefVal'] = (refPrice['xchRateMDLInitVal'] / refPrice['totalQuantity']) * (+this.PriceRegForm.get('price.totalQuantity').value);
                break;
            }
        }

        if (!refPrice.hasOwnProperty('xchRateRef')) { // this is fucking Moldo Leu
            refPrice['xchRateRef'] = 1;
            refPrice['xchRateRefVal'] = refPrice.value;
        }

        for (const avgCur of this.avgCurrencies) {

            if (avgCur.currency.shortDescription == 'EUR') {
                refPrice['xchRateEur'] = avgCur.value;
                refPrice['xchRateEurVal'] = refPrice['xchRateRefVal'] / avgCur.value;

            } else if (avgCur.currency.shortDescription == 'USD') {
                refPrice['xchRateUsd'] = avgCur.value;
                refPrice['xchRateUsdVal'] = refPrice['xchRateRefVal'] / avgCur.value;
            }
        }
    }


    deleteRelatedMed(index: number) {
        this.relatedMeds.splice(index, 1);
        this.calculateAvgRelatedMeds();
        this.calculateAVGOriginAndDci();
    }

    deleteRelatedOriginalMed(index: number) {
        this.medicaments.splice(index, 1);
    }


    viewDoc(document: any) {
        if (document.docType.category != 'FE') { //  Fișa de evaluare a dosarului pentru aprobarea prețului de producător
            return;
        }
        this.loadingService.show();

        this.subscriptions.push(this.priceService.viewEvaluationSheet(this.createEvaluationSheetDTO()).subscribe(data => {
            const file = new Blob([data], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.loadingService.hide();
        }, error => {
            this.loadingService.hide();
        }));
    }

    createEvaluationSheetDTO(): any {
        const averageRateEuro = this.avgCurrencies.find(c => c.currency.shortDescription == 'EUR');
        const averageRateUsd = this.avgCurrencies.find(c => c.currency.shortDescription == 'USD');
        const currMed = this.medicaments.find(m => m.rowType == 1);
        const originalMeds: any[] = [];
        this.medicaments.forEach(m => {
            if (m.rowType == 2) {
                originalMeds.push({
                    medicamentCode: m.code, medicamentName: m.name, medicamentForm: m.pharmaceuticalForm.description, doseConcentration: m.dose, division: m.division,
                    internationalMedicamentName: m.internationalMedicamentName.description, priceMdl: m.price.mdlValue, priceCurrency: m.price.value,
                    currency: m.price.currency.shortDescription,
                });
            }
        });

        const medicamentReferenceCountryPriceList: any[] = [];
        this.refPrices.forEach(p => {
            if (p.type.id == this.PriceRefType.ReferenceCountry) {
                medicamentReferenceCountryPriceList.push({
                    referenceCountry: p.country.description, referenceCountryCurrency: p.currency.shortDescription, division: p.division, priceInCurrency: p.value,
                    exchangeRateReferenceCurrencyMDL: p.xchRateRef, priceMDL: p.xchRateRefVal, exchangeRateEURO_MDL: p.xchRateEur, priceEURO: p.xchRateEurVal,
                    exchangeRateUSD_MDL: p.xchRateUsd, priceUSD: p.xchRateUsdVal
                });
            }
        });

        const previousPriceRegistrations: any[] = [];
        this.prevPrices.forEach(p => {
            previousPriceRegistrations.push({
                dateOfApprovalOrder: p.orderApprovDate, dateOfRevisionPrice: p.revisionDate, priceMDL: p.priceMdl, priceInCurrency: p.price,
                currency: p.currency.shortDescription
            });
        });

        const originCountryMedicamentPriceList: any[] = [];
        this.refPrices.forEach(p => {
            if (p.type.id == this.PriceRefType.OriginCountry) {
                originCountryMedicamentPriceList.push({
                    originCountry: p.country.description, currencyOfOriginCountry: p.currency.shortDescription, division: p.division, price: p.value,
                    exchangeRateOriginCurrencyMDL: p.xchRateRef, priceMDL: p.xchRateRefVal, exchangeRateEURO_MDL: p.xchRateEur, priceEURO: p.xchRateEurVal,
                    exchangeRateUSD_MDL: p.xchRateUsd, priceUSD: p.xchRateUsdVal
                });
            }
        });

        const minimalPricesAverages: any[] = [];
        this.refPrices.forEach(p => {
            if (p.type.id == this.PriceRefType.OtherCountriesCatalog) {
                minimalPricesAverages.push({
                    country: p.country.description, countryCurrency: p.currency.shortDescription, division: p.division, currencyPrice: p.value,
                    exchangeRateCurrencyMDL: p.xchRateRef, priceMDL: p.xchRateRefVal, exchangeRateEURO_MDL: p.xchRateEur, priceEURO: p.xchRateEurVal,
                    exchangeRateUSD_MDL: p.xchRateUsd, priceUSD: p.xchRateUsdVal
                });
            }
        });

        const similarRegisteredMedicaments: any[] = [];
        this.relatedMeds.forEach(p => {
            similarRegisteredMedicaments.push({
                medicamentInfo: {
                    medicineCode: p.code, commercialName: p.name, pharmaceuticalForm: p.pharmaceuticalForm, dose: p.dose, division: p.division
                }, country: p.country, manufacturer: p.manufacture, internationalName: p.internationalName, priceMDL: p.mdlValue, priceInCurrency: p.price,
                currency: p.currency
            });
        });

        const sourceAveragePrices = new Map<string, number>();
        this.dciAndOriginAvgs.forEach(p => {
            sourceAveragePrices[p.source.toString()] = p.avg;
        });

        const previousYearsPrices = new Map<string, number>();
        //todo: previousYearsPrices

        const evaluationSheetDTO: any = {
            cimOwner: this.PriceRegForm.get('company.name').value, countryOwner: 'Republica Moldova',
            manufacturer: this.PriceRegForm.get('medicament.manufactureName').value, countryManufacturer: this.PriceRegForm.get('medicament.manufactureCountry').value,
            applicationDate: this.PriceRegForm.get('startDate').value, medicamentClaimedPriceList: [{
                id: currMed.id, medicamentCode: currMed.code, medicamentName: currMed.name, medicamentForm: currMed.pharmaceuticalForm.description,
                doseConcentration: currMed.dose, division: currMed.division, internationalMedicamentName: currMed.internationalMedicamentName.description,
                priceMdl: currMed.price.mdlValue, priceCurrency: currMed.price.value, currency: currMed.price.currency.shortDescription,
            }], min1Mdl: this.minRefPrices[0] ? this.minRefPrices[0].xchRateRefVal : 0, min1Eur: this.minRefPrices[0] ? this.minRefPrices[0].xchRateEurVal : 0,

            medicamentStatus: this.medicamentOriginalType ? 'Original' : 'Generic', medicamentOriginalPriceList: originalMeds,
            averageRateEuro: averageRateEuro ? averageRateEuro.value : undefined, averageRateUsd: averageRateUsd ? averageRateUsd.value : undefined,
            medicamentReferenceCountryPriceList: medicamentReferenceCountryPriceList, previousPriceRegistrations: previousPriceRegistrations,
            originCountryMedicamentPriceList: originCountryMedicamentPriceList, minimalPricesAverages: minimalPricesAverages,
            similarRegisteredMedicaments: similarRegisteredMedicaments, sourceAveragePrices: sourceAveragePrices, previousYearsPrices: previousYearsPrices,
            expertName: this.priceService.getUsername(), creationFileDate: new Date(),
        };

        const minimals = this.minRefPrices.filter(p => !p.averageType);

        evaluationSheetDTO.min1Usd = minimals[0] ? minimals[0].xchRateUsdVal : 0;
        evaluationSheetDTO.min2Mdl = minimals[1] ? minimals[1].xchRateRefVal : 0;
        evaluationSheetDTO.min2Eur = minimals[1] ? minimals[1].xchRateEurVal : 0;
        evaluationSheetDTO.min2Usd = minimals[1] ? minimals[1].xchRateUsdVal : 0;
        evaluationSheetDTO.min3Mdl = minimals[2] ? minimals[2].xchRateRefVal : 0;
        evaluationSheetDTO.min3Eur = minimals[2] ? minimals[2].xchRateEurVal : 0;
        evaluationSheetDTO.min3Usd = minimals[2] ? minimals[2].xchRateUsdVal : 0;

        const medPrice = this.minRefPrices.find(t => t.averageType);
        evaluationSheetDTO.medMdl = medPrice ? medPrice.xchRateRefVal : 0;
        evaluationSheetDTO.medEur = medPrice ? medPrice.xchRateEurVal : 0;
        evaluationSheetDTO.medUsd = medPrice ? medPrice.xchRateUsdVal : 0;

        console.log('evaluationSheetDTO', evaluationSheetDTO);

        return evaluationSheetDTO;
    }

    save() {

        this.loadingService.show();
        this.formSubmitted = true;

        const selectedPrice = this.PriceRegForm.get('evaluation')['controls'].selectedPrice;
        const expDate = this.PriceRegForm.get('evaluation')['controls'].expirationDate;
        const decision = this.PriceRegForm.get('evaluation')['controls'].decision;

        const uploadedEvaluationFile = this.documents.find(d => d.docType.category == 'FE');

        let requestStatus = '';
        if (decision.valid && decision.value.description == 'Acceptat') {
            requestStatus = 'AF';
        } else if (decision.valid && decision.value.description == 'Respins') {
            requestStatus = 'C';
        } else {
            requestStatus = 'E';
        }

        const priceAcceptCondition: boolean = ((requestStatus == 'AF' || requestStatus == 'C') && uploadedEvaluationFile != undefined && !this.hasUnloadedDocs());
        const canFinishEvaluate: boolean = this.medicaments[0].price.mdlValue > 0 && (decision.invalid || priceAcceptCondition);


        if (!canFinishEvaluate) {
            this.loadingService.hide();
            return;
        }

        this.formSubmitted = false;
        const priceModel: any = {};
        priceModel.id = this.PriceRegForm.get('id').value;
        priceModel.requestNumber = this.PriceRegForm.get('requestNumber').value;
        priceModel.initiator = this.PriceRegForm.get('initiator').value;
        priceModel.startDate = this.PriceRegForm.get('startDate').value;
        priceModel.company = this.PriceRegForm.get('company').value;
        priceModel.type = this.PriceRegForm.get('type').value;
        priceModel.endDate = new Date();
        priceModel.currentStep = requestStatus;
        priceModel.assignedUser = this.priceService.getUsername();
        priceModel.requestHistories = this.PriceRegForm.get('requestHistories').value;
        priceModel.documents = this.documents;
        priceModel.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        priceModel.requestHistories.push({
            startDate: this.PriceRegForm.get('dataToSaveInStartDateRequestHistory').value, endDate: new Date(), username: this.priceService.getUsername(),
            step: priceModel.currentStep
        });

        const price = this.PriceRegForm.get('price').value;
        let acceptType: any, aprovDate = price.orderApprovDate, revisionDate = price.revisionDate;

        if (priceAcceptCondition) {
            aprovDate = new Date();
            revisionDate = new Date();
            acceptType = this.priceTypes.filter(value => value.description == 'Acceptat')[0];
        } else {
            acceptType = this.PriceRegForm.get('price.type').value;
        }

        // let orderNr = this.documents.find(d => d.docType.category == 'OP');

        priceModel.price = {
            id: price.id, value: this.medicaments[0].price.value, type: acceptType, currency: price.currency, mdlValue: this.medicaments[0].price.mdlValue,
            referencePrices: this.refPrices, medicament: {id: this.PriceRegForm.get('medicament.id').value},
        };


        this.subscriptions.push(this.priceService.savePrice(priceModel).subscribe(data => {
            this.initialData = priceModel;

            if (priceAcceptCondition && this.medicamentOriginalType) {
                this.router.navigate(['dashboard/module/price/revaluation-generics/' + data.body.price.id]);
            }
            this.errorHandlerService.showSuccess('Datele au fost salvate');

            this.loadingService.hide();
        }, error1 => {
            console.log(error1);
            this.loadingService.hide();
        }));
        return false;
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(value => value.unsubscribe());
    }

    sendInfoLetter(afterCallback?: () => void) {

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            height: '800px',
            data: {
                hideSave: true,
                requestNumber: this.PriceRegForm.get('requestNumber').value,
                requestId: this.PriceRegForm.get('id').value,
                modalType: 'EMPTY_NOTIFICATION',
                startDate: this.PriceRegForm.get('data').value,
                companyName: this.PriceRegForm.get('company').value.name,
                address: this.PriceRegForm.get('company').value.legalAddress,
                registrationRequestMandatedContact: this.registrationRequestMandatedContacts[0],
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                console.log('RequestAdditionalDataDialogComponent', result);
            }
        });

    }

}
