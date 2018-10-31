import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Document} from "../../../models/document";
import {ModalService} from "../../../shared/service/modal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {Expert} from "../../../models/expert";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {DocumentService} from "../../../shared/service/document.service";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
    selector: 'app-experti',
    templateUrl: './experti.component.html',
    styleUrls: ['./experti.component.css']
})
export class ExpertiComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    expertForm: FormGroup;
    documents: Document [] = [];
    activeSubstancesTable: any[];
    company: any;
    outDocuments: any[] = [{name: 'Ordinul de autorizare a medicamentului'}];
    formSubmitted: boolean;
    expert: Expert = new Expert();
    docTypes: any[];
    modelToSubmit : any;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private requestService: RequestService,
                public dialogConfirmation: MatDialog,
                private administrationService: AdministrationService,
                private router: Router,
                private errorHandlerService: ErrorHandlerService,
                private documentService: DocumentService,
                private activatedRoute: ActivatedRoute) {
        this.expertForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
            //'dataToSaveInStartDateRequestHistory': [''],
            'currentStep': ['F'],
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
                    'status': ['F'],
                    'experts': [''],
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
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                    this.modelToSubmit = data;
                        this.expertForm.get('medicament.id').setValue(data.medicament.id);
                        this.expertForm.get('id').setValue(data.id);
                        this.expertForm.get('startDate').setValue(data.startDate);
                        this.expertForm.get('requestNumber').setValue(data.requestNumber);
                        this.expertForm.get('medicament.company').setValue(data.medicament.company);
                        this.expertForm.get('medicament.companyValue').setValue(data.medicament.company.name);
                        this.expertForm.get('company').setValue(data.medicament.company);
                        this.expertForm.get('medicament.id').setValue(data.medicament.id);
                        this.expertForm.get('medicament.name').setValue(data.medicament.name);
                        this.expertForm.get('medicament.documents').setValue(data.medicament.documents);
                        this.expertForm.get('medicament.pharmaceuticalForm').setValue(data.medicament.pharmaceuticalForm.description);
                        this.expertForm.get('medicament.pharmaceuticalFormType').setValue(data.medicament.pharmaceuticalForm.type.description);
                        this.expertForm.get('medicament.registrationDate').setValue(data.medicament.registrationDate);
                        this.expertForm.get('medicament.dose').setValue(data.medicament.dose);
                        this.expertForm.get('medicament.unitsOfMeasurement').setValue(data.medicament.unitsOfMeasurement.description);
                        this.expertForm.get('medicament.internationalMedicamentName').setValue(data.medicament.internationalMedicamentName.description);
                        this.expertForm.get('medicament.medicamentType').setValue(data.medicament.medicamentType.description);
                        this.expertForm.get('medicament.code').setValue(data.medicament.code);
                        this.expertForm.get('medicament.unitsQuantity').setValue(data.medicament.unitsQuantity);
                        this.expertForm.get('medicament.unitsQuantityMeasurement').setValue(data.medicament.unitsQuantityMeasurement.description);
                        this.expertForm.get('medicament.storageQuantity').setValue(data.medicament.storageQuantity);
                        this.expertForm.get('medicament.storageQuantityMeasurement').setValue(data.medicament.storageQuantityMeasurement.description);
                        this.expertForm.get('medicament.volume').setValue(data.medicament.volume);
                        this.expertForm.get('medicament.termsOfValidity').setValue(data.medicament.termsOfValidity);
                        this.expertForm.get('medicament.group.code').setValue(data.medicament.group.code);
                        this.expertForm.get('medicament.prescription').setValue(data.medicament.prescription.toString());
                        this.expertForm.get('medicament.authorizationHolder').setValue(data.medicament.authorizationHolder.description);
                        this.expertForm.get('medicament.authorizationHolderCountry').setValue(data.medicament.authorizationHolder.country.description);
                        this.expertForm.get('medicament.authorizationHolderAddress').setValue(data.medicament.authorizationHolder.address);
                        this.expertForm.get('medicament.manufacture').setValue(data.medicament.manufacture.description);
                        this.expertForm.get('medicament.manufactureMedCountry').setValue(data.medicament.manufacture.country.description);
                        this.expertForm.get('medicament.manufactureMedAddress').setValue(data.medicament.manufacture.address);
                        this.expertForm.get('type').setValue(data.type);
                        this.expertForm.get('requestHistories').setValue(data.requestHistories);
                        this.expertForm.get('typeValue').setValue(data.type.code);
                        this.company = data.medicament.company;
                        this.documents = data.medicament.documents;
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        this.activeSubstancesTable = data.medicament.activeSubstances;
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                    })
                );
            })
        );

        this.subscriptions.push(
            this.administrationService.getAllDocTypes().subscribe(data => {
                    this.docTypes = data;
                    this.docTypes = this.docTypes.filter(r => r.category === 'CA');
                },
                error => console.log(error)
            )
        );
    }

    viewDoc() {
        this.formSubmitted = true;
        if (!this.expert || !this.expert.chairman) {
            this.errorHandlerService.showError('Presedintele comisiei trebuie selectat');
            return;
        } else if (!this.expert.farmacolog) {
            this.errorHandlerService.showError('Farmacologul trebuie selectat');
            return;
        } else if (!this.expert.farmacist) {
            this.errorHandlerService.showError('Farmacistul trebuie selectat');
            return;
        } else if (!this.expert.medic) {
            this.errorHandlerService.showError('Medicul trebuie selectat');
            return;
        }
        this.formSubmitted = false;
        this.subscriptions.push(this.documentService.viewMedicamentAuthorizationOrder().subscribe(data => {
                let file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }, error => {
                console.log('error ', error);
            }
            )
        );
    }


    nextStep() {
        this.formSubmitted = true;

        if (!this.expert || !this.expert.medic || !this.expert.farmacist || !this.expert.farmacolog || !this.expert.chairman) {
            return;
        }

        this.formSubmitted = false;

        var x  = this.modelToSubmit;

        x.currentStep = 'F';
        x.endDate = new Date();

        x.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'X'
        });

        x.requestHistories.push({
            startDate: new Date(),
            username: this.authService.getUserName(), step: 'F'
        });

        x.medicament.experts = {chairman : this.expert.chairman, farmacolog : this.expert.farmacolog, farmacist :this.expert.farmacist,
            medic :this.expert.medic, date : new Date(), comment : this.expert.comment, number : this.expert.comiteeNr};

        this.subscriptions.push(this.requestService.addMedicamentRequest(x).subscribe(data => {
                this.router.navigate(['dashboard/module']);
            }, error => console.log('Certificatul de autorizare nu a putut fi salvat in baza de date.'))
        );

    }

    interruptProcess()
    {
        this.formSubmitted = true;

        if (!this.expert || !this.expert.medic || !this.expert.farmacist || !this.expert.farmacolog || !this.expert.chairman) {
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
                var modelToSubmit = {requestHistories: [], currentStep: 'I', id: this.expertForm.get('id').value, medicament : {experts : {}}};
                modelToSubmit.requestHistories.push({
                    startDate: this.expertForm.get('data').value, endDate: new Date(),
                    username: this.authService.getUserName(), step: 'X'
                });

                modelToSubmit.medicament.experts = {chairman : this.expert.chairman, farmacolog : this.expert.farmacolog, farmacist :this.expert.farmacist,
                    medic :this.expert.medic, date : new Date(), comment : this.expert.comment, number : this.expert.comiteeNr};

                this.subscriptions.push(this.requestService.addMedicamentHistory(modelToSubmit).subscribe(data => {
                        this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.expertForm.get('id').value]);
                    }, error => console.log(error))
                );
            }
        });
    }
}
