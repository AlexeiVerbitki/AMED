import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../models/document';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DrugDecisionsService} from '../../../shared/service/drugs/drugdecisions.service';
import {DrugDocumentsService} from '../../../shared/service/drugs/drugdocuments.service';
import {MatDialog} from '@angular/material';
import {AddDeclarationDialogComponent} from '../add-declaration-dialog/add-declaration-dialog.component';
import {AuthService} from '../../../shared/service/authetication.service';
import {DecimalPipe} from '@angular/common';
import {AddActiveSubstanceDialogComponent} from '../add-active-substance-dialog/add-active-substance-dialog.component';

@Component({
    selector: 'app-declaration-import-export',
    templateUrl: './declaration-import-export.component.html',
    styleUrls: ['./declaration-import-export.component.css']
})
export class DeclarationImportExportComponent implements OnInit, OnDestroy {

    docs: Document [] = [];
    requestId: string;
    oldData: any;

    allSubstanceUnits: any[];
    selectedSubstancesTable: any[] = [];

    private subscriptions: Subscription[] = [];
    startDate: Date = new Date();
    endDate: Date;

    outDocuments: any[] = [];

    formSubbmitted = false;

    expiredAuthorization = false;
    numberPipe: DecimalPipe = new DecimalPipe('en-US');

    //Validations
    cerereImpExpForm: FormGroup;

    scopeAuthorizations: any[] = [
        {value: 0, viewValue: 'Tehnic'},
        {value: 1, viewValue: 'Medical sau stiintific'},
    ];


    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private drugDocumentsService: DrugDocumentsService,
                private drugDecisionsService: DrugDecisionsService,
                public dialogDeclaration: MatDialog,
                private authService: AuthService,
                public dialogActiveSubstance: MatDialog) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Declarare import/export a precursorilor/psihotropelor/stupefiantelor');

        this.initFormData();
        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.allSubstanceUnits = data;
                    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                        this.subscriptions.push(this.drugDecisionsService.getRequest(params['id']).subscribe(data => {
                            this.oldData = data;
                            this.patchData(data);
                        }));
                    }));
                }
            )
        );


        this.onChanges();
    }


    private initFormData() {
        this.cerereImpExpForm = this.fb.group({
            'requestNumber': [{value: null, disabled: true}],
            'dataCererii': [{value: null, disabled: true}],
            'company': [{value: null, disabled: true}],
            'authorizationType': [{value: null, disabled: true}],
            'scopeAuthorization': [{value: null, disabled: true}],
            'partnerCompany': [{value: null, disabled: true}],
            'expireDate': [{value: null, disabled: true}],
            'customsPost': [{value: null, disabled: true}],
        });
    }

    private patchData(data) {
        this.cerereImpExpForm.get('requestNumber').setValue(data.requestNumber);
        this.cerereImpExpForm.get('dataCererii').setValue(new Date(data.startDate));
        this.cerereImpExpForm.get('company').setValue(data.company.name);

        this.cerereImpExpForm.get('authorizationType').setValue(data.drugCheckDecisions[0].authorizationType);
        this.cerereImpExpForm.get('scopeAuthorization').setValue( this.scopeAuthorizations.find(att => att.value === data.drugCheckDecisions[0].scopeAuthorization).viewValue);
        this.cerereImpExpForm.get('partnerCompany').setValue(data.drugCheckDecisions[0].partnerCompany);
        this.cerereImpExpForm.get('expireDate').setValue(new Date(data.drugCheckDecisions[0].expireDate));
        this.cerereImpExpForm.get('customsPost').setValue(data.drugCheckDecisions[0].customsPost);


        this.selectedSubstancesTable = data.drugCheckDecisions[0].drugImportExports;
        this.selectedSubstancesTable.forEach(sf => {
            sf.details.forEach(dt => {
                dt.substanceName = dt.authorizedDrugSubstance.substanceName;
                dt.substanceCode = dt.authorizedDrugSubstance.substanceCode;
                dt.authorizedQuantityUnitDesc = this.allSubstanceUnits.find(asu => asu.code === dt.authorizedQuantityUnitCode).description;
                const authorizedQuantityRemaining = dt.authorizedQuantity - dt.declarations.map(dcl => dcl.substActiveQuantityUsed).reduce((a, b) => a + b, 0);
                dt.authorizedQuantityRemaining = this.numberPipe.transform(authorizedQuantityRemaining, '1.4-4');
            });
           sf.packagingQuantityUnitDesc = this.allSubstanceUnits.find(asu => asu.code === sf.requestQuantityUnitCode).description;
        });

        if (new Date(data.drugCheckDecisions[0].expireDate) < new Date()) {
            this.expiredAuthorization = true;
            this.errorHandlerService.showError('A expirat autorizatia');
        }
    }

    onChanges(): void {

    }

    documentAdded(event) {
    }

    declare(substance: any) {

        const data = {
            substance: substance,
        };

        const dialogRef2 = this.dialogDeclaration.open(AddDeclarationDialogComponent, {
            data: {
                details: data,
                parentWindow: window
            },
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            panelClass: 'custom-dialog-container',
            width: '1000px',

        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                substance.authorizedQuantityRemaining = result.quantityRemaining;
            }
        });
    }


    save() {
        const modelToSubmit: any = this.oldData;

        this.populateModelToSubmit(modelToSubmit, 'D');

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
            //Do nothing
            this.errorHandlerService.showSuccess('Datele au fost salvate');
        }));
    }

    finish() {
        const modelToSubmit: any = this.oldData;

        this.populateModelToSubmit(modelToSubmit, 'F');

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
            //Do nothing
            // this.errorHandlerService.showSuccess('Datele au fost salvate');
            this.router.navigate(['/dashboard/homepage']);
        }));
    }


    populateModelToSubmit(modelToSubmit: any, step: string) {
        this.endDate = new Date();
        modelToSubmit.requestHistories.push({
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: step
        });
        modelToSubmit.assignedUser = this.authService.getUserName();

        modelToSubmit.documents = this.docs;

        if (step === 'F') {
            modelToSubmit.currentStep = 'F';
            modelToSubmit.endDate = this.endDate;
            modelToSubmit.drugCheckDecisions[0].status = 'F';
        }

        modelToSubmit.medicaments = [];
    }


    loadActiveSubstance(substance: any) {

        const data = {
            substance: substance,
            authorizationType: this.cerereImpExpForm.get('authorizationType').value,
            otherSelectedSubstanceDetails: this.selectedSubstancesTable.filter(asd => asd !== substance),
            reqId: this.oldData.id,
            viewMode: true
        };

        const dialogRef2 = this.dialogActiveSubstance.open(AddActiveSubstanceDialogComponent, {
            data: {
                details: data,
                parentWindow: window
            },
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            panelClass: 'custom-dialog-container',
            width: '1300px',

        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result && result.success) {
                substance.details = result.details;
            }
        });
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
