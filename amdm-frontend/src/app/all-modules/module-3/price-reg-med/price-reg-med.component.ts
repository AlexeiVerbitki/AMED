import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Document} from '../../../models/document';
import {MatDialog, MatTabGroup} from '@angular/material';
import {saveAs} from 'file-saver';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../../../shared/service/loader.service';
import {PriceService} from '../../../shared/service/prices.service';
import {Country} from '../../../models/country';
import {Currency} from '../../../models/currency';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from "../../../shared/service/success-or-error-handler.service";

@Component({
    selector: 'app-price-reg-med',
    templateUrl: './price-reg-med.component.html',
    styleUrls: ['./price-reg-med.component.css'],
    providers: [PriceService]
})
export class PriceRegMedComponent implements OnInit, OnDestroy {

    public folderNumber: number;
    commonDocuments: Document[] = [];
    private subscriptions: Subscription[] = [];
    countries: Country[] = [];
    currencies: Currency[] = [];
    priceTypes: any[];

    requests: any[] = [{documents: this.commonDocuments, price: {referencePrices: []}}];
    rForm: FormGroup;

    formSubmitted: boolean;

    color = 'green';

    @ViewChild('tabGroup') private tabGroup: MatTabGroup;
    startRecDate: Date = new Date();


    tabs = ['Medicamentul 1'];
    selected = new FormControl(0);

    lastIndex: number = 0;

    /*mandatoryDocuments: any[] = [{
        description: 'Cerere',
        number: undefined,
        status: "Nu este atasat"
    }, {
        description: 'Declaraţie pe propria răspundere (Anexa 2)',
        number: undefined,
        status: "Nu este atasat"
    }, {
        description: 'Comparația prețului propus cu prețul de producător din țările de referință',
        number: undefined,
        status: "Nu este atasat"
    }, {
        description: 'Copia catalogului de preţuri din ţările de referinţă/origine/etc',
        number: undefined,
        status: "Nu este atasat"
    }, {
        description: 'Procură ce confirmă dreptul de înregistrare a preţului de producător',
        number: undefined,
        status: "Nu este atasat"
    }];*/

