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
import {DatePipe} from '@angular/common';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';


@Component({
    selector: 'app-aprob-cerere',
    templateUrl: './aprob-cerere.component.html',
    styleUrls: ['./aprob-cerere.component.css']
})

export class AprobCerereComponent implements OnInit, OnDestroy, CanModuleDeactivate {

    documents: Document [] = [];
    companii: Observable<any[]>;
    rForm: FormGroup;
    inspectorForm: FormGroup;
    decisionForm: FormGroup;

    subsidiaryList: any[] = [];

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();

    requestId: any;
    paymentTotal: number;

    gdpCertificate = {
        docType: {category: 'GDP'},
        description: 'Certificatul GDP',
        number: undefined,
        status: 'Nu este atasat'
    };

    accompanyingLetter = {
        docType: {category: 'SDI'},
        description: 'Scrisoare de însoțire',
        number: undefined,
        status: 'Nu este atasat'
    };

    inspectionReportDoc = {
        docType: {category: 'RI'},
        description: 'Raport de inspecție',
        number: undefined,
        status: 'Nu este atasat'
    };

    decisions: any[] = [
        {description: 'Aprobare', id: 1, currentStep: 'AF', code: 'AGDP'},
        {description: 'Respingere', id: 2, currentStep: 'AC', code: 'AGDP'}];
        // {description: 'Suspendare', id: 3, currentStep: 'A', code: 'AGDP'}];

    datePipe = new DatePipe('en-US');

    gdpInspection = {
        groupLeaderId: null,
        certificateBasedOnTheInspection: null,
        autoDistributionOperations: null,
        id: null,
        inspectors: [],
        subsidiaries: [],
        periods: []
    };
    get formData() { return <FormArray>this.inspectorForm.get('periods'); }

    outputDocuments: any[] = [];

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


        this.outputDocuments = [this.inspectionReportDoc];

        this.inspectorForm = fb.group({
            'useInspector': [false],
            'mandatedLastname': [null],
            'periods': fb.array([]),
            'autoDistributionOperations': [null, Validators.required],
            'certificateBasedOnTheInspection': [null, Validators.required],
        });

        this.decisionForm = fb.group({
            'decision': [null]
        });

