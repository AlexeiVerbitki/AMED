import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {Observable, Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Document} from '../../../models/document';
import {LoaderService} from '../../../shared/service/loader.service';
import {CanModuleDeactivate} from '../../../shared/auth-guard/can-deactivate-guard.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {GDPService} from '../../../shared/service/gdp.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {SelectSubsidiaryModalComponent} from '../select-subsidiary-modal/select-subsidiary-modal.component';
import {InspectorsModalComponent} from '../inspectors-modal/inspectors-modal.component';
import {DatePipe} from '@angular/common';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';
import {AddEcAgentComponent} from '../../../administration/economic-agent/add-ec-agent/add-ec-agent.component';


@Component({
    selector: 'app-eval-cerere',
    templateUrl: './eval-cerere.component.html',
    styleUrls: ['./eval-cerere.component.css']
})

export class EvalCerereComponent implements OnInit, OnDestroy, CanModuleDeactivate {

    documents: Document [] = [];
    companii: Observable<any[]>;
    rForm: FormGroup;
    inspectorForm: FormGroup;

    subsidiaryList: any[] = [];

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    loadingCompany = false;
    companyInputs = new Subject<string>();
    minDate = new Date();

    requestId: any;
    paymentTotal: number;

    outDocuments: any[] = [];

    outputDocuments: any[] = [
    //     {
    //     docType: {category: 'OGD'},
    //     description: 'Ordin GDP',
    //     number: undefined,
    //     status: 'Nu este atasat'
    // }
    ];

    decisions: any[] = [
        {description: 'Cerere aprobată', id: 1, currentStep: 'A', code: 'AGDP'},
        {description: 'Cerere respinsă', id: 2, currentStep: 'C', code: 'EGDP'},
        {description: 'Așteptare date', id: 3, currentStep: 'I', code: 'EGDP'}];

    datePipe = new DatePipe('en-US');

    gdpInspection = {
        groupLeaderId: null,
        id: null,
        inspectors: [],
        subsidiaries: [],
        periods: []
    };

    canChange = true;

    get formData() { return <FormArray>this.inspectorForm.get('periods'); }

    constructor(private fb: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private gdpService: GDPService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private loadingService: LoaderService,
                public dialog: MatDialog,
                private route: Router,
                public dialogConfirmation: MatDialog) {

        this.inspectorForm = fb.group({
            'useInspector': [false],
            'mandatedLastname': [null, Validators.required],
            'periods': fb.array([])
        });

        this.rForm = fb.group({

            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'id': [null],
            'requestStatus': [null],
            'startDate': {disabled: true, value: new Date()},
            'currentStep': ['E'],
            'decision': [null, Validators.required],
            'benefCompany': [null, Validators.required],
            'responsiblePerson': fb.group({
                'idnp': [{value: null, disabled: true}],
                'mandatedFirstname': [{value: null, disabled: true}],
                'mandatedLastname': [{value: null, disabled: true}],
                'phoneNumber': [{value: null, disabled: true}],
                'requestMandateDate': [{value: null, disabled: true}],
                'requestMandateNr': [{value: null, disabled: true}],
                'email': [{value: null, disabled: true}],
                'id': [{value: null, disabled: true}],
            }),
            'company': fb.group({
                'id': [],
                'name': [null, Validators.required],
                'adresa': [{value: null, disabled: true}],
                'idno': [{value: null, disabled: true}],
                'seria': [{value: null, disabled: true}],
                'nrLic': [{value: null, disabled: true}],
                'dataEliberariiLic': [{value: null, disabled: true}],
                'dataExpirariiLic': [{value: null, disabled: true}],
            }),
            'initiator': [''],
            'assignedUser': [''],
            'type':
                fb.group({
                    'id': [null],
                    'description': [null],
                    'processId': [null],
                    'code': ['EGDP', Validators.required]
                }),
            'requestHistories': [],
        });
    }

    inspectorUsageChanged($event) {
        for ( let i = 0; i < this.outputDocuments.length; i++) {
            if ( this.outputDocuments[i].docType.category == 'OGD') {
                this.outputDocuments.splice(i, 1);
            }
        }

        if ($event.checked) {
            this.outputDocuments.push({
                docType: {category: 'OGD'},
                description: 'Ordin GDP',
                number: undefined,
                status: 'Nu este atasat'
            });

            this.documentAdded(null);
        }
    }

    companySelected(company) {
        console.log(company);
        this.getCompanyLicenseInfo(company)
    }

    createPeriod(obj): FormGroup {
        obj = obj ? obj : {};
        return this.fb.group({
            fromDate: [{value: new Date(obj.fromDate), disabled: true}],
            toDate: [{value: new Date(obj.toDate), disabled: true}],
            gdpInspectionId: obj.gdpInspectionId,
            id: obj.id
        });
    }