    registrationRequestId: string;
    maxDate = new Date();
    sourceRegistrationRequest: any;

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private priceService: PriceService,
                private router: Router,
                private navbarTitleService: NavbarTitleService,
                private route: ActivatedRoute,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private resolver: ComponentFactoryResolver,
                private loadingService: LoaderService) {

        this.subscriptions.push(
            this.route.params.subscribe(params => {
                if (params['id']) {
                    this.registrationRequestId = params.id;
                }
            }));

        this.rForm = fb.group({
            'reqData': {disabled: true, value: new Date()},
            'todayData': {disabled: true, value: new Date()},
            'requestNumber': {disabled: true, value: null},
            'folderNumber': {disabled: true, value: null},
            'startDate': {disabled: true, value: new Date()},
            'currentStep': ['R'],
            'contactId': [null],
            'mandatedFirstname': {disabled: true, value: null},
            'mandatedLastname': {disabled: true, value: null},
            'phoneNumber': {disabled: true, value: null},
            'email': {disabled: true, value: null},
            'idnp': {disabled: true, value: null},
            'requestMandateNr': {disabled: true, value: null},
            'requestMandateDate': {disabled: true, value: new Date()},
            'company': fb.group({
                'name': {disabled: true, value: null},
                'id': [null]
            }),
            'initiator': [''],
            'assignedUser': [''],
            'type':
                fb.group({
                    'code': ['PMED']
                }),
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrarea prețului medicamentelor');

        //this.loadDocTypes();
        this.getCountries();
        this.getCurrencies();
        this.getPriceTypes();

        if (this.registrationRequestId != undefined) {
            this.subscriptions.push(
                this.priceService.getPricesRequest(this.registrationRequestId).subscribe(r => {
                    r.valid = true;
                    r.medicaments = [];
                    console.log('request', r);
                    this.rForm.get('reqData').setValue(new Date(r.startDate));
                    this.rForm.get('requestNumber').setValue(r.requestNumber);
                    this.requests[0].requestNumber = this.rForm.get('requestNumber').value + '/' + (++this.lastIndex),
                    this.rForm.get('folderNumber').setValue(r.dossierNr);
                    this.rForm.get('startDate').setValue(r.startDate);
                    this.rForm.get('initiator').setValue(r.initiator);
                    this.rForm.get('company.name').setValue(r.company.name);
                    this.rForm.get('company.id').setValue(r.company.id);
                    if (r.registrationRequestMandatedContacts && r.registrationRequestMandatedContacts[0]) {
                        this.rForm.get('contactId').setValue(r.registrationRequestMandatedContacts[0].id);
                        this.rForm.get('mandatedFirstname').setValue(r.registrationRequestMandatedContacts[0].mandatedFirstname);
                        this.rForm.get('mandatedLastname').setValue(r.registrationRequestMandatedContacts[0].mandatedLastname);
                        this.rForm.get('phoneNumber').setValue(r.registrationRequestMandatedContacts[0].phoneNumber);
                        this.rForm.get('email').setValue(r.registrationRequestMandatedContacts[0].email);
                        this.rForm.get('idnp').setValue(r.registrationRequestMandatedContacts[0].idnp);
                        this.rForm.get('requestMandateNr').setValue(r.registrationRequestMandatedContacts[0].requestMandateNr);
                        this.rForm.get('requestMandateDate').setValue(r.registrationRequestMandatedContacts[0].requestMandateDate);
                    }
                    this.commonDocuments = r.documents;

                    this.sourceRegistrationRequest = r;

                    this.requests.forEach(r => {
                        r.documents = this.commonDocuments,
                            r.price.folderNr = this.rForm.get('folderNumber').value;
                        r.price.type = {id: 1};
                    });

                    this.commonDocuments.forEach(d => {
                        d.id = null;
                        d.registrationRequestId = null;
                    });
                }, e => console.log(e), () => {}));
        } else {
            this.subscriptions.push(
                this.priceService.generateDocNumber().subscribe(generatedNumber => {
                        this.rForm.get('folderNumber').setValue(generatedNumber[0]);
                    },
                    error => console.log(error))
            );
        }
    }

    getPriceTypes() {
        this.subscriptions.push(
            this.priceService.getPriceTypes('2').subscribe(priceTypes => {
                    this.priceTypes = priceTypes;

                    let i = 0;
                    while (i < this.priceTypes.length) {
                        if (this.priceTypes[i].description == 'Propus' || this.priceTypes[i].description == 'Acceptat') {
                            this.priceTypes.splice(i, 1);
                        } else {
                            ++i;
                        }
                    }
                },
                error => console.log(error)
            ));
    }

    getCountries() {
        this.subscriptions.push(
            this.priceService.getCountries().subscribe(countriesData => {
                    this.countries = countriesData;
                },
                error => console.log(error)
            ));
    }


    getCurrencies() {
        this.subscriptions.push(
            this.priceService.getCurrenciesShort().subscribe(currenciesData => {
                    this.currencies = currenciesData;
                },
                error => console.log(error)
            ));
    }


    commonDocumentAdded($event) {
    }

    nextStep() {

        this.loadingService.show();
        this.formSubmitted = true;

        const canSave: boolean = //this.commonDocuments.length > 0 && //this.rForm.get('folderNumber').valid &&
            ((this.requests.length) == this.tabs.length &&
                this.requests.every(value => value.valid)); //&& this.mandatoryDocuments.length == 0;

        if (!canSave) {
            this.loadingService.hide();

            for (let i = 0; i < this.tabs.length; i++) {
                const r = this.requests[i];
                if (r == undefined || r.valid == undefined || !r.valid) {
                    this.selected.setValue(i);
                }
            }
            return;
        }

        this.formSubmitted = false;

        const user: string = this.priceService.getUsername();

        const requestHistory: any = {
            startDate: this.startRecDate,
            endDate: new Date(),
            username: user,
            step: 'E'
        };

        const contacts = {
            mandatedFirstname: this.rForm.get('mandatedFirstname').value,
            mandatedLastname: this.rForm.get('mandatedLastname').value,
            phoneNumber: this.rForm.get('phoneNumber').value,
            email: this.rForm.get('email').value,
            idnp: this.rForm.get('idnp').value,
            requestMandateNr: this.rForm.get('requestMandateNr').value,
            requestMandateDate: this.rForm.get('requestMandateDate').value
        };

        this.requests.forEach(req => {
            if (!req.registrationRequestMandatedContacts) {
                req.registrationRequestMandatedContacts = [contacts];
            }

            req.initiator = this.rForm.get('initiator').value;
            req.assignedUser = user;
            req.startDate = this.startRecDate;
            req.endDate = new Date();
            if (!req.requestHistories) {
                req.requestHistories = [];
            }
            req.requestHistories = [...req.requestHistories, requestHistory];
            req.company = this.rForm.get('company').value;
            req.dossierNr = this.rForm.get('folderNumber').value;
            req.currentStep = 'E';
            if (!req.type) {
                req.type = {code: 'PMED'};
            }
            if (!req.requestNumber) {
                req.requestNumber = req.price.requestNumber;
            }
        });
        this.requests.push(this.sourceRegistrationRequest);

        this.subscriptions.push(this.priceService.savePrices(this.requests).subscribe(data => {
                if (data.body.length > 0) {
                    this.errorHandlerService.showSuccess('Datele au fost salvate');
                    this.sourceRegistrationRequest = data.body.find(d => d.id == this.sourceRegistrationRequest.id);
                    this.requests = data.body.filter(d => d.id != this.sourceRegistrationRequest.id);
                    this.requests.forEach(value => value.valid = true);
                }
                this.loadingService.hide();
            }, error1 => {
                this.requests = this.requests.filter(d => d.id != this.sourceRegistrationRequest.id);
                this.requests.forEach(value => value.valid = true);
                this.loadingService.hide();
            })
        );
        return false;
    }


    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(value => value.unsubscribe());
    }

    // ngAfterContentInit() {
    //     alert('ngAfterContentInit');
    // }

    ngAfterViewInit() {
        console.log('ngAfterViewInit', this.tabGroup);
        // this.subscriptions.push(this.tabGroup.selectedIndexChange.subscribe(index => console.log("selectedIndexChange", index)));
        this.subscriptions.push(this.tabGroup.selectedIndexChange.subscribe(index => console.log('selectedIndexChange', index)));

    }

    onMedChange($event) {
        if ($event.index != undefined) {
            // let tab = this.tabGroup._tabs.find(tab => tab.position == $event.index);
            const tab = this.tabGroup._tabs.toArray()[$event.index];
            if ($event.commercialName) {
                const tabName = $event.commercialName.substring(0, 40);
                tab.textLabel = tabName + ($event.code ? ' [' + $event.code + ']' : '');
            } else {
                tab.textLabel = 'Medicamentul ' + ($event.index + 1);
            }
            this.tabGroup._tabs.notifyOnChanges();
        }
    }


    addTab() {
        this.requests.push({
            documents: this.commonDocuments,
            requestNumber: this.rForm.get('requestNumber').value + '/' + (++this.lastIndex),
            price: {
                referencePrices: []
            }
        });
        this.tabs.push('Medicamentul ' + (this.tabs.length + 1));
        this.selected.setValue(this.tabs.length - 1);
    }

    removeTab(index: number) {
        let request = this.requests[index];
        if(request.requestNumber) {
            this.subscriptions.push(this.priceService.removeRequest(request.requestNumber).subscribe(data => {
                console.log('removed', data);
            }));
        }
        this.requests.splice(index, 1);
        this.tabs.splice(index, 1);
    }
}
