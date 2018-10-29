import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {ModalService} from "../../../shared/service/modal.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
    selector: 'app-samsa',
    templateUrl: './samsa.component.html',
    styleUrls: ['./samsa.component.css']
})
export class SamsaComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    model: string;
    documents: Document [] = [];
    sForm: FormGroup;
    company: any;
    formSubmitted: boolean;
    activeSubstancesTable: any[];
    paymentOrdersList: PaymentOrder[] = [];
    receiptsList: Receipt[] = [];
    paymentTotal: number;

    date: any = new FormControl({value: new Date(), disabled: true});

    constructor(private fb: FormBuilder,
                private router: Router,
                private requestService: RequestService,
                private modalService: ModalService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                private activatedRoute: ActivatedRoute) {
        this.sForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
            //'dataToSaveInStartDateRequestHistory': [''],
            'currentStep': ['X'],
            'medicament':
                fb.group({
                    'id': [],
                    'name': [''],
                    'company': [''],
                    'registrationDate': [],
                    'companyValue': [''],
                    'pharmaceuticalForm': [null],
                    'pharmaceuticalFormType': [null],
                    'dose': [null],
                    'unitsOfMeasurement': [null],
                    'internationalMedicamentName': [null],
                    'volume': [null],
                    'termsOfValidity': [null],
                    'code': [null],
                    'medicamentType': [null],
                    'storageQuantityMeasurement': [null],
                    'storageQuantity': [null],
                    'unitsQuantityMeasurement': [null],
                    'unitsQuantity': [null],
                    'prescription': {disabled: true, value: null},
                    'authorizationHolder': [null],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'manufacture': [null],
                    'manufactureMedCountry': [null],
                    'manufactureMedAddress': [null],
                    'documents': [],
                    'status': ['P'],
                    'group':
                        fb.group({
                                'code': {disabled: true, value: null}
                            }
                        )
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'manufactureSA': [null],
            'manufactureCountrySA': [null],
            'manufactureAddressSA': [null],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'requestHistories': [],
        });
    }

    ngOnInit() {
        this.modalService.data.next('');
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.sForm.get('medicament.id').setValue(data.medicament.id);
                        this.sForm.get('id').setValue(data.id);
                        this.sForm.get('startDate').setValue(data.startDate);
                        this.sForm.get('requestNumber').setValue(data.requestNumber);
                        this.sForm.get('medicament.company').setValue(data.medicament.company);
                        this.sForm.get('medicament.companyValue').setValue(data.medicament.company.name);
                        this.sForm.get('company').setValue(data.medicament.company);
                        this.sForm.get('medicament.id').setValue(data.medicament.id);
                        this.sForm.get('medicament.name').setValue(data.medicament.name);
                        this.sForm.get('medicament.documents').setValue(data.medicament.documents);
                        this.sForm.get('medicament.pharmaceuticalForm').setValue(data.medicament.pharmaceuticalForm.description);
                        this.sForm.get('medicament.pharmaceuticalFormType').setValue(data.medicament.pharmaceuticalForm.type.description);
                        this.sForm.get('medicament.registrationDate').setValue(data.medicament.registrationDate);
                        this.sForm.get('medicament.dose').setValue(data.medicament.dose);
                        this.sForm.get('medicament.unitsOfMeasurement').setValue(data.medicament.unitsOfMeasurement.description);
                        this.sForm.get('medicament.internationalMedicamentName').setValue(data.medicament.internationalMedicamentName.description);
                        this.sForm.get('medicament.medicamentType').setValue(data.medicament.medicamentType.description);
                        this.sForm.get('medicament.code').setValue(data.medicament.code);
                        this.sForm.get('medicament.unitsQuantity').setValue(data.medicament.unitsQuantity);
                        this.sForm.get('medicament.unitsQuantityMeasurement').setValue(data.medicament.unitsQuantityMeasurement.description);
                        this.sForm.get('medicament.storageQuantity').setValue(data.medicament.storageQuantity);
                        this.sForm.get('medicament.storageQuantityMeasurement').setValue(data.medicament.storageQuantityMeasurement.description);
                        this.sForm.get('medicament.volume').setValue(data.medicament.volume);
                        this.sForm.get('medicament.termsOfValidity').setValue(data.medicament.termsOfValidity);
                        this.sForm.get('medicament.group.code').setValue(data.medicament.group.code);
                        this.sForm.get('medicament.prescription').setValue(data.medicament.prescription.toString());
                        this.sForm.get('medicament.authorizationHolder').setValue(data.medicament.authorizationHolder.description);
                        this.sForm.get('medicament.authorizationHolderCountry').setValue(data.medicament.authorizationHolder.country.description);
                        this.sForm.get('medicament.authorizationHolderAddress').setValue(data.medicament.authorizationHolder.address);
                        this.sForm.get('medicament.manufacture').setValue(data.medicament.manufacture.description);
                        this.sForm.get('medicament.manufactureMedCountry').setValue(data.medicament.manufacture.country.description);
                        this.sForm.get('medicament.manufactureMedAddress').setValue(data.medicament.manufacture.address);
                        this.sForm.get('type').setValue(data.type);
                        this.sForm.get('requestHistories').setValue(data.requestHistories);
                        this.sForm.get('typeValue').setValue(data.type.code);
                        // var reqHist = data.requestHistories.reduce((p, n) => p.id < n.id ? p : n);
                        // this.sForm.get('dataToSaveInStartDateRequestHistory').setValue(reqHist.endDate);
                        this.company = data.medicament.company;
                        this.documents = data.medicament.documents;
                        this.receiptsList = data.medicament.receipts;
                        this.paymentOrdersList = data.medicament.paymentOrders;
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        this.activeSubstancesTable = data.medicament.activeSubstances;
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        let xs2 = this.receiptsList;
                        xs2 = xs2.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        let xs3 = this.paymentOrdersList;
                        xs3 = xs3.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        if (data.currentStep == 'S') {
                            this.modalService.data.next({
                                modalType: 'WAITING',
                                requestId: this.sForm.get('id').value,
                                requestNumber: this.sForm.get('requestNumber').value
                            });
                        }
                        if (data.currentStep == 'L') {
                            this.modalService.data.next({
                                modalType: 'WAITING_ANALYSIS',
                                requestId: this.sForm.get('id').value,
                                requestNumber: this.sForm.get('requestNumber').value
                            });
                        }
                    })
                );
            })
        );
    }

    ngAfterViewInit(): void {
        this.modalService.data.asObservable().subscribe(value => {
            if (value != '' && (value.action == 'CLOSE_MODAL' || value.action == 'CLOSE_WAITING_MODAL')) {
                this.sForm.get('data').setValue(new Date());
                this.subscriptions.push(this.requestService.getMedicamentRequest(this.sForm.get('id').value).subscribe(data => {
                    this.documents = data.medicament.documents;
                    this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    let xs = this.documents;
                    xs = xs.map(x => {
                        x.isOld = true;
                        return x;
                    });
                    if (data.currentStep == 'S') {
                        this.modalService.data.next({
                            modalType: 'WAITING',
                            requestId: this.sForm.get('id').value,
                            requestNumber: this.sForm.get('requestNumber').value
                        });
                    }
                    if (data.currentStep == 'L') {
                        this.modalService.data.next({
                            modalType: 'WAITING_ANALYSIS',
                            requestId: this.sForm.get('id').value,
                            requestNumber: this.sForm.get('requestNumber').value
                        });
                    }
                }));
            }
        })
    }

    requestLaboratoryAnalysis() {
        this.modalService.data.next({
                requestNumber: this.sForm.get('requestNumber').value,
                requestId: this.sForm.get('id').value,
                modalType: 'LABORATORY_ANALYSIS',
                startDate: this.sForm.get('data').value
            }
        );
    }

    requestAdditionalData() {
        console.log(this.sForm.get('data').value);
        this.modalService.data.next({
                requestNumber: this.sForm.get('requestNumber').value,
                requestId: this.sForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA',
                startDate: this.sForm.get('data').value
            }
        );
    }

    interruptProcess() {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                var modelToSubmit = {requestHistories: [], currentStep: 'I', id: this.sForm.get('id').value};
                modelToSubmit.requestHistories.push({
                    startDate: this.sForm.get('data').value, endDate: new Date(),
                    username: this.authService.getUserName(), step: 'A'
                });

                this.subscriptions.push(this.requestService.addMedicamentHistory(modelToSubmit).subscribe(data => {
                        this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.sForm.get('id').value]);
                    }, error => console.log(error))
                );
            }
        });
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    nextStep() {
        this.formSubmitted = true;

        if (this.paymentTotal < 0) {
            return;
        }

        this.formSubmitted = false;

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                var modelToSubmit = {medicament :{paymentOrders: [],receipts: []}, currentStep: 'X', id: this.sForm.get('id').value, requestHistories : []};
                modelToSubmit.medicament.paymentOrders = this.paymentOrdersList;
                modelToSubmit.medicament.receipts = this.receiptsList;

                modelToSubmit.requestHistories.push({
                    startDate: this.sForm.get('data').value, endDate: new Date(),
                    username: this.authService.getUserName(), step: 'A'
                });

                this.subscriptions.push(this.requestService.addMedicamentPayments(modelToSubmit).subscribe(data => {
                        this.router.navigate(['dashboard/module/medicament-registration/expert/' + this.sForm.get('id').value]);
                    }, error => console.log(error))
                );
            }
        });
    }
}
