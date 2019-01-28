import {Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {AdministrationService} from '../shared/service/administration.service';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddPaymentOrderComponent} from '../dialog/add-payment-order/add-payment-order.component';
import {LoaderService} from '../shared/service/loader.service';
import {ConfirmationDialogComponent} from '../dialog/confirmation-dialog.component';
import {DocumentService} from '../shared/service/document.service';
import {ErrorHandlerService} from '../shared/service/error-handler.service';
import {SelectCurrencyBonPlataDialogComponent} from '../dialog/select-currency-bon-plata-dialog/select-currency-bon-plata-dialog.component';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    //Bon de plata
    private subscriptions: Subscription[] = [];
    bonDePlataList: any[] = [];
    bonDePlataTotal = 0;

    additionalBonDePlataList: any;
    process: string;
    requestNimicire: any;
    requestDet: any;

    //Incasari
    receiptsList: any[] = [];
    receiptsTotal = 0;
    total = 0;

    disabled = false;
    rOnly = false;
    bonSuplimentarNotRender = false;
    requestIdP: any;
    isCheckProducator: boolean;
    manufacturesList: any[];
    isManufactureAutohton = false;

    constructor(private administrationService: AdministrationService,
                private dialog: MatDialog,
                private documentService: DocumentService,
                private errorHandlerService: ErrorHandlerService,
                private loadingService: LoaderService) {

    }

    ngOnInit() {

    }

    loadPaymentOrders() {
        if (!this.requestIdP) {
            this.requestIdP = 0;
        }

        this.subscriptions.push(
            this.administrationService.getPaymentOrders(this.requestIdP).subscribe(data => {
                    this.bonDePlataList = data;
                    if (this.bonDePlataList.length != 0) {
                        this.checkReceipts();
                    }
                    this.recalculateTotalTaxes();
                },
                error => {
                    console.log(error);
                    this.loadingService.hide();
                }
            )
        );
    }

    @Output() totalValueChanged = new EventEmitter();

    get isDisabled(): boolean {
        return this.disabled;
    }

    @Input()
    set isDisabled(disabled: boolean) {
        this.disabled = disabled;
    }

    get readOnly(): boolean {
        return this.disabled;
    }

    @Input()
    set readOnly(readonly: boolean) {
        this.rOnly = readonly;
    }


    get additionalBonDePlata(): any {
        return this.additionalBonDePlataList;
    }

    @Input()
    set additionalBonDePlata(additionalBonDePlataList: any) {
        this.additionalBonDePlataList = additionalBonDePlataList;
        this.loadPaymentOrders();
    }


    get processModule(): string {
        return this.process;
    }

    @Input()
    set processModule(process: string) {
        this.process = process;
    }

    get checkProducator(): boolean {
        return this.isCheckProducator;
    }

    @Input()
    set checkProducator(isCheckProducator: boolean) {
        this.isCheckProducator = isCheckProducator;
    }

    get manufactures(): any[] {
        return this.manufacturesList;
    }

    @Input()
    set manufactures(manufacturesList: any[]) {
        this.manufacturesList = manufacturesList;
    }

    addTaxes() {
        if (this.checkProducator) {
            const test = this.manufactures.find(r => r.producatorProdusFinit == true);
            const test2 = this.manufactures.find(r => r.producatorProdusFinitTo == true);
            if (!test && !test2) {
                this.errorHandlerService.showError('Nu a fost selectat producatorul produsului finit');
                return;
            }
        }

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';
        dialogConfig2.data = {bonSuplimentarNotRender: this.isBonSuplimentarNotRender};

        const dialogRef = this.dialog.open(AddPaymentOrderComponent, dialogConfig2);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                result.registrationRequestId = this.requestIdP;
                this.loadingService.show();
                this.subscriptions.push(
                    this.administrationService.addPaymentOrder(result).subscribe(request => {
                            this.loadPaymentOrders();
                            this.loadingService.hide();
                        },
                        error => {
                            console.log(error);
                            this.loadingService.hide();
                        }
                    ));
            }
        });
    }

    isDisableDeleteBonDePlata(bonDePlata: any): boolean {
        return this.receiptsList.find(r => r.paymentOrderNumber == bonDePlata.number);
    }

    deleteBonDePlata(bonDePlata: any, i: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta taxa?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                this.subscriptions.push(this.administrationService.removePaymentOrder(bonDePlata.id).subscribe(data => {
                        this.bonDePlataList.splice(i, 1);
                        this.recalculateTotalTaxes();
                        this.loadingService.hide();
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    private recalculateTotalTaxes() {
        this.bonDePlataTotal = 0;
        this.bonDePlataList.filter(bon => bon.serviceCharge.category != 'BS').forEach(bon => {
            this.bonDePlataTotal += (bon.amount * bon.quantity);
        });
        this.recalculateTotal();
    }

    private recalculateTotalReceipts() {
        this.receiptsTotal = 0;
        this.receiptsList.forEach(receipt => {
            this.receiptsTotal += receipt.amount;
        });
        this.recalculateTotal();
    }

    private recalculateTotal() {
        this.total = this.receiptsTotal - this.bonDePlataTotal;
        this.totalValueChanged.emit(this.total);
    }

    checkReceipts() {
        const ar: any[] = [];
        for (const bon of this.bonDePlataList) {
            ar.push(bon.number);
        }

        this.loadingService.show();
        this.subscriptions.push(this.administrationService.getReceiptsByPaymentOrderNumbers(ar).subscribe(data => {
                this.receiptsList = data.body;
                this.recalculateTotalReceipts();
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    get isBonSuplimentarNotRender(): boolean {
        return this.bonSuplimentarNotRender;
    }

    @Input()
    set isBonSuplimentarNotRender(bonSuplimentarNotRender: boolean) {
        this.bonSuplimentarNotRender = bonSuplimentarNotRender;
    }

    get requestAnnihilation(): any {
        return this.requestNimicire;
    }

    @Input()
    set requestAnnihilation(requestNimicire: any) {
        this.requestNimicire = requestNimicire;
    }

    get requestDetails(): any {
        return this.requestDet;
    }

    @Input()
    set requestDetails(requestDet: any) {
        this.requestDet = requestDet;
    }

    get requestId(): any {
        return this.requestIdP;
    }

    @Input()
    set requestId(requestId: any) {
        this.requestIdP = requestId;
        if (requestId) {
            this.loadPaymentOrders();
        }
    }

    generateBonDePlataForAll() {
        if (this.bonDePlataList.length != 0) {
            if (!this.checkProducator) {
                this.generateBonCommonParameters('');
            } else {

                if (this.checkProducator) {
                    if ((!this.requestDet.medicament.commercialName && !this.requestDet.medicament.commercialNameTo) ||
                        (!this.requestDet.medicament.pharmaceuticalForm && !this.requestDet.medicament.pharmaceuticalFormTo) ||
                        (!this.requestDet.medicament.dose && !this.requestDet.medicament.doseTo) ||
                        !this.requestDet.divisionBonDePlata) {
                        this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
                        return;
                    }
                }
                const dialogConfig2 = new MatDialogConfig();

                dialogConfig2.disableClose = false;
                dialogConfig2.autoFocus = true;
                dialogConfig2.hasBackdrop = true;

                dialogConfig2.width = '600px';

                const dialogRef = this.dialog.open(SelectCurrencyBonPlataDialogComponent, dialogConfig2);
                dialogRef.afterClosed().subscribe(result => {
                    this.generateBonCommonParameters(result.currency);
                });
            }
        } else {
            this.errorHandlerService.showError('Nu a fost introdusa nici o taxa spre achitare');
        }
    }

    generateBonCommonParameters(currency: string) {
        this.loadingService.show();
        let observable;
        if (this.process && this.process === 'NIMICIRE') {
            const nimicireList = this.bonDePlataList.filter(bdp => bdp.serviceCharge.category === 'BN');
            if (nimicireList.length !== 1) {
                this.errorHandlerService.showError('Trebuie sa exista o singura taxa pentru nimicirea medicamentelor.');
                this.loadingService.hide();
                return;
            }
            observable = this.documentService.viewBonDePlataNimicire(this.requestNimicire);
        }
        else if (this.process && (this.process === 'LICENTA' || this.process === 'CPCD')) {
            console.log('gdfg', this.bonDePlataList);
            const modelToSubmit = {
                requestId: this.requestIdP,
                paymentOrders: this.bonDePlataList,
            };
            observable = this.documentService.viewBonDePlataComun(modelToSubmit);
        }
        else {
            let pharmaceuticForm = '';
            if (this.requestDet.medicament.pharmaceuticalForm) {
                pharmaceuticForm = this.requestDet.medicament.pharmaceuticalForm.description;
            } else {
                pharmaceuticForm = this.requestDet.medicament.pharmaceuticalFormTo.description;
            }
            let dose = '';
            if (this.requestDet.medicament.dose) {
                dose = this.requestDet.medicament.dose;
            } else {
                dose = this.requestDet.medicament.doseTo;
            }
            let commercialName = '';
            if (this.requestDet.medicament.commercialName) {
                commercialName = this.requestDet.medicament.commercialName;
            } else {
                commercialName = this.requestDet.medicament.commercialNameTo;
            }
            const modelToSubmit = {
                currency: currency,
                companyName: this.requestDet.company.name,
                companyCountry: 'Republica Moldova',
                address: this.requestDet.company.legalAddress,
                requestId: this.requestIdP,
                paymentOrders: this.bonDePlataList,
                medicamentDetails: [{
                    nr: 1,
                    medicamentName: commercialName,
                    pharmaceuticForm: pharmaceuticForm,
                    dose: dose,
                    division: this.requestDet.divisionBonDePlata
                }]
            };
            observable = this.documentService.viewBonDePlata(modelToSubmit);
        }


        this.subscriptions.push(observable.subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadPaymentOrders();
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    generateSingleBonDePlata(bonDePlata: any) {

        if (!this.checkProducator) {
            this.generateSingleBonCommonParameters(bonDePlata, '');
        } else {

            if (this.checkProducator) {
                if ((!this.requestDet.medicament.pharmaceuticalForm && !this.requestDet.medicament.pharmaceuticalFormTo) ||
                    (!this.requestDet.medicament.dose && !this.requestDet.medicament.doseTo) ||
                    !this.requestDet.divisionBonDePlata) {
                    this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
                    return;
                }
            }

            if (bonDePlata.serviceCharge.category == 'BS') {
                this.generateSingleBonCommonParameters(bonDePlata, 'MDL');
                return;
            }

            const dialogConfig2 = new MatDialogConfig();

            dialogConfig2.disableClose = false;
            dialogConfig2.autoFocus = true;
            dialogConfig2.hasBackdrop = true;

            dialogConfig2.width = '600px';

            const dialogRef = this.dialog.open(SelectCurrencyBonPlataDialogComponent, dialogConfig2);
            dialogRef.afterClosed().subscribe(result => {
                this.generateSingleBonCommonParameters(bonDePlata, result.currency);
            });
        }
    }

    generateSingleBonCommonParameters(bonDePlata: any, currency: string) {
        this.loadingService.show();
        let observable;
        if (this.process && (this.process === 'LICENTA' || this.process === 'CPCD')) {
            const modelToSubmit = {
                requestId: this.requestIdP,
                paymentOrders: [bonDePlata],
            };
            observable = this.documentService.viewBonDePlataComun(modelToSubmit);
        }
        else {
            let pharmaceuticForm = '';
            if (this.requestDet.medicament.pharmaceuticalForm) {
                pharmaceuticForm = this.requestDet.medicament.pharmaceuticalForm.description;
            } else {
                pharmaceuticForm = this.requestDet.medicament.pharmaceuticalFormTo.description;
            }
            let dose = '';
            if (this.requestDet.medicament.dose) {
                dose = this.requestDet.medicament.dose;
            } else {
                dose = this.requestDet.medicament.doseTo;
            }
            const modelToSubmit = {
                currency: currency,
                companyName: this.requestDet.company.name,
                companyCountry: 'Republica Moldova',
                address: this.requestDet.company.legalAddress,
                requestId: this.requestIdP,
                paymentOrders: [bonDePlata],
                medicamentDetails: [{
                    nr: 1,
                    medicamentName: this.requestDet.medicament.commercialName,
                    pharmaceuticForm: pharmaceuticForm,
                    dose: dose,
                    division: this.requestDet.divisionBonDePlata
                }]
            };

            if (bonDePlata.serviceCharge.category != 'BS') {
                observable = this.documentService.viewBonDePlata(modelToSubmit);
            } else {
                observable = this.documentService.viewBonDePlataSuplimentar(modelToSubmit);
            }
        }

        this.subscriptions.push(observable.subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadPaymentOrders();
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    manufactureModified() {
        if (this.isCheckProducator) {
            if (this.manufacturesList) {
                this.isManufactureAutohton = this.manufacturesList.find(r => {
                    return r.manufacture.country.code == 'MD' && r.producatorProdusFinit == 1;
                });
                if (this.isManufactureAutohton) {
                    for (const x of this.bonDePlataList) {
                        this.subscriptions.push(this.administrationService.removePaymentOrder(x.id).subscribe(data => {
                                this.recalculateTotalTaxes();
                            }, error => console.log(error))
                        );

                    }
                    this.bonDePlataList = [];
                }
            } else {
                this.isManufactureAutohton = false;
            }
        }
    }

    getPaymentOrders() {
        return this.bonDePlataList;
    }
}


