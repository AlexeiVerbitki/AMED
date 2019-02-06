import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {DocumentService} from '../../../shared/service/document.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {ActivatedRoute} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {TaskService} from '../../../shared/service/task.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {LicenseService} from '../../../shared/service/license/license.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddDescriptionComponent} from '../../../dialog/add-description/add-description.component';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara-gmp.component.html',
    styleUrls: ['./evaluare-primara-gmp.component.css']
})
export class EvaluarePrimaraGmpComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document[] = [];
    registrationRequestMandatedContacts: any[];
    docTypes: any[];
    docTypesInitial: any[];
    formSubmitted: boolean;
    outDocuments: any[] = [];
    reqTypes: any[];
    companyLicenseNotFound = false;
    companiiPerIdnoSelected: any[] = [];
    initialData: any;
    asepticPreparations: any[];
    otherAsepticPreparations: any[] = [];
    finalSterilized: any[];
    otherFinalSterilized: any[] = [];

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private documentService: DocumentService,
                private navbarTitleService: NavbarTitleService,
                private taskService: TaskService,
                private authService: AuthService,
                private loadingService: LoaderService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private licenseService: LicenseService,
                private administrationService: AdministrationService,
                private requestService: RequestService,
                private activatedRoute: ActivatedRoute) {
        this.eForm = fb.group({
            'id': [],
            'startDateValue': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [null],
            'documents': [],
            'typeFara': [null],
            'licenseId': [null],
            'type': [],
            'initiator': [null],
            'requestHistories': [],
            'company': [null],
            'companyValue': [],
            'seria': [null],
            'nrLic': [null],
            'dataEliberariiLic': {disabled: true, value: new Date()},
            'dataExpirariiLic': {disabled: true, value: new Date()},
            'manufacturingAddress': [null, Validators.required],
            'manufacturingName': [null, Validators.required],
            'asepticPreparationsValues': [null],
            'finalSterilizedValues': [null],
            'humanUse' : [false],
            'veterinary' : [false],
            'veterinaryDetails' : [null],
            'certificationOnlySterile' : [false],
        });

        this.eForm.get('veterinary').valueChanges.subscribe(val => {
            if (val) {
                this.eForm.get('veterinaryDetails').enable();
            } else {
                this.eForm.get('veterinaryDetails').setValue(null);
                this.eForm.get('veterinaryDetails').disable();
            }
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Autorizație de fabricație a medicamentelor / Evaluare primara');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.loadGMPDetails(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.fillRequestDetails(data);
                        this.fillGMPDetails(data);
                        this.loadAllQuickSearches(data);
                    })
                );
            })
        );
    }

    loadAllQuickSearches(dataDB: any) {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('43', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllRequestTypes().subscribe(data => {
                    this.reqTypes = data;
                    this.reqTypes = this.reqTypes.filter(t => t.processId == 12 && t.code != 'GMPF');
                    if (dataDB.type) {
                        this.eForm.get('type').setValue(this.reqTypes.find(r => r.id === dataDB.type.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.licenseService.retrieveLicenseByIdno(dataDB.company.idno).subscribe(data => {
                    if (data) {
                        this.eForm.get('licenseId').setValue(data.id);
                        this.eForm.get('seria').setValue(data.serialNr);
                        this.eForm.get('nrLic').setValue(data.nr);
                        this.eForm.get('dataEliberariiLic').setValue(new Date(data.releaseDate));
                        this.eForm.get('dataExpirariiLic').setValue(new Date(data.expirationDate));
                        this.findLicense(data);
                    } else {
                        this.companyLicenseNotFound = true;
                    }
                }
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllSterileProducts().subscribe(data => {
                    this.asepticPreparations = data;
                    this.finalSterilized = data;
                    if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0 && dataDB.gmpAuthorizations[0].sterileProducts) {
                        const arrAseptic: any[] = [];
                        const arrFinalSterilized: any[] = [];
                        for (const z of dataDB.gmpAuthorizations[0].sterileProducts) {
                            if (z.category == 'P') {
                                if (z.sterileProduct) {
                                    arrAseptic.push(z.sterileProduct);
                                } else {
                                    this.otherAsepticPreparations.push({description: z.description});
                                }
                            } else if (z.category == 'S') {
                                if (z.sterileProduct) {
                                    arrFinalSterilized.push(z.sterileProduct);
                                } else {
                                    this.otherFinalSterilized.push({description: z.description});
                                }
                            } else if (z.category == 'C') {

                            }
                        }
                        this.eForm.get('finalSterilizedValues').setValue(arrFinalSterilized);
                        this.eForm.get('asepticPreparationsValues').setValue(arrAseptic);
                    }
                },
                error => console.log(error)
            )
        );
    }

    findLicense(dataDB: any) {
        this.licenseService.findLicenseById(dataDB.id).subscribe(data => {
                this.companiiPerIdnoSelected = data.economicAgents;

                this.companiiPerIdnoSelected.forEach(cis => {
                    cis.companyType = cis.type.description;
                    if (cis.locality) {
                        cis.address = cis.locality.stateName + ', ' + cis.locality.description + ', ' + cis.street;
                    }

                    let activitiesStr;
                    cis.activities.forEach(r => {
                        if (activitiesStr) {
                            activitiesStr += ', ' + r.description;
                        } else {
                            activitiesStr = r.description;
                        }

                    });
                    cis.activitiesStr = activitiesStr;
                });
            }
        );
    }

    fillRequestDetails(data: any) {
        this.eForm.get('typeFara').setValue(data.type);
        this.eForm.get('type').setValue(data.type);
        this.eForm.get('id').setValue(data.id);
        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
        this.eForm.get('initiator').setValue(data.initiator);
        this.eForm.get('startDate').setValue(data.startDate);
        this.eForm.get('startDateValue').setValue(new Date(data.startDate));
        this.eForm.get('requestNumber').setValue(data.requestNumber);
        this.eForm.get('requestHistories').setValue(data.requestHistories);
        this.eForm.get('company').setValue(data.company);
        this.eForm.get('companyValue').setValue(data.company.name);
        this.outDocuments = data.outputDocuments;
        this.documents = data.documents;
        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let xs = this.documents;
        xs = xs.map(x => {
            x.isOld = true;
            return x;
        });
    }

    fillGMPDetails(dataDB: any) {
        if (dataDB.gmpAuthorizations && dataDB.gmpAuthorizations.length != 0) {
            this.eForm.get('manufacturingAddress').setValue(dataDB.gmpAuthorizations[0].manufacturingAddress);
            this.eForm.get('manufacturingName').setValue(dataDB.gmpAuthorizations[0].manufacturingName);
            this.eForm.get('humanUse').setValue(dataDB.gmpAuthorizations[0].medicamentHumanUse);
            this.eForm.get('veterinary').setValue(dataDB.gmpAuthorizations[0].medicamentVeterinary);
            this.eForm.get('veterinaryDetails').setValue(dataDB.gmpAuthorizations[0].veterinaryDetails);
        }
    }

    documentModified(event) {
        this.formSubmitted = false;
        this.checkOutputDocumentsStatus();
    }

    checkOutputDocumentsStatus() {
        for (const entry of this.outDocuments) {
            const isMatch = this.documents.some(elem => {
                return (elem.docType.category == entry.docType.category && elem.number == entry.number) ? true : false;
            });
            if (isMatch) {
                entry.status = 'Atasat';
            } else {
                entry.status = 'Nu este atasat';
            }
        }
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

        // if(!this.rForm.dirty){
        //     return true;
        // }
        // const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
        //     data: {
        //         message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
        //         confirm: false,
        //     }
        // });
        //
        // return dialogRef.afterClosed();
        return true;

    }

    save() {
        this.loadingService.show();
        const modelToSubmit: any = this.eForm.value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.currentStep = 'E';
        modelToSubmit.assignedUser = this.authService.getUserName();

        if (!this.eForm.get('type').value) {
            modelToSubmit.type = this.eForm.get('typeFara').value;
        }

        modelToSubmit.gmpAuthorizations = [];
        const gmpAuthorization = {
            status: 'P',
            manufacturingAddress: this.eForm.get('manufacturingAddress').value,
            manufacturingName: this.eForm.get('manufacturingName').value,
            company: this.eForm.get('company').value,
            sterileProducts: [],
            medicamentHumanUse: this.eForm.get('humanUse').value,
            medicamentVeterinary: this.eForm.get('veterinary').value,
            veterinaryDetails: this.eForm.get('veterinaryDetails').value,
        };
        if (this.eForm.get('asepticPreparationsValues').value) {
            for (const w of this.eForm.get('asepticPreparationsValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'P'});
            }
        }
        if (this.otherAsepticPreparations.length != 0) {
            for (const w of this.otherAsepticPreparations) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'P'});
            }
        }
        if (this.eForm.get('finalSterilizedValues').value) {
            for (const w of this.eForm.get('finalSterilizedValues').value) {
                gmpAuthorization.sterileProducts.push({sterileProduct: w, category: 'S'});
            }
        }
        if (this.otherFinalSterilized.length != 0) {
            for (const w of this.otherFinalSterilized) {
                gmpAuthorization.sterileProducts.push({description: w.description, category: 'S'});
            }
        }
        if (this.eForm.get('checkCertificationOnlySterile').value) {
            gmpAuthorization.sterileProducts.push({category: 'C'});
        }
        modelToSubmit.gmpAuthorizations.push(gmpAuthorization);

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('startDate').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });
        modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        this.subscriptions.push(this.requestService.addGMPRequest(modelToSubmit).subscribe(data => {
                this.initialData = Object.assign({}, data.body);
                this.initialData.gmpAuthorizations = Object.assign([], data.body.gmpAuthorizations);
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    nextStep() {
        if (this.companyLicenseNotFound) {
            this.errorHandlerService.showError('Acest agent economic nu are o licenta activa.');
            return;
        }

        if (!this.eForm.get('veterinary').value && !this.eForm.get('humanUse').value) {
            this.errorHandlerService.showError('Tipul de medicament fabricat trebuie selectat.');
            return;
        }

        if (this.eForm.get('veterinary').value && !this.eForm.get('veterinaryDetails').value) {
            this.errorHandlerService.showError('Detaliile pentru medicamentele de uz veterinar trebuie introduse');
            return;
        }

        this.formSubmitted = true;
        if (this.eForm.invalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }
        this.formSubmitted = false;
    }

    addAsepticPreparation() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {name: 'Preparat aseptic', errMsg : 'Preparatul trebuie introdus', title : 'Adaugare preparat aseptic'};

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherAsepticPreparations.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeAsepticPreparation(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast preparat?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherAsepticPreparations.splice(index, 1);
            }
        });
    }

    addAFinalSterilized() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.width = '600px';

        dialogConfig2.data = {name: 'Produs sterilizat final ', errMsg : 'Produsul trebuie introdus', title : 'Adaugare produs sterilizat final'};

        const dialogRef = this.dialog.open(AddDescriptionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.otherFinalSterilized.push({
                        description: result.description
                    });
                }
            }
        );
    }

    removeFinalSterilized(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceast produs?',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.otherFinalSterilized.splice(index, 1);
            }
        });
    }

    checkHumanUseMed(value: any) {
        this.eForm.get('humanUse').setValue(value.checked);
    }

    checkVeterinary(value: any) {
        this.eForm.get('veterinary').setValue(value.checked);
    }

    checkCertificationOnlySterile(value: any) {
        this.eForm.get('certificationOnlySterile').setValue(value.checked);
    }
}