    startDateChanged(e, d) {
        e.controls['toDate'].reset();
        d.disabled = true;
        if (e.controls['fromDate'].value) {
            d.disabled = false;
        }
    }

    addPeriod(obj) {
        (this.inspectorForm.get('periods') as FormArray).push(this.createPeriod(obj));
    }


    newAgent() {
        const dialogRef2 = this.dialog.open(AddEcAgentComponent, {
            width: '1000px',
            panelClass: 'custom-dialog-container',
            data: {
            },
            hasBackdrop: true
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result && result.success) {
                //Do nothing
            }
        });
    }

    getCompanies() {
        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.gdpService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Organizarea inspecției regulilor de bună practică de distribuţie');

        this.getCompanies();

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.requestId = params['id'];
            this.subscriptions.push(this.gdpService.getRequest(params['id']).subscribe(data => {
                console.log('getRequest', data);

                switch (data.currentStep) {
                    case 'E':
                        this.rForm.get('requestStatus').setValue('Evaluare');
                        break;
                    case 'I':
                        this.rForm.get('requestStatus').setValue('Suspendată');
                        break;
                    case 'C':
                        this.rForm.get('requestStatus').setValue('Respinsă');
                        break;
                }

                this.rForm.get('currentStep').setValue(data.currentStep);
                this.rForm.get('requestNumber').setValue(data.requestNumber);
                this.rForm.get('startDate').setValue(data.startDate);
                this.rForm.get('initiator').setValue(data.initiator);
                this.rForm.get('assignedUser').setValue(data.assignedUser);

                this.rForm.get('id').setValue(data.id);
                this.rForm.get('type').setValue(data.type);
                this.rForm.get('requestHistories').setValue(data.requestHistories);

                this.gdpInspection = data.gdpInspection ? data.gdpInspection : this.gdpInspection;
                if (this.gdpInspection.groupLeaderId) {
                    this.inspectorUsageChanged({checked: true});
                }
                if (this.gdpInspection.inspectors.length > 0) {
                    this.inspectorForm.get('useInspector').setValue(true);
                }
                if (this.gdpInspection.periods.length > 0) {
                    this.gdpInspection.periods.forEach(p => this.addPeriod(p));
                }

                if (this.gdpInspection.subsidiaries.length > 0) {
                    this.normalizeSubsidiaryList(this.gdpInspection.subsidiaries.map(l => l.subsidiary));
                }

                this.documents = data.documents;

                if (data.registrationRequestMandatedContacts) {
                    this.rForm.get('responsiblePerson.mandatedFirstname').setValue(data.registrationRequestMandatedContacts[0].mandatedFirstname);
                    this.rForm.get('responsiblePerson.mandatedLastname').setValue(data.registrationRequestMandatedContacts[0].mandatedLastname);
                    this.rForm.get('responsiblePerson.idnp').setValue(data.registrationRequestMandatedContacts[0].idnp);
                    this.rForm.get('responsiblePerson.phoneNumber').setValue(data.registrationRequestMandatedContacts[0].phoneNumber);
                    this.rForm.get('responsiblePerson.id').setValue(data.registrationRequestMandatedContacts[0].id);
                    this.rForm.get('responsiblePerson.email').setValue(data.registrationRequestMandatedContacts[0].email);
                    this.rForm.get('responsiblePerson.requestMandateNr').setValue(data.registrationRequestMandatedContacts[0].requestMandateNr);
                    this.rForm.get('responsiblePerson.requestMandateDate').setValue(data.registrationRequestMandatedContacts[0].requestMandateDate);
                }

                this.rForm.get('benefCompany').setValue(data.company);
                this.getCompanyLicenseInfo(data.company);

            }, error1 => console.log(error1)));
        }));

    }

    getCompanyLicenseInfo(company: any) {
        if (company) {
            this.rForm.get('company.adresa').setValue(company.legalAddress);
            this.rForm.get('company.id').setValue(company.id);
            this.rForm.get('company.name').setValue(company.name);

            if (company.idno) {
                this.rForm.get('company.idno').setValue(company.idno);
                this.subscriptions.push(
                    this.gdpService.retrieveLicenseByIdno(company.idno).subscribe(data => {
                        console.log('retrieveLicenseByIdno', data);
                        if (data) {
                            this.rForm.get('company.seria').setValue(data.serialNr);
                            this.rForm.get('company.nrLic').setValue(data.nr);
                            this.rForm.get('company.dataEliberariiLic').setValue(new Date(data.releaseDate));
                            this.rForm.get('company.dataExpirariiLic').setValue(new Date(data.expirationDate));
                            this.subsidiaryList = data.economicAgents;
                            this.gdpInspection.subsidiaries = [];
                            this.normalizeSubsidiaryList(this.subsidiaryList);
                        } else {
                            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    message: 'Compania solicitanta nu are licenta. Mergeți la pagina principală?',
                                    confirm: false
                                }
                            });
                            dialogRef.afterClosed().subscribe(result => {
                                if (result) {
                                    this.route.navigate(['dashboard/homepage']);
                                }
                            });
                        }
                    }));
            }
        }
    }

    bossSelected(id) {
        this.gdpInspection.groupLeaderId = id;
        this.inspectorUsageChanged({checked: true});
    }

    normalizeSubsidiaryList(list) {
        list.forEach(cis => {
            cis.companyType = cis.type ? cis.type.description : '';
            if (cis.locality) {
                cis.address = cis.locality.stateName ? cis.locality.stateName : '' ;
                cis.address += cis.address ? ',' : '';
                cis.address += cis.locality.description ? cis.locality.description : '';
                cis.address += cis.address ? ',' : '';
                cis.address += cis.street ? cis.street : '';
            }

            let activitiesStr = '';
            cis.activities.forEach(r => {
                if (activitiesStr) {
                    activitiesStr += ', ' + (r.description ? r.description : '');
                } else {
                    activitiesStr = r.description ? r.description : '';
                }
            });
            cis.activitiesStr = activitiesStr;

            let pharmaceutist;
            cis.agentPharmaceutist.forEach(r => {
                if (pharmaceutist) {
                    pharmaceutist += ', ' + r.fullName;
                } else {
                    pharmaceutist = r.fullName;
                }
            });
            cis.selectedPharmaceutist = pharmaceutist;
        });
    }

    selectSubsidiary() {
        const dialogRef = this.dialog.open(SelectSubsidiaryModalComponent, {
            width: '1800px',
            data: {idno: this.rForm.get('company.idno').value, subsidiaryList: this.subsidiaryList, selectedList: this.gdpInspection.subsidiaries},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.gdpInspection.subsidiaries = [];
                result.forEach(r => this.gdpInspection.subsidiaries.push({
                    subsidiary: r
                }));
                console.log('SelectSubsidiaryModalComponent close', result);
            }
        });
    }

    selectInspectors() {
        const dialogRef = this.dialog.open(InspectorsModalComponent, {
            width: '1800px',
            data: {selectedInspectors: this.gdpInspection.inspectors},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.gdpInspection.groupLeaderId = null;
                this.gdpInspection.inspectors = result;
                console.log('InspectorsModalComponent close', result);
            }
        });
    }

    requestAdditionalData() {

        let magicNumber = '';
        for (const outDoc of this.outDocuments) {
            if (magicNumber < outDoc.number) {
                magicNumber = outDoc.number;
            }
        }
        const magicNumbers = magicNumber.split('-');

        let nrOrdDoc = 1;
        if (magicNumbers && magicNumbers.length > 2) {
            nrOrdDoc = Number(magicNumbers[3]) + 1;
        }

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            data: {
                // hideSave: true,
                nrOrdDoc: nrOrdDoc,
                requestNumber: this.rForm.get('requestNumber').value,
                requestId: this.rForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA_EMPTY',
                startDate: this.rForm.get('data').value,
                companyName: this.rForm.get('company').value.name,
                address: this.rForm.get('company').value.legalAddress,
                registrationRequestMandatedContact: {
                    mandatedFirstname: this.rForm.get('responsiblePerson.mandatedFirstname').value,
                    mandatedLastname: this.rForm.get('responsiblePerson.mandatedLastname').value
                }
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                console.log('RequestAdditionalDataDialogComponent', result);
                result.requestId = this.rForm.get('id').value;
                this.outDocuments.push(result);
                this.justSave();
                this.addAditionalDataAsRequiredOutputDocument(result);
            }
        });
    }


    addAditionalDataAsRequiredOutputDocument(result: any) {
        result.description = 'Scrisoare de solicitare date aditionale';
        result.status = 'Nu este atasat';
        this.outputDocuments.push(result);
    }

    remove(doc: any) {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                this.outDocuments.forEach((item, index) => {
                    if (item === doc) {
                        this.outDocuments.splice(index, 1);
                    }
                });
                this.outputDocuments.forEach((item, index) => {
                    if (item === doc) {
                        this.outputDocuments.splice(index, 1);
                    }
                });
                this.justSave();
            }
        });
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    onDecisionChange($event) {
        console.log('onDecisionChange', $event);
    }


    justSave() {
        this.loadingService.show();
        const useranameDB = this.gdpService.getUsername();
        const modelToSubmit: any = this.rForm.value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.endDate = null;
        modelToSubmit.startDate = this.rForm.get('startDate').value;
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.currentStep = 'I';
        modelToSubmit.type.code = 'EGDP';
        modelToSubmit.gmpAuthorizations = [];
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: this.rForm.get('currentStep').value
        }];
        modelToSubmit.registrationRequestMandatedContacts = [this.rForm.get('responsiblePerson').value];
        this.gdpInspection.periods = (this.inspectorForm.get('periods') as FormArray).getRawValue();
        this.gdpInspection.periods.forEach(p => {
            p.toDate = p.toDate ? p.toDate : p.fromDate;
        });
        modelToSubmit.gdpInspection = this.gdpInspection;

        this.subscriptions.push(this.gdpService.addRegistrationRequestForGDP(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    nextStep() {

        this.formSubmitted = true;

        console.log(this.rForm);

        const decisionAccept = this.rForm.valid && this.rForm.get('decision').value.id == 1;
        const acceptWithoutPeriods: boolean = decisionAccept && (this.inspectorForm.get('periods') as FormArray).length == 0 ; //|| !this.isValidDate((this.inspectorForm.get('periods') as FormArray).controls[0].get('fromDate').value);
        const acceptWithoutDocs: Boolean = decisionAccept && this.hasUnloadedDocs();
        const acceptWithoutSubsidiaries: Boolean = decisionAccept && (!this.gdpInspection.subsidiaries || this.gdpInspection.subsidiaries.length == 0);
        const inspectorsWithoutBoss: Boolean = decisionAccept && this.inspectorForm.get('useInspector').value && this.gdpInspection.groupLeaderId == null;

        if (this.rForm.invalid || acceptWithoutDocs || acceptWithoutSubsidiaries || inspectorsWithoutBoss || acceptWithoutPeriods) {
            return;
        }
        // if (this.paymentTotal < 0) {
        //     this.errorHandlerService.showError('Nu s-a efectuat plata.');
        //     return;
        // }

        this.formSubmitted = false;

        this.loadingService.show();

        const useranameDB = this.gdpService.getUsername();

        const modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: this.rForm.get('currentStep').value
        }];

        modelToSubmit.currentStep = this.rForm.get('decision').value.currentStep;
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.endDate = null;
        modelToSubmit.startDate = this.rForm.get('startDate').value;
        modelToSubmit.registrationRequestMandatedContacts = [this.rForm.get('responsiblePerson').value];
        const subsidiaryIds = this.gdpInspection.subsidiaries.map(s => s = {
            id: s.id, gdpInspectionId: s.gdpInspectionId, subsidiary: {id: s.subsidiary.id}
        });
        this.gdpInspection.periods = (this.inspectorForm.get('periods') as FormArray).getRawValue();
        this.gdpInspection.periods.forEach(p => {
            p.toDate = p.toDate ? p.toDate : p.fromDate;
        });
        modelToSubmit.gdpInspection = this.gdpInspection;
        modelToSubmit.gdpInspection.subsidiaries = subsidiaryIds;
        modelToSubmit.type.code = this.rForm.get('decision').value.code;

        // delete modelToSubmit.gdpInspection.subsidiaries;

        console.log(modelToSubmit);

        this.subscriptions.push(this.gdpService.addRegistrationRequestForGDP(modelToSubmit).subscribe(req => {
                this.errorHandlerService.showSuccess('Datele au fost salvate');
                if (this.rForm.get('decision').value.id == 1) {
                    this.router.navigate(['/dashboard/homepage']);
                } else if (req.body.gdpInspection) {
                    this.gdpInspection = req.body.gdpInspection;
                    if (this.gdpInspection.periods.length > 0) {
                        while ((this.inspectorForm.get('periods') as FormArray).length !== 0) {
                            (this.inspectorForm.get('periods') as FormArray).removeAt(0);
                        }
                        this.gdpInspection.periods.forEach(p => this.addPeriod(p));
                    }
                    if (this.gdpInspection.subsidiaries.length > 0) {
                        this.normalizeSubsidiaryList(this.gdpInspection.subsidiaries.map(l => l.subsidiary));
                    }
                }

                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }


    documentAdded($event) {

        this.outputDocuments.forEach(outDoc => {
            outDoc.number = undefined;
            outDoc.status = 'Nu este atasat';
            this.canChange = true;

            for (const doc of this.documents) {
                if (doc.docType.category == 'OGD') {
                    this.canChange = false;
                }
                if (doc.docType.category == outDoc.docType.category) {
                    outDoc.number = doc.number;
                    outDoc.status = 'Atasat';
                    break;
                }
            }

        });
    }

    hasUnloadedDocs() {
        return this.outputDocuments.some(value => value.status == 'Nu este atasat');
    }

    viewDoc(document: any) {
        if (document.docType.category == 'OGD') {
            this.viewOGD();
        } else if (document.docType.category == 'SL') {
            this.viewSL(document);
        }
    }

    viewOGD () {
        if (!this.gdpInspection.groupLeaderId) {
            this.errorHandlerService.showError('Trebuie să indicați șeful de grup');
            return;
        } else if ((this.inspectorForm.get('periods') as FormArray).length == 0 || !this.isValidDate((this.inspectorForm.get('periods') as FormArray).controls[0].get('fromDate').value)) {
            this.errorHandlerService.showError('Trebuie să introduceți cel puțin o perioadă de inspecție ');
            return;
        }

        this.loadingService.show();

        this.subscriptions.push(this.gdpService.viewGDPOrder(this.createGDPOrderDTO()).subscribe(data => {
            const file = new Blob([data], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.loadingService.hide();
        }, error => {
            this.loadingService.hide();
        }));
    }

    viewSL(document: any) {
        const modelToSubmit = {
            nrDoc: document.number,
            responsiblePerson: this.rForm.get('responsiblePerson.mandatedLastname').value + ' ' + this.rForm.get('responsiblePerson.mandatedFirstname').value,
            companyName: this.rForm.get('company').value.name,
            requestDate: document.date,
            country: 'Moldova',
            address: this.rForm.get('company').value.legalAddress,
            phoneNumber: this.rForm.get('responsiblePerson.phoneNumber').value,
            email: this.rForm.get('responsiblePerson.email').value,
            message: document.content,
            function: document.signerFunction,
            signerName: document.signerName
        };

        this.loadingService.show();
        const observable = this.gdpService.viewRequestNew(modelToSubmit);

        this.subscriptions.push(observable.subscribe(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    isValidDate(d) {
        return d instanceof Date && !isNaN(+d);
    }

    createGDPOrderDTO() {

        let inspectorBoss: any = {};
        let inspectors = '';
        this.gdpInspection.inspectors.forEach(p => {
            if (p.id == this.gdpInspection.groupLeaderId) {
                inspectorBoss = p;
            } else {
                const fun = p.profession ? (p.profession.description ? p.profession.description : '') : '';
                inspectors += p.name + ', ' + fun + ';|';
            }
        });

        let subsidiariesAddresses = '\n';
        let index = 1;
        this.gdpInspection.subsidiaries.forEach(s => {
            subsidiariesAddresses += index + '. ' + s.subsidiary.companyType + ', adresa: ' + s.subsidiary.address + ';\n';
            index++;
        });

        return {
            nr: '_____________________',
            date: '_____________________',
            companyAddress: subsidiariesAddresses,
            gdpBeginDate: this.datePipe.transform((this.inspectorForm.get('periods') as FormArray).controls[0].get('fromDate').value, 'dd/MM/yyyy'),
            requestNr: this.rForm.get('requestNumber').value,
            requestDate: this.datePipe.transform(this.rForm.get('startDate').value, 'dd/MM/yyyy'),
            companyName: this.rForm.get('company.name').value,
            registeredLetterNr: this.rForm.get('requestNumber').value,
            registeredLetterDate: this.datePipe.transform(this.rForm.get('startDate').value, 'dd/MM/yyyy'),
            expertsLeader: inspectorBoss.name,
            expertsLeaderFuncion: inspectorBoss.profession ? inspectorBoss.profession.description : '',
            expertsLeaderInspectorat: inspectorBoss.function,
            inspectorsNameFunction: inspectors,
        };
    }

    killInspector(i) {
        this.gdpInspection.inspectors.splice(i, 1);
        if (this.gdpInspection.groupLeaderId && !this.gdpInspection.inspectors.some(i => i.id == this.gdpInspection.groupLeaderId)) {
            this.gdpInspection.groupLeaderId = undefined;
        }
    }


    removePeriod(i) {
        (this.inspectorForm.get('periods') as FormArray).controls.splice(i, 1);
        this.gdpInspection.periods.splice(i, 1);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.navbarTitleService.showTitleMsg('');
    }


    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

        // if(!this.rForm.dirty){
        //     return true;
        // }
        // const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
        //     data: {
        //         message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
        //         confirm: false,
        //     size: 'sm',
        //     }
        // });
        //
        // return dialogRef.afterClosed();
        return true;

    }
}
