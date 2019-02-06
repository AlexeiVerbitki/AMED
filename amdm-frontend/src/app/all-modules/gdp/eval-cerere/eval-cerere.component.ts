import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog} from '@angular/material';
import {saveAs} from 'file-saver';
import {Observable, Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Document} from '../../../models/document';
import {LoaderService} from '../../../shared/service/loader.service';
import {CanModuleDeactivate} from '../../../shared/auth-guard/can-deactivate-guard.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {GDPService} from "../../../shared/service/gdp.service";
import {SuccessOrErrorHandlerService} from "../../../shared/service/success-or-error-handler.service";
import {SelectSubsidiaryModalComponent} from "../select-subsidiary-modal/select-subsidiary-modal.component";
import {InspectorsModalComponent} from "../inspectors-modal/inspectors-modal.component";
import {DatePipe} from "@angular/common";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {RequestAdditionalDataDialogComponent} from "../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component";
import {Decision} from "../../module-3/price-constants";


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

    selectedSubsidiaries: any[] = [];
    selectedInspectors: any[] = [];
    inspectionPeriods: any[] = [];
    subsidiaryList: any[] = [];

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();

    requestId: any;
    paymentTotal: number;

    outputDocuments: any[] = [{
        docType: {category: 'OGD'},
        description: 'Ordin GDP',
        number: undefined,
        status: 'Nu este atasat'
    }];

    decisions: any[] = [{description: 'Cerere aprobată', id: 1}, {description: 'Cerere respinsă', id: 2}, {description: 'Așteptare date adiționale', id: 3}];

    datePipe = new DatePipe('en-US');


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
        });

        this.rForm = fb.group({

            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'id': [null],
            'requestStatus': [null],
            'startDate': {disabled: true, value: new Date()},
            'currentStep': ['E'],
            'decision': [null, Validators.required],
            'responsiblePerson': fb.group({
                'idnp': [{value: null, disabled: true}],
                'mandatedFirstname': [{value: null, disabled: true}],
                'mandatedLastname': [{value: null, disabled: true}],
                'phoneNumber': [{value: null, disabled: true}],
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
                    'code': ['EGDP', Validators.required]
                }),
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Organizarea inspecției regulilor de bună practică de distribuţie');

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

                this.rForm.get('currentStep').setValue(data.currentStep);
                this.rForm.get('requestStatus').setValue(data.currentStep);
                this.rForm.get('requestNumber').setValue(data.requestNumber);

                if (data.registrationRequestMandatedContacts) {
                    this.rForm.get('responsiblePerson.mandatedFirstname').setValue(data.registrationRequestMandatedContacts[0].mandatedFirstname);
                    this.rForm.get('responsiblePerson.mandatedLastname').setValue(data.registrationRequestMandatedContacts[0].mandatedLastname);
                    this.rForm.get('responsiblePerson.idnp').setValue(data.registrationRequestMandatedContacts[0].idnp);
                    this.rForm.get('responsiblePerson.phoneNumber').setValue(data.registrationRequestMandatedContacts[0].phoneNumber);
                }

                if (data.company) {
                    this.rForm.get('company.adresa').setValue(data.company.legalAddress);
                    this.rForm.get('company.id').setValue(data.company.id);
                    this.rForm.get('company.name').setValue(data.company.name);

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
                                    this.normalizeSubsidiaryList();
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

    normalizeSubsidiaryList() {
        this.subsidiaryList.forEach(cis => {
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
            data: {idno: this.rForm.get('company.idno').value, subsidiaryList: this.subsidiaryList},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectedSubsidiaries = result;
                console.log('SelectSubsidiaryModalComponent close', result);
            }
        });
    }

    selectInspectors() {
        const dialogRef = this.dialog.open(InspectorsModalComponent, {
            width: '1800px',
            data: {},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectedInspectors = result;
                console.log('InspectorsModalComponent close', result);
            }
        });
    }

    requestAdditionalData() {

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            data: {
                hideSave: true,
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
            }
        });
    }


    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    onDecisionChange($event) {
        console.log('onDecisionChange', $event);
        // if ($event.id == Decision.Accept) { //accepta
        // }
    }

    nextStep() {

        this.formSubmitted = true;

        console.log(this.rForm);
        if (!this.rForm.valid) {
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
            username: useranameDB, step: 'R'
        }];
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;
        modelToSubmit.endDate = new Date();
        modelToSubmit.registrationRequestMandatedContacts = [{
            mandatedLastname: this.rForm.get('mandatedLastname').value,
            mandatedFirstname: this.rForm.get('mandatedFirstname').value,
            phoneNumber: this.rForm.get('phoneNumber').value,
            email: this.rForm.get('email').value,
            requestMandateNr: this.rForm.get('requestMandateNr').value,
            requestMandateDate: this.rForm.get('requestMandateDate').value,
            id: this.rForm.get('registrationRequestMandatedContactsId').value,
            idnp: this.rForm.get('idnp').value
        }];

        this.formSubmitted = true;

        this.subscriptions.push(this.gdpService.addRegistrationRequestForGDP(modelToSubmit).subscribe(req => {
                this.rForm.get('id').setValue(req.body.id);
                if (req.body.registrationRequestMandatedContacts[0]) {
                    this.rForm.get('registrationRequestMandatedContactsId').setValue(req.body.registrationRequestMandatedContacts[0].id);
                }

                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }


    documentAdded($event) {

        this.outputDocuments.forEach(outDoc => {
            outDoc.number = undefined;
            outDoc.status = 'Nu este atasat';

            for (const doc of this.documents) {
                if (doc.docType.description == outDoc.description) {
                    outDoc.number = doc.number;
                    outDoc.status = 'Atasat';
                    break;
                }
            }

        });
    }


    viewDoc(document: any) {
        if (document.docType.category != 'LR') {
            return;
        }
        // this.loadingService.show();
        //
        // this.subscriptions.push(this.priceService.viewAnexa3(this.createAnexa3DTO()).subscribe(data => {
        //         const file = new Blob([data], {type: 'application/pdf'});
        //         const fileURL = URL.createObjectURL(file);
        //         window.open(fileURL);
        //         this.loadingService.hide();
        //     }, error => {
        //         this.loadingService.hide();
        //     }
        //     )
        // );
    }

    killInspector(i) {
        this.selectedInspectors.splice(i, 1);
    }

    addPeriod() {
        this.inspectionPeriods.push({from: '', to: ''});
    }

    inspectionPeriodChanged(date, i, $event) {
        this.inspectionPeriods[i][date] = this.datePipe.transform($event.target.value, 'dd/MM/yyyy');
    }

    removePeriod(i) {
        this.inspectionPeriods.splice(i, 1);
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