        this.rForm = fb.group({

            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'id': [null],
            'requestStatus': [null],
            'startDate': {disabled: true, value: new Date()},
            'currentStep': ['A'],
            'gdpCertificateNr': [null],
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
                'director': [{value: null, disabled: true}]
            }),
            'initiator': [''],
            'assignedUser': [''],
            'type':
                fb.group({
                    'id': [null],
                    'description': [null],
                    'processId': [null],
                    'code': ['AGDP', Validators.required]
                }),
            'requestHistories': [],
        });
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

    addPeriod(obj) {
        (<FormArray>this.inspectorForm.get('periods')).push(this.createPeriod(obj));
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Aprobarea inspecției regulilor de bună practică de distribuţie');

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
                if (this.gdpInspection.inspectors.length > 0 && this.gdpInspection.groupLeaderId) {
                    this.inspectorForm.get('useInspector').setValue(true);
                }
                if (this.gdpInspection.periods.length > 0) {
                    this.gdpInspection.periods.forEach(p => this.addPeriod(p));
                }

                if (this.gdpInspection.subsidiaries.length > 0) {
                    this.normalizeSubsidiaryList(this.gdpInspection.subsidiaries.map(l => l.subsidiary));
                }

                this.inspectorForm.get('certificateBasedOnTheInspection').setValue(this.gdpInspection.certificateBasedOnTheInspection);
                this.inspectorForm.get('autoDistributionOperations').setValue(this.gdpInspection.autoDistributionOperations);

                this.documents = data.documents;
                this.documentAdded(null);

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

                if (data.company) {
                    this.rForm.get('company.adresa').setValue(data.company.legalAddress);
                    this.rForm.get('company.id').setValue(data.company.id);
                    this.rForm.get('company.name').setValue(data.company.name);
                    this.rForm.get('company.director').setValue(data.company.director);

                    if (data.company.idno) {
                        this.rForm.get('company.idno').setValue(data.company.idno);
                        this.subscriptions.push(
                            this.gdpService.retrieveLicenseByIdno(data.company.idno).subscribe(data => {
                                console.log('retrieveLicenseByIdno', data);
                                if (data) {
                                    this.rForm.get('company.seria').setValue(data.serialNr);
                                    this.rForm.get('company.nrLic').setValue(data.nr);
                                    this.rForm.get('company.dataEliberariiLic').setValue(new Date(data.releaseDate));
                                    this.rForm.get('company.dataExpirariiLic').setValue(new Date(data.expirationDate));
                                    this.subsidiaryList = data.economicAgents;
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
            }, error1 => console.log(error1)));
        }));
    }

    normalizeSubsidiaryList(list) {
        list.forEach(cis => {
            cis.companyType = cis.type.description;
            if (cis.locality) {
                const localityState = cis.locality.stateName ? (cis.locality.stateName + ', ') : '';
                const localityDesc = cis.locality.description ? (cis.locality.description + ', ') : '';
                cis.address = localityState + localityDesc + (cis.street ? cis.street : '');
            }

            let activitiesStr;
            cis.activities.forEach(r => {
                if (activitiesStr) {
                    activitiesStr += (r.description ? (', ' + r.description) : '');
                } else {
                    activitiesStr = (r.description ? r.description : '');
                }
            });
            cis.activitiesStr = activitiesStr;

            let pharmaceutist;
            cis.agentPharmaceutist.forEach(r => {
                if (pharmaceutist) {
                    pharmaceutist += (r.fullName ? ', ' + r.fullName : '');
                } else {
                    pharmaceutist = (r.fullName ? r.fullName : '');
                }
            });
            cis.selectedPharmaceutist = pharmaceutist;
        });
    }


    requestRemoveDeficiencies() {

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            data: {
                hideSave: true,
                requestNumber: this.rForm.get('requestNumber').value,
                requestId: this.rForm.get('id').value,
                modalType: 'REQUEST_REMOVE_DEFICIENCIES',
                startDate: this.rForm.get('data').value,
                companyName: this.rForm.get('company').value.name,
                address: this.rForm.get('company.adresa').value,
                registrationRequestMandatedContact: {
                    mandatedFirstname: this.rForm.get('responsiblePerson.mandatedFirstname').value,
                    mandatedLastname: this.rForm.get('responsiblePerson.mandatedLastname').value,
                    idnp: this.rForm.get('responsiblePerson.mandatedLastname').value,
                    phoneNumber: this.rForm.get('responsiblePerson.phoneNumber').value,
                    email: this.rForm.get('responsiblePerson.email').value,
                }
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                console.log('RequestAdditionalDataDialogComponent', result);
            }
        });
    }


    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    onDecisionChange($event) {
        console.log('onDecisionChange', $event);
        if ($event.id == 1) {
            this.outputDocuments = [this.inspectionReportDoc, this.gdpCertificate];
        } else if ($event.id == 2)  {
            this.outputDocuments = [this.inspectionReportDoc, this.accompanyingLetter];
        }

        this.documentAdded(null);
    }



    save(onlySave: boolean) {
        // if(onlySave) {
        //     this.rForm.controls['decision'].setErrors(null);
        // }

        this.formSubmitted = true;

        console.log(this.rForm);

        const WithoutDocs: boolean = this.decisionForm.valid && this.decisionForm.get('decision').valid && (!onlySave) && this.hasUnloadedDocs();
        const acceptValid: boolean = onlySave || this.decisionForm.valid && ((this.decisionForm.get('decision').value.id == 1 && this.inspectorForm.valid) || this.decisionForm.get('decision').value.id == 2);

        if (this.rForm.invalid || WithoutDocs || !acceptValid) {
            return;
        }

        if (this.paymentTotal < 0) {
            this.errorHandlerService.showError('Nu s-a efectuat plata.');
            return;
        }

        this.formSubmitted = false;

        this.loadingService.show();

        const useranameDB = this.gdpService.getUsername();

        const modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: this.rForm.get('currentStep').value
        }];

        modelToSubmit.currentStep = onlySave ? 'A' : this.decisionForm.get('decision').value.currentStep;
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;
        modelToSubmit.endDate = new Date();
        modelToSubmit.startDate = this.rForm.get('startDate').value;
        modelToSubmit.registrationRequestMandatedContacts = [this.rForm.get('responsiblePerson').value];
        const subsidiaryIds = this.gdpInspection.subsidiaries.map(s => s = {
            id: s.id, gdpInspectionId: s.gdpInspectionId, subsidiary: {id: s.subsidiary.id}
        });
        this.gdpInspection.periods = (this.inspectorForm.get('periods') as FormArray).getRawValue();
        modelToSubmit.gdpInspection = this.gdpInspection;
        modelToSubmit.gdpInspection.subsidiaries = subsidiaryIds;

        modelToSubmit.gdpInspection.autoDistributionOperations = this.inspectorForm.get('autoDistributionOperations').value;
        modelToSubmit.gdpInspection.certificateBasedOnTheInspection = this.inspectorForm.get('certificateBasedOnTheInspection').value;

        modelToSubmit.type.code = onlySave ? 'AGDP' : this.decisionForm.get('decision').value.code;

        // delete modelToSubmit.gdpInspection.subsidiaries;

        console.log(modelToSubmit);

        this.subscriptions.push(this.gdpService.addRegistrationRequestForGDP(modelToSubmit).subscribe(req => {
                this.errorHandlerService.showSuccess('Datele au fost salvate');
                if(!onlySave) {
                    this.router.navigate(['/dashboard/homepage']);
                }

                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }


    documentAdded($event) {
        this.documents.forEach(d => {
            if (d.docType.category == 'GDP') {
                d.number = this.rForm.get('gdpCertificateNr').value;
                return;
            }
        });

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

    hasUnloadedDocs() {
        return this.outputDocuments.some(value => value.status == 'Nu este atasat');
    }

    viewDoc(document: any) {
        const report = this.documents.find(d => d.docType.category == 'RI');

        if (!report) {
            this.errorHandlerService.showError('Încărcați mai întâi raportul de inspecție');
            return;
        }

        this.loadingService.show();

        if (document.docType.category == 'SDI') {
            this.subscriptions.push(this.gdpService.viewAccompanyingLetter(this.createAccompanyingLetterDTO(report.number)).subscribe(this.showGeneratedDocCallback, this.errorCatchCallback));

        } else if (document.docType.category == 'GDP') {
            if (this.inspectorForm.get('autoDistributionOperations').invalid || this.inspectorForm.get('certificateBasedOnTheInspection').invalid) {
                this.loadingService.hide();
                this.errorHandlerService.showError('Trebuie să indicați operațiunile de distribuție autorizate și nr certificatului bazat pe inspecție');
                return;
            } else {
                this.subscriptions.push(this.gdpService.generateCertificateNumber().subscribe(data => {
                    this.rForm.get('gdpCertificateNr').setValue(data[0]);
                    console.log('generatedCertificateNumber', this.rForm.get('gdpCertificateNr').value);
                    this.subscriptions.push(this.gdpService.viewGDPCertificate(this.createGDPCertificateDTO(report)).subscribe(this.showGeneratedDocCallback, this.errorCatchCallback));
                }));

            }
        }
    }

    showGeneratedDocCallback = (data): void => {
        const file = new Blob([data], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.loadingService.hide();
    }

    errorCatchCallback = (err): void => {
        this.loadingService.hide();
    }

    createAccompanyingLetterDTO(reportNr) {

        let periods = '';
        this.gdpInspection.periods.forEach(p => {
            periods += (this.datePipe.transform(p.fromDate, 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(p.toDate, 'dd/MM/yyyy') + ', ');
        });

        let distributionAddress = '';

        this.gdpInspection.subsidiaries.forEach(s => {
            distributionAddress += s.subsidiary.address + ', ';
        });

        return {
            nr: '_____________________',
            date: '_____________________',
            companyAddress: this.rForm.get('company.adresa').value ? this.rForm.get('company.adresa').value : '',
            companyDirector: this.rForm.get('company.director').value ? this.rForm.get('company.director').value : '',
            companyEmail: this.rForm.get('responsiblePerson.email').value ? this.rForm.get('responsiblePerson.email').value : '',
            inspectPeriod: periods,
            distributionAddress: distributionAddress,
            companyName: this.rForm.get('company.name').value,
            anex: 'Raport de inspecție, ' + reportNr
        };
    }

    createGDPCertificateDTO(report) {

        let distributionAddress = '';

        this.gdpInspection.subsidiaries.forEach(s => {
            distributionAddress += s.subsidiary.address + ', ';
        });

        this.gdpInspection.periods.sort((a, b) => {
            if (a.fromDate < b.fromDate) { return -1; }
            if (a.fromDate > b.fromDate) { return 1; }
            return 0;
        });
        const lastInspectionDate = (this.datePipe.transform(this.gdpInspection.periods[0].fromDate, 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(this.gdpInspection.periods[0].toDate, 'dd/MM/yyyy'));

        return {
            nr: this.rForm.get('gdpCertificateNr').value,
            date: '',
            wholesaleDistributor: this.rForm.get('company.name').value,
            distributionAddress: distributionAddress,
            inspectingInBase: 'Ordinului AMDM nr.' + report.number + ' din ' + this.datePipe.transform(report.date, 'dd/MM/yyyy'),
            licenseSeries: this.rForm.get('company.seria').value,
            licenseNr: this.rForm.get('company.nrLic').value,
            licenseStartDate: this.datePipe.transform(this.rForm.get('company.dataEliberariiLic').value, 'dd/MM/yyyy'),
            licenseEndDate:  this.datePipe.transform(this.rForm.get('company.dataExpirariiLic').value, 'dd/MM/yyyy'),
            autorizatedDistribution: this.inspectorForm.get('autoDistributionOperations').value,
            certificateBasedOnTheInspection: this.inspectorForm.get('certificateBasedOnTheInspection').value,
            lastInspectionDate: lastInspectionDate,
            dateOfIssueCertificate: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
            maximYearAfterInspection: '2 ',
        };
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
