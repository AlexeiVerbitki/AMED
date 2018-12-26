import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {DocumentService} from "../../../shared/service/document.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {TaskService} from "../../../shared/service/task.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";

@Component({
    selector: 'app-experti',
    templateUrl: './experti.component.html',
    styleUrls: ['./experti.component.css']
})
export class ExpertiComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    expertForm: FormGroup;
    documents: Document [] = [];
    docDetails : Document = new Document();
    activeSubstancesTable: any[];
    auxiliarySubstancesTable: any[] = [];
    company: any;
    outputDocuments: any[] = [];
    formSubmitted: boolean;
    docTypes: any[];
    modelToSubmit: any;
    isNonAttachedDocuments: boolean = false;
    divisions: any[] = [];
    manufacturesTable: any[] = [];
    instructions: any[] = [];
    machets: any[] = [];
    registrationRequestMandatedContacts: any[] = [];
    chairmans: any[];
    farmacologs: any[];
    farmacists: any[];
    medics: any[];
    oaAttached: boolean = false;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private requestService: RequestService,
                public dialogConfirmation: MatDialog,
                private administrationService: AdministrationService,
                private router: Router,
                private errorHandlerService: ErrorHandlerService,
                private navbarTitleService: NavbarTitleService,
                private taskService: TaskService,
                private loadingService: LoaderService,
                private documentService: DocumentService,
                private activatedRoute: ActivatedRoute) {
        this.expertForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
            'currentStep': ['F'],
            'medicamentName': [],
            'initiator': [''],
            'assignedUser': [''],
            'companyValue': [''],
            'division': [null],
            'expertDate': [new Date()],
            'comiteeNr': [null],
            'chairman': [null],
            'farmacolog': [null],
            'farmacist': [null],
            'medic': [null],
            'commentExperts': [null],
            'statusExperts': [null, Validators.required],
            'decisionChairman': [null],
            'decisionFarmacolog': [null],
            'decisionFarmacist': [null],
            'decisionMedic': [null],
            'divisionBonDePlata': [null],
            'medicament':
                fb.group({
                    'id': [],
                    'commercialName': [''],
                    'company': [''],
                    'atcCode': [null],
                    'registrationDate': [],
                    'pharmaceuticalForm': [''],
                    'pharmaceuticalFormType': [''],
                    'dose': [null],
                    'unitsOfMeasurement': [null],
                    'internationalMedicamentName': [null],
                    'volume': [null],
                    'volumeQuantityMeasurement': [null],
                    'registrationNumber': [null],
                    'termsOfValidity': [null],
                    'code': [null],
                    'medicamentType': [null],
                    'customsCode': [null],
                    'storageQuantityMeasurement': [null],
                    'storageQuantity': [null],
                    'unitsQuantityMeasurement': [null],
                    'unitsQuantity': [null],
                    'prescription': {disabled: true, value: null},
                    'authorizationHolder': [null],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'medTypesValues' : [null],
                    'documents': [],
                    'status': ['F'],
                    'experts': [''],
                    'group': ['']
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'requestHistories': []
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrare medicament / Expertiza');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.modelToSubmit = Object.assign({}, data);
                        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
                        this.outputDocuments = data.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.expertForm.get('id').setValue(data.id);
                        this.expertForm.get('initiator').setValue(data.initiator);
                        this.expertForm.get('startDate').setValue(data.startDate);
                        this.expertForm.get('requestNumber').setValue(data.requestNumber);
                        this.expertForm.get('companyValue').setValue(data.company.name);
                        this.expertForm.get('company').setValue(data.company);
                        this.expertForm.get('medicament.commercialName').setValue(data.medicamentName);
                        this.expertForm.get('medicamentName').setValue(data.medicamentName);
                        this.expertForm.get('medicament.pharmaceuticalForm').setValue(data.medicaments[0].pharmaceuticalForm.description);
                        this.expertForm.get('medicament.pharmaceuticalFormType').setValue(data.medicaments[0].pharmaceuticalForm.type.description);
                        this.expertForm.get('medicament.registrationNumber').setValue(data.medicaments[0].registrationNumber);
                        this.expertForm.get('medicament.dose').setValue(data.medicaments[0].dose);
                        if (data.medicaments && data.medicaments.length != 0 && data.medicaments[0].unitsOfMeasurement) {
                            this.expertForm.get('medicament.unitsOfMeasurement').setValue(data.medicaments[0].unitsOfMeasurement.description);
                        }
                        this.expertForm.get('medicament.internationalMedicamentName').setValue(data.medicaments[0].internationalMedicamentName.description);
                        this.expertForm.get('medicament.medicamentType').setValue(data.medicaments[0].medicamentType.description);
                        this.expertForm.get('medicament.customsCode').setValue(data.medicaments[0].customsCode.description);
                        this.expertForm.get('medicament.volume').setValue(data.medicaments[0].volume);
                        if (data.medicaments && data.medicaments.length != 0 && data.medicaments[0].volumeQuantityMeasurement) {
                            this.expertForm.get('medicament.volumeQuantityMeasurement').setValue(data.medicaments[0].volumeQuantityMeasurement.description);
                        }
                        this.expertForm.get('medicament.termsOfValidity').setValue(data.medicaments[0].termsOfValidity);
                        this.expertForm.get('medicament.group').setValue(data.medicaments[0].group.description);
                        if (data.medicaments[0].prescription == 0) {
                            this.expertForm.get('medicament.prescription').setValue('Fără prescripţie');
                        } else {
                            this.expertForm.get('medicament.prescription').setValue('Cu prescripţie');
                        }
                        this.expertForm.get('medicament.authorizationHolder').setValue(data.medicaments[0].authorizationHolder.description);
                        this.expertForm.get('medicament.authorizationHolderCountry').setValue(data.medicaments[0].authorizationHolder.country.description);
                        this.expertForm.get('medicament.authorizationHolderAddress').setValue(data.medicaments[0].authorizationHolder.address);
                        this.expertForm.get('medicament.atcCode').setValue(data.medicaments[0].atcCode);
                        let medTypes = '';
                        for(let mt of data.medicaments[0].medicamentTypes)
                        {
                            medTypes = medTypes + mt.type.description + '; ';
                        }
                        this.expertForm.get('medicament.medTypesValues').setValue(medTypes);
                        if (data.medicaments[0].experts) {
                            this.expertForm.get('expertDate').setValue(new Date(data.medicaments[0].experts.date));
                            this.expertForm.get('comiteeNr').setValue(data.medicaments[0].experts.number);
                            this.expertForm.get('commentExperts').setValue(data.medicaments[0].experts.comment);
                            if(data.medicaments[0].experts.status) {
                                this.expertForm.get('statusExperts').setValue(data.medicaments[0].experts.status.toString());
                            }
                            this.expertForm.get('decisionChairman').setValue(data.medicaments[0].experts.decisionChairman);
                            this.expertForm.get('decisionFarmacolog').setValue(data.medicaments[0].experts.decisionFarmacolog);
                            this.expertForm.get('decisionFarmacist').setValue(data.medicaments[0].experts.decisionFarmacist);
                            this.expertForm.get('decisionMedic').setValue(data.medicaments[0].experts.decisionMedic);
                        }
                        this.activeSubstancesTable = data.medicaments[0].activeSubstances;
                        this.auxiliarySubstancesTable = data.medicaments[0].auxSubstances;
                        this.manufacturesTable = data.medicaments[0].manufactures;
                        for (let entry of data.medicaments) {
                            if (entry.division && entry.division.length != 0) {
                                this.divisions.push({
                                    description: entry.division,
                                    id: entry.id,
                                    approved: entry.approved
                                });
                            }
                        }
                        let z = this.divisions.find(t => t.approved == true);
                        if (z) {
                            this.expertForm.get('statusExperts').setValue("1");
                        }
                        for (let x of data.medicaments) {
                            this.fillInstructions(x);
                            this.fillMachets(x);
                        }
                        this.expertForm.get('type').setValue(data.type);
                        this.expertForm.get('requestHistories').setValue(data.requestHistories);
                        this.expertForm.get('typeValue').setValue(data.type.code);
                        this.company = data.company;
                        this.documents = data.documents;
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        this.docDetails = this.documents.find(t=>t.docType.category=='OA');
                        this.oaAttached = this.documents.find(t => t.docType.category == 'OA') ? true : false;
                        this.fillQuickSearches();
                    })
                );
            })
        );


    }

    fillQuickSearches() {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('1', 'X').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
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
            this.administrationService.getAllEmployees().subscribe(data => {
                    this.chairmans = data;
                    this.chairmans = this.chairmans.filter(r => r.chairmanOfExperts == 1);
                    this.farmacologs = data;
                    this.farmacologs = this.farmacologs.filter(r => r.profession && r.profession.category == 'FG');
                    this.farmacists = data;
                    this.farmacists = this.farmacists.filter(r => r.profession && r.profession.category == 'FT');
                    this.medics = data;
                    this.medics = this.medics.filter(r => r.profession && r.profession.category == 'CL');
                    if (this.modelToSubmit.medicaments[0].experts) {
                        if(this.modelToSubmit.medicaments[0].experts.chairman) {
                            this.expertForm.get('chairman').setValue(this.chairmans.find(t => t.id == this.modelToSubmit.medicaments[0].experts.chairman.id));
                        }
                        if(this.modelToSubmit.medicaments[0].experts.farmacolog) {
                            this.expertForm.get('farmacolog').setValue(this.farmacologs.find(t => t.id == this.modelToSubmit.medicaments[0].experts.farmacolog.id));
                        }
                        if(this.modelToSubmit.medicaments[0].experts.farmacist) {
                            this.expertForm.get('farmacist').setValue(this.farmacists.find(t => t.id == this.modelToSubmit.medicaments[0].experts.farmacist.id));
                        }
                        if(this.modelToSubmit.medicaments[0].experts.medic) {
                            this.expertForm.get('medic').setValue(this.medics.find(t => t.id == this.modelToSubmit.medicaments[0].experts.medic.id));
                        }
                    }
                },
                error => console.log(error)
            )
        );
    }

    fillInstructions(medicament: any) {
        for (let medInstruction of medicament.instructions) {
            if (medInstruction.type == 'I') {
                let pageInstrction = this.instructions.find(value => value.path == medInstruction.path);
                if (pageInstrction) {
                    pageInstrction.divisions.push({description: medicament.division});
                } else {
                    medInstruction.divisions = [];
                    medInstruction.divisions.push({description: medicament.division});
                    this.instructions.push(medInstruction);
                }
            }
        }
    }

    fillMachets(x: any) {
        for (let y of x.instructions) {
            if (y.type == 'M') {
                let z = this.machets.find(value => value.path == y.path);
                if (z) {
                    z.divisions.push({description: x.division});
                } else {
                    y.divisions = [];
                    y.divisions.push({description: x.division});
                    this.machets.push(y);
                }
            }
        }
    }

    viewDoc(document: any) {

        let find = this.documents.find(t => t.docType.category == 'OA');
        if (!find) {
            this.errorHandlerService.showError('Ordinul de autorizare nu este atasat.');
            return;
        }

        if (document.docType.category == 'CA') {

            let d = '';
            this.divisions.forEach(t=>d + t.description+'; ');
            let a : any[] = [];
            this.activeSubstancesTable.forEach(t=>a.push(t.activeSubstance.description+' '+t.quantity+' '+t.unitsOfMeasurement.description));
            let b = this.manufacturesTable.find(t=>t.producatorProdusFinit);
            let o = this.documents.find(t=>t.docType.category=='OA');

            let m = {medName : this.expertForm.get('medicamentName').value, pharmaceuticalPhorm : this.expertForm.get('medicament.pharmaceuticalForm').value,
                dose : this.expertForm.get('medicament.dose').value, divisions : d, activeSubstances : a,
                authorizationHolder : this.expertForm.get('medicament.authorizationHolder').value,
                authorizationHolderCountry : this.expertForm.get('medicament.authorizationHolderCountry').value,
                manufacture : b.manufacture.description,
                manufactureCountry : b.manufacture.country.description,
                atcCode : this.expertForm.get('medicament.atcCode').value,
                termsOfValidity :this.expertForm.get('medicament.termsOfValidity').value,
                registrationNumber :this.expertForm.get('medicament.registrationNumber').value,
                registrationDate : o.dateOfIssue,
                orderNumber :o.number,
                orderDate : o.dateOfIssue
            };

            this.subscriptions.push(this.documentService.viewMedicamentAuthorizationCertificate(m).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }, error => {
                    console.log('error ', error);
                }
                )
            );
        }
    }


    finish() {
        this.formSubmitted = true;

        // if (this.expertForm.get('chairman').invalid || this.expertForm.get('farmacolog').invalid || this.expertForm.get('farmacist').invalid
        //     || this.expertForm.get('medic').invalid) {
        //     this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
        //     return;
        // }

        if (this.expertForm.get('statusExperts').invalid) {
            this.errorHandlerService.showError('Status inregistrare trebuie selectat.');
            return;
        }

        let find = this.documents.find(t => t.docType.category == 'DD');
        if (!find && this.modelToSubmit.ddIncluded) {
            this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
            return;
        }

        if (this.expertForm.get('statusExperts').value == 1) {
            this.success();
        } else {
            this.interruptProcess();
        }

    }

    success() {

        if (this.instructions.length==0)
        {
            this.errorHandlerService.showError('Nici o informatie nu a fost adaugata');
            return;
        }

        if (this.machets.length==0)
        {
            this.errorHandlerService.showError('Nici o macheta nu a fost adaugata');
            return;
        }

        for (let div of this.divisions) {
            let findInstr = false;
            let findMachet = false;
            for (let instr of this.instructions) {
                if (instr.divisions.some(value => value.description == div.description)) {
                    findInstr = true;
                }
            }
            for (let macheta of this.machets) {
                if (macheta.divisions.some(value => value.description == div.description)) {
                    findMachet = true;
                }
            }
            if (!findInstr) {
                this.errorHandlerService.showError('Exista divizari fara instructiuni.');
                return;
            }
            if (!findMachet) {
                this.errorHandlerService.showError('Exista divizari fara machete.');
                return;
            }
        }

        let find = this.documents.find(t => t.docType.category == 'OA');
        if (!find) {
            this.errorHandlerService.showError('Ordinul de autorizare nu este atasat.');
            return;
        }


        let find2 = this.documents.find(t => t.docType.category == 'CA');
        if (!find2) {
            this.errorHandlerService.showError('Certificatul de autorizare nu este atasat.');
            return;
        }

        this.loadingService.show();
        this.formSubmitted = false;

        var x = this.modelToSubmit;

        let usernameDB = this.authService.getUserName();
        x.currentStep = 'F';
        x.endDate = new Date();
        x.assignedUser = usernameDB;

        x.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'X'
        });

        x.requestHistories.push({
            startDate: new Date(),
            username: usernameDB, step: 'F'
        });

        x.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        x.documents = this.documents;
        x.outputDocuments = this.outputDocuments;

        for (let med of x.medicaments) {
            med.atcCode = this.expertForm.get('medicament.atcCode').value;
            let div = this.divisions.find(t => t.description == med.division);
            if (div.approved) {
                med.status = 'F';
            } else {
                med.status = 'N';
            }
            med.experts = {
                chairman: this.expertForm.get('chairman').value,
                farmacolog: this.expertForm.get('farmacolog').value,
                farmacist: this.expertForm.get('farmacist').value,
                medic: this.expertForm.get('medic').value,
                date: this.expertForm.get('expertDate').value,
                comment: this.expertForm.get('commentExperts').value,
                number: this.expertForm.get('comiteeNr').value,
                decisionChairman: this.expertForm.get('decisionChairman').value,
                decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
                decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
                decisionMedic: this.expertForm.get('decisionMedic').value,
                status: this.expertForm.get('statusExperts').value
            };

            med.instructions = [];
            for (let x of this.instructions) {
                x.id = null;
                x.type = 'I';
                let z = Object.assign({}, x);
                let copyDivision = Object.assign('', med.division);
                z.division = copyDivision;
                if (x.divisions.some(value => value.description == med.division)) {
                    med.instructions.push(z);
                }
            }

            for (let x of this.machets) {
                x.id = null;
                x.type = 'M';
                let z = Object.assign({}, x);
                let copyDivision = Object.assign('', med.division);
                z.division = copyDivision;
                if (x.divisions.some(value => value.description == med.division)) {
                    med.instructions.push(z);
                }
            }
        }

        console.log(x);
        this.subscriptions.push(this.requestService.addMedicamentRequest(x).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/homepage']);
            }, error => this.loadingService.hide())
        );
    }

    documentModified(event) {
        this.formSubmitted = false;
        this.checkOutputDocumentsStatus();
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
                this.loadingService.show();
                let userNameDB = this.authService.getUserName();
                var modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    initiator: this.modelToSubmit.initiator,
                    assignedUser: userNameDB,
                    id: this.expertForm.get('id').value,
                    medicaments: this.modelToSubmit.medicaments
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.expertForm.get('data').value, endDate: new Date(),
                    username: userNameDB, step: 'X'
                });

                for (let med of modelToSubmit.medicaments) {
                    med.atcCode = this.expertForm.get('medicament.atcCode').value;
                    med.experts = {
                        chairman: this.expertForm.get('chairman').value,
                        farmacolog: this.expertForm.get('farmacolog').value,
                        farmacist: this.expertForm.get('farmacist').value,
                        medic: this.expertForm.get('medic').value,
                        date: this.expertForm.get('expertDate').value,
                        comment: this.expertForm.get('commentExperts').value,
                        number: this.expertForm.get('comiteeNr').value,
                        decisionChairman: this.expertForm.get('decisionChairman').value,
                        decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
                        decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
                        decisionMedic: this.expertForm.get('decisionMedic').value
                    };
                }

                this.subscriptions.push(this.requestService.addMedicamentRegistrationHistoryOnInterruption(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.expertForm.get('id').value]);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    checkOutputDocumentsStatus() {
        for (let entry of this.outputDocuments) {
            var isMatch = this.documents.some(elem => {
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

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());

    }

    dd() {

        if (!this.expertForm.get('chairman').value || !this.expertForm.get('farmacolog').value || !this.expertForm.get('farmacist').value
            || !this.expertForm.get('medic').value) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            return;
        }

        if (!this.expertForm.get('comiteeNr').value) {
            this.errorHandlerService.showError('Numarul comisiei trebuie completat.');
            return;
        }

        if (!this.expertForm.get('expertDate').value) {
            this.errorHandlerService.showError('Data comisiei trebuie completata.');
            return;
        }

        for (let x of this.modelToSubmit.medicaments) {
            x.experts = {
                chairman: this.expertForm.get('chairman').value,
                farmacolog: this.expertForm.get('farmacolog').value,
                farmacist: this.expertForm.get('farmacist').value,
                medic: this.expertForm.get('medic').value,
                date: this.expertForm.get('expertDate').value,
                comment: this.expertForm.get('commentExperts').value,
                number: this.expertForm.get('comiteeNr').value,
                decisionChairman: this.expertForm.get('decisionChairman').value,
                decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
                decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
                decisionMedic: this.expertForm.get('decisionMedic').value
            };
        }

        this.modelToSubmit.ddIncluded = true;

        let usernameDB = this.authService.getUserName();
        this.modelToSubmit.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'DD'
        });

        this.modelToSubmit.currentStep = 'X';
        this.modelToSubmit.assignedUser = usernameDB;

        this.loadingService.show();
        this.subscriptions.push(this.requestService.includeExpertsInDD(this.modelToSubmit).subscribe(data => {
                this.loadingService.hide();
            }, error1 => {
                this.loadingService.hide();
            })
        );
    }

    checkApproved(element: any, value: any) {
        element.approved = value.checked;
    }

    addToAuthorizationOrder() {
        this.formSubmitted = true;

        if (this.expertForm.get('chairman').invalid || this.expertForm.get('farmacolog').invalid || this.expertForm.get('farmacist').invalid
            || this.expertForm.get('medic').invalid) {
            this.errorHandlerService.showError('Membrii comisiei trebuiesc completati.');
            return;
        }

        if (this.expertForm.invalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        let find = this.documents.find(t => t.docType.category == 'DD');
        if (!find && this.modelToSubmit.ddIncluded) {
            this.errorHandlerService.showError('Dispozitia de distribuire nu este atasata.');
            return;
        }

        let y = this.divisions.find(t => t.approved == true);
        if (!y) {
            this.errorHandlerService.showError('Nici un medicament nu a fost aprobat.');
            return;
        }

        this.loadingService.show();
        this.formSubmitted = false;

        let ids: any[] = [];
        this.divisions.filter(t => t.approved == true).forEach(t => ids.push(t.id));

        this.subscriptions.push(this.requestService.setMedicamentApproved(ids).subscribe(data => {
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    back() {

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)? Divizarile aprobate nu vor fi incluse in ordinul de autorizare.',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();

                var x = this.modelToSubmit;

                let usernameDB = this.authService.getUserName();
                x.currentStep = 'E';
                x.assignedUser = usernameDB;

                x.requestHistories.push({
                    startDate: this.expertForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'X'
                });

                x.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

                x.documents = this.documents;
                x.outputDocuments = this.outputDocuments.filter(t=>t.docType.category!='CA');

                for (let med of x.medicaments) {
                    med.atcCode = this.expertForm.get('medicament.atcCode').value;
                    let div = this.divisions.find(t => t.description == med.division);
                    med.approved = false;
                    med.experts = {
                        chairman: this.expertForm.get('chairman').value,
                        farmacolog: this.expertForm.get('farmacolog').value,
                        farmacist: this.expertForm.get('farmacist').value,
                        medic: this.expertForm.get('medic').value,
                        date: this.expertForm.get('expertDate').value,
                        comment: this.expertForm.get('commentExperts').value,
                        number: this.expertForm.get('comiteeNr').value,
                        decisionChairman: this.expertForm.get('decisionChairman').value,
                        decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
                        decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
                        decisionMedic: this.expertForm.get('decisionMedic').value
                    };

                    med.instructions = [];
                    for (let x of this.instructions) {
                        x.id = null;
                        x.type = 'I';
                        let z = Object.assign({}, x);
                        let copyDivision = Object.assign('', med.division);
                        z.division = copyDivision;
                        if (x.divisions.some(value => value.description == med.division)) {
                            med.instructions.push(z);
                        }
                    }

                    for (let x of this.machets) {
                        x.id = null;
                        x.type = 'M';
                        let z = Object.assign({}, x);
                        let copyDivision = Object.assign('', med.division);
                        z.division = copyDivision;
                        if (x.divisions.some(value => value.description == med.division)) {
                            med.instructions.push(z);
                        }
                    }
                }

                this.subscriptions.push(this.requestService.addMedicamentRequest(x).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + this.modelToSubmit.id]);
                    }, error => this.loadingService.hide())
                );
            }
        });

    }

    save() {
        this.loadingService.show();

        var x = this.modelToSubmit;

        let usernameDB = this.authService.getUserName();
        x.currentStep = 'X';
        x.assignedUser = usernameDB;

        x.requestHistories.push({
            startDate: this.expertForm.get('data').value, endDate: new Date(),
            username: usernameDB, step: 'X'
        });

        x.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        x.documents = this.documents;
        x.outputDocuments = this.outputDocuments;

        for (let med of x.medicaments) {
            med.atcCode = this.expertForm.get('medicament.atcCode').value;
            let div = this.divisions.find(t => t.description == med.division);

            med.experts = {
                chairman: this.expertForm.get('chairman').value,
                farmacolog: this.expertForm.get('farmacolog').value,
                farmacist: this.expertForm.get('farmacist').value,
                medic: this.expertForm.get('medic').value,
                date: this.expertForm.get('expertDate').value,
                comment: this.expertForm.get('commentExperts').value,
                number: this.expertForm.get('comiteeNr').value,
                decisionChairman: this.expertForm.get('decisionChairman').value,
                decisionFarmacolog: this.expertForm.get('decisionFarmacolog').value,
                decisionFarmacist: this.expertForm.get('decisionFarmacist').value,
                decisionMedic: this.expertForm.get('decisionMedic').value,
                status: this.expertForm.get('statusExperts').value
            };

            med.instructions = [];
            for (let x of this.instructions) {
                x.id = null;
                x.type = 'I';
                let z = Object.assign({}, x);
                let copyDivision = Object.assign('', med.division);
                z.division = copyDivision;
                if (x.divisions.some(value => value.description == med.division)) {
                    med.instructions.push(z);
                }
            }

            for (let x of this.machets) {
                x.id = null;
                x.type = 'M';
                let z = Object.assign({}, x);
                let copyDivision = Object.assign('', med.division);
                z.division = copyDivision;
                if (x.divisions.some(value => value.description == med.division)) {
                    med.instructions.push(z);
                }
            }
        }

        console.log(x);
        this.subscriptions.push(this.requestService.addMedicamentRequest(x).subscribe(data => {
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    manufacturesStr(substance: any) {
        if(substance && substance.manufactures) {
            let s = Array.prototype.map.call(substance.manufactures, s => s.manufacture.description + ' ' + s.manufacture.country.description + ' ' + s.manufacture.address + 'NRQW').toString();
            s = s.replace(/NRQW/gi, ';');
            return s.replace(';,', '; ');
        }
        return '';
    }

}
